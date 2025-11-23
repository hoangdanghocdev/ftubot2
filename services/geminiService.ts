import { ImagePart } from '../types';

// Backend API endpoint - API key is stored server-side
// Use relative URL for same-origin requests (nginx will proxy)
const API_BASE_URL = '/api';

export async function* generateContentStream(prompt: string, imageParts: ImagePart[]): AsyncGenerator<string> {
    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                imageParts: imageParts,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        // Handle Server-Sent Events stream
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
            throw new Error('Response body is not readable');
        }

        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
                break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep incomplete line in buffer

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        if (data.error) {
                            throw new Error(data.error);
                        }
                        if (data.done) {
                            return;
                        }
                        if (data.text) {
                            yield data.text;
                        }
                    } catch (e) {
                        // Skip invalid JSON lines
                        if (e instanceof SyntaxError) {
                            continue;
                        }
                        throw e;
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error calling backend API:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to fetch streaming response: ${error.message}`);
        }
        throw new Error('Failed to fetch streaming response from backend API.');
    }
}
