import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, mkdirSync } from 'node:fs';

const legacyEntrypointCompatibility = () => ({
  name: 'legacy-entrypoint-compatibility',
  apply: 'build',
  closeBundle() {
    mkdirSync(new URL('./dist/src/', import.meta.url), { recursive: true });
    copyFileSync(
      new URL('./public/legacy-entry.js', import.meta.url),
      new URL('./dist/src/main.jsx', import.meta.url)
    );
  }
});

export default defineConfig({
  plugins: [react(), legacyEntrypointCompatibility()],
  server: {
    port: 3000,
    open: false
  },
  build: {
    rollupOptions: {
      output: {
        // Content hashes prevent browsers and CDNs from serving a stale app
        // after a new production deployment.
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
});
