import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/c0ld3d/',
  server: {
    port: 5173,
  },
})
