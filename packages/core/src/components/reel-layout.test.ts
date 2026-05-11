import { beforeEach, describe, expect, it, vi } from "vitest"

import { nextFrame, setClientSize, setupDom } from "../test/setup"
import { ReelLayout } from "./reel-layout"

describe("reel-layout", () => {
  beforeEach(() => {
    setupDom()
    document.body.innerHTML = ""
  })

  it("sets reel variables and emits overflow state", async () => {
    expect(customElements.get("reel-layout")).toBe(ReelLayout)
    const element = document.createElement("reel-layout") as ReelLayout
    const onReel = vi.fn()

    expect(element).toBeInstanceOf(ReelLayout)
    element.gap = 12
    element.itemWidth = "180px"
    element.snap = true
    setClientSize(element, 300, 120)
    Object.defineProperty(element, "scrollWidth", {
      configurable: true,
      value: 620,
    })
    element.addEventListener("reel", onReel)
    document.body.append(element)

    await Promise.resolve()
    await element.updateComplete
    await nextFrame()

    expect(element.style.getPropertyValue("--rl-gap")).toBe("12px")
    expect(element.style.getPropertyValue("--rl-item-width")).toBe("180px")
    expect(element.style.getPropertyValue("--rl-snap-align")).toBe("start")
    expect(element.style.getPropertyValue("--rl-snap-type")).toBe("x mandatory")
    expect(onReel).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { overflow: true, scrollLeft: 0 },
      }),
    )
  })
})
