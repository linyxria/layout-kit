import { beforeEach, describe, expect, it, vi } from "vitest"

import { nextFrame, setupDom } from "../test/setup"
import { ScrollShadow } from "./scroll-shadow"

describe("scroll-shadow", () => {
  beforeEach(() => {
    setupDom()
    document.body.innerHTML = ""
  })

  it("shows vertical overflow shadows and emits edge state", async () => {
    expect(customElements.get("scroll-shadow")).toBe(ScrollShadow)
    const element = document.createElement("scroll-shadow") as ScrollShadow
    const onOverflow = vi.fn()

    element.direction = "vertical"
    element.shadowSize = "32px"
    element.shadowColor = "rgb(1 2 3 / 40%)"
    element.addEventListener("overflow", onOverflow)
    document.body.append(element)

    element.requestUpdate()
    element.performUpdate()
    await Promise.resolve()
    await element.updateComplete
    await Promise.resolve()
    await element.updateComplete

    const scroller = element.shadowRoot?.querySelector(
      ".scroller",
    ) as HTMLDivElement
    expect(element.shadowRoot?.innerHTML).toContain("scroller")
    Object.defineProperties(scroller, {
      clientHeight: { configurable: true, value: 100 },
      clientWidth: { configurable: true, value: 200 },
      scrollHeight: { configurable: true, value: 300 },
      scrollWidth: { configurable: true, value: 200 },
    })

    scroller.dispatchEvent(new Event("scroll"))
    await nextFrame()
    element.performUpdate()
    await element.updateComplete

    expect(element.style.getPropertyValue("--ss-size")).toBe("32px")
    expect(element.style.getPropertyValue("--ss-color")).toBe(
      "rgb(1 2 3 / 40%)",
    )
    expect(
      element.shadowRoot?.querySelector(".bottom")?.classList.contains("visible"),
    ).toBe(true)
    expect(onOverflow).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { bottom: true, left: false, right: false, top: false },
      }),
    )
  })
})
