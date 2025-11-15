import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vite dev server options
  server: {
    port: 5173,
    strictPort: true,
  },
  // To make sure Tauri can find the dev server
  clearScreen: false,
  // Tauri expects a fixed port, so we disable dynamic port finding
  envPrefix: ['VITE_', 'TAURI_'],
})