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

Install the core package when you want to use the Web Components directly:

```bash
pnpm add @layout-kit/core
```

For framework projects, install only the matching adapter. The core package is
installed automatically as a dependency:

```bash
pnpm add @layout-kit/react
pnpm add @layout-kit/vue
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

### AdaptiveStack

Switches between row and column layout based on the host container width.

```html
<adaptive-stack breakpoint="720" gap="16" align="center">
  <aside>Filters</aside>
  <main>Results</main>
</adaptive-stack>
```

```ts
document.querySelector("adaptive-stack")?.addEventListener("stack", (event) => {
  console.log(event.detail.mode)
})
```

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

### FlowStack

Creates consistent vertical rhythm for content groups.

```html
<flow-stack gap="20" align="stretch">
  <header>Section title</header>
  <article>Primary content</article>
  <footer>Actions</footer>
</flow-stack>
```

### ClusterLayout

Wraps inline items while preserving a predictable gap, alignment, and
justification.

```html
<cluster-layout gap="12" align="center" justify="space-between">
  <span>Status</span>
  <button>Save</button>
  <button>Publish</button>
</cluster-layout>
```

### CenterBox

Centers content in a readable max-width container.

```html
<center-box max-width="720px" padding="24px" center-text>
  <h1>Readable content</h1>
  <p>Constrained copy without page-specific wrapper CSS.</p>
</center-box>
```

### SidebarLayout

Composes sidebar and content slots, then collapses into one column below the
configured container width.

```html
<sidebar-layout sidebar-width="260px" gap="24" collapse-at="720">
  <aside slot="sidebar">Filters</aside>
  <main slot="content">Results</main>
</sidebar-layout>
```

Use `side="right"` to place the sidebar after the content on wider containers.

### CoverLayout

Builds a full-height section with optional header and footer slots plus a main
region that can be vertically centered.

```html
<cover-layout min-height="100vh" gap="24" center>
  <header slot="header">Navigation</header>
  <main>Centered content</main>
  <footer slot="footer">Footer</footer>
</cover-layout>
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

Keeps long fixed-height lists responsive by measuring the visible range and
rendering only the items supplied by the framework wrapper.

```html
<virtual-list item-count="1000" height="320" item-height="48" overscan="4">
  <!-- Render only the current range here. -->
</virtual-list>
```

```ts
document.querySelector("virtual-list")?.addEventListener("range", (event) => {
  console.log(event.detail.start, event.detail.end)
})
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

### ReelLayout

Creates a horizontal scrolling row for cards, media, and compact panels.

```html
<reel-layout item-width="220px" gap="16" snap>
  <article>Release card</article>
  <article>Preview card</article>
  <article>Status card</article>
</reel-layout>
```

### ScrollShadow

Wraps scrollable content and shows edge fades only where more content is
available.

```html
<scroll-shadow direction="vertical" shadow-size="32px">
  <div style="max-height: 240px">Long content</div>
</scroll-shadow>
```

### StickyBox

Keeps a toolbar, sidebar, or summary panel pinned inside its scroll container.

```html
<sticky-box offset="16px" z-index="10">
  <nav>Section actions</nav>
</sticky-box>
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

Pass foreground media as children when another renderer should own the image
element. This keeps framework image optimization pipelines, such as Next
`Image`, in control of the foreground image:

```tsx
import Image from "next/image"
import { AmbientImage } from "@layout-kit/react"

export function Banner() {
  return (
    <AmbientImage src="/banner.png" alt="Event banner" fit="cover">
      <Image src="/banner.png" alt="Event banner" fill sizes="100vw" />
    </AmbientImage>
  )
}
```

Use the named `backdrop` slot when the decorative blurred backdrop should also
be supplied by the host framework:

```tsx
<AmbientImage src="/banner.png" alt="Event banner" fit="cover">
  <Image slot="backdrop" src="/banner.png" alt="" fill sizes="100vw" />
  <Image src="/banner.png" alt="Event banner" fill sizes="100vw" />
</AmbientImage>
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

### AspectBox

Keeps slotted media or content at a stable aspect ratio.

```html
<aspect-box ratio="4:3" fit="cover" position="center">
  <img src="/preview.png" alt="Preview" />
</aspect-box>
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

For large-screen previews with mismatched container ratios, pass a backdrop
source to fill the letterbox space with a blurred ambient image:

```html
<screen-fit
  draft-width="1920"
  draft-height="1080"
  backdrop-src="/dashboard-preview.png"
  backdrop-blur="40px"
  backdrop-overlay="rgb(0 0 0 / 30%)"
>
  <main>Dashboard content</main>
</screen-fit>
```

## React

```tsx
import {
  AdaptiveStack,
  AmbientImage,
  AspectBox,
  AutoGrid,
  CenterBox,
  ClusterLayout,
  CoverLayout,
  FlowStack,
  ReelLayout,
  ResizablePanel,
  ScreenFit,
  ScrollShadow,
  SidebarLayout,
  StickyBox,
  VirtualList,
} from "@layout-kit/react"

export function Demo() {
  const rows = Array.from({ length: 1000 }, (_, index) => `Row ${index + 1}`)

  return (
    <>
      <AdaptiveStack
        breakpoint={720}
        gap={16}
        onStack={(event) => console.log(event.detail.mode)}
      >
        <aside>Filters</aside>
        <main>Results</main>
      </AdaptiveStack>

      <AutoGrid
        columnWidth={180}
        gap={16}
        onGrid={(event) => console.log(event.detail.columns)}
      >
        <article>Card A</article>
        <article>Card B</article>
      </AutoGrid>

      <FlowStack gap={20}>
        <header>Section title</header>
        <article>Primary content</article>
      </FlowStack>

      <ClusterLayout gap={12} align="center" justify="space-between">
        <span>Status</span>
        <button>Save</button>
      </ClusterLayout>

      <CenterBox maxWidth="720px" padding="24px" centerText>
        <article>Readable content</article>
      </CenterBox>

      <SidebarLayout
        sidebarWidth="260px"
        collapseAt={720}
        onSidebar={(event) => console.log(event.detail.collapsed)}
      >
        <aside slot="sidebar">Filters</aside>
        <main slot="content">Results</main>
      </SidebarLayout>

      <CoverLayout minHeight="420px" gap={24} center>
        <header slot="header">Header</header>
        <main>Centered content</main>
        <footer slot="footer">Footer</footer>
      </CoverLayout>

      <VirtualList
        height={320}
        itemHeight={48}
        items={rows}
        renderItem={(row, index) => <article>{`${index + 1}. ${row}`}</article>}
      />

      <AmbientImage src="/banner.png" alt="Event banner" backdropBlur="32px" />

      <AspectBox ratio="16:9">
        <img src="/preview.png" alt="Preview" />
      </AspectBox>

      <ReelLayout itemWidth="220px" gap={16} snap>
        <article>Card A</article>
        <article>Card B</article>
      </ReelLayout>

      <ResizablePanel size={40} min={20} max={80}>
        <section slot="start">Navigation</section>
        <section slot="end">Preview</section>
      </ResizablePanel>

      <ScrollShadow direction="vertical" shadowSize="32px">
        <section>Long content</section>
      </ScrollShadow>

      <StickyBox offset="16px" zIndex={10}>
        <nav>Actions</nav>
      </StickyBox>

      <ScreenFit
        draftWidth={1920}
        draftHeight={1080}
        backdropSrc="/dashboard-preview.png"
      >
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
  AdaptiveStack,
  AmbientImage,
  AspectBox,
  AutoGrid,
  CenterBox,
  ClusterLayout,
  CoverLayout,
  FlowStack,
  ReelLayout,
  ResizablePanel,
  ScreenFit,
  ScrollShadow,
  SidebarLayout,
  StickyBox,
  VirtualList,
} from "@layout-kit/vue"

const rows = Array.from({ length: 1000 }, (_, index) => `Row ${index + 1}`)
</script>

<template>
  <AdaptiveStack
    :breakpoint="720"
    :gap="16"
    :on-stack="(event) => console.log(event.detail.mode)"
  >
    <aside>Filters</aside>
    <main>Results</main>
  </AdaptiveStack>

  <AutoGrid
    :column-width="180"
    :gap="16"
    :on-grid="(event) => console.log(event.detail.columns)"
  >
    <article>Card A</article>
    <article>Card B</article>
  </AutoGrid>

  <FlowStack :gap="20">
    <header>Section title</header>
    <article>Primary content</article>
  </FlowStack>

  <ClusterLayout :gap="12" align="center" justify="space-between">
    <span>Status</span>
    <button>Save</button>
  </ClusterLayout>

  <CenterBox max-width="720px" padding="24px" center-text>
    <article>Readable content</article>
  </CenterBox>

  <SidebarLayout
    sidebar-width="260px"
    :collapse-at="720"
    :on-sidebar="(event) => console.log(event.detail.collapsed)"
  >
    <aside slot="sidebar">Filters</aside>
    <main slot="content">Results</main>
  </SidebarLayout>

  <CoverLayout min-height="420px" :gap="24" center>
    <header slot="header">Header</header>
    <main>Centered content</main>
    <footer slot="footer">Footer</footer>
  </CoverLayout>

  <VirtualList
    :height="320"
    :item-height="48"
    :items="rows"
    :render-item="(row, index) => `${index + 1}. ${row}`"
  />

  <AmbientImage src="/banner.png" alt="Event banner" backdrop-blur="32px" />

  <AspectBox ratio="16:9">
    <img src="/preview.png" alt="Preview" />
  </AspectBox>

  <ReelLayout item-width="220px" :gap="16" snap>
    <article>Card A</article>
    <article>Card B</article>
  </ReelLayout>

  <ResizablePanel :size="40" :min="20" :max="80">
    <section slot="start">Navigation</section>
    <section slot="end">Preview</section>
  </ResizablePanel>

  <ScrollShadow direction="vertical" shadow-size="32px">
    <section>Long content</section>
  </ScrollShadow>

  <StickyBox offset="16px" :z-index="10">
    <nav>Actions</nav>
  </StickyBox>

  <ScreenFit
    :draft-width="1920"
    :draft-height="1080"
    backdrop-src="/dashboard-preview.png"
  >
    <main>Dashboard content</main>
  </ScreenFit>
</template>
```

## Events

All core elements dispatch native `CustomEvent` events:

| Element           | Event      | Detail                             |
| ----------------- | ---------- | ---------------------------------- |
| `adaptive-stack`  | `stack`    | `{ mode, inlineSize }`             |
| `auto-grid`       | `grid`     | `{ columns }`                      |
| `masonry-layout`  | `layout`   | `{ columns, height }`              |
| `sidebar-layout`  | `sidebar`  | `{ collapsed, inlineSize }`        |
| `virtual-list`    | `range`    | `{ start, end }`                   |
| `reel-layout`     | `reel`     | `{ overflow, scrollLeft }`         |
| `resizable-panel` | `resize`   | `{ size }`                         |
| `scroll-shadow`   | `overflow` | `{ top, right, bottom, left }`     |
| `screen-fit`      | `scale`    | `{ scale, inlineSize, blockSize }` |
| `ambient-image`   | `ambient`  | `{ color, inlineSize, blockSize }` |

React wrappers expose `onAmbient`, `onGrid`, `onLayout`, `onOverflow`,
`onRange`, `onReel`, `onResize`, `onScale`, `onSidebar`, and `onStack`. Vue
wrappers expose the same callback props.

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

Publish all packages after tests, lint, and build pass:

```bash
pnpm run publish
```

This publishes `@layout-kit/core`, then `@layout-kit/react`, then
`@layout-kit/vue` with `--access public`.
