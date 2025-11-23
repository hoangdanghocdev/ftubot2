import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

// Polyfill crypto.getRandomValues for Node.js build
if (typeof globalThis.crypto === 'undefined') {
  // @ts-ignore
  globalThis.crypto = require('crypto');
  // @ts-ignore
  globalThis.crypto.getRandomValues = (arr: any) => require('crypto').randomFillSync(arr);
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    optimizeDeps: {
      esbuildOptions: {
        plugins: [
          // polyfill Node globals for dependencies that expect a browser-like environment
          // moved here because this is an esbuild plugin, not a Vite plugin
          NodeGlobalsPolyfillPlugin({
            buffer: true,
            crypto: true,
          }),
        ],
      },
    },
    plugins: [
      react(),
    ],
    define: {
      // API key is now stored server-side in backend
      // No need to expose it in frontend build
    },
    envPrefix: 'VITE_',
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
