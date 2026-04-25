import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), vue()],
  resolve: {
    alias: {
      '@layout-kit/core': fileURLToPath(
        new URL('../packages/core/src/index.ts', import.meta.url),
      ),
      '@layout-kit/react': fileURLToPath(
        new URL('../packages/react/src/index.ts', import.meta.url),
      ),
      '@layout-kit/vue': fileURLToPath(
        new URL('../packages/vue/src/index.ts', import.meta.url),
      ),
    },
  },
})
