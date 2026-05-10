import { beforeEach, describe, expect, it, vi } from "vitest"

import { setRect, setupDom } from "../test/setup"
import { ResizablePanel } from "./resizable-panel"

describe("resizable-panel", () => {
  beforeEach(() => {
    setupDom()
    document.body.innerHTML = ""
  })

  it("clamps size and emits resize events while dragging", async () => {
    const element = document.createElement("resizable-panel") as ResizablePanel
    const onResize = vi.fn()

    element.size = 50
    element.min = 20
    element.max = 70
    setRect(element, 200, 100)
    element.addEventListener("resize", onResize)
    document.body.append(element)

    await element.updateComplete

    const handle = element.shadowRoot?.querySelector(".handle") as HTMLElement
    element.setPointerCapture = vi.fn()
    element.hasPointerCapture = vi.fn(() => true)
    element.releasePointerCapture = vi.fn()
    handle.dispatchEvent(
      new PointerEvent("pointerdown", {
        clientX: 0,
        pointerId: 1,
      }),
    )
    element.dispatchEvent(
      new PointerEvent("pointermove", {
        clientX: 100,
        pointerId: 1,
      }),
    )

    expect(element.size).toBe(70)
    expect(element.style.getPropertyValue("--rp-size")).toBe("70%")
    expect(onResize).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { size: 70 } }),
    )
  })

  it("reflects vertical direction", async () => {
    const element = document.createElement("resizable-panel") as ResizablePanel

    element.direction = "vertical"
    document.body.append(element)
    await element.updateComplete

    const handle = element.shadowRoot?.querySelector(".handle")
    expect(element.getAttribute("direction")).toBe("vertical")
    expect(handle?.getAttribute("aria-orientation")).toBe("vertical")
  })
})
