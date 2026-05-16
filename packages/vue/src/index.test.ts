import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createApp, h, nextTick } from "vue"

import {
  AdaptiveStack,
  AmbientImage,
  AspectBox,
  AutoGrid,
  CenterBox,
  ClusterLayout,
  CoverLayout,
  FlowStack,
  MasonryLayout,
  ReelLayout,
  ResizablePanel,
  ScreenFit,
  ScrollShadow,
  SidebarLayout,
  StickyBox,
  VirtualList,
} from "./index"

describe("@layout-kit/vue", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        disconnect() {}
        observe() {}
        unobserve() {}
      },
    )
    vi.stubGlobal(
      "MutationObserver",
      class {
        disconnect() {}
        observe() {}
        takeRecords() {
          return []
        }
      },
    )
    container = document.createElement("div")
    document.body.append(container)
  })

  afterEach(() => {
    container.remove()
  })

  function mount(
    component: unknown,
    props: Record<string, unknown>,
    slots = {},
  ) {
    const app = createApp({
      render: () => h(component, props, slots),
    })
    app.mount(container)
    return app
  }

  it("maps AdaptiveStack props, slots, and events", async () => {
    const onStack = vi.fn()
    const app = mount(
      AdaptiveStack,
      {
        breakpoint: 720,
        gap: 20,
        align: "center",
        justify: "space-between",
        reverse: true,
        onStack,
      },
      { default: () => h("article", "stack") },
    )

    const element = container.querySelector("adaptive-stack") as HTMLElement
    await nextTick()
    element.dispatchEvent(
      new CustomEvent("stack", {
        bubbles: true,
        composed: true,
        detail: { inlineSize: 600, mode: "column" },
      }),
    )

    expect(element).toMatchObject({
      align: "center",
      breakpoint: 720,
      gap: 20,
      justify: "space-between",
      reverse: true,
    })
    expect(element.textContent).toBe("stack")
    expect(onStack).toHaveBeenCalledOnce()
    app.unmount()
  })

  it("maps AmbientImage props and events", async () => {
    const onAmbient = vi.fn()
    const app = mount(AmbientImage, {
      src: "/image.webp",
      alt: "Preview",
      fit: "cover",
      variant: "fade",
      fade: "both",
      fadeSize: "20%",
      backdropBlur: "12px",
      imageRadius: "16px",
      overlayColor: "rgb(0 0 0 / 40%)",
      padding: "10px",
      backdropScale: "1.2",
      backgroundColor: "#123456",
      autoColor: false,
      crossOrigin: "anonymous",
      onAmbient,
    })

    const element = container.querySelector("ambient-image") as HTMLElement
    await nextTick()
    element.dispatchEvent(
      new CustomEvent("ambient", {
        bubbles: true,
        composed: true,
        detail: { blockSize: 2, color: "rgb(1 2 3)", inlineSize: 2 },
      }),
    )

    expect(element).toMatchObject({
      alt: "Preview",
      autoColor: false,
      backdropBlur: "12px",
      backdropScale: "1.2",
      backgroundColor: "#123456",
      crossOrigin: "anonymous",
      fade: "both",
      fadeSize: "20%",
      fit: "cover",
      imageRadius: "16px",
      overlayColor: "rgb(0 0 0 / 40%)",
      padding: "10px",
      src: "/image.webp",
      variant: "fade",
    })
    expect(onAmbient).toHaveBeenCalledOnce()
    app.unmount()
  })

  it("passes AmbientImage slots through for optimized media renderers", async () => {
    const app = mount(
      AmbientImage,
      { alt: "Preview", src: "/image.webp" },
      {
        default: () =>
          h("img", { alt: "Optimized preview", src: "/optimized.webp" }),
      },
    )

    const element = container.querySelector("ambient-image") as HTMLElement
    await nextTick()
    const image = element.querySelector("img")

    expect(image?.getAttribute("src")).toBe("/optimized.webp")
    expect(image?.getAttribute("alt")).toBe("Optimized preview")
    app.unmount()
  })

  it("maps AspectBox props and slots", async () => {
    const app = mount(
      AspectBox,
      { ratio: "4:3", fit: "contain", position: "top left" },
      { default: () => h("img", { alt: "" }) },
    )

    const element = container.querySelector("aspect-box") as HTMLElement
    await nextTick()

    expect(element).toMatchObject({
      fit: "contain",
      position: "top left",
      ratio: "4:3",
    })
    expect(element.querySelector("img")).not.toBeNull()
    app.unmount()
  })

  it("maps CenterBox props and slots", async () => {
    const app = mount(
      CenterBox,
      { maxWidth: "960px", padding: "24px", centerText: true },
      { default: () => h("article", "center") },
    )

    const element = container.querySelector("center-box") as HTMLElement
    await nextTick()

    expect(element).toMatchObject({
      centerText: true,
      maxWidth: "960px",
      padding: "24px",
    })
    expect(element.textContent).toBe("center")
    app.unmount()
  })

  it("maps ClusterLayout props and slots", async () => {
    const app = mount(
      ClusterLayout,
      { gap: 10, align: "baseline", justify: "space-between" },
      { default: () => h("button", "Save") },
    )

    const element = container.querySelector("cluster-layout") as HTMLElement
    await nextTick()

    expect(element).toMatchObject({
      align: "baseline",
      gap: 10,
      justify: "space-between",
    })
    expect(element.textContent).toBe("Save")
    app.unmount()
  })

  it("maps CoverLayout props and slots", async () => {
    const app = mount(
      CoverLayout,
      { minHeight: "480px", gap: 18, center: true },
      {
        default: () => [
          h("header", { slot: "header" }, "header"),
          h("main", "main"),
          h("footer", { slot: "footer" }, "footer"),
        ],
      },
    )

    const element = container.querySelector("cover-layout") as HTMLElement
    await nextTick()

    expect(element).toMatchObject({
      center: true,
      gap: 18,
      minHeight: "480px",
    })
    expect(element.querySelector('[slot="header"]')?.textContent).toBe("header")
    expect(element.querySelector("main")?.textContent).toBe("main")
    expect(element.querySelector('[slot="footer"]')?.textContent).toBe("footer")
    app.unmount()
  })

  it("maps FlowStack props and slots", async () => {
    const app = mount(
      FlowStack,
      { gap: 20, align: "center", justify: "space-between" },
      { default: () => h("article", "flow") },
    )

    const element = container.querySelector("flow-stack") as HTMLElement
    await nextTick()

    expect(element).toMatchObject({
      align: "center",
      gap: 20,
      justify: "space-between",
    })
    expect(element.textContent).toBe("flow")
    app.unmount()
  })

  it("maps ScreenFit props, slots, and events", async () => {
    const onScale = vi.fn()
    const app = mount(
      ScreenFit,
      { draftWidth: 1920, draftHeight: 1080, fit: "cover", onScale },
      { default: () => "screen" },
    )

    const element = container.querySelector("screen-fit") as HTMLElement
    await nextTick()
    element.dispatchEvent(
      new CustomEvent("scale", {
        bubbles: true,
        composed: true,
        detail: { blockSize: 720, inlineSize: 1280, scale: 2 / 3 },
      }),
    )

    expect(element).toMatchObject({
      draftHeight: 1080,
      draftWidth: 1920,
      fit: "cover",
    })
    expect(element.textContent).toBe("screen")
    expect(onScale).toHaveBeenCalledOnce()
    app.unmount()
  })

  it("maps ScreenFit backdrop props", async () => {
    const app = mount(ScreenFit, {
      draftWidth: 1920,
      draftHeight: 1080,
      backdropSrc: "/image.webp",
      backdropBlur: "24px",
      backdropScale: "1.2",
      backdropOverlay: "rgb(0 0 0 / 40%)",
      backgroundColor: "#123456",
      autoColor: false,
      crossOrigin: "anonymous",
    })

    const element = container.querySelector("screen-fit") as HTMLElement
    await nextTick()

    expect(element).toMatchObject({
      autoColor: false,
      backdropBlur: "24px",
      backdropOverlay: "rgb(0 0 0 / 40%)",
      backdropScale: "1.2",
      backdropSrc: "/image.webp",
      backgroundColor: "#123456",
      crossOrigin: "anonymous",
    })
    app.unmount()
  })

  it("maps MasonryLayout props, slots, and events", async () => {
    const onLayout = vi.fn()
    const app = mount(
      MasonryLayout,
      { columnWidth: 240, gap: 24, onLayout },
      { default: () => h("article", "card") },
    )

    const element = container.querySelector("masonry-layout") as HTMLElement
    await nextTick()
    element.dispatchEvent(
      new CustomEvent("layout", {
        bubbles: true,
        composed: true,
        detail: { columns: 2, height: 320 },
      }),
    )

    expect(element).toMatchObject({ columnWidth: 240, gap: 24 })
    expect(element.textContent).toBe("card")
    expect(onLayout).toHaveBeenCalledOnce()
    app.unmount()
  })

  it("maps AutoGrid props, slots, and events", async () => {
    const onGrid = vi.fn()
    const app = mount(
      AutoGrid,
      { columnWidth: 220, gap: 18, onGrid },
      { default: () => h("article", "tile") },
    )

    const element = container.querySelector("auto-grid") as HTMLElement
    await nextTick()
    element.dispatchEvent(
      new CustomEvent("grid", {
        bubbles: true,
        composed: true,
        detail: { columns: 3 },
      }),
    )

    expect(element).toMatchObject({ columnWidth: 220, gap: 18 })
    expect(element.textContent).toBe("tile")
    expect(onGrid).toHaveBeenCalledOnce()
    app.unmount()
  })

  it("maps VirtualList props, slots, and events", async () => {
    const onRange = vi.fn()
    const rows = Array.from({ length: 10 }, (_, index) => `Row ${index}`)
    const app = mount(VirtualList, {
      height: 320,
      itemHeight: 48,
      items: rows,
      onRange,
      overscan: 6,
      renderItem: (row: unknown, index: number) => h("span", `${index}:${row}`),
    })

    const element = container.querySelector("virtual-list") as HTMLElement
    await nextTick()
    element.dispatchEvent(
      new CustomEvent("range", {
        bubbles: true,
        composed: true,
        detail: { start: 1, end: 3 },
      }),
    )
    await nextTick()

    expect(element).toMatchObject({ height: 320, itemHeight: 48, overscan: 6 })
    expect(element.getAttribute("item-count")).toBe("10")
    expect(element.textContent).toBe("1:Row 12:Row 23:Row 3")
    expect(element.children).toHaveLength(3)
    expect(onRange).toHaveBeenCalledOnce()
    app.unmount()
  })

  it("maps ReelLayout props, slots, and events", async () => {
    const onReel = vi.fn()
    const app = mount(
      ReelLayout,
      { gap: 14, itemWidth: "180px", snap: true, onReel },
      { default: () => h("article", "card") },
    )

    const element = container.querySelector("reel-layout") as HTMLElement
    await nextTick()
    element.dispatchEvent(
      new CustomEvent("reel", {
        bubbles: true,
        composed: true,
        detail: { overflow: true, scrollLeft: 10 },
      }),
    )

    expect(element).toMatchObject({
      gap: 14,
      itemWidth: "180px",
      snap: true,
    })
    expect(element.textContent).toBe("card")
    expect(onReel).toHaveBeenCalledOnce()
    app.unmount()
  })

  it("maps ResizablePanel props, named slots, and events", async () => {
    const onResize = vi.fn()
    const app = mount(
      ResizablePanel,
      { direction: "vertical", size: 40, min: 20, max: 80, onResize },
      {
        default: () => [
          h("div", { slot: "start" }, "top"),
          h("div", { slot: "end" }, "bottom"),
        ],
      },
    )

    const element = container.querySelector("resizable-panel") as HTMLElement
    await nextTick()
    element.dispatchEvent(
      new CustomEvent("resize", {
        bubbles: true,
        composed: true,
        detail: { size: 60 },
      }),
    )

    expect(element).toMatchObject({
      direction: "vertical",
      max: 80,
      min: 20,
      size: 40,
    })
    expect(element.querySelector('[slot="start"]')?.textContent).toBe("top")
    expect(element.querySelector('[slot="end"]')?.textContent).toBe("bottom")
    expect(onResize).toHaveBeenCalledOnce()
    app.unmount()
  })

  it("maps ScrollShadow props, slots, and events", async () => {
    const onOverflow = vi.fn()
    const app = mount(
      ScrollShadow,
      {
        direction: "both",
        shadowSize: "32px",
        shadowColor: "rgb(1 2 3 / 40%)",
        onOverflow,
      },
      { default: () => h("article", "overflow") },
    )

    const element = container.querySelector("scroll-shadow") as HTMLElement
    await nextTick()
    element.dispatchEvent(
      new CustomEvent("overflow", {
        bubbles: true,
        composed: true,
        detail: { bottom: true, left: false, right: false, top: false },
      }),
    )

    expect(element).toMatchObject({
      direction: "both",
      shadowColor: "rgb(1 2 3 / 40%)",
      shadowSize: "32px",
    })
    expect(element.textContent).toBe("overflow")
    expect(onOverflow).toHaveBeenCalledOnce()
    app.unmount()
  })

  it("maps SidebarLayout props, slots, and events", async () => {
    const onSidebar = vi.fn()
    const app = mount(
      SidebarLayout,
      {
        side: "right",
        sidebarWidth: "220px",
        gap: 18,
        collapseAt: 640,
        onSidebar,
      },
      {
        default: () => [
          h("aside", { slot: "sidebar" }, "sidebar"),
          h("main", { slot: "content" }, "content"),
        ],
      },
    )

    const element = container.querySelector("sidebar-layout") as HTMLElement
    await nextTick()
    element.dispatchEvent(
      new CustomEvent("sidebar", {
        bubbles: true,
        composed: true,
        detail: { collapsed: true, inlineSize: 520 },
      }),
    )

    expect(element).toMatchObject({
      collapseAt: 640,
      gap: 18,
      side: "right",
      sidebarWidth: "220px",
    })
    expect(element.querySelector('[slot="sidebar"]')?.textContent).toBe(
      "sidebar",
    )
    expect(element.querySelector('[slot="content"]')?.textContent).toBe(
      "content",
    )
    expect(onSidebar).toHaveBeenCalledOnce()
    app.unmount()
  })

  it("maps StickyBox props and slots", async () => {
    const app = mount(
      StickyBox,
      { offset: "16px", position: "bottom", zIndex: 20 },
      { default: () => h("article", "sticky") },
    )

    const element = container.querySelector("sticky-box") as HTMLElement
    await nextTick()

    expect(element).toMatchObject({
      offset: "16px",
      position: "bottom",
      zIndex: 20,
    })
    expect(element.textContent).toBe("sticky")
    app.unmount()
  })
})
