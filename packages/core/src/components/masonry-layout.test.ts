import { beforeEach, describe, expect, it, vi } from "vitest"

import { nextFrame, setClientSize, setupDom } from "../test/setup"
import { MasonryLayout } from "./masonry-layout"

describe("masonry-layout", () => {
  beforeEach(() => {
    setupDom()
    document.body.innerHTML = ""
  })

  it("positions slotted items into masonry columns", async () => {
    const element = document.createElement("masonry-layout") as MasonryLayout
    const onLayout = vi.fn()

    element.columnWidth = 100
    element.gap = 10
    setClientSize(element, 210, 400)
    element.addEventListener("layout", onLayout)

    for (const height of [100, 80, 60]) {
      const item = document.createElement("article")
      Object.defineProperty(item, "offsetHeight", {
        configurable: true,
        value: height,
      })
      element.append(item)
    }

    document.body.append(element)
    await element.updateComplete
    await nextFrame()

    const items = [...element.children] as HTMLElement[]
    expect(items[0].style.transform).toBe("translate(0px, 0px)")
    expect(items[1].style.transform).toBe("translate(110px, 0px)")
    expect(items[2].style.transform).toBe("translate(110px, 90px)")
    expect(element.style.height).toBe("150px")
    expect(onLayout).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { columns: 2, height: 150 } }),
    )
  })
})
