import express from "express";
import { runAgent } from "../agents/agentService.js";
import { requireAuth } from "./auth.js";

const router = express.Router();

// System prompts for each of your 6 agents
const AGENT_PROMPTS = {
  research: `You are a Web Research Agent powered by Groq Llama 3.3.
For MOST questions, answer directly from your training knowledge — you are highly knowledgeable.
ONLY call the Tavily search tool when the user explicitly asks for: current events, live prices, today's news, or real-time information from the web.
Do NOT search the web for general questions, definitions, advice, or anything you already know.
Give thorough, well-structured answers. If you use search, cite the sources briefly at the end.`,

  mongodb: `You are a MongoDB Query Generator powered by Groq Llama 3.3.
Your job is to help users query their MongoDB database.
When the user provides a natural language query about their data, FIRST use get_collection_names to discover available collections, THEN use execute_mongo_query to run the query and return real results.
For general MongoDB questions (syntax, how to do something), answer directly from your knowledge without calling tools.`,

  codereview: `You are an expert Code Review Agent powered by Groq Llama 3.3.
Analyze the provided code carefully. Identify bugs, security vulnerabilities, performance issues, and bad practices.
Structure your response as: 1) Summary 2) Issues Found 3) Improved Code 4) Explanation.
Answer directly from your deep programming knowledge — do NOT use any tools unless explicitly asked.`,

  workflow: `You are a Workflow Automation Planner powered by Groq Llama 3.3.
Help users design step-by-step automation workflows for their business goals.
Structure your response as: 1) Workflow Overview 2) Step-by-Step Plan 3) Tools/Services Needed 4) Sample Pseudocode.
Answer directly from your knowledge — do NOT use web search unless specifically asked for live information.`,

  prompt: `You are an expert Prompt Engineering Agent powered by Groq Llama 3.3.
Take the user's raw prompt or idea and transform it into an optimized, production-grade prompt.
Structure your response as: 1) Analysis of original 2) Optimized Prompt 3) Why it's better 4) Variations.
Use your deep knowledge of prompt engineering techniques — do NOT use any tools.`,

  api: `You are an API Integration Expert powered by Groq Llama 3.3.
Generate complete, production-ready API integration code with proper error handling, authentication, and retry logic.
Structure your response as: 1) Overview 2) Full Code Example 3) Error Handling 4) Testing Instructions.
Answer directly from your expert knowledge — do NOT use any tools unless asked to search for specific API docs.`,
};

router.post("/automate", requireAuth, async (req, res) => {
  try {
    const { message, agentType, threadId } = req.body;
    
    if (!message || !agentType) {
      return res.status(400).json({ error: "Missing message or agentType" });
    }

    const systemPrompt = AGENT_PROMPTS[agentType] || "You are a helpful AI assistant.";
    
    // Use user ID if no threadId provided for session persistence
    const finalThreadId = threadId || `user-${req.user.id}-${agentType}`;

    const result = await runAgent(message, finalThreadId, systemPrompt);
    res.json(result);
  } catch (err) {
    console.error("Agent service error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
