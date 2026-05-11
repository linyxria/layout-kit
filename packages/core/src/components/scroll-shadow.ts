import { css, html, LitElement } from "lit"
import { customElement, property, query } from "lit/decorators.js"

export interface ScrollShadowOverflowEventData {
  bottom: boolean
  left: boolean
  right: boolean
  top: boolean
}

@customElement("scroll-shadow")
export class ScrollShadow extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      overflow: hidden;
      box-sizing: border-box;
    }

    .scroller {
      width: 100%;
      height: 100%;
      overflow: auto;
      box-sizing: border-box;
    }

    .shadow {
      position: absolute;
      z-index: 1;
      pointer-events: none;
      opacity: 0;
      transition: opacity 120ms ease;
    }

    .shadow.visible {
      opacity: 1;
    }

    .top,
    .bottom {
      right: 0;
      left: 0;
      height: var(--ss-size, 24px);
    }

    .left,
    .right {
      top: 0;
      bottom: 0;
      width: var(--ss-size, 24px);
    }

    .top {
      top: 0;
      background: linear-gradient(
        to bottom,
        var(--ss-color, rgb(0 0 0 / 24%)),
        transparent
      );
    }

    .right {
      right: 0;
      background: linear-gradient(
        to left,
        var(--ss-color, rgb(0 0 0 / 24%)),
        transparent
      );
    }

    .bottom {
      bottom: 0;
      background: linear-gradient(
        to top,
        var(--ss-color, rgb(0 0 0 / 24%)),
        transparent
      );
    }

    .left {
      left: 0;
      background: linear-gradient(
        to right,
        var(--ss-color, rgb(0 0 0 / 24%)),
        transparent
      );
    }
  `

  @property()
  direction: "both" | "horizontal" | "vertical" = "vertical"

  @property({ attribute: "shadow-size" })
  shadowSize = "24px"

  @property({ attribute: "shadow-color" })
  shadowColor = "rgb(0 0 0 / 24%)"

  @query(".scroller")
  private scrollerElement!: HTMLDivElement

  private frameId = 0
  private overflowState: ScrollShadowOverflowEventData = {
    bottom: false,
    left: false,
    right: false,
    top: false,
  }
  private resizeObserver = new ResizeObserver(() => this.scheduleUpdate())
  private mutationObserver = new MutationObserver(() => this.scheduleUpdate())

  connectedCallback() {
    super.connectedCallback()
    this.updateShadowProperties()
    this.resizeObserver.observe(this)
    this.mutationObserver.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    })
    this.requestUpdate()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    cancelAnimationFrame(this.frameId)
    this.resizeObserver.disconnect()
    this.mutationObserver.disconnect()
  }

  protected firstUpdated() {
    this.updateShadowProperties()
    this.resizeObserver.observe(this.scrollerElement)
    this.scheduleUpdate()
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has("direction") ||
      changedProperties.has("shadowColor") ||
      changedProperties.has("shadowSize")
    ) {
      this.updateShadowProperties()
      this.scheduleUpdate()
    }
  }

  private handleScroll = () => this.scheduleUpdate()

  private updateShadowProperties() {
    this.style.setProperty("--ss-color", this.shadowColor || "rgb(0 0 0 / 24%)")
    this.style.setProperty("--ss-size", this.shadowSize || "24px")
  }

  private scheduleUpdate() {
    cancelAnimationFrame(this.frameId)
    this.frameId = requestAnimationFrame(() => this.updateOverflow())
  }

  private updateOverflow() {
    const scroller = this.scrollerElement

    if (!scroller) {
      return
    }

    const canScrollX = this.direction !== "vertical"
    const canScrollY = this.direction !== "horizontal"
    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth
    const maxScrollTop = scroller.scrollHeight - scroller.clientHeight
    const nextOverflow = {
      bottom: canScrollY && scroller.scrollTop < maxScrollTop,
      left: canScrollX && scroller.scrollLeft > 0,
      right: canScrollX && scroller.scrollLeft < maxScrollLeft,
      top: canScrollY && scroller.scrollTop > 0,
    }

    if (this.isSameOverflow(nextOverflow)) {
      return
    }

    this.overflowState = nextOverflow
    this.requestUpdate()
    this.dispatchEvent(
      new CustomEvent<ScrollShadowOverflowEventData>("overflow", {
        detail: nextOverflow,
        bubbles: true,
        composed: true,
      }),
    )
  }

  private isSameOverflow(overflow: ScrollShadowOverflowEventData) {
    return (
      overflow.bottom === this.overflowState.bottom &&
      overflow.left === this.overflowState.left &&
      overflow.right === this.overflowState.right &&
      overflow.top === this.overflowState.top
    )
  }

  render() {
    return html`
      <div class="scroller" @scroll=${this.handleScroll}>
        <slot></slot>
      </div>
      <div class=${this.getShadowClass("top")}></div>
      <div class=${this.getShadowClass("right")}></div>
      <div class=${this.getShadowClass("bottom")}></div>
      <div class=${this.getShadowClass("left")}></div>
    `
  }

  private getShadowClass(edge: keyof ScrollShadowOverflowEventData) {
    return `shadow ${edge} ${this.overflowState[edge] ? "visible" : ""}`
  }
}
