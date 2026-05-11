import { beforeEach, describe, expect, it } from "vitest"

import { setupDom } from "../test/setup"
import { StickyBox } from "./sticky-box"

describe("sticky-box", () => {
  beforeEach(() => {
    setupDom()
    document.body.innerHTML = ""
  })

  it("maps sticky position, offset, and z-index into CSS variables", async () => {
    expect(customElements.get("sticky-box")).toBe(StickyBox)
    const element = document.createElement("sticky-box") as StickyBox

    element.position = "bottom"
    element.offset = "16px"
    element.zIndex = 20
    document.body.append(element)

    await Promise.resolve()
    await element.updateComplete

    expect(element.style.getPropertyValue("--sb-bottom")).toBe("16px")
    expect(element.style.getPropertyValue("--sb-top")).toBe("auto")
    expect(element.style.getPropertyValue("--sb-z-index")).toBe("20")
  })
})
