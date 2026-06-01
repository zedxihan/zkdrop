import tailwindcss from '@tailwindcss/vite';
import { preact } from '@preact/preset-vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [preact(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('react-router-dom') ||
            id.includes('react-dom') ||
            id.includes('node_modules/react/')
          ) {
            return 'react';
          }
          if (
            id.includes('@tanstack/react-query') ||
            id.includes('lucide-react')
          ) {
            return 'vendor-utils';
          }
          if (id.includes('sketchbook-ui')) {
            return 'sketchbook-ui';
          }
          if (id.includes('gsap')) {
            return 'gsap';
          }
        },
      },
    },
  },
});
