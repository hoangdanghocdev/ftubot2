import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['https://ftu.fyi', 'https://www.ftu.fyi', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Validate API key is set
if (!process.env.GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY environment variable is not set!');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = 'gemini-2.5-pro';

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ftu-bot-backend' });
});

// Chat endpoint - streams responses
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, imageParts } = req.body;

    if (!prompt && (!imageParts || imageParts.length === 0)) {
      return res.status(400).json({ error: 'Prompt or image is required' });
    }

    // Prepare parts for Gemini API
    const parts = [];
    
    if (imageParts && imageParts.length > 0) {
      parts.push(...imageParts);
    }
    
    if (prompt) {
      parts.push({ text: prompt });
    }

    // Set up Server-Sent Events for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

    try {
      const responseStream = await ai.models.generateContentStream({
        model: model,
        contents: { parts: parts },
      });

      // Stream chunks to client
      for await (const chunk of responseStream) {
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
      console.error('Error streaming from Gemini:', error);
      res.write(`data: ${JSON.stringify({ error: 'Failed to get response from AI' })}\n\n`);
      res.end();
    }
  } catch (error) {
    console.error('Error in /api/chat:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 FTU-bot backend server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});

