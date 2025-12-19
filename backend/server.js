import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { getRAGContext } from "./ragLoader.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(
  cors({
    origin: ["https://ftu.fyi", "https://www.ftu.fyi", "http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

// Validate API key is set
if (!process.env.GEMINI_API_KEY) {
  console.error("ERROR: GEMINI_API_KEY environment variable is not set!");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// const model = 'gemini-2.5-pro';
const model = "gemini-flash-lite-latest";

// Default system prompt - applies to all conversations
const DEFAULT_SYSTEM_PROMPT =
  "Bạn là trợ lý AI Tiếng Việt, chuyên biệt cho người Việt Nam, cụ thể là sinh viên Đại học Ngoại thương (FTU). Bạn cần trả lời các câu hỏi của người dùng một cách chuyên nghiệp và hữu ích.";

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "ftu-bot-backend" });
});

// Chat endpoint - streams responses
app.post("/api/chat", async (req, res) => {
  try {
    const { prompt, imageParts, persona } = req.body;

    if (!prompt && (!imageParts || imageParts.length === 0)) {
      return res.status(400).json({ error: "Prompt or image is required" });
    }

    // Get persona system prompt if provided
    let personaPrompt = "";
    if (persona) {
      const { getPersonaById } = await import("../services/personaService.js");
      const personaData = getPersonaById(persona);
      if (personaData) {
        personaPrompt = personaData.systemPrompt;
      }
    }

    // Load RAG context from text files
    const ragContext = await getRAGContext();

    // Combine default system prompt with persona prompt and RAG context
    let systemPrompt = DEFAULT_SYSTEM_PROMPT;

    if (personaPrompt) {
      systemPrompt = `${DEFAULT_SYSTEM_PROMPT}\n\n${personaPrompt}`;
    }

    // Add RAG context if available
    if (ragContext) {
      systemPrompt = `${systemPrompt}\n\n--- Thông tin tham khảo ---\n${ragContext}`;
    }

    // Prepare parts for Gemini API
    const parts = [];

    if (imageParts && imageParts.length > 0) {
      parts.push(...imageParts);
    }

    // Add system prompt with user prompt
    if (prompt) {
      parts.push({ text: `${systemPrompt}\n\nUser: ${prompt}` });
    } else if (systemPrompt && imageParts && imageParts.length > 0) {
      // If only images, still include system prompt
      parts.push({ text: systemPrompt });
    }

    // Set up Server-Sent Events for streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering

    console.log("Constructed system prompt:", systemPrompt);
    console.log("Parts sent to Gemini API:", JSON.stringify(parts));
    try {
      const responseStream = await ai.models.generateContentStream({
        model: model,
        contents: { parts: parts },
      });

      // Stream chunks to client
      for await (const chunk of responseStream) {
        console.log("Received chunk from Gemini:", JSON.stringify(chunk));
        const chunkText = chunk.text;
        if (chunkText) {
          // Send as Server-Sent Event
          res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
        }
      }

      // Send completion signal
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Error streaming from Gemini:", error);
      res.write(
        `data: ${JSON.stringify({
          error: "Failed to get response from AI",
        })}\n\n`
      );
      res.end();
    }
  } catch (error) {
    console.error("Error in /api/chat:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 FTU-bot backend server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});
