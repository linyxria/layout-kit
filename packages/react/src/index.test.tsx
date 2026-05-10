import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

describe("@layout-kit/react", () => {
  let AmbientImage: typeof import("./index").AmbientImage
  let AutoGrid: typeof import("./index").AutoGrid
  let container: HTMLDivElement
  let createRoot: typeof import("react-dom/client").createRoot
  let MasonryLayout: typeof import("./index").MasonryLayout
  let React: typeof import("react")
  let ResizablePanel: typeof import("./index").ResizablePanel
  let root: import("react-dom/client").Root
  let ScreenFit: typeof import("./index").ScreenFit
  let VirtualList: typeof import("./index").VirtualList
  let act: typeof import("react").act

  beforeEach(async () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true)
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
    ;({ default: React, act } = await import("react"))
    ;({ createRoot } = await import("react-dom/client"))
    ;({
      AmbientImage,
      AutoGrid,
      MasonryLayout,
      ResizablePanel,
      ScreenFit,
      VirtualList,
    } = await import("./index"))
    container = document.createElement("div")
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => {
      root.unmount()
    })
    container.remove()
  })

  async function render(element: React.ReactNode) {
    act(() => {
      root.render(element)
    })
    await Promise.resolve()
    await new Promise((resolve) => setTimeout(resolve, 0))
    await Promise.resolve()
  }

  async function waitForElement<T extends HTMLElement>(selector: string) {
    const element = container.querySelector(selector) as T & {
      updateComplete?: Promise<unknown>
    }
    await new Promise((resolve) => setTimeout(resolve, 0))
    await element.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 0))
    await element.updateComplete
    return element
  }

  it("maps AmbientImage props and events", async () => {
    const onAmbient = vi.fn()
    await render(
      <AmbientImage
        src="/image.webp"
        alt="Preview"
        fit="cover"
        variant="fade"
        fade="both"
        fadeSize="20%"
        backdropBlur="12px"
        imageRadius="16px"
        overlayColor="rgb(0 0 0 / 40%)"
        padding="10px"
        backdropScale="1.2"
        backgroundColor="#123456"
        autoColor={false}
        crossOrigin="anonymous"
        onAmbient={onAmbient}
      />,
    )

    const element = await waitForElement("ambient-image")
    onAmbient.mockClear()
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
      backgroundColor: "#123456",
      backdropBlur: "12px",
      backdropScale: "1.2",
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
  })

  it("maps ScreenFit props and events", async () => {
    const onScale = vi.fn()
    await render(
      <ScreenFit draftWidth={1920} draftHeight={1080} fit="cover" onScale={onScale}>
        <span>screen</span>
      </ScreenFit>,
    )

    const element = await waitForElement("screen-fit")
    onScale.mockClear()
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
  })

  it("maps MasonryLayout props and events", async () => {
    const onLayout = vi.fn()
    await render(
      <MasonryLayout columnWidth={240} gap={24} onLayout={onLayout}>
        <article>card</article>
      </MasonryLayout>,
    )

    const element = await waitForElement("masonry-layout")
    onLayout.mockClear()
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
  })

  it("maps AutoGrid props and events", async () => {
    const onGrid = vi.fn()
    await render(
      <AutoGrid columnWidth={220} gap={18} onGrid={onGrid}>
        <article>tile</article>
      </AutoGrid>,
    )

    const element = await waitForElement("auto-grid")
    onGrid.mockClear()
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
  })

  it("maps VirtualList props and events", async () => {
    const onRange = vi.fn()
    await render(
      <VirtualList itemHeight={48} height={320} overscan={6} onRange={onRange}>
        <div>row</div>
      </VirtualList>,
    )

    const element = await waitForElement("virtual-list")
    onRange.mockClear()
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
  })

  it("maps ResizablePanel props, slots, and events", async () => {
    const onResize = vi.fn()
    await render(
      <ResizablePanel
        direction="vertical"
        size={40}
        min={20}
        max={80}
        onResize={onResize}
      >
        <div slot="start">top</div>
        <div slot="end">bottom</div>
      </ResizablePanel>,
    )

    const element = await waitForElement("resizable-panel")
    onResize.mockClear()
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
  })
})
