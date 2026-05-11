import { beforeEach, describe, expect, it } from "vitest"

import { setupDom } from "../test/setup"
import { AspectBox } from "./aspect-box"

describe("aspect-box", () => {
  beforeEach(() => {
    setupDom()
    document.body.innerHTML = ""
  })

  it("maps ratio, fit, and position into CSS variables", async () => {
    expect(customElements.get("aspect-box")).toBe(AspectBox)
    const element = document.createElement("aspect-box") as AspectBox

    element.ratio = "4:3"
    element.fit = "contain"
    element.position = "top left"
    document.body.append(element)

    await Promise.resolve()
    await element.updateComplete

    expect(element.style.getPropertyValue("--ab-ratio")).toBe("4 / 3")
    expect(element.style.getPropertyValue("--ab-fit")).toBe("contain")
    expect(element.style.getPropertyValue("--ab-position")).toBe("top left")
  })
})
