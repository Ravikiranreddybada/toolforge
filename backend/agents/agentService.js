import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { tool } from "@langchain/core/tools";
import { MemorySaver } from "@langchain/langgraph";
import { MongoClient } from "mongodb";
import { z } from "zod";

// ──── MongoDB Setup ────
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27018/toolforge";
const client = new MongoClient(MONGODB_URI);
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

const executeHttpRequest = tool(
  async ({ url }) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return `❌ Request failed with status: ${response.status}`;
      }
      const data = await response.json();
      // If array, return first 5 only to keep response clean
      const result = Array.isArray(data) ? data.slice(0, 5) : data;
      return JSON.stringify(result, null, 2);
    } catch (error) {
      return `❌ HTTP Request failed: ${error.message}`;
    }
  },
  {
    name: "execute_http_request",
    description: "Makes a real HTTP GET request to a public API URL and returns the actual response data",
    schema: z.object({
      url: z.string().describe("The full API URL to make a GET request to")
    })
  }
);

const sendSlackNotification = tool(
  async ({ message }) => {
    try {
      const webhookUrl = process.env.SLACK_WEBHOOK_URL;
      if (!webhookUrl) return "❌ SLACK_WEBHOOK_URL not configured.";
      
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `payload=${encodeURIComponent(JSON.stringify({ 
          text: message,
          username: "ToolForge Bot",
          icon_emoji: ":robot_face:"
        }))}`
      });
      return "✅ Slack notification sent successfully!";
    } catch (error) {
      return `❌ Failed to send Slack notification: ${error.message}`;
    }
  },
  {
    name: "send_slack_notification",
    description: "Sends a Slack notification to the team. Input is the message text.",
    schema: z.object({
      message: z.string().describe("The text message to post to Slack")
    })
  }
);

const tools = [
  getCollectionNames,
  executeMongoQuery,
  executeHttpRequest,
  sendSlackNotification
];

if (process.env.TAVILY_API_KEY) {
  const tavilySearch = new TavilySearchResults({
    maxResults: 3,
    apiKey: process.env.TAVILY_API_KEY,
  });
  tools.push(tavilySearch);
} else {
  console.warn('⚠️ TAVILY_API_KEY missing. Search functionality will be disabled.');
}

// ──── LLM & Agent ────
let agent;
if (process.env.GROQ_API_KEY) {
  const llm = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0,
    maxTokens: 2048,
  });
  agent = createReactAgent({ llm, tools, checkpointSaver: checkpointer });
} else {
  console.warn('⚠️ GROQ_API_KEY missing. Agent functionality will be disabled.');
}

// ──── Run Function with 45-second timeout ────
export async function runAgent(message, threadId = "default-thread", systemPrompt = null) {
  const config = { configurable: { thread_id: threadId } };

  const baseSystem = "You are a highly capable AI agent. When calling tools, ensure your JSON arguments are complete and valid. Do not cut off your response early.";
  const messages = systemPrompt
    ? [["system", `${baseSystem}\n\n${systemPrompt}`], ["user", message]]
    : [["system", baseSystem], ["user", message]];

  // Wrap in a timeout so the UI never hangs indefinitely
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Agent timed out after 45 seconds. The LLM may be overloaded — try again.")), 45000)
  );

  if (!agent) {
    return { output: "Agent is not configured (missing API keys).", steps: [] };
  }

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
