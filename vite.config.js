import { defineConfig } from 'vite'
export default defineConfig({
  base: '/GeoFence/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'public/index.html'
    }
  },
  server: { port: 3000, open: true }
})
