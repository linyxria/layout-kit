import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  format: ['esm', 'cjs', 'iife'],
  globalName: 'LayoutKit',
  dts: true,
  sourcemap: true,
  platform: 'browser',
  deps: {
    alwaysBundle: ['lit', /^lit\//],
    onlyBundle: false,
  },
})
