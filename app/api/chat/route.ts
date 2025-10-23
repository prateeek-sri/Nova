import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenAI } from "@google/genai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  GEMINI_API_KEY,
  UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN,
} = process.env;

const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL!,
  token: UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiter: 4 requests per minute per IP
const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(4, "60 s"),
});

// Initialize the GoogleGenAI API
const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Initialize the Astra DB client
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT!, { keyspace: ASTRA_DB_NAMESPACE });

// Helper function: fetch document context
export async function getDocumentContext(latestMessage: string) {
  try {
    const embeddingResponse = await genAI.models.embedContent({
      model: "gemini-embedding-001",
      contents: latestMessage,
      config: { outputDimensionality: 1024 },
    });

    const embedding = embeddingResponse.embeddings[0]?.values;
    if (!embedding) throw new Error("Embedding could not be generated.");

    const collection = db.collection(ASTRA_DB_COLLECTION);
    const cursor = collection.find(null, {
      sort: { $vector: embedding },
      limit: 10,
    });

    const documents = await cursor.toArray();
    return documents?.map((doc) => doc.text) || [];
  } catch (err) {
    console.error("Error generating embeddings or querying DB:", err);
    return ["Error retrieving documents; answer based on general knowledge."];
  }
}

// POST handler with Upstash Redis rate limiting
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage =
      messages?.[messages.length - 1]?.text || messages?.[messages.length - 1]?.content;

    if (!latestMessage || latestMessage.trim() === "") {
      return new Response("Please provide a valid question.", { status: 400 });
    }

    // Get client IP for rate limiting
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const { success } = await rateLimit.limit(ip);

    if (!success) {
      return new Response("Too many requests — max 4 per minute.", { status: 429 });
    }

    // Fetch document context
    const docContext = await getDocumentContext(latestMessage);

    const template = {
      role: "system",
      content: `
        You are an AI assistant specialized in Indian Government Schemes, Policies, and Welfare Programs.
Use the context below to answer questions accurately. Also, if you don't have any context, answer based on your own knowledge.
And don't mention about context provided or not.

        -------------------
        START CONTEXT
        ${JSON.stringify(docContext)}
        END CONTEXT

        CURRENT TIME: ${Date.now()}
        ---------------------
        QUESTION: ${latestMessage}
        -----------------------
      `,
    };

    const generateParams = {
      model: "gemini-2.5-flash",
      contents: [template.content],
      maxTokens: 150,
      temperature: 0.7,
    };

    const responseStream = await genAI.models.generateContentStream(generateParams);

    let responseText = "";
    for await (const chunk of responseStream) {
      responseText += chunk.text || chunk;
    }

    return new Response(responseText, { status: 200 });
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response("Error generating info", { status: 500 });
  }
}
