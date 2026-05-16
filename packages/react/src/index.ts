import {
  AdaptiveStack as AdaptiveStackElement,
  AmbientImage as AmbientImageElement,
  AspectBox as AspectBoxElement,
  AutoGrid as AutoGridElement,
  CenterBox as CenterBoxElement,
  ClusterLayout as ClusterLayoutElement,
  CoverLayout as CoverLayoutElement,
  FlowStack as FlowStackElement,
  MasonryLayout as MasonryLayoutElement,
  ReelLayout as ReelLayoutElement,
  ResizablePanel as ResizablePanelElement,
  ScreenFit as ScreenFitElement,
  ScrollShadow as ScrollShadowElement,
  SidebarLayout as SidebarLayoutElement,
  StickyBox as StickyBoxElement,
  VirtualList as VirtualListElement,
  type VirtualListRangeEventData,
} from "@layout-kit/core"
import { createComponent } from "@lit/react"
import React from "react"

export const AdaptiveStack = createComponent({
  tagName: "adaptive-stack",
  elementClass: AdaptiveStackElement,
  react: React,
  events: {
    onStack: "stack",
  },
})

export const AmbientImage = createComponent({
  tagName: "ambient-image",
  elementClass: AmbientImageElement,
  react: React,
  events: {
    onAmbient: "ambient",
  },
})

export const AspectBox = createComponent({
  tagName: "aspect-box",
  elementClass: AspectBoxElement,
  react: React,
})

export const CenterBox = createComponent({
  tagName: "center-box",
  elementClass: CenterBoxElement,
  react: React,
})

export const ClusterLayout = createComponent({
  tagName: "cluster-layout",
  elementClass: ClusterLayoutElement,
  react: React,
})

export const CoverLayout = createComponent({
  tagName: "cover-layout",
  elementClass: CoverLayoutElement,
  react: React,
})

export const FlowStack = createComponent({
  tagName: "flow-stack",
  elementClass: FlowStackElement,
  react: React,
})

export const ScreenFit = createComponent({
  tagName: "screen-fit",
  elementClass: ScreenFitElement,
  react: React,
  events: {
    onScale: "scale",
  },
})

export const MasonryLayout = createComponent({
  tagName: "masonry-layout",
  elementClass: MasonryLayoutElement,
  react: React,
  events: {
    onLayout: "layout",
  },
})

export const AutoGrid = createComponent({
  tagName: "auto-grid",
  elementClass: AutoGridElement,
  react: React,
  events: {
    onGrid: "grid",
  },
})

export interface VirtualListProps<T> extends Omit<
  React.HTMLAttributes<VirtualListElement>,
  "children"
> {
  height?: number
  itemHeight?: number
  items: readonly T[]
  onRange?: (event: CustomEvent<VirtualListRangeEventData>) => void
  overscan?: number
  renderItem: (item: T, index: number) => React.ReactNode
}

export function VirtualList<T>({
  height,
  itemHeight = 48,
  items,
  onRange,
  overscan,
  renderItem,
  style,
  ...props
}: VirtualListProps<T>) {
  const elementRef = React.useRef<VirtualListElement | null>(null)
  const [range, setRange] = React.useState<VirtualListRangeEventData>({
    end: -1,
    start: -1,
  })

  React.useLayoutEffect(() => {
    const element = elementRef.current

    if (!element) {
      return
    }

    const handleRange = (event: Event) => {
      const rangeEvent = event as CustomEvent<VirtualListRangeEventData>
      setRange(rangeEvent.detail)
      onRange?.(rangeEvent)
    }

    element.addEventListener("range", handleRange)

    return () => element.removeEventListener("range", handleRange)
  }, [onRange])

  const safeItemHeight = Math.max(1, itemHeight)
  const visibleItems =
    range.start < 0 || range.end < 0
      ? []
      : items.slice(range.start, range.end + 1).map((item, offset) => ({
          index: range.start + offset,
          item,
        }))

  return React.createElement(
    "virtual-list",
    {
      ...props,
      height,
      "item-count": items.length,
      "item-height": itemHeight,
      overscan,
      ref: elementRef,
      style,
    },
    visibleItems.map(({ item, index }) =>
      React.createElement(
        "div",
        {
          key: index,
          style: {
            boxSizing: "border-box",
            height: `${safeItemHeight}px`,
            left: 0,
            overflow: "hidden",
            position: "absolute",
            right: 0,
            transform: `translateY(${index * safeItemHeight}px)`,
          },
        },
        renderItem(item, index),
      ),
    ),
  )
}

export const ReelLayout = createComponent({
  tagName: "reel-layout",
  elementClass: ReelLayoutElement,
  react: React,
  events: {
    onReel: "reel",
  },
})

export const ResizablePanel = createComponent({
  tagName: "resizable-panel",
  elementClass: ResizablePanelElement,
  react: React,
  events: {
    onResize: "resize",
  },
})

export const ScrollShadow = createComponent({
  tagName: "scroll-shadow",
  elementClass: ScrollShadowElement,
  react: React,
  events: {
    onOverflow: "overflow",
  },
})

export const SidebarLayout = createComponent({
  tagName: "sidebar-layout",
  elementClass: SidebarLayoutElement,
  react: React,
  events: {
    onSidebar: "sidebar",
  },
})

export const StickyBox = createComponent({
  tagName: "sticky-box",
  elementClass: StickyBoxElement,
  react: React,
})
