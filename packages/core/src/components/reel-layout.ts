import { css, html, LitElement } from "lit"
import { customElement, property, query } from "lit/decorators.js"

export interface ReelLayoutEventData {
  overflow: boolean
  scrollLeft: number
}

@customElement("reel-layout")
export class ReelLayout extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      scroll-snap-type: var(--rl-snap-type, none);
      box-sizing: border-box;
    }

    .track {
      display: flex;
      gap: var(--rl-gap, 16px);
      min-width: min-content;
    }

    ::slotted(*) {
      flex: 0 0 var(--rl-item-width, 260px);
      min-width: 0;
      scroll-snap-align: var(--rl-snap-align, none);
      box-sizing: border-box;
    }
  `

  @property({ type: Number })
  gap = 16

  @property({ attribute: "item-width" })
  itemWidth = "260px"

  @property({
    converter: {
      fromAttribute: (value) => value !== "false",
      toAttribute: (value: boolean) => (value ? "" : "false"),
    },
  })
  snap = false

  @query("slot")
  private slotElement!: HTMLSlotElement

  private frameId = 0
  private previousOverflow = false
  private previousScrollLeft = -1
  private resizeObserver = new ResizeObserver(() => this.scheduleUpdate())

  connectedCallback() {
    super.connectedCallback()
    this.updateReelProperties()
    this.addEventListener("scroll", this.handleScroll)
    this.resizeObserver.observe(this)
    this.requestUpdate()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    cancelAnimationFrame(this.frameId)
    this.removeEventListener("scroll", this.handleScroll)
    this.resizeObserver.disconnect()
  }

  protected firstUpdated() {
    this.updateReelProperties()
    this.scheduleUpdate()
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has("gap") ||
      changedProperties.has("itemWidth") ||
      changedProperties.has("snap")
    ) {
      this.updateReelProperties()
      this.scheduleUpdate()
    }
  }

  private handleScroll = () => this.scheduleUpdate()

  private handleSlotChange() {
    for (const element of this.getItems()) {
      this.resizeObserver.observe(element)
    }

    this.scheduleUpdate()
  }

  private updateReelProperties() {
    this.style.setProperty("--rl-gap", `${Math.max(0, this.gap)}px`)
    this.style.setProperty("--rl-item-width", this.itemWidth || "260px")
    this.style.setProperty("--rl-snap-align", this.snap ? "start" : "none")
    this.style.setProperty("--rl-snap-type", this.snap ? "x mandatory" : "none")
  }

  private scheduleUpdate() {
    cancelAnimationFrame(this.frameId)
    this.frameId = requestAnimationFrame(() => this.updateReel())
  }

  private updateReel() {
    const overflow = this.scrollWidth > this.clientWidth
    const scrollLeft = Math.round(this.scrollLeft)

    if (
      overflow === this.previousOverflow &&
      scrollLeft === this.previousScrollLeft
    ) {
      return
    }

    this.previousOverflow = overflow
    this.previousScrollLeft = scrollLeft
    this.dispatchEvent(
      new CustomEvent<ReelLayoutEventData>("reel", {
        detail: { overflow, scrollLeft },
        bubbles: true,
        composed: true,
      }),
    )
  }

  private getItems() {
    return this.slotElement
      ? this.slotElement
          .assignedElements({ flatten: true })
          .filter(
            (element): element is HTMLElement => element instanceof HTMLElement,
          )
      : []
  }

  render() {
    return html`
      <div class="track">
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `
  }
}
