import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAG_DIR = path.join(__dirname, 'rag');

/**
 * Load all RAG context from text files in the rag directory
 * @returns {Promise<string>} Combined RAG context
 */
export async function loadRAGContext() {
  try {
    // Check if RAG directory exists
    if (!fs.existsSync(RAG_DIR)) {
      console.warn(`RAG directory not found: ${RAG_DIR}`);
      return '';
    }

    // Read all .txt files from the RAG directory
    const files = fs.readdirSync(RAG_DIR)
      .filter(file => file.endsWith('.txt'))
      .sort(); // Sort for consistent ordering

    if (files.length === 0) {
      console.warn(`No .txt files found in RAG directory: ${RAG_DIR}`);
      return '';
    }

    // Load and combine all RAG files
    const contexts = [];
    for (const file of files) {
      const filePath = path.join(RAG_DIR, file);
      try {
        const content = fs.readFileSync(filePath, 'utf-8').trim();
        if (content) {
          contexts.push(`--- ${file} ---\n${content}`);
        }
      } catch (error) {
        console.error(`Error reading RAG file ${file}:`, error);
      }
    }

    if (contexts.length === 0) {
      return '';
    }

    // Combine all contexts
    const combinedContext = contexts.join('\n\n');
    console.log(`Loaded RAG context from ${files.length} file(s)`);
    return combinedContext;
  } catch (error) {
    console.error('Error loading RAG context:', error);
    return '';
  }
}

/**
 * Get RAG context (cached version for performance)
 * Loads once and caches the result
 */
let cachedRAGContext = null;
let lastLoadTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

export async function getRAGContext(forceReload = false) {
  const now = Date.now();
  
  // Return cached version if still valid and not forcing reload
  if (!forceReload && cachedRAGContext && (now - lastLoadTime) < CACHE_TTL) {
    return cachedRAGContext;
  }

  // Load fresh context
  cachedRAGContext = await loadRAGContext();
  lastLoadTime = now;
  return cachedRAGContext;
}

