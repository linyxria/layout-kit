import { css, html, LitElement } from "lit"
import { customElement, property } from "lit/decorators.js"

@customElement("flow-stack")
export class FlowStack extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: var(--fs-align, stretch);
      justify-content: var(--fs-justify, flex-start);
      gap: var(--fs-gap, 16px);
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
  gap = 16

  @property()
  align = "stretch"

  @property()
  justify = "flex-start"

  connectedCallback() {
    super.connectedCallback()
    this.updateStackProperties()
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has("align") ||
      changedProperties.has("gap") ||
      changedProperties.has("justify")
    ) {
      this.updateStackProperties()
    }
  }

  private updateStackProperties() {
    this.style.setProperty("--fs-align", this.align || "stretch")
    this.style.setProperty("--fs-gap", `${Math.max(0, this.gap)}px`)
    this.style.setProperty("--fs-justify", this.justify || "flex-start")
  }

  render() {
    return html`<slot></slot>`
  }
}
