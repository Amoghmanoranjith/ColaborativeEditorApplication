import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // optional: not strictly necessary if using Tailwind via PostCSS

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['framer-motion'], // ✅ explicitly pre-bundle framer-motion
  },
});
