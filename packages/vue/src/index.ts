import '@layout-kit/core'

import type {
  AutoGridEventData,
  MasonryLayoutEventData,
  ResizablePanelEventData,
  ScaleEventData,
  VirtualListRangeEventData,
} from '@layout-kit/core'
import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'

export const ScreenFit = defineComponent({
  name: 'ScreenFit',
  props: {
    draftWidth: Number,
    draftHeight: Number,
    fit: String as PropType<'contain' | 'cover'>,
    onScale: Function as PropType<(event: CustomEvent<ScaleEventData>) => void>,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'screen-fit',
        {
          ...attrs,
          'draft-width': props.draftWidth,
          'draft-height': props.draftHeight,
          fit: props.fit,
          onScale: props.onScale,
        },
        slots.default?.(),
      )
  },
})

export const MasonryLayout = defineComponent({
  name: 'MasonryLayout',
  props: {
    columnWidth: Number,
    gap: Number,
    onLayout: Function as PropType<
      (event: CustomEvent<MasonryLayoutEventData>) => void
    >,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'masonry-layout',
        {
          ...attrs,
          'column-width': props.columnWidth,
          gap: props.gap,
          onLayout: props.onLayout,
        },
        slots.default?.(),
      )
  },
})

export const AutoGrid = defineComponent({
  name: 'AutoGrid',
  props: {
    columnWidth: Number,
    gap: Number,
    onGrid: Function as PropType<
      (event: CustomEvent<AutoGridEventData>) => void
    >,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'auto-grid',
        {
          ...attrs,
          'column-width': props.columnWidth,
          gap: props.gap,
          onGrid: props.onGrid,
        },
        slots.default?.(),
      )
  },
})

export const VirtualList = defineComponent({
  name: 'VirtualList',
  props: {
    itemHeight: Number,
    height: Number,
    overscan: Number,
    onRange: Function as PropType<
      (event: CustomEvent<VirtualListRangeEventData>) => void
    >,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'virtual-list',
        {
          ...attrs,
          'item-height': props.itemHeight,
          height: props.height,
          overscan: props.overscan,
          onRange: props.onRange,
        },
        slots.default?.(),
      )
  },
})

export const ResizablePanel = defineComponent({
  name: 'ResizablePanel',
  props: {
    direction: String as PropType<'horizontal' | 'vertical'>,
    size: Number,
    min: Number,
    max: Number,
    onResize: Function as PropType<
      (event: CustomEvent<ResizablePanelEventData>) => void
    >,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'resizable-panel',
        {
          ...attrs,
          direction: props.direction,
          size: props.size,
          min: props.min,
          max: props.max,
          onResize: props.onResize,
        },
        slots.default?.(),
      )
  },
})
