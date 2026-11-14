import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Dev:   `npm run dev`   -> http://localhost:5173. /api and /files are proxied to the Node backend (default :4000).
// Build: `npm run build` -> writes frontend/dist, which the Node backend serves at its own address.
// To point the dev server at another backend, set VITE_API_URL (for example in frontend/.env.local).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const api = env.VITE_API_URL || 'http://127.0.0.1:4000'
  return {
    plugins: [react()],
    server: { proxy: { '/api': api, '/files': api } },
    preview: { proxy: { '/api': api, '/files': api } },
  }
})
