import { beforeEach, describe, expect, it } from "vitest"

import { setupDom } from "../test/setup"
import { FlowStack } from "./flow-stack"

describe("flow-stack", () => {
  beforeEach(() => {
    setupDom()
    document.body.innerHTML = ""
  })

  it("maps stack rhythm variables", async () => {
    expect(customElements.get("flow-stack")).toBe(FlowStack)
    const element = document.createElement("flow-stack") as FlowStack

    element.gap = 20
    element.align = "center"
    element.justify = "space-between"
    document.body.append(element)

    await element.updateComplete

    expect(element.style.getPropertyValue("--fs-gap")).toBe("20px")
    expect(element.style.getPropertyValue("--fs-align")).toBe("center")
    expect(element.style.getPropertyValue("--fs-justify")).toBe("space-between")
  })
})
