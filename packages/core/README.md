# @layout-kit/core

Native Web Components for responsive layout primitives.

## Installation

```bash
pnpm add @layout-kit/core
```

## Usage

Import the package once to register all custom elements:

```ts
import "@layout-kit/core"
```

Then use the elements directly:

```html
<auto-grid column-width="180" gap="16">
  <article>Card A</article>
  <article>Card B</article>
  <article>Card C</article>
</auto-grid>

<ambient-image
  src="/banner.png"
  alt="Event banner"
  variant="blur"
  backdrop-blur="32px"
  image-radius="12px"
></ambient-image>

<screen-fit draft-width="1920" draft-height="1080">
  <main>Dashboard content</main>
</screen-fit>
```

## Elements

- `auto-grid`: responsive container-aware grid.
- `masonry-layout`: compact masonry flow for uneven-height items.
- `virtual-list`: fixed-row virtualized list.
- `resizable-panel`: two-pane draggable layout.
- `ambient-image`: image preview with generated ambient backdrop.
- `screen-fit`: fixed design canvas scaled into a fluid container.

## Events

```ts
document.querySelector("screen-fit")?.addEventListener("scale", (event) => {
  console.log(event.detail.scale)
})
```

| Element | Event | Detail |
| --- | --- | --- |
| `auto-grid` | `grid` | `{ columns }` |
| `masonry-layout` | `layout` | `{ columns, height }` |
| `virtual-list` | `range` | `{ start, end }` |
| `resizable-panel` | `resize` | `{ size }` |
| `screen-fit` | `scale` | `{ scale, inlineSize, blockSize }` |
| `ambient-image` | `ambient` | `{ color, inlineSize, blockSize }` |

See the repository README for full examples.
