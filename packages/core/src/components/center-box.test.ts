import { beforeEach, describe, expect, it } from "vitest"

import { setupDom } from "../test/setup"
import { CenterBox } from "./center-box"

describe("center-box", () => {
  beforeEach(() => {
    setupDom()
    document.body.innerHTML = ""
  })

  it("maps max width, padding, and text alignment into CSS variables", async () => {
    expect(customElements.get("center-box")).toBe(CenterBox)
    const element = document.createElement("center-box") as CenterBox

    element.maxWidth = "960px"
    element.padding = "24px"
    element.centerText = true
    document.body.append(element)

    await element.updateComplete

    expect(element.style.getPropertyValue("--cb-max-width")).toBe("960px")
    expect(element.style.getPropertyValue("--cb-padding")).toBe("24px")
    expect(element.style.getPropertyValue("--cb-text-align")).toBe("center")
  })
})
