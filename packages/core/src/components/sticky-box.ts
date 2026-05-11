import { css, html, LitElement } from "lit"
import { customElement, property } from "lit/decorators.js"

@customElement("sticky-box")
export class StickyBox extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: sticky;
      inset-block-start: var(--sb-top, auto);
      inset-inline-end: var(--sb-right, auto);
      inset-block-end: var(--sb-bottom, auto);
      inset-inline-start: var(--sb-left, auto);
      z-index: var(--sb-z-index, 1);
      box-sizing: border-box;
    }

    ::slotted(*) {
      min-width: 0;
      box-sizing: border-box;
    }
  `

  @property()
  offset = "0px"

  @property()
  position: "bottom" | "left" | "right" | "top" = "top"

  @property({ type: Number, attribute: "z-index" })
  zIndex = 1

  protected firstUpdated() {
    this.updateStickyProperties()
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has("offset") ||
      changedProperties.has("position") ||
      changedProperties.has("zIndex")
    ) {
      this.updateStickyProperties()
    }
  }

  private updateStickyProperties() {
    for (const property of ["top", "right", "bottom", "left"]) {
      this.style.setProperty(`--sb-${property}`, "auto")
    }

    this.style.setProperty(`--sb-${this.position}`, this.offset || "0px")
    this.style.setProperty("--sb-z-index", `${this.zIndex}`)
  }

  render() {
    return html`<slot></slot>`
  }
}
