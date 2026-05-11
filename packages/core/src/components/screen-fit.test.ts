import { beforeEach, describe, expect, it, vi } from "vitest"

import { nextFrame, setClientSize, setupDom } from "../test/setup"
import { ScreenFit } from "./screen-fit"

describe("screen-fit", () => {
  beforeEach(() => {
    setupDom()
    document.body.innerHTML = ""
  })

  it("uses contain scaling by default and emits scale changes", async () => {
    const element = document.createElement("screen-fit") as ScreenFit
    const onScale = vi.fn()

    element.draftWidth = 1920
    element.draftHeight = 1080
    setClientSize(element, 1280, 720)
    element.addEventListener("scale", onScale)
    document.body.append(element)

    await element.updateComplete
    await nextFrame()

    expect(element.style.getPropertyValue("--sf-width")).toBe("1920px")
    expect(element.style.getPropertyValue("--sf-height")).toBe("1080px")
    expect(element.style.getPropertyValue("--sf-scale")).toBe(`${1280 / 1920}`)
    expect(element.style.getPropertyValue("--sf-translate-x")).toBe("0px")
    expect(element.style.getPropertyValue("--sf-translate-y")).toBe("0px")
    expect(onScale).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          blockSize: 720,
          inlineSize: 1280,
          scale: 1280 / 1920,
        },
      }),
    )
  })

  it("supports cover scaling", async () => {
    const element = document.createElement("screen-fit") as ScreenFit

    element.draftWidth = 1920
    element.draftHeight = 1080
    element.fit = "cover"
    setClientSize(element, 1000, 1000)
    document.body.append(element)

    await element.updateComplete
    await nextFrame()

    expect(element.style.getPropertyValue("--sf-scale")).toBe(`${1000 / 1080}`)
    expect(element.style.getPropertyValue("--sf-translate-x")).toBe(
      `${(1000 - 1920 * (1000 / 1080)) / 2}px`,
    )
    expect(element.style.getPropertyValue("--sf-translate-y")).toBe("0px")
  })

  it("renders the backdrop only when a backdrop source is provided", async () => {
    const element = document.createElement("screen-fit") as ScreenFit

    document.body.append(element)

    await element.updateComplete

    expect(element.shadowRoot?.querySelector(".backdrop")).toBeNull()

    element.backdropSrc = "/image.webp"
    element.autoColor = false

    await element.updateComplete

    const backdrop = element.shadowRoot?.querySelector(".backdrop")
    const image = backdrop?.querySelector("img")
    expect(backdrop).not.toBeNull()
    expect(image?.getAttribute("src")).toBe("/image.webp")
  })

  it("maps backdrop properties into CSS variables", async () => {
    const element = document.createElement("screen-fit") as ScreenFit

    element.backdropSrc = "/image.webp"
    element.backdropBlur = "24px"
    element.backdropScale = "1.2"
    element.backdropOverlay = "rgb(0 0 0 / 40%)"
    element.backgroundColor = "#123456"
    element.autoColor = false
    document.body.append(element)

    await element.updateComplete

    expect(element.style.getPropertyValue("--sf-background")).toBe("#123456")
    expect(element.style.getPropertyValue("--sf-backdrop-blur")).toBe("24px")
    expect(element.style.getPropertyValue("--sf-backdrop-scale")).toBe("1.2")
    expect(element.style.getPropertyValue("--sf-backdrop-overlay")).toBe(
      "rgb(0 0 0 / 40%)",
    )
  })

  it("does not load the backdrop image when auto color is disabled", async () => {
    const element = document.createElement("screen-fit") as ScreenFit
    const Image = vi.fn()

    vi.stubGlobal("Image", Image)

    element.backdropSrc = "/image.webp"
    element.backgroundColor = "#123456"
    element.autoColor = false
    document.body.append(element)

    await element.updateComplete
    await Promise.resolve()

    expect(Image).not.toHaveBeenCalled()
    expect(element.style.getPropertyValue("--sf-background")).toBe("#123456")
  })
})
