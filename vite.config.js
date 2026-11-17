import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Bibliotecas em arquivos próprios: mudam pouco, então o navegador reaproveita o cache
        // entre um deploy e outro e só baixa de novo o código do site.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/[\\/](react|react-dom|react-router|react-router-dom|scheduler|@remix-run)[\\/]/.test(id)) return 'react'
          if (/[\\/](gsap|@gsap|lenis)[\\/]/.test(id)) return 'motion'
        },
      },
    },
  },
})
