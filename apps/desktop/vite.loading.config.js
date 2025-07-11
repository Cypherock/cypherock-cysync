import path from 'node:path';
import { defineConfig } from 'vite';
import renderer from 'vite-plugin-electron-renderer';

const vendor = process.env.VENDOR ?? 'default';
const loadingWindowHtml = path.join(
  'html',
  vendor === 'default' ? 'loading.html' : `loading-${vendor}.html`,
);

export default defineConfig({
  plugins: [renderer()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: path.join(__dirname, loadingWindowHtml),
    },
  },
});
