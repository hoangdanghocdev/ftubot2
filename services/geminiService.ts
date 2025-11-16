import { GoogleGenAI } from "@google/genai";
import { ImagePart, TextPart } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Please set it in your environment.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = 'gemini-2.5-pro';

export async function* generateContentStream(prompt: string, imageParts: ImagePart[]): AsyncGenerator<string> {
    try {
        const parts: (TextPart | ImagePart)[] = [
            ...imageParts,
            { text: prompt },
        ];

        const responseStream = await ai.models.generateContentStream({
            model: model,
            contents: { parts: parts },
        });

        for await (const chunk of responseStream) {
            // It's possible for a chunk to be empty, so we guard against that.
            const chunkText = chunk.text;
            if (chunkText) {
                yield chunkText;
            }
        }
    } catch (error) {
        console.error("Error calling Gemini API stream:", error);
        throw new Error("Failed to fetch streaming response from Gemini API.");
    }
}