import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Базовий шлях. Локально — '/', на GitHub Pages підставляється
  // з воркфлоу (.github/workflows/deploy.yml) через змінну BASE_PATH,
  // тому назву репозиторію ніде не треба хардкодити.
  base: process.env.BASE_PATH || '/',
})
