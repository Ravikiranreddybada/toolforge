import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { tool } from "@langchain/core/tools";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { MongoClient } from "mongodb";
import { z } from "zod";

// ──── MongoDB Setup ────
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db();

// ──── Checkpointer ────
const checkpointer = new MongoDBSaver({ client });

// ──── Tools ────
const executeMongoQuery = tool(
  async ({ collection_name, query }) => {
    try {
      const collection = db.collection(collection_name);
      const results = await collection
        .find(query)
        .limit(5)
        .toArray();
      
      // Handle MongoDB specific types for serialization
      const sanitized = results.map(doc => ({
        ...doc,
        _id: doc._id.toString()
      }));

      return sanitized.length
        ? JSON.stringify(sanitized)
        : "No documents found.";
    } catch (e) {
      return `Error: ${e.message}`;
    }
  },
  {
    name: "execute_mongo_query",
    description: "Executes a find query on a MongoDB collection and returns results. Use this to query user details, orders, or logs.",
    schema: z.object({
      collection_name: z.string(),
      query: z.record(z.any()),
    }),
  }
);

const getCollectionNames = tool(
  async () => {
    try {
      const collections = await db.listCollections().toArray();
      return JSON.stringify(collections.map((c) => c.name));
    } catch (e) {
      return `Error: ${e.message}`;
    }
  },
  {
    name: "get_collection_names",
    description: "Returns all collection names in the database. Use this to discover available data.",
    schema: z.object({}),
  }
);

const tavilySearch = new TavilySearchResults({ maxResults: 3 });

const tools = [executeMongoQuery, getCollectionNames, tavilySearch];

// ──── LLM + Agent ────
const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  api_key: process.env.GROQ_API_KEY,
  temperature: 0,
});

const agent = createReactAgent({ llm, tools, checkpointSaver: checkpointer });

// ──── Run Function ────
export async function runAgent(message, threadId = "default-thread", systemPrompt = null) {
  const config = { configurable: { thread_id: threadId } };

  const messages = systemPrompt
    ? [["system", systemPrompt], ["user", message]]
    : [["user", message]];

  const result = await agent.invoke({ messages }, config);

  // The last message in the list is the agent's final response
  const finalMessage = result.messages[result.messages.length - 1].content;

  // Extract ReAct steps for UI trace
  const steps = [];
  for (const msg of result.messages) {
    if (msg.tool_calls?.length) {
      for (const tc of msg.tool_calls) {
        steps.push({ 
          type: "action", 
          tool: tc.name, 
          input: tc.args 
        });
      }
    } else if (msg._getType?.() === "tool" || msg.type === "tool") {
      steps.push({ 
        type: "observation", 
        content: msg.content 
      });
    }
  }

  return { output: finalMessage, steps };
}
