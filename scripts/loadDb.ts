import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenAI } from "@google/genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import dotenv from "dotenv";

dotenv.config();

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  GEMINI_API_KEY,
} = process.env;

// Anime Big 3 — comprehensive data sources
const animeData = [
  // One Piece
  "https://en.wikipedia.org/wiki/One_Piece",
  "https://en.wikipedia.org/wiki/Monkey_D._Luffy",
  "https://en.wikipedia.org/wiki/Straw_Hat_Pirates",
  "https://en.wikipedia.org/wiki/List_of_One_Piece_characters",
  "https://en.wikipedia.org/wiki/One_Piece_(season_21)",
  "https://en.wikipedia.org/wiki/Roronoa_Zoro",
  // Naruto
  "https://en.wikipedia.org/wiki/Naruto",
  "https://en.wikipedia.org/wiki/Naruto_Uzumaki",
  "https://en.wikipedia.org/wiki/Sasuke_Uchiha",
  "https://en.wikipedia.org/wiki/List_of_Naruto_characters",
  "https://en.wikipedia.org/wiki/Naruto_Shippuden",
  "https://en.wikipedia.org/wiki/Akatsuki_(Naruto)",
  // Bleach
  "https://en.wikipedia.org/wiki/Bleach_(manga)",
  "https://en.wikipedia.org/wiki/Ichigo_Kurosaki",
  "https://en.wikipedia.org/wiki/List_of_Bleach_characters",
  "https://en.wikipedia.org/wiki/Bleach:_Thousand-Year_Blood_War",
  "https://en.wikipedia.org/wiki/Gotei_13",
  "https://en.wikipedia.org/wiki/Hollow_(Bleach)",
];

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT!, { keyspace: ASTRA_DB_NAMESPACE });

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

const createCollection = async (
  similarityMetric: SimilarityMetric = "dot_product"
) => {
  const res = await db.createCollection(ASTRA_DB_COLLECTION!, {
    vector: {
      dimension: 768,
      metric: similarityMetric,
    },
  });

  console.log("Collection created:", res);
};

const scrapePage = async (url: string): Promise<string> => {
  try {
    console.log("Scraping:", url);
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        Connection: "keep-alive",
      },
    });

    if (!response.ok) {
      console.error(`HTTP error ${response.status} for ${url}`);
      return "";
    }

    const html = await response.text();
    // Strip HTML tags & compress whitespace
    const cleanText = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
    console.log(`Scraped ${url} (${cleanText.length} chars)`);
    return cleanText.slice(0, 20000);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to scrape ${url}:`, error.message);
    } else {
      console.error(`Failed to scrape ${url}:`, error);
    }
    return "";
  }
};

const loadSampleData = async () => {
  const collection = db.collection(ASTRA_DB_COLLECTION!);
  for (const url of animeData) {
    const content = await scrapePage(url);
    if (!content) {
      console.log(`Skipping ${url} — no content scraped.`);
      continue;
    }

    const chunks = await splitter.splitText(content);
    console.log(`Processing ${chunks.length} chunks from ${url}`);

    for (const chunk of chunks) {
      const embedding = await genAI.models.embedContent({
        model: "gemini-embedding-001",
        contents: chunk,
      });

      const vector = embedding.embeddings?.[0]?.values;
      if (!vector) {
        console.error("Failed to generate embedding for chunk, skipping.");
        continue;
      }

      const res = await collection.insertOne({
        $vector: vector,
        text: chunk,
      });

      console.log(res);
    }
  }
};

const cntRec = async () => {
  try {
    const collection = db.collection(ASTRA_DB_COLLECTION!);
    const count = await collection.estimatedDocumentCount({});
    console.log("Total records:", count);
  } catch (error) {
    console.error("Error counting documents:", error);
  }
};

(async () => {
  console.log("=== Starting Anime Big 3 Data Loader ===");
  console.log("Creating collection...");
  await createCollection();
  console.log("Loading anime data...");
  await loadSampleData();
  await cntRec();
  console.log("=== Done! ===");
})();