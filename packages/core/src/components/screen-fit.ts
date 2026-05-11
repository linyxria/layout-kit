import { css, html, LitElement } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { styleMap } from "lit/directives/style-map.js"

import {
  getAverageImageColor,
  type ImageCrossOrigin,
  loadImage,
} from "../utils/image-color"

export interface ScaleEventData {
  blockSize: number
  inlineSize: number
  scale: number
}

@customElement("screen-fit")
export class ScreenFit extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      overflow: hidden;
      background: var(--sf-background, #111827);
      contain: layout paint;
      box-sizing: border-box;
    }

    .backdrop {
      position: absolute;
      inset: 0;
      z-index: 0;
      overflow: hidden;
      pointer-events: none;
    }

    .backdrop img {
      width: 100%;
      height: 100%;
      max-width: none;
      object-fit: cover;
      filter: blur(var(--sf-backdrop-blur, 40px));
      transform: scale(var(--sf-backdrop-scale, 1.08));
    }

    .backdrop::after {
      position: absolute;
      inset: 0;
      background: var(--sf-backdrop-overlay, rgb(0 0 0 / 28%));
      content: "";
    }

    .viewport {
      position: relative;
      z-index: 1;
      width: var(--sf-width);
      height: var(--sf-height);
      transform: translate(
          var(--sf-translate-x, 0px),
          var(--sf-translate-y, 0px)
        )
        scale(var(--sf-scale, 1));
      transform-origin: top left;
      transition: transform 0.3s;
    }

    ::slotted(*) {
      box-sizing: border-box;
    }
  `

  @property({ type: Number, attribute: "draft-width" })
  draftWidth = 0

  @property({ type: Number, attribute: "draft-height" })
  draftHeight = 0

  @property()
  fit: "contain" | "cover" = "contain"

  @property({ attribute: "backdrop-src" })
  backdropSrc = ""

  @property({ attribute: "backdrop-blur" })
  backdropBlur = "40px"

  @property({ attribute: "backdrop-scale" })
  backdropScale = "1.08"

  @property({ attribute: "backdrop-overlay" })
  backdropOverlay = "rgb(0 0 0 / 28%)"

  @property({ attribute: "background-color" })
  backgroundColor = "#111827"

  @property({
    attribute: "auto-color",
    converter: {
      fromAttribute: (value) => value !== "false",
      toAttribute: (value: boolean) => (value ? "" : "false"),
    },
  })
  autoColor = true

  @property({ attribute: "cross-origin" })
  crossOrigin: ImageCrossOrigin = null

  @state()
  private resolvedBackgroundColor = this.backgroundColor

  private currentScale = Number.NaN
  private hasWarnedInvalidSize = false
  private frameId = 0
  private requestId = 0
  private resizeObserver = new ResizeObserver(() => this.scheduleTransform())

  connectedCallback() {
    super.connectedCallback()
    this.resizeObserver.observe(this)
    this.updateBackdropProperties()
    this.updateSizeProperties()
    this.scheduleTransform()
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("backgroundColor")) {
      this.resolvedBackgroundColor = this.backgroundColor
    }

    this.updateBackdropProperties()

    if (
      changedProperties.has("draftWidth") ||
      changedProperties.has("draftHeight") ||
      changedProperties.has("fit")
    ) {
      this.updateSizeProperties()
      this.scheduleTransform()
    }

    if (
      changedProperties.has("backdropSrc") ||
      changedProperties.has("autoColor") ||
      changedProperties.has("crossOrigin") ||
      changedProperties.has("backgroundColor")
    ) {
      this.resolveBackdropColor()
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    cancelAnimationFrame(this.frameId)
    this.resizeObserver.disconnect()
  }

  private updateSizeProperties() {
    this.style.setProperty("--sf-width", `${this.draftWidth}px`)
    this.style.setProperty("--sf-height", `${this.draftHeight}px`)
  }

  private updateBackdropProperties() {
    this.style.setProperty("--sf-background", this.resolvedBackgroundColor)
    this.style.setProperty("--sf-backdrop-blur", this.backdropBlur)
    this.style.setProperty("--sf-backdrop-scale", this.backdropScale)
    this.style.setProperty("--sf-backdrop-overlay", this.backdropOverlay)
  }

  private async resolveBackdropColor() {
    const currentRequest = ++this.requestId

    if (!this.backdropSrc || !this.autoColor) {
      this.resolvedBackgroundColor = this.backgroundColor
      this.updateBackdropProperties()
      return
    }

    try {
      const image = await loadImage(this.backdropSrc, this.crossOrigin)

      if (currentRequest !== this.requestId) {
        return
      }

      this.resolvedBackgroundColor = getAverageImageColor(
        image,
        this.backgroundColor,
      )
      this.updateBackdropProperties()
    } catch {
      this.resolvedBackgroundColor = this.backgroundColor
      this.updateBackdropProperties()
    }
  }

  private scheduleTransform() {
    cancelAnimationFrame(this.frameId)
    this.frameId = requestAnimationFrame(() => this.updateTransform())
  }

  private updateTransform() {
    const inlineSize = this.clientWidth
    const blockSize = this.clientHeight

    if (!this.draftWidth || !this.draftHeight || !inlineSize || !blockSize) {
      if (!this.hasWarnedInvalidSize) {
        console.warn(
          "screen-fit must have draft-width, draft-height, and a visible container size",
        )
        this.hasWarnedInvalidSize = true
      }

      return
    }

    const scaleX = inlineSize / this.draftWidth
    const scaleY = blockSize / this.draftHeight
    const nextScale =
      this.fit === "cover" ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY)

    const translateX = (inlineSize - this.draftWidth * nextScale) / 2
    const translateY = (blockSize - this.draftHeight * nextScale) / 2

    this.style.setProperty("--sf-scale", `${nextScale}`)
    this.style.setProperty("--sf-translate-x", `${translateX}px`)
    this.style.setProperty("--sf-translate-y", `${translateY}px`)

    if (nextScale === this.currentScale) {
      return
    }

    this.currentScale = nextScale
    this.dispatchEvent(
      new CustomEvent<ScaleEventData>("scale", {
        detail: { blockSize, inlineSize, scale: nextScale },
        bubbles: true,
        composed: true,
      }),
    )
  }

  render() {
    const backdropStyles = {
      "--sf-background": this.resolvedBackgroundColor,
      "--sf-backdrop-blur": this.backdropBlur,
      "--sf-backdrop-overlay": this.backdropOverlay,
      "--sf-backdrop-scale": this.backdropScale,
    }

    return html`
      ${this.backdropSrc
        ? html`
            <div
              class="backdrop"
              aria-hidden="true"
              style=${styleMap(backdropStyles)}
            >
              <img
                src=${this.backdropSrc}
                crossorigin=${this.crossOrigin ?? undefined}
              />
            </div>
          `
        : null}
      <div class="viewport"><slot></slot></div>
    `
  }
}
