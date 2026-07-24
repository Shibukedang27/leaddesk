import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/App.tsx', 'src/types/**', 'src/**/*.d.ts'],
      thresholds: {
        statements: 65,
        branches: 65,
        functions: 65,
        lines: 65,
      },
    },
  },
  build: {
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('react') || id.includes('react-router')) return 'react'
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) return 'forms'
          if (id.includes('axios')) return 'http'
          if (id.includes('lucide-react')) return 'icons'
        },
      },
    },
  },
})
