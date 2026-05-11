import { beforeEach, describe, expect, it } from "vitest"

import { setupDom } from "../test/setup"
import { ClusterLayout } from "./cluster-layout"

describe("cluster-layout", () => {
  beforeEach(() => {
    setupDom()
    document.body.innerHTML = ""
  })

  it("maps cluster alignment variables", async () => {
    expect(customElements.get("cluster-layout")).toBe(ClusterLayout)
    const element = document.createElement("cluster-layout") as ClusterLayout

    element.gap = 10
    element.align = "baseline"
    element.justify = "space-between"
    document.body.append(element)

    await element.updateComplete

    expect(element.style.getPropertyValue("--cl-gap")).toBe("10px")
    expect(element.style.getPropertyValue("--cl-align")).toBe("baseline")
    expect(element.style.getPropertyValue("--cl-justify")).toBe("space-between")
  })
})
