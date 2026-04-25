<script setup lang="ts">
import {
  AutoGrid,
  MasonryLayout,
  ResizablePanel,
  ScreenFit,
  VirtualList,
} from '@layout-kit/vue'

const rows = Array.from(
  { length: 10000 },
  (_, index) => `Vue 条目 ${String(index + 1).padStart(4, '0')}`,
)

const cards = [
  ['属性', '用 Vue 的方式传参'],
  ['插槽', '内容照常写进组件里'],
  ['事件', '监听组件状态变化'],
]

const masonryCards = [
  ['图文卡片', 'tall'],
  ['短内容', 'short'],
  ['稍微长一点的说明', 'medium'],
  ['自动落到更短的列里', 'tall'],
  ['补充信息', 'medium'],
]
</script>

<template>
  <div class="demo-surface">
    <AutoGrid :column-width="190" :gap="14">
      <article v-for="[label, value] in cards" :key="label" class="metric-card">
        <span>{{ label }}</span>
        <strong>{{ value }}</strong>
      </article>
    </AutoGrid>

    <VirtualList :height="192" :item-height="44" class="list-demo">
      <article v-for="row in rows" :key="row" class="list-row">
        <span>{{ row }}</span>
        <small>当前渲染</small>
      </article>
    </VirtualList>

    <MasonryLayout :column-width="170" :gap="14" class="masonry-demo">
      <article
        v-for="[text, size] in masonryCards"
        :key="text"
        :class="['masonry-card', size]"
      >
        {{ text }}
      </article>
    </MasonryLayout>

    <ScreenFit :draft-width="640" :draft-height="360" class="fit-demo">
      <article class="fit-canvas">
        <span>Vue 画布</span>
        <strong>父容器缩放</strong>
      </article>
    </ScreenFit>

    <ResizablePanel :size="42" :min="25" :max="75" class="panel">
      <div slot="start" class="panel-pane">
        <span>左侧区域</span>
        <strong>拖动中间分隔条</strong>
      </div>
      <div slot="end" class="panel-pane">
        <span>右侧区域</span>
        <strong>宽度会实时变化</strong>
      </div>
    </ResizablePanel>
  </div>
</template>
