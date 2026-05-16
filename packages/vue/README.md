# @layout-kit/vue

Vue 3 wrappers for Layout Kit Web Components.

## Installation

```bash
pnpm add @layout-kit/vue
```

## Usage

```vue
<script setup lang="ts">
import {
  AmbientImage,
  AutoGrid,
  ResizablePanel,
  ScreenFit,
  VirtualList,
} from "@layout-kit/vue"

const rows = Array.from({ length: 1000 }, (_, index) => `Row ${index + 1}`)
</script>

<template>
  <AutoGrid
    :column-width="180"
    :gap="16"
    :on-grid="(event) => console.log(event.detail.columns)"
  >
    <article>Card A</article>
    <article>Card B</article>
  </AutoGrid>

  <AmbientImage src="/banner.png" alt="Event banner" backdrop-blur="32px" />

  <AmbientImage src="/banner.png" alt="Event banner" fit="cover">
    <img src="/banner.png" alt="Event banner" />
  </AmbientImage>

  <VirtualList
    :height="320"
    :item-height="48"
    :items="rows"
    :on-range="(event) => console.log(event.detail)"
    :render-item="(row, index) => `${index + 1}. ${row}`"
  />

  <ResizablePanel :size="40" :min="20" :max="80">
    <section slot="start">Navigation</section>
    <section slot="end">Preview</section>
  </ResizablePanel>

  <ScreenFit
    :draft-width="1920"
    :draft-height="1080"
    backdrop-src="/dashboard-preview.png"
  >
    <main>Dashboard content</main>
  </ScreenFit>
</template>
```

## Components

- `AutoGrid`
- `MasonryLayout`
- `VirtualList`
- `ResizablePanel`
- `AmbientImage`
- `ScreenFit`

Vue wrappers expose `onAmbient`, `onGrid`, `onLayout`, `onRange`, `onResize`,
and `onScale` callback props.
