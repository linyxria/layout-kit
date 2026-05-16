# @layout-kit/react

React wrappers for Layout Kit Web Components.

## Installation

```bash
pnpm add @layout-kit/react
```

## Usage

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

      <AmbientImage src="/banner.png" alt="Event banner" backdropBlur="32px" />

      <AmbientImage src="/banner.png" alt="Event banner" fit="cover">
        <img src="/banner.png" alt="Event banner" />
      </AmbientImage>

      <VirtualList
        height={320}
        itemHeight={48}
        items={rows}
        onRange={(event) => console.log(event.detail)}
        renderItem={(row, index) => (
          <article>
            {index + 1}. {row}
          </article>
        )}
      />

      <ResizablePanel size={40} min={20} max={80}>
        <section slot="start">Navigation</section>
        <section slot="end">Preview</section>
      </ResizablePanel>

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

## Components

- `AutoGrid`
- `MasonryLayout`
- `VirtualList`
- `ResizablePanel`
- `AmbientImage`
- `ScreenFit`

React wrappers expose `onAmbient`, `onGrid`, `onLayout`, `onRange`, `onResize`,
and `onScale` callback props.
