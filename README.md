# Layout Kit

一组基于 Web Components 的响应式布局组件，并提供 React 与 Vue 包装层。核心包可以直接在原生 HTML 中使用，框架包则保留对应框架的组件写法。

## 包结构

- `@layout-kit/core`：注册并导出原生自定义元素。
- `@layout-kit/react`：React 组件适配器。
- `@layout-kit/vue`：Vue 3 组件适配器。

## 本地开发

```bash
pnpm install
pnpm dev
```

打开 `http://127.0.0.1:5173/` 查看 playground。

构建包：

```bash
pnpm build
```

## Core 用法

安装并导入核心包后，自定义元素会自动注册：

```ts
import '@layout-kit/core'
```

### AutoGrid

根据容器宽度自动计算列数。

```html
<auto-grid column-width="180" gap="16">
  <article>卡片 A</article>
  <article>卡片 B</article>
  <article>卡片 C</article>
</auto-grid>
```

监听列数变化：

```ts
document.querySelector('auto-grid')?.addEventListener('grid', (event) => {
  console.log(event.detail.columns)
})
```

### MasonryLayout

适合不等高卡片的瀑布流布局。

```html
<masonry-layout column-width="220" gap="16">
  <article>短内容</article>
  <article>更高的内容块</article>
  <article>另一张卡片</article>
</masonry-layout>
```

### VirtualList

只渲染可视范围附近的列表项，适合大量固定高度数据。

```html
<virtual-list height="320" item-height="48" overscan="4">
  <article>条目 1</article>
  <article>条目 2</article>
  <article>条目 3</article>
</virtual-list>
```

### ResizablePanel

可拖拽调整比例的双栏面板。

```html
<resizable-panel size="40" min="20" max="80">
  <section slot="start">左侧</section>
  <section slot="end">右侧</section>
</resizable-panel>
```

垂直方向：

```html
<resizable-panel direction="vertical" size="50">
  <section slot="start">上方</section>
  <section slot="end">下方</section>
</resizable-panel>
```

### ScreenFit

把一个设计稿尺寸的页面按父容器等比缩放居中，常用于大屏页面、预览卡片、弹窗或 iframe 里的画布。

```html
<div style="width: 100%; height: 100vh">
  <screen-fit draft-width="1920" draft-height="1080">
    <main>大屏内容</main>
  </screen-fit>
</div>
```

默认 `fit="contain"` 会完整显示设计稿；如果希望铺满容器并允许裁切，可以使用 `fit="cover"`：

```html
<screen-fit draft-width="1920" draft-height="1080" fit="cover">
  <main>大屏内容</main>
</screen-fit>
```

## React 用法

```tsx
import { AutoGrid, ResizablePanel, VirtualList } from '@layout-kit/react'

export function Demo() {
  const rows = Array.from({ length: 1000 }, (_, index) => `条目 ${index + 1}`)

  return (
    <>
      <AutoGrid columnWidth={180} gap={16}>
        <article>卡片 A</article>
        <article>卡片 B</article>
      </AutoGrid>

      <VirtualList height={320} itemHeight={48}>
        {rows.map((row) => (
          <article key={row}>{row}</article>
        ))}
      </VirtualList>

      <ResizablePanel size={40} min={20} max={80}>
        <section slot="start">左侧</section>
        <section slot="end">右侧</section>
      </ResizablePanel>
    </>
  )
}
```

## Vue 用法

```vue
<script setup lang="ts">
import { AutoGrid, ResizablePanel, VirtualList } from '@layout-kit/vue'

const rows = Array.from({ length: 1000 }, (_, index) => `条目 ${index + 1}`)
</script>

<template>
  <AutoGrid :column-width="180" :gap="16">
    <article>卡片 A</article>
    <article>卡片 B</article>
  </AutoGrid>

  <VirtualList :height="320" :item-height="48">
    <article v-for="row in rows" :key="row">{{ row }}</article>
  </VirtualList>

  <ResizablePanel :size="40" :min="20" :max="80">
    <section slot="start">左侧</section>
    <section slot="end">右侧</section>
  </ResizablePanel>
</template>
```

## 事件

组件会派发原生 `CustomEvent`：

- `auto-grid`：`grid`，返回 `{ columns }`。
- `masonry-layout`：`layout`，返回 `{ columns, height }`。
- `virtual-list`：`range`，返回 `{ start, end }`。
- `resizable-panel`：`resize`，返回 `{ size }`。
- `screen-fit`：`scale`，返回 `{ scale, inlineSize, blockSize }`。

React 包装层使用 `onGrid`、`onLayout`、`onRange`、`onResize`、`onScale`。Vue 包装层同样暴露对应的事件回调 prop。
