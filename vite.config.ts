import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set to '/hexcrawler/' when deploying to GitHub Pages project site
  base: '/',
})
