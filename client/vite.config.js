import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist',
  },
  // Optional: Base path if deploying to subdirectory
  // base: process.env.NODE_ENV === 'production' ? '/your-subpath/' : '/',
})