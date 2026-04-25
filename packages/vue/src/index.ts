import '@layout-kit/core'

import type {
  AmbientImageEventData,
  AutoGridEventData,
  MasonryLayoutEventData,
  ResizablePanelEventData,
  ScaleEventData,
  VirtualListRangeEventData,
} from '@layout-kit/core'
import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'

export const AmbientImage = defineComponent({
  name: 'AmbientImage',
  props: {
    src: String,
    alt: String,
    fit: String as PropType<'contain' | 'cover'>,
    variant: String as PropType<'blur' | 'fade'>,
    fade: String as PropType<'x' | 'y' | 'both' | 'none'>,
    fadeSize: String,
    blur: String,
    imageRadius: String,
    overlayColor: String,
    padding: String,
    backdropScale: String,
    backgroundColor: String,
    autoColor: Boolean,
    crossOrigin: String as PropType<'' | 'anonymous' | 'use-credentials'>,
    onAmbient: Function as PropType<
      (event: CustomEvent<AmbientImageEventData>) => void
    >,
  },
  setup(props, { attrs }) {
    return () =>
      h('ambient-image', {
        ...attrs,
        src: props.src,
        alt: props.alt,
        fit: props.fit,
        variant: props.variant,
        fade: props.fade,
        'fade-size': props.fadeSize,
        blur: props.blur,
        'image-radius': props.imageRadius,
        'overlay-color': props.overlayColor,
        padding: props.padding,
        'backdrop-scale': props.backdropScale,
        'background-color': props.backgroundColor,
        'auto-color': props.autoColor,
        'cross-origin': props.crossOrigin,
        onAmbient: props.onAmbient,
      })
  },
})

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
