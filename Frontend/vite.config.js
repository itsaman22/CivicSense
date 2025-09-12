import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Proxy only needed for local development, not for production deployment
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Local development only
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
