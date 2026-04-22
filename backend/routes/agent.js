import express from "express";
import { runAgent } from "../agents/agentService.js";
import { requireAuth } from "./auth.js";

const router = express.Router();

// System prompts for each of your 6 agents
const AGENT_PROMPTS = {
  research: "You are a Web Research Agent. Use Tavily Search to find and synthesize real-time info into high-quality research reports.",
  mongodb: "You are a MongoDB Query Agent. Use tools to query the live collections. Do NOT generate mock data; actually fetch it.",
  codereview: "You are a Code Review Agent. Analyze user code snippets for bugs and performance bottlenecks.",
  workflow: "You are a Workflow Planner. Break down business goals into actionable execution steps using available tools.",
  prompt: "You are a Prompt Engineering Agent. Take raw prompts and optimize them, then test the result to show how it performed.",
  api: "You are an API Integration Agent. Generate production-ready integration code and simulate/execute calls if possible.",
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
