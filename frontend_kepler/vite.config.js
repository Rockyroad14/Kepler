import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5050,
  },
  test: {
    globals: true,
		environment: "jsdom",

    setupFiles: "@testing-library/jest-dom",
  }

})
