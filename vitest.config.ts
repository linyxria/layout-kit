import { fileURLToPath } from "node:url"

import { defineConfig } from "vitest/config"

const resolvePath = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      "@layout-kit/core": resolvePath("./packages/core/src/index.ts"),
      "@layout-kit/react": resolvePath("./packages/react/src/index.ts"),
      "@layout-kit/vue": resolvePath("./packages/vue/src/index.ts"),
    },
    conditions: ["browser", "development"],
  },
  test: {
    environment: "happy-dom",
  },
})
