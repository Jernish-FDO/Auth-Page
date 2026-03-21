import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor';
            if (id.includes('firebase')) return 'firebase-vendor';
            if (id.includes('lucide-react') || id.includes('react-hot-toast')) return 'ui-vendor';
            if (id.includes('hookform') || id.includes('zod')) return 'form-vendor';
            return 'vendor';
          }
        }
      }
    }
  }
})
