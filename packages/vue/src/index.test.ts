import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createApp, h, nextTick } from "vue"

import {
  AmbientImage,
  AutoGrid,
  MasonryLayout,
  ResizablePanel,
  ScreenFit,
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

  function mount(component: unknown, props: Record<string, unknown>, slots = {}) {
    const app = createApp({
      render: () => h(component, props, slots),
    })
    app.mount(container)
    return app
  }

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
    const app = mount(
      VirtualList,
      { itemHeight: 48, height: 320, overscan: 6, onRange },
      { default: () => h("div", "row") },
    )

    const element = container.querySelector("virtual-list") as HTMLElement
    await nextTick()
    element.dispatchEvent(
      new CustomEvent("range", {
        bubbles: true,
        composed: true,
        detail: { start: 1, end: 5 },
      }),
    )

    expect(element).toMatchObject({ height: 320, itemHeight: 48, overscan: 6 })
    expect(element.textContent).toBe("row")
    expect(onRange).toHaveBeenCalledOnce()
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
})
