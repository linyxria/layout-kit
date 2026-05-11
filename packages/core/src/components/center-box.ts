import { css, html, LitElement } from "lit"
import { customElement, property } from "lit/decorators.js"

@customElement("center-box")
export class CenterBox extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: min(100%, var(--cb-max-width, 720px));
      margin-inline: auto;
      padding-inline: var(--cb-padding, 0px);
      text-align: var(--cb-text-align, inherit);
      box-sizing: border-box;
    }

    ::slotted(*) {
      min-width: 0;
      box-sizing: border-box;
    }
  `

  @property({ attribute: "max-width" })
  maxWidth = "720px"

  @property()
  padding = "0px"

  @property({
    attribute: "center-text",
    converter: {
      fromAttribute: (value) => value !== "false",
      toAttribute: (value: boolean) => (value ? "" : "false"),
    },
  })
  centerText = false

  connectedCallback() {
    super.connectedCallback()
    this.updateBoxProperties()
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has("centerText") ||
      changedProperties.has("maxWidth") ||
      changedProperties.has("padding")
    ) {
      this.updateBoxProperties()
    }
  }

  private updateBoxProperties() {
    this.style.setProperty("--cb-max-width", this.maxWidth || "720px")
    this.style.setProperty("--cb-padding", this.padding || "0px")
    this.style.setProperty(
      "--cb-text-align",
      this.centerText ? "center" : "inherit",
    )
  }

  render() {
    return html`<slot></slot>`
  }
}
