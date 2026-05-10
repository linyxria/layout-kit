import { beforeEach, describe, expect, it, vi } from "vitest"

import { setupDom } from "../test/setup"
import { AmbientImage } from "./ambient-image"

describe("ambient-image", () => {
  beforeEach(() => {
    setupDom()
    document.body.innerHTML = ""
  })

  it("maps properties into render output and CSS variables", async () => {
    const element = document.createElement("ambient-image") as AmbientImage

    element.src = "/image.webp"
    element.alt = "Preview"
    element.variant = "fade"
    element.fade = "both"
    element.fit = "cover"
    element.autoColor = false
    element.backdropBlur = "12px"
    element.fadeSize = "20%"
    element.imageRadius = "16px"
    element.overlayColor = "rgb(0 0 0 / 40%)"
    element.padding = "10px"
    element.backdropScale = "1.2"
    document.body.append(element)

    await element.updateComplete

    const image = element.shadowRoot?.querySelector("img")
    const fade = element.shadowRoot?.querySelector(".fade")
    expect(image?.getAttribute("src")).toBe("/image.webp")
    expect(image?.getAttribute("alt")).toBe("Preview")
    expect(image?.classList.contains("cover")).toBe(true)
    expect(fade?.className).toBe("fade both")
    expect(element.style.getPropertyValue("--ai-blur")).toBe("12px")
    expect(element.style.getPropertyValue("--ai-fade-size")).toBe("20%")
    expect(element.style.getPropertyValue("--ai-image-radius")).toBe("16px")
    expect(element.style.getPropertyValue("--ai-overlay")).toBe(
      "rgb(0 0 0 / 40%)",
    )
    expect(element.style.getPropertyValue("--ai-padding")).toBe("10px")
    expect(element.style.getPropertyValue("--ai-scale")).toBe("1.2")
  })

  it("maps backdrop-blur attribute without supporting the native blur name", async () => {
    const element = document.createElement("ambient-image") as AmbientImage

    element.setAttribute("backdrop-blur", "12px")
    document.body.append(element)

    await element.updateComplete

    expect(element.backdropBlur).toBe("12px")
    expect(element.style.getPropertyValue("--ai-blur")).toBe("12px")

    element.setAttribute("blur", "24px")

    await element.updateComplete

    expect(element.backdropBlur).toBe("12px")
    expect(element.style.getPropertyValue("--ai-blur")).toBe("12px")
  })

  it("emits the average ambient color", async () => {
    const onAmbient = vi.fn()
    const element = document.createElement("ambient-image") as AmbientImage
    const createElement = document.createElement.bind(document)

    vi.stubGlobal(
      "Image",
      class {
        crossOrigin: string | null = null
        naturalHeight = 2
        naturalWidth = 2
        onerror: (() => void) | null = null
        onload: (() => void) | null = null

        set src(_value: string) {
          queueMicrotask(() => this.onload?.())
        }
      },
    )

    vi.spyOn(document, "createElement").mockImplementation((tagName) => {
      if (tagName !== "canvas") {
        return createElement(tagName)
      }

      return {
        getContext: () => ({
          drawImage: vi.fn(),
          getImageData: () => ({
            data: new Uint8ClampedArray([
              100, 150, 200, 255, 100, 150, 200, 255, 100, 150, 200, 255, 100,
              150, 200, 255,
            ]),
          }),
        }),
        height: 0,
        width: 0,
      } as unknown as HTMLCanvasElement
    })

    element.src = "/image.webp"
    element.addEventListener("ambient", onAmbient)
    document.body.append(element)

    await element.updateComplete
    await Promise.resolve()
    await element.updateComplete

    expect(onAmbient).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          blockSize: 2,
          color: "rgb(100 150 200)",
          inlineSize: 2,
        },
      }),
    )
    expect(element.style.getPropertyValue("--ai-background")).toBe(
      "rgb(100 150 200)",
    )
  })
})
