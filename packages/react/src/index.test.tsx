import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

describe("@layout-kit/react", () => {
  let AdaptiveStack: typeof import("./index").AdaptiveStack
  let AmbientImage: typeof import("./index").AmbientImage
  let AspectBox: typeof import("./index").AspectBox
  let AutoGrid: typeof import("./index").AutoGrid
  let CenterBox: typeof import("./index").CenterBox
  let ClusterLayout: typeof import("./index").ClusterLayout
  let container: HTMLDivElement
  let CoverLayout: typeof import("./index").CoverLayout
  let createRoot: typeof import("react-dom/client").createRoot
  let FlowStack: typeof import("./index").FlowStack
  let MasonryLayout: typeof import("./index").MasonryLayout
  let ReelLayout: typeof import("./index").ReelLayout
  let React: typeof import("react")
  let ResizablePanel: typeof import("./index").ResizablePanel
  let root: import("react-dom/client").Root
  let ScreenFit: typeof import("./index").ScreenFit
  let ScrollShadow: typeof import("./index").ScrollShadow
  let SidebarLayout: typeof import("./index").SidebarLayout
  let StickyBox: typeof import("./index").StickyBox
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

  it("maps AdaptiveStack props and events", async () => {
    const onStack = vi.fn()
    await render(
      <AdaptiveStack
        breakpoint={720}
        gap={20}
        align="center"
        justify="space-between"
        reverse
        onStack={onStack}
      >
        <article>stack</article>
      </AdaptiveStack>,
    )

    const element = await waitForElement("adaptive-stack")
    onStack.mockClear()
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
  })

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

  it("passes AmbientImage children through for optimized media renderers", async () => {
    await render(
      <AmbientImage src="/image.webp" alt="Preview">
        <img src="/optimized.webp" alt="Optimized preview" />
      </AmbientImage>,
    )

    const element = await waitForElement("ambient-image")
    const image = element.querySelector("img")

    expect(image?.getAttribute("src")).toBe("/optimized.webp")
    expect(image?.getAttribute("alt")).toBe("Optimized preview")
  })

  it("maps AspectBox props and slots", async () => {
    await render(
      <AspectBox ratio="4:3" fit="contain" position="top left">
        <img alt="" />
      </AspectBox>,
    )

    const element = await waitForElement("aspect-box")

    expect(element).toMatchObject({
      fit: "contain",
      position: "top left",
      ratio: "4:3",
    })
    expect(element.querySelector("img")).not.toBeNull()
  })

  it("maps CenterBox props and slots", async () => {
    await render(
      <CenterBox maxWidth="960px" padding="24px" centerText>
        <article>center</article>
      </CenterBox>,
    )

    const element = await waitForElement("center-box")

    expect(element).toMatchObject({
      centerText: true,
      maxWidth: "960px",
      padding: "24px",
    })
    expect(element.textContent).toBe("center")
  })

  it("maps ClusterLayout props and slots", async () => {
    await render(
      <ClusterLayout gap={10} align="baseline" justify="space-between">
        <button>Save</button>
      </ClusterLayout>,
    )

    const element = await waitForElement("cluster-layout")

    expect(element).toMatchObject({
      align: "baseline",
      gap: 10,
      justify: "space-between",
    })
    expect(element.textContent).toBe("Save")
  })

  it("maps CoverLayout props and slots", async () => {
    await render(
      <CoverLayout minHeight="480px" gap={18} center>
        <header slot="header">header</header>
        <main>main</main>
        <footer slot="footer">footer</footer>
      </CoverLayout>,
    )

    const element = await waitForElement("cover-layout")

    expect(element).toMatchObject({
      center: true,
      gap: 18,
      minHeight: "480px",
    })
    expect(element.querySelector('[slot="header"]')?.textContent).toBe("header")
    expect(element.querySelector("main")?.textContent).toBe("main")
    expect(element.querySelector('[slot="footer"]')?.textContent).toBe("footer")
  })

  it("maps FlowStack props and slots", async () => {
    await render(
      <FlowStack gap={20} align="center" justify="space-between">
        <article>flow</article>
      </FlowStack>,
    )

    const element = await waitForElement("flow-stack")

    expect(element).toMatchObject({
      align: "center",
      gap: 20,
      justify: "space-between",
    })
    expect(element.textContent).toBe("flow")
  })

  it("maps ScreenFit props and events", async () => {
    const onScale = vi.fn()
    await render(
      <ScreenFit
        draftWidth={1920}
        draftHeight={1080}
        fit="cover"
        onScale={onScale}
      >
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

  it("maps ScreenFit backdrop props", async () => {
    await render(
      <ScreenFit
        draftWidth={1920}
        draftHeight={1080}
        backdropSrc="/image.webp"
        backdropBlur="24px"
        backdropScale="1.2"
        backdropOverlay="rgb(0 0 0 / 40%)"
        backgroundColor="#123456"
        autoColor={false}
        crossOrigin="anonymous"
      />,
    )

    const element = await waitForElement("screen-fit")

    expect(element).toMatchObject({
      autoColor: false,
      backdropBlur: "24px",
      backdropOverlay: "rgb(0 0 0 / 40%)",
      backdropScale: "1.2",
      backdropSrc: "/image.webp",
      backgroundColor: "#123456",
      crossOrigin: "anonymous",
    })
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
    const rows = Array.from({ length: 10 }, (_, index) => `Row ${index}`)

    await render(
      <VirtualList
        itemHeight={48}
        height={320}
        items={rows}
        overscan={6}
        onRange={onRange}
        renderItem={(row, index) => (
          <span>
            {index}:{row}
          </span>
        )}
      />,
    )

    const element = await waitForElement("virtual-list")
    onRange.mockClear()
    await act(async () => {
      element.dispatchEvent(
        new CustomEvent("range", {
          bubbles: true,
          composed: true,
          detail: { start: 1, end: 3 },
        }),
      )
    })

    expect(element).toMatchObject({ height: 320, itemHeight: 48, overscan: 6 })
    expect(element.getAttribute("item-count")).toBe("10")
    expect(element.textContent).toBe("1:Row 12:Row 23:Row 3")
    expect(element.children).toHaveLength(3)
    expect(onRange).toHaveBeenCalledOnce()
  })

  it("maps ReelLayout props and events", async () => {
    const onReel = vi.fn()
    await render(
      <ReelLayout gap={14} itemWidth="180px" snap onReel={onReel}>
        <article>card</article>
      </ReelLayout>,
    )

    const element = await waitForElement("reel-layout")
    onReel.mockClear()
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

  it("maps ScrollShadow props and events", async () => {
    const onOverflow = vi.fn()
    await render(
      <ScrollShadow
        direction="both"
        shadowSize="32px"
        shadowColor="rgb(1 2 3 / 40%)"
        onOverflow={onOverflow}
      >
        <article>overflow</article>
      </ScrollShadow>,
    )

    const element = await waitForElement("scroll-shadow")
    onOverflow.mockClear()
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
  })

  it("maps SidebarLayout props, slots, and events", async () => {
    const onSidebar = vi.fn()
    await render(
      <SidebarLayout
        side="right"
        sidebarWidth="220px"
        gap={18}
        collapseAt={640}
        onSidebar={onSidebar}
      >
        <aside slot="sidebar">sidebar</aside>
        <main slot="content">content</main>
      </SidebarLayout>,
    )

    const element = await waitForElement("sidebar-layout")
    onSidebar.mockClear()
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
  })

  it("maps StickyBox props and slots", async () => {
    await render(
      <StickyBox offset="16px" position="bottom" zIndex={20}>
        <article>sticky</article>
      </StickyBox>,
    )

    const element = await waitForElement("sticky-box")

    expect(element).toMatchObject({
      offset: "16px",
      position: "bottom",
      zIndex: 20,
    })
    expect(element.textContent).toBe("sticky")
  })
})
