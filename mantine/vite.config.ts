import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import path from "path"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // PWA disabled due to server MIME type configuration issues
    // Re-enable after fixing .htaccess on the server
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   ...
    // })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})