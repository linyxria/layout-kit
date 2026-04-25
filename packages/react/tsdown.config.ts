import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  deps: {
    neverBundle: [
      'react',
      'react/jsx-runtime',
      'react-dom',
      '@layout-kit/core',
    ],
  },
  platform: 'browser',
})
