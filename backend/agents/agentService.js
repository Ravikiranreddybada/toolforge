import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { tool } from "@langchain/core/tools";
import { MemorySaver } from "@langchain/langgraph";
import { MongoClient } from "mongodb";
import { z } from "zod";

// ──── MongoDB Setup ────
const client = new MongoClient(process.env.MONGODB_URI);
let db;

// Connect MongoDB lazily (on first use), with error resilience
async function getDb() {
  if (!db) {
    await client.connect();
    db = client.db();
    console.log("✅ AgentService: MongoDB connected");
  }
  return db;
}

// ──── In-memory checkpointer (no extra package needed) ────
const checkpointer = new MemorySaver();

// ──── Tools ────
const executeMongoQuery = tool(
  async ({ collection_name, query }) => {
    try {
      const database = await getDb();
      const collection = database.collection(collection_name);
      const results = await collection.find(query).limit(5).toArray();
      const sanitized = results.map(doc => ({ ...doc, _id: doc._id.toString() }));
      return sanitized.length ? JSON.stringify(sanitized) : "No documents found.";
    } catch (e) {
      return `MongoDB Error: ${e.message}`;
    }
  },
  {
    name: "execute_mongo_query",
    description: "Executes a find query on a MongoDB collection and returns real results. Use this to query user details, orders, or any collection.",
    schema: z.object({
      collection_name: z.string().describe("The MongoDB collection name to query"),
      query: z.record(z.any()).describe("The MongoDB query filter object, e.g. {} for all documents"),
    }),
  }
);

const getCollectionNames = tool(
  async () => {
    try {
      const database = await getDb();
      const collections = await database.listCollections().toArray();
      return JSON.stringify(collections.map(c => c.name));
    } catch (e) {
      return `MongoDB Error: ${e.message}`;
    }
  },
  {
    name: "get_collection_names",
    description: "Returns all collection names in the database. Always call this first before querying to discover available data.",
    schema: z.object({}),
  }
);

const tavilySearch = new TavilySearchResults({
  maxResults: 3,
  apiKey: process.env.TAVILY_API_KEY,
});

const tools = [executeMongoQuery, getCollectionNames, tavilySearch];

// ──── LLM ────
const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: process.env.GROQ_API_KEY,  // ← correct key name
  temperature: 0,
  maxTokens: 1024,
});

// ──── Agent ────
const agent = createReactAgent({ llm, tools, checkpointSaver: checkpointer });

// ──── Run Function with 45-second timeout ────
export async function runAgent(message, threadId = "default-thread", systemPrompt = null) {
  const config = { configurable: { thread_id: threadId } };

  const messages = systemPrompt
    ? [["system", systemPrompt], ["user", message]]
    : [["user", message]];

  // Wrap in a timeout so the UI never hangs indefinitely
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Agent timed out after 45 seconds. The LLM may be overloaded — try again.")), 45000)
  );

  const agentRun = agent.invoke({ messages }, config);
  const result = await Promise.race([agentRun, timeout]);

  // Extract final message
  const finalMessage = result.messages[result.messages.length - 1].content;

  // Extract ReAct trace steps for UI
  const steps = [];
  for (const msg of result.messages) {
    if (msg.tool_calls?.length) {
      for (const tc of msg.tool_calls) {
        steps.push({ type: "action", tool: tc.name, input: tc.args });
      }
    } else if (msg._getType?.() === "tool" || msg.name) {
      steps.push({ type: "observation", content: msg.content });
    }
  }

  return { output: finalMessage, steps };
}
