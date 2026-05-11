import { css, html, LitElement } from "lit"
import { customElement, property } from "lit/decorators.js"

export interface AdaptiveStackEventData {
  inlineSize: number
  mode: "column" | "row"
}

@customElement("adaptive-stack")
export class AdaptiveStack extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: var(--as-direction, row);
      align-items: var(--as-align, stretch);
      justify-content: var(--as-justify, flex-start);
      gap: var(--as-gap, 16px);
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
  breakpoint = 640

  @property({ type: Number })
  gap = 16

  @property()
  align = "stretch"

  @property()
  justify = "flex-start"

  @property({
    converter: {
      fromAttribute: (value) => value !== "false",
      toAttribute: (value: boolean) => (value ? "" : "false"),
    },
  })
  reverse = false

  private mode: "column" | "row" | null = null
  private resizeObserver = new ResizeObserver(() => this.updateMode())

  connectedCallback() {
    super.connectedCallback()
    this.resizeObserver.observe(this)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.resizeObserver.disconnect()
  }

  protected firstUpdated() {
    this.updateStackProperties()
    this.updateMode()
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has("align") ||
      changedProperties.has("breakpoint") ||
      changedProperties.has("gap") ||
      changedProperties.has("justify") ||
      changedProperties.has("reverse")
    ) {
      this.updateStackProperties()
      this.updateMode()
    }
  }

  private updateStackProperties() {
    this.style.setProperty("--as-align", this.align || "stretch")
    this.style.setProperty("--as-gap", `${Math.max(0, this.gap)}px`)
    this.style.setProperty("--as-justify", this.justify || "flex-start")
  }

  private updateMode() {
    const inlineSize = this.clientWidth

    if (!inlineSize) {
      return
    }

    const nextMode =
      inlineSize < Math.max(1, this.breakpoint) ? "column" : "row"
    const direction = this.reverse ? `${nextMode}-reverse` : nextMode
    this.style.setProperty("--as-direction", direction)

    if (nextMode === this.mode) {
      return
    }

    this.mode = nextMode
    this.dispatchEvent(
      new CustomEvent<AdaptiveStackEventData>("stack", {
        detail: { inlineSize, mode: nextMode },
        bubbles: true,
        composed: true,
      }),
    )
  }

  render() {
    return html`<slot></slot>`
  }
}
