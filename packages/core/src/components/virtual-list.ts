import { css, html, LitElement } from "lit"
import { customElement, property } from "lit/decorators.js"

export interface VirtualListRangeEventData {
  end: number
  start: number
}

@customElement("virtual-list")
export class VirtualList extends LitElement {
  static styles = css`
    :host {
      position: relative;
      display: block;
      height: var(--vl-height, 320px);
      overflow: auto;
      contain: layout;
      box-sizing: border-box;
    }

    .spacer {
      position: relative;
      min-height: 100%;
    }

    .item,
    ::slotted(*) {
      position: absolute;
      left: 0;
      right: 0;
      box-sizing: border-box;
      height: var(--vl-item-height, 48px);
      overflow: hidden;
    }
  `

  @property({ type: Number, attribute: "item-height" })
  itemHeight = 48

  @property({ type: Number })
  height = 320

  @property({ type: Number })
  overscan = 4

  @property({ type: Number, attribute: "item-count" })
  itemCount = 0

  private range: VirtualListRangeEventData = { start: -1, end: -1 }
  private frameId = 0
  private resizeObserver = new ResizeObserver(() => this.scheduleLayout())

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener("scroll", this.handleScroll)
    this.resizeObserver.observe(this)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    cancelAnimationFrame(this.frameId)
    this.removeEventListener("scroll", this.handleScroll)
    this.resizeObserver.disconnect()
  }

  protected firstUpdated() {
    this.updateListProperties()
    this.scheduleLayout()
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has("height") ||
      changedProperties.has("itemCount") ||
      changedProperties.has("itemHeight") ||
      changedProperties.has("overscan")
    ) {
      this.updateListProperties()
      this.scheduleLayout()
    }
  }

  private handleScroll = () => this.scheduleLayout()

  private updateListProperties() {
    this.style.setProperty("--vl-height", `${Math.max(1, this.height)}px`)
    this.style.setProperty(
      "--vl-item-height",
      `${Math.max(1, this.itemHeight)}px`,
    )
  }

  private scheduleLayout() {
    cancelAnimationFrame(this.frameId)
    this.frameId = requestAnimationFrame(() => this.layoutItems())
  }

  private layoutItems() {
    const totalItems = this.getItemCount()
    const safeItemHeight = Math.max(1, this.itemHeight)
    const safeOverscan = Math.max(0, this.overscan)

    if (totalItems === 0) {
      this.style.setProperty("--vl-total-height", "0px")
      this.updateRange({ start: -1, end: -1 })
      return
    }

    const firstVisible = Math.floor(this.scrollTop / safeItemHeight)
    const lastVisible = Math.ceil(
      (this.scrollTop + this.clientHeight) / safeItemHeight,
    )
    const start = Math.max(0, firstVisible - safeOverscan)
    const end = Math.min(
      totalItems - 1,
      Math.max(start, lastVisible + safeOverscan - 1),
    )

    this.style.setProperty(
      "--vl-total-height",
      `${totalItems * safeItemHeight}px`,
    )

    this.updateRange({ start, end })
  }

  private getItemCount() {
    return Math.max(0, this.itemCount)
  }

  render() {
    return html`
      <div class="spacer" style="height: var(--vl-total-height, 0px)">
        <slot></slot>
      </div>
    `
  }

  private updateRange(range: VirtualListRangeEventData) {
    if (range.start === this.range.start && range.end === this.range.end) {
      return
    }

    this.range = range
    this.dispatchEvent(
      new CustomEvent<VirtualListRangeEventData>("range", {
        detail: this.range,
        bubbles: true,
        composed: true,
      }),
    )
  }
}
