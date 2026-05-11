import { css, html, LitElement } from "lit"
import { customElement, property } from "lit/decorators.js"

@customElement("aspect-box")
export class AspectBox extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      aspect-ratio: var(--ab-ratio, 16 / 9);
      overflow: hidden;
      box-sizing: border-box;
    }

    ::slotted(*) {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      object-fit: var(--ab-fit, cover);
      object-position: var(--ab-position, center);
      box-sizing: border-box;
    }

    slot {
      display: contents;
    }
  `

  @property()
  ratio = "16 / 9"

  @property()
  fit: "contain" | "cover" | "fill" | "none" | "scale-down" = "cover"

  @property()
  position = "center"

  protected firstUpdated() {
    this.updateBoxProperties()
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has("fit") ||
      changedProperties.has("position") ||
      changedProperties.has("ratio")
    ) {
      this.updateBoxProperties()
    }
  }

  private updateBoxProperties() {
    this.style.setProperty("--ab-fit", this.fit || "cover")
    this.style.setProperty("--ab-position", this.position || "center")
    this.style.setProperty("--ab-ratio", this.normalizeRatio(this.ratio))
  }

  private normalizeRatio(ratio: string) {
    const trimmedRatio = ratio.trim()

    if (!trimmedRatio) {
      return "16 / 9"
    }

    return trimmedRatio.includes(":")
      ? trimmedRatio.replace(":", " / ")
      : trimmedRatio
  }

  render() {
    return html`<slot></slot>`
  }
}
