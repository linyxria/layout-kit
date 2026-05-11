import "@layout-kit/core"

import type {
  AdaptiveStackEventData,
  AmbientImageEventData,
  AutoGridEventData,
  MasonryLayoutEventData,
  ReelLayoutEventData,
  ResizablePanelEventData,
  ScaleEventData,
  ScrollShadowOverflowEventData,
  SidebarLayoutEventData,
  VirtualListRangeEventData,
} from "@layout-kit/core"
import type { PropType } from "vue"
import { defineComponent, h } from "vue"

export const AdaptiveStack = defineComponent({
  name: "AdaptiveStack",
  props: {
    breakpoint: Number,
    gap: Number,
    align: String,
    justify: String,
    reverse: Boolean,
    onStack: Function as PropType<
      (event: CustomEvent<AdaptiveStackEventData>) => void
    >,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "adaptive-stack",
        {
          ...attrs,
          breakpoint: props.breakpoint,
          gap: props.gap,
          align: props.align,
          justify: props.justify,
          reverse: props.reverse,
          onStack: props.onStack,
        },
        slots.default?.(),
      )
  },
})

export const AmbientImage = defineComponent({
  name: "AmbientImage",
  props: {
    src: String,
    alt: String,
    fit: String as PropType<"contain" | "cover">,
    variant: String as PropType<"blur" | "fade">,
    fade: String as PropType<"x" | "y" | "both" | "none">,
    fadeSize: String,
    backdropBlur: String,
    imageRadius: String,
    overlayColor: String,
    padding: String,
    backdropScale: String,
    backgroundColor: String,
    autoColor: Boolean,
    crossOrigin: String as PropType<"" | "anonymous" | "use-credentials">,
    onAmbient: Function as PropType<
      (event: CustomEvent<AmbientImageEventData>) => void
    >,
  },
  setup(props, { attrs }) {
    return () =>
      h("ambient-image", {
        ...attrs,
        src: props.src,
        alt: props.alt,
        fit: props.fit,
        variant: props.variant,
        fade: props.fade,
        "fade-size": props.fadeSize,
        "backdrop-blur": props.backdropBlur,
        "image-radius": props.imageRadius,
        "overlay-color": props.overlayColor,
        padding: props.padding,
        "backdrop-scale": props.backdropScale,
        "background-color": props.backgroundColor,
        "auto-color": props.autoColor,
        "cross-origin": props.crossOrigin,
        onAmbient: props.onAmbient,
      })
  },
})

export const AspectBox = defineComponent({
  name: "AspectBox",
  props: {
    ratio: String,
    fit: String as PropType<"contain" | "cover" | "fill" | "none" | "scale-down">,
    position: String,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "aspect-box",
        {
          ...attrs,
          ratio: props.ratio,
          fit: props.fit,
          position: props.position,
        },
        slots.default?.(),
      )
  },
})

export const CenterBox = defineComponent({
  name: "CenterBox",
  props: {
    maxWidth: String,
    padding: String,
    centerText: Boolean,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "center-box",
        {
          ...attrs,
          "max-width": props.maxWidth,
          padding: props.padding,
          "center-text": props.centerText,
        },
        slots.default?.(),
      )
  },
})

export const ClusterLayout = defineComponent({
  name: "ClusterLayout",
  props: {
    gap: Number,
    align: String,
    justify: String,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "cluster-layout",
        {
          ...attrs,
          gap: props.gap,
          align: props.align,
          justify: props.justify,
        },
        slots.default?.(),
      )
  },
})

export const CoverLayout = defineComponent({
  name: "CoverLayout",
  props: {
    minHeight: String,
    gap: Number,
    center: Boolean,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "cover-layout",
        {
          ...attrs,
          "min-height": props.minHeight,
          gap: props.gap,
          center: props.center,
        },
        slots.default?.(),
      )
  },
})

export const FlowStack = defineComponent({
  name: "FlowStack",
  props: {
    gap: Number,
    align: String,
    justify: String,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "flow-stack",
        {
          ...attrs,
          gap: props.gap,
          align: props.align,
          justify: props.justify,
        },
        slots.default?.(),
      )
  },
})

export const ScreenFit = defineComponent({
  name: "ScreenFit",
  props: {
    draftWidth: Number,
    draftHeight: Number,
    fit: String as PropType<"contain" | "cover">,
    onScale: Function as PropType<(event: CustomEvent<ScaleEventData>) => void>,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "screen-fit",
        {
          ...attrs,
          "draft-width": props.draftWidth,
          "draft-height": props.draftHeight,
          fit: props.fit,
          onScale: props.onScale,
        },
        slots.default?.(),
      )
  },
})

export const MasonryLayout = defineComponent({
  name: "MasonryLayout",
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
        "masonry-layout",
        {
          ...attrs,
          "column-width": props.columnWidth,
          gap: props.gap,
          onLayout: props.onLayout,
        },
        slots.default?.(),
      )
  },
})

export const AutoGrid = defineComponent({
  name: "AutoGrid",
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
        "auto-grid",
        {
          ...attrs,
          "column-width": props.columnWidth,
          gap: props.gap,
          onGrid: props.onGrid,
        },
        slots.default?.(),
      )
  },
})

export const VirtualList = defineComponent({
  name: "VirtualList",
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
        "virtual-list",
        {
          ...attrs,
          "item-height": props.itemHeight,
          height: props.height,
          overscan: props.overscan,
          onRange: props.onRange,
        },
        slots.default?.(),
      )
  },
})

export const ReelLayout = defineComponent({
  name: "ReelLayout",
  props: {
    gap: Number,
    itemWidth: String,
    snap: Boolean,
    onReel: Function as PropType<
      (event: CustomEvent<ReelLayoutEventData>) => void
    >,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "reel-layout",
        {
          ...attrs,
          gap: props.gap,
          "item-width": props.itemWidth,
          snap: props.snap,
          onReel: props.onReel,
        },
        slots.default?.(),
      )
  },
})

export const ResizablePanel = defineComponent({
  name: "ResizablePanel",
  props: {
    direction: String as PropType<"horizontal" | "vertical">,
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
        "resizable-panel",
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

export const ScrollShadow = defineComponent({
  name: "ScrollShadow",
  props: {
    direction: String as PropType<"both" | "horizontal" | "vertical">,
    shadowSize: String,
    shadowColor: String,
    onOverflow: Function as PropType<
      (event: CustomEvent<ScrollShadowOverflowEventData>) => void
    >,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "scroll-shadow",
        {
          ...attrs,
          direction: props.direction,
          "shadow-size": props.shadowSize,
          "shadow-color": props.shadowColor,
          onOverflow: props.onOverflow,
        },
        slots.default?.(),
      )
  },
})

export const SidebarLayout = defineComponent({
  name: "SidebarLayout",
  props: {
    side: String as PropType<"left" | "right">,
    sidebarWidth: String,
    gap: Number,
    collapseAt: Number,
    onSidebar: Function as PropType<
      (event: CustomEvent<SidebarLayoutEventData>) => void
    >,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "sidebar-layout",
        {
          ...attrs,
          side: props.side,
          "sidebar-width": props.sidebarWidth,
          gap: props.gap,
          "collapse-at": props.collapseAt,
          onSidebar: props.onSidebar,
        },
        slots.default?.(),
      )
  },
})

export const StickyBox = defineComponent({
  name: "StickyBox",
  props: {
    offset: String,
    position: String as PropType<"bottom" | "left" | "right" | "top">,
    zIndex: Number,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "sticky-box",
        {
          ...attrs,
          offset: props.offset,
          position: props.position,
          "z-index": props.zIndex,
        },
        slots.default?.(),
      )
  },
})
