import { beforeEach, describe, expect, it, vi } from "vitest"

import { nextFrame, setClientSize, setupDom } from "../test/setup"
import { VirtualList } from "./virtual-list"

describe("virtual-list", () => {
  beforeEach(() => {
    setupDom()
    document.body.innerHTML = ""
  })

  it("renders only the visible range plus overscan", async () => {
    const element = document.createElement("virtual-list") as VirtualList
    const onRange = vi.fn()

    element.itemHeight = 20
    element.height = 60
    element.overscan = 1
    setClientSize(element, 300, 60)
    element.addEventListener("range", onRange)

    for (let index = 0; index < 10; index += 1) {
      element.append(document.createElement("div"))
    }

    document.body.append(element)
    await element.updateComplete
    await nextFrame()

    const items = [...element.children] as HTMLElement[]
    expect(items.slice(0, 6).every((item) => !item.hidden)).toBe(true)
    expect(items.slice(6).every((item) => item.hidden)).toBe(true)
    expect(items[4].style.transform).toBe("translateY(80px)")
    expect(element.style.getPropertyValue("--vl-height")).toBe("60px")
    expect(element.style.getPropertyValue("--vl-item-height")).toBe("20px")
    expect(onRange).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { start: 0, end: 5 } }),
    )
  })
})
