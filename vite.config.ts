import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

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
          if (id.includes('@supabase/supabase-js')) {
            return 'supabase';
          }
          if (id.includes('@tanstack/react-query')) {
            return 'query';
          }
        },
      },
    },
  },
});
