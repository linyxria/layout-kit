import { css, html, LitElement } from "lit"
import { customElement, property } from "lit/decorators.js"

@customElement("cluster-layout")
export class ClusterLayout extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-wrap: wrap;
      align-items: var(--cl-align, center);
      justify-content: var(--cl-justify, flex-start);
      gap: var(--cl-gap, 12px);
      width: 100%;
      box-sizing: border-box;
    }

    ::slotted(*) {
      min-width: 0;
      box-sizing: border-box;
    }

    slot {
      display: contents;
    }
  `

  @property({ type: Number })
  gap = 12

  @property()
  align = "center"

  @property()
  justify = "flex-start"

  connectedCallback() {
    super.connectedCallback()
    this.updateClusterProperties()
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has("align") ||
      changedProperties.has("gap") ||
      changedProperties.has("justify")
    ) {
      this.updateClusterProperties()
    }
  }

  private updateClusterProperties() {
    this.style.setProperty("--cl-align", this.align || "center")
    this.style.setProperty("--cl-gap", `${Math.max(0, this.gap)}px`)
    this.style.setProperty("--cl-justify", this.justify || "flex-start")
  }

  render() {
    return html`<slot></slot>`
  }
}
