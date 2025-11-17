import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Kameleoon_frontend_task/', // Очень важно для GitHub Pages!
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
