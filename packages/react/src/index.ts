import {
  AutoGrid as AutoGridElement,
  MasonryLayout as MasonryLayoutElement,
  ResizablePanel as ResizablePanelElement,
  ScreenFit as ScreenFitElement,
  VirtualList as VirtualListElement,
} from '@layout-kit/core'
import { createComponent } from '@lit/react'
import React from 'react'

export const ScreenFit = createComponent({
  tagName: 'screen-fit',
  elementClass: ScreenFitElement,
  react: React,
  events: {
    onScale: 'scale',
  },
})

export const MasonryLayout = createComponent({
  tagName: 'masonry-layout',
  elementClass: MasonryLayoutElement,
  react: React,
  events: {
    onLayout: 'layout',
  },
})

export const AutoGrid = createComponent({
  tagName: 'auto-grid',
  elementClass: AutoGridElement,
  react: React,
  events: {
    onGrid: 'grid',
  },
})

export const VirtualList = createComponent({
  tagName: 'virtual-list',
  elementClass: VirtualListElement,
  react: React,
  events: {
    onRange: 'range',
  },
})

export const ResizablePanel = createComponent({
  tagName: 'resizable-panel',
  elementClass: ResizablePanelElement,
  react: React,
  events: {
    onResize: 'resize',
  },
})
