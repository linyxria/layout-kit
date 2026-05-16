import { beforeEach, describe, expect, it, vi } from "vitest"

import { nextFrame, setClientSize, setupDom } from "../test/setup"
import { VirtualList } from "./virtual-list"

describe("virtual-list", () => {
  beforeEach(() => {
    setupDom()
    document.body.innerHTML = ""
  })

  it("renders only the visible data range plus overscan", async () => {
    const element = document.createElement("virtual-list") as VirtualList
    const onRange = vi.fn()

    element.itemHeight = 20
    element.height = 60
    element.itemCount = 10
    element.overscan = 1
    setClientSize(element, 300, 60)
    element.addEventListener("range", onRange)

    document.body.append(element)
    await element.updateComplete
    await nextFrame()

    expect(element.shadowRoot!.querySelector("slot")).not.toBeNull()
    expect(element.style.getPropertyValue("--vl-height")).toBe("60px")
    expect(element.style.getPropertyValue("--vl-item-height")).toBe("20px")
    expect(onRange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { start: 0, end: 3 } }),
    )
  })

  it("updates the rendered data window after scrolling", async () => {
    const element = document.createElement("virtual-list") as VirtualList

    element.itemHeight = 20
    element.height = 60
    element.itemCount = 20
    element.overscan = 1
    setClientSize(element, 300, 60)
    const onRange = vi.fn()
    element.addEventListener("range", onRange)

    document.body.append(element)
    await element.updateComplete
    await nextFrame()

    element.scrollTop = 80
    element.dispatchEvent(new Event("scroll"))
    await element.updateComplete
    await nextFrame()

    expect(onRange).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: { start: 3, end: 7 } }),
    )
  })
})
