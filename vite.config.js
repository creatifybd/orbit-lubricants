import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, mkdirSync, readdirSync, renameSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const legacyEntrypointCompatibility = () => ({
  name: 'legacy-entrypoint-compatibility',
  apply: 'build',
  closeBundle() {
    const generatedHtml = new URL('./dist/index.source.html', import.meta.url);
    const productionHtml = new URL('./dist/index.html', import.meta.url);
    const generatedAssets = new URL('./dist/assets/', import.meta.url);
    const rootAssets = new URL('./assets/', import.meta.url);

    renameSync(generatedHtml, productionHtml);

    mkdirSync(new URL('./dist/src/', import.meta.url), { recursive: true });
    copyFileSync(
      new URL('./public/legacy-entry.js', import.meta.url),
      new URL('./dist/src/main.jsx', import.meta.url)
    );

    // Hostinger Git deployment serves the repository root, while the FTP
    // workflow serves dist. Keep both deployment targets production-ready.
    copyFileSync(productionHtml, new URL('./index.html', import.meta.url));
    copyFileSync(new URL('./hosting/root.htaccess', import.meta.url), new URL('./.htaccess', import.meta.url));
    copyFileSync(
      new URL('./public/legacy-entry.js', import.meta.url),
      new URL('./legacy-entry.js', import.meta.url)
    );

    mkdirSync(rootAssets, { recursive: true });
    readdirSync(generatedAssets)
      .filter((file) => /\.(js|css)$/.test(file))
      .forEach((file) => {
        copyFileSync(
          new URL(`./dist/assets/${file}`, import.meta.url),
          new URL(`./assets/${file}`, import.meta.url)
        );
      });
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
      input: fileURLToPath(new URL('./index.source.html', import.meta.url)),
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
