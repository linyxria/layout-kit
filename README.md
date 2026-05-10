# Layout Kit

Responsive layout primitives built with Web Components, with first-class
wrappers for React and Vue.

Layout Kit focuses on small, composable layout helpers that are useful in
dashboards, editors, media previews, playgrounds, and other interface-heavy
products. The core package registers native custom elements, while the framework
packages keep the ergonomics of React and Vue components.

## Packages

- `@layout-kit/core` registers and exports the native custom elements.
- `@layout-kit/react` exposes React components powered by the core elements.
- `@layout-kit/vue` exposes Vue 3 components powered by the core elements.

## Installation

```bash
pnpm add @layout-kit/core
```

For framework projects, install the matching adapter:

```bash
pnpm add @layout-kit/core @layout-kit/react
pnpm add @layout-kit/core @layout-kit/vue
```

## Quick Start

Import the core package once to register every custom element:

```ts
import "@layout-kit/core"
```

Then use the elements directly in HTML:

```html
<auto-grid column-width="180" gap="16">
  <article>Card A</article>
  <article>Card B</article>
  <article>Card C</article>
</auto-grid>
```

## Components

### AutoGrid

Creates a responsive grid whose column count follows the available container
width.

```html
<auto-grid column-width="180" gap="16">
  <article>Card A</article>
  <article>Card B</article>
  <article>Card C</article>
</auto-grid>
```

```ts
document.querySelector("auto-grid")?.addEventListener("grid", (event) => {
  console.log(event.detail.columns)
})
```

### MasonryLayout

Arranges uneven-height items into compact masonry columns.

```html
<masonry-layout column-width="220" gap="16">
  <article>Short card</article>
  <article>A taller content block</article>
  <article>Another card</article>
</masonry-layout>
```

### VirtualList

Keeps long fixed-height lists responsive by only showing the items around the
visible range.

```html
<virtual-list height="320" item-height="48" overscan="4">
  <article>Row 1</article>
  <article>Row 2</article>
  <article>Row 3</article>
</virtual-list>
```

### ResizablePanel

Creates a two-pane layout with a draggable separator.

```html
<resizable-panel size="40" min="20" max="80">
  <section slot="start">Navigation</section>
  <section slot="end">Preview</section>
</resizable-panel>
```

Use `direction="vertical"` for stacked panes:

```html
<resizable-panel direction="vertical" size="50">
  <section slot="start">Top pane</section>
  <section slot="end">Bottom pane</section>
</resizable-panel>
```

### AmbientImage

Displays an image with an ambient background generated from the same source
image. The default `variant="blur"` scales and blurs the image behind the
foreground media, which works well for covers, posters, banners, and media
previews.

```html
<ambient-image
  src="/banner.png"
  alt="Event banner"
  image-radius="12px"
  backdrop-blur="32px"
  background-color="#15110f"
></ambient-image>
```

Use `variant="fade"` when you want the image edges to blend into the surrounding
background:

```html
<ambient-image
  src="/banner.png"
  alt="Event banner"
  variant="fade"
  fade="x"
  fade-size="14%"
></ambient-image>
```

`AmbientImage` computes an average color from the image and uses it as a
fallback background. For cross-origin images without the required CORS headers,
disable automatic color extraction and pass a color manually:

```html
<ambient-image
  src="https://example.com/banner.png"
  background-color="#15110f"
  auto-color="false"
></ambient-image>
```

### ScreenFit

Scales a fixed-size design canvas into its parent container. It is useful for
large-screen dashboards, preview cards, modal canvases, and iframe-like surfaces.

```html
<div style="width: 100%; height: 100vh">
  <screen-fit draft-width="1920" draft-height="1080">
    <main>Dashboard content</main>
  </screen-fit>
</div>
```

The default `fit="contain"` keeps the whole canvas visible. Use `fit="cover"` to
fill the container and allow cropping:

```html
<screen-fit draft-width="1920" draft-height="1080" fit="cover">
  <main>Dashboard content</main>
</screen-fit>
```

## React

```tsx
import {
  AmbientImage,
  AutoGrid,
  ResizablePanel,
  ScreenFit,
  VirtualList,
} from "@layout-kit/react"

export function Demo() {
  const rows = Array.from({ length: 1000 }, (_, index) => `Row ${index + 1}`)

  return (
    <>
      <AutoGrid
        columnWidth={180}
        gap={16}
        onGrid={(event) => console.log(event.detail.columns)}
      >
        <article>Card A</article>
        <article>Card B</article>
      </AutoGrid>

      <VirtualList height={320} itemHeight={48}>
        {rows.map((row) => (
          <article key={row}>{row}</article>
        ))}
      </VirtualList>

      <AmbientImage
        src="/banner.png"
        alt="Event banner"
        backdropBlur="32px"
      />

      <ResizablePanel size={40} min={20} max={80}>
        <section slot="start">Navigation</section>
        <section slot="end">Preview</section>
      </ResizablePanel>

      <ScreenFit draftWidth={1920} draftHeight={1080}>
        <main>Dashboard content</main>
      </ScreenFit>
    </>
  )
}
```

## Vue

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

  <VirtualList :height="320" :item-height="48">
    <article v-for="row in rows" :key="row">{{ row }}</article>
  </VirtualList>

  <AmbientImage
    src="/banner.png"
    alt="Event banner"
    backdrop-blur="32px"
  />

  <ResizablePanel :size="40" :min="20" :max="80">
    <section slot="start">Navigation</section>
    <section slot="end">Preview</section>
  </ResizablePanel>

  <ScreenFit :draft-width="1920" :draft-height="1080">
    <main>Dashboard content</main>
  </ScreenFit>
</template>
```

## Events

All core elements dispatch native `CustomEvent` events:

| Element | Event | Detail |
| --- | --- | --- |
| `auto-grid` | `grid` | `{ columns }` |
| `masonry-layout` | `layout` | `{ columns, height }` |
| `virtual-list` | `range` | `{ start, end }` |
| `resizable-panel` | `resize` | `{ size }` |
| `screen-fit` | `scale` | `{ scale, inlineSize, blockSize }` |
| `ambient-image` | `ambient` | `{ color, inlineSize, blockSize }` |

React wrappers expose `onAmbient`, `onGrid`, `onLayout`, `onRange`, `onResize`,
and `onScale`. Vue wrappers expose the same callback props.

## Local Development

Install dependencies:

```bash
pnpm install
```

Build all packages:

```bash
pnpm build
```

The playground loads the built core bundle from
`packages/core/dist/index.iife.js`, so build the project before opening
`playground/index.html`.

Useful commands:

```bash
pnpm test
pnpm lint
pnpm format
```
