import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Expose to local network (mobile devices on same Wi-Fi)
    port: 5173,
    allowedHosts: true, // Allow Cloudflare tunnels, Localtunnel, Ngrok, and custom domains
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
