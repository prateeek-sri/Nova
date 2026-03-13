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

// Initialize Upstash Redis (safe for build time)
const redis = UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: UPSTASH_REDIS_REST_URL,
      token: UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Initialize Rate Limiter
const rateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(4, "60 s"),
    })
  : null;

// Initialize the GoogleGenAI API
const genAI = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

// Initialize the Astra DB client
const client = ASTRA_DB_APPLICATION_TOKEN ? new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN) : null;
const db = client && ASTRA_DB_API_ENDPOINT ? client.db(ASTRA_DB_API_ENDPOINT, { keyspace: ASTRA_DB_NAMESPACE }) : null;

// Helper function: fetch document context
async function getDocumentContext(latestMessage: string) {
  try {
    if (!genAI || !db || !ASTRA_DB_COLLECTION) {
      console.warn("Context fetch skipped: Missing GenAI or DB configuration.");
      return [];
    }

    const embeddingResponse = await genAI.models.embedContent({
      model: "gemini-embedding-001",
      contents: latestMessage,
    });

    const embedding = embeddingResponse.embeddings[0]?.values;
    if (!embedding) throw new Error("Embedding could not be generated.");

    const collection = db.collection(ASTRA_DB_COLLECTION);
    const cursor = collection.find(null, {
      sort: { $vector: embedding },
      limit: 5,
    });

    const documents = await cursor.toArray();
    return documents?.map((doc) => doc.text) || [];
  } catch (err) {
    console.error("Error generating embeddings or querying DB:", err);
    return ["Error retrieving documents; answer based on general knowledge."];
  }
}

// POST handler with resilience
export async function POST(req: Request) {
  try {
    // 1. Validate Environment Variables
    const missingVars = [];
    if (!ASTRA_DB_API_ENDPOINT) missingVars.push("ASTRA_DB_API_ENDPOINT");
    if (!ASTRA_DB_APPLICATION_TOKEN) missingVars.push("ASTRA_DB_APPLICATION_TOKEN");
    if (!GEMINI_API_KEY) missingVars.push("GEMINI_API_KEY");
    if (!UPSTASH_REDIS_REST_URL) missingVars.push("UPSTASH_REDIS_REST_URL");
    if (!UPSTASH_REDIS_REST_TOKEN) missingVars.push("UPSTASH_REDIS_REST_TOKEN");

    if (missingVars.length > 0) {
      console.error("CRITICAL: Missing Environment Variables:", missingVars.join(", "));
    }

    const body = await req.json();
    const { messages } = body;
    const latestMessage =
      messages?.[messages.length - 1]?.text || messages?.[messages.length - 1]?.content;

    if (!latestMessage || latestMessage.trim() === "") {
      return new Response("Please provide a valid question.", { status: 400 });
    }

    // 2. Rate Limiting (Fail-safe)
    if (rateLimit) {
      try {
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const { success } = await rateLimit.limit(ip);
        if (!success) {
          return new Response("Too many requests — max 4 per minute.", { status: 429 });
        }
      } catch (rlError) {
        console.error("Rate Limiter Error (falling back to allow):", rlError);
      }
    } else {
      console.warn("Rate Limiter disabled: Missing Upstash Configuration.");
    }

    // 3. Fetch document context
    const docContext = await getDocumentContext(latestMessage);

    // 4. AI Generation with Fallback
    if (!genAI) {
      return new Response("AI Model not configured. Check GEMINI_API_KEY.", { status: 500 });
    }

    const template = {
      role: "system",
      content: `
You are an expert AI assistant specialized in the Big 3 anime: One Piece, Naruto, and Bleach.
You have deep knowledge of all characters, story arcs, abilities, power systems, lore, and world-building.
Use the context below to answer questions accurately. If the context doesn't cover the topic, answer based on your own knowledge.
Be enthusiastic, engaging, and reference specific moments when relevant. Don't mention about context provided or not.

        -------------------
        START CONTEXT
        ${JSON.stringify(docContext)}
        END CONTEXT

        CURRENT TIME: ${new Date().toLocaleString()}
        ---------------------
        QUESTION: ${latestMessage}
        -----------------------
      `,
    };

    // 4. AI Generation with Fallback (Reverted to gemini-2.5-flash as requested)
    if (!genAI) {
      return new Response("AI Model not configured. Check GEMINI_API_KEY.", { status: 500 });
    }

    const generateWithFallback = async (modelName: string) => {
      return await genAI.models.generateContentStream({
        model: modelName,
        contents: [{ role: "user", parts: [{ text: template.content }] }],
        config: {
          maxOutputTokens: 300,
          temperature: 0.7,
        },
      });
    };

    let responseStream;
    try {
      // Try the one that worked before
      responseStream = await generateWithFallback("gemini-2.5-flash");
    } catch (err: any) {
      console.warn(`2.5-flash failed: ${err.message}`);
      try {
        // Try stable 2.0
        responseStream = await generateWithFallback("gemini-2.0-flash");
      } catch (err2: any) {
        // Final fallback
        responseStream = await generateWithFallback("gemini-1.5-flash");
      }
    }

    let responseText = "";
    for await (const chunk of responseStream) {
      responseText += chunk.text || (chunk as any).text?.() || "";
    }

    return new Response(responseText || "Sorry, I couldn't generate a response.", { status: 200 });
  } catch (error) {
    console.error("Detailed POST Error:", error);
    return new Response(
      `Error generating info: ${error instanceof Error ? error.message : "Internal Server Error"}`,
      { status: 500 }
    );
  }
}
