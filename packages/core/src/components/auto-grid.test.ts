import { beforeEach, describe, expect, it, vi } from "vitest"

import { setClientSize, setupDom } from "../test/setup"
import { AutoGrid } from "./auto-grid"

describe("auto-grid", () => {
  beforeEach(() => {
    setupDom()
    document.body.innerHTML = ""
  })

  it("updates layout variables and emits the column count", async () => {
    const element = document.createElement("auto-grid") as AutoGrid
    const onGrid = vi.fn()

    element.columnWidth = 200
    element.gap = 20
    setClientSize(element, 660, 200)
    element.addEventListener("grid", onGrid)
    document.body.append(element)

    await element.updateComplete

    expect(element.style.getPropertyValue("--ag-column-width")).toBe("200px")
    expect(element.style.getPropertyValue("--ag-gap")).toBe("20px")
    expect(onGrid).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { columns: 3 } }),
    )
  })
})
