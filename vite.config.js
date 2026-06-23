import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import fs from 'fs';

// Get all index_*.html files
const inputs = {
  main: resolve(__dirname, 'index.html'),
};

const files = fs.readdirSync(__dirname);
files.forEach(file => {
  if (file.startsWith('index_') && file.endsWith('.html')) {
    const name = file.replace('.html', '');
    inputs[name] = resolve(__dirname, file);
  }
});

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: inputs,
    },
  },
});
