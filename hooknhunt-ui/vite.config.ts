import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React ecosystem
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          // UI components
          if (id.includes('node_modules/@radix-ui')) {
            return 'ui-vendor';
          }
          // Utilities
          if (id.includes('node_modules/clsx') || id.includes('node_modules/tailwind-merge') ||
              id.includes('node_modules/class-variance-authority') || id.includes('node_modules/lucide-react')) {
            return 'utils';
          }
          // Form & validation
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/@hookform/resolvers') ||
              id.includes('node_modules/zod')) {
            return 'form-vendor';
          }
          // Data fetching
          if (id.includes('node_modules/axios') || id.includes('node_modules/zustand')) {
            return 'api-vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})