import { DataAPIClient } from "@datastax/astra-db-ts";

// const client = new DataAPIClient({
//     applicationToken: ASTRA_DB_APPLICATION_TOKEN,
//     apiEndpoint: ASTRA_DB_API_ENDPOINT,
//     namespace: ASTRA_DB_NAMESPACE,
// });
// import {PuppeteerWebBaseLoader} from "langchain/document_loaders/web/puppeteer"
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

const schemeData = [
  "https://en.wikipedia.org/wiki/List_of_schemes_of_the_government_of_India",
  "https://en.wikipedia.org/wiki/Garib_Kalyan_Rojgar_Abhiyaan",
  "https://en.wikipedia.org/wiki/Pradhan_Mantri_Matsya_Sampada_Yojana",
  "https://en.wikipedia.org/wiki/Atal_Bhujal_Yojana",
  "https://en.wikipedia.org/wiki/Pradhan_Mantri_Kisan_Urja_Suraksha_Evam_Utthan_Mahabhiyan_Yojana",
  "https://en.wikipedia.org/wiki/Ayushman_Bharat_Yojana",
  "https://en.wikipedia.org/wiki/National_Education_Mission",
  "https://www.myscheme.gov.in/schemes/mssc",
  "https://en.wikipedia.org/wiki/Pradhan_Mantri_Kisan_Samman_Nidhi",
];

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);

const db = client.db(ASTRA_DB_API_ENDPOINT, { keyspace: ASTRA_DB_NAMESPACE });

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});
const createCollection = async (
  SimilarityMetric: SimilarityMetric = "dot_product"
) => {
  const res = await db.createCollection(ASTRA_DB_COLLECTION, {
    vector: {
      dimension: 768,
      metric: SimilarityMetric,
    },
  });

  console.log(res);
};

console.log(createCollection);

  const scrapePage = async (url: string): Promise<string> => {
    try {
      console.log("Scraping:", url);
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Connection": "keep-alive",
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
    } 
    catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Failed to scrape ${url}:`, error.message);
      } else {
        console.error(`Failed to scrape ${url}:`, error);
      }
      return "";
    }
  }

const loadSampleData = async() => {
    const collection = db.collection(ASTRA_DB_COLLECTION)
    for await (const url of schemeData){
        const content = await scrapePage(url);
        
        const chunks = await splitter.splitText(content);

        for await (const chunk of chunks) {
            const embedding = await genAI.models.embedContent({
                model : "gemini-embedding-001",
                contents : chunk,
            });

            const vector = embedding.embeddings.values;

            const res = await collection.insertOne({
                $vector : vector,
                text : chunk
            });

            console.log(res);
        }
    }
}
const cntRec = async() => {
  try {
    const collection =  db.collection(ASTRA_DB_COLLECTION);
    const count = await collection.estimatedDocumentCount({});
    console.log("Total is ", count); // 1000+ records
  } 
  catch (error) {
    console.error("Error counting documents:", error);
  }
}

(async () => {
  await loadSampleData();
  await cntRec();
})();