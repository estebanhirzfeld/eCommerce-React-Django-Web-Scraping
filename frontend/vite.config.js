import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

//fixed its outside of your project root

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: ['..'],
    },
  },
})


