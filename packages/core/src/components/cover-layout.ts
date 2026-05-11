import { css, html, LitElement } from "lit"
import { customElement, property } from "lit/decorators.js"

@customElement("cover-layout")
export class CoverLayout extends LitElement {
  static styles = css`
    :host {
      display: grid;
      min-height: var(--cv-min-height, 100vh);
      gap: var(--cv-gap, 24px);
      grid-template-rows: auto minmax(0, 1fr) auto;
      width: 100%;
      box-sizing: border-box;
    }

    .main {
      display: grid;
      align-content: var(--cv-align, start);
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
    }

    ::slotted(*) {
      min-width: 0;
      box-sizing: border-box;
    }
  `

  @property({ attribute: "min-height" })
  minHeight = "100vh"

  @property({ type: Number })
  gap = 24

  @property({
    converter: {
      fromAttribute: (value) => value !== "false",
      toAttribute: (value: boolean) => (value ? "" : "false"),
    },
  })
  center = false

  connectedCallback() {
    super.connectedCallback()
    this.updateCoverProperties()
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has("center") ||
      changedProperties.has("gap") ||
      changedProperties.has("minHeight")
    ) {
      this.updateCoverProperties()
    }
  }

  private updateCoverProperties() {
    this.style.setProperty("--cv-align", this.center ? "center" : "start")
    this.style.setProperty("--cv-gap", `${Math.max(0, this.gap)}px`)
    this.style.setProperty("--cv-min-height", this.minHeight || "100vh")
  }

  render() {
    return html`
      <slot name="header"></slot>
      <div class="main">
        <slot></slot>
      </div>
      <slot name="footer"></slot>
    `
  }
}
