import { beforeEach, describe, expect, it, vi } from "vitest"

import { setClientSize, setupDom } from "../test/setup"
import { AdaptiveStack } from "./adaptive-stack"

describe("adaptive-stack", () => {
  beforeEach(() => {
    setupDom()
    document.body.innerHTML = ""
  })

  it("switches mode from container width and emits stack changes", async () => {
    expect(customElements.get("adaptive-stack")).toBe(AdaptiveStack)
    const element = document.createElement("adaptive-stack") as AdaptiveStack
    const onStack = vi.fn()

    element.breakpoint = 500
    element.gap = 20
    element.align = "center"
    element.justify = "space-between"
    setClientSize(element, 420, 200)
    element.addEventListener("stack", onStack)
    document.body.append(element)

    await Promise.resolve()
    await element.updateComplete

    expect(element.style.getPropertyValue("--as-direction")).toBe("column")
    expect(element.style.getPropertyValue("--as-gap")).toBe("20px")
    expect(element.style.getPropertyValue("--as-align")).toBe("center")
    expect(element.style.getPropertyValue("--as-justify")).toBe("space-between")
    expect(onStack).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { inlineSize: 420, mode: "column" },
      }),
    )
  })

  it("supports reversed row direction", async () => {
    expect(customElements.get("adaptive-stack")).toBe(AdaptiveStack)
    const element = document.createElement("adaptive-stack") as AdaptiveStack

    element.breakpoint = 300
    element.reverse = true
    setClientSize(element, 640, 200)
    document.body.append(element)

    await Promise.resolve()
    await element.updateComplete

    expect(element.style.getPropertyValue("--as-direction")).toBe("row-reverse")
  })
})
