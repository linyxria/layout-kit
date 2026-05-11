import { beforeEach, describe, expect, it, vi } from "vitest"

import { setClientSize, setupDom } from "../test/setup"
import { SidebarLayout } from "./sidebar-layout"

describe("sidebar-layout", () => {
  beforeEach(() => {
    setupDom()
    document.body.innerHTML = ""
  })

  it("collapses below the threshold and emits sidebar state", async () => {
    expect(customElements.get("sidebar-layout")).toBe(SidebarLayout)
    const element = document.createElement("sidebar-layout") as SidebarLayout
    const onSidebar = vi.fn()

    element.side = "right"
    element.sidebarWidth = "220px"
    element.gap = 18
    element.collapseAt = 640
    setClientSize(element, 520, 300)
    element.addEventListener("sidebar", onSidebar)
    document.body.append(element)

    await element.updateComplete

    expect(element.getAttribute("side")).toBe("right")
    expect(element.hasAttribute("data-collapsed")).toBe(true)
    expect(element.style.getPropertyValue("--sl-sidebar-width")).toBe("220px")
    expect(element.style.getPropertyValue("--sl-gap")).toBe("18px")
    expect(onSidebar).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { collapsed: true, inlineSize: 520 },
      }),
    )
  })
})
