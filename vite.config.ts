import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
