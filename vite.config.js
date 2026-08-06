import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: ['react-compiler'],
    }),
  ],

  build: {
    outDir: "dist",
  },
})