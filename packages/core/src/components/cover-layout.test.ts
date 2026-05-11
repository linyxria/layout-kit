import { beforeEach, describe, expect, it } from "vitest"

import { setupDom } from "../test/setup"
import { CoverLayout } from "./cover-layout"

describe("cover-layout", () => {
  beforeEach(() => {
    setupDom()
    document.body.innerHTML = ""
  })

  it("maps cover sizing and centering variables", async () => {
    expect(customElements.get("cover-layout")).toBe(CoverLayout)
    const element = document.createElement("cover-layout") as CoverLayout

    element.minHeight = "480px"
    element.gap = 18
    element.center = true
    document.body.append(element)

    await element.updateComplete

    expect(element.style.getPropertyValue("--cv-min-height")).toBe("480px")
    expect(element.style.getPropertyValue("--cv-gap")).toBe("18px")
    expect(element.style.getPropertyValue("--cv-align")).toBe("center")
  })
})
