import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  base: './',
  server: {
    port: 5174,
    open: true,
    fs: {
      // Allow serving files from parent directories
      allow: ['..', '../..']
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  },
  assetsInclude: ['**/*.md']
});
