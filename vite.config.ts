import tailwindcss from '@tailwindcss/vite';
import { preact } from '@preact/preset-vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [preact(), tailwindcss()],
  build: {
    rollupOptions: {
      onLog(level, log, handler) {
        if (log.code !== 'IMPORT_IS_UNDEFINED') handler(level, log);
      },
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (
            id.includes('react-router') ||
            id.includes('react-dom') ||
            id.includes('preact')
          ) {
            return 'react';
          }
          if (
            id.includes('@tanstack/react-query') ||
            id.includes('lucide-react')
          ) {
            return 'vendor-utils';
          }
          for (const key of ['sketchbook-ui', 'gsap']) {
            if (id.includes(key)) return key;
          }
        },
      },
    },
  },
});
