import { css, html, LitElement } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

export interface VirtualListRangeEventData {
  end: number
  start: number
}

@customElement('virtual-list')
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

    ::slotted(*) {
      position: absolute;
      left: 0;
      right: 0;
      box-sizing: border-box;
      height: var(--vl-item-height, 48px);
      overflow: hidden;
    }

    slot {
      display: contents;
    }
  `

  @property({ type: Number, attribute: 'item-height' })
  itemHeight = 48

  @property({ type: Number })
  height = 320

  @property({ type: Number })
  overscan = 4

  @query('slot')
  private slotElement!: HTMLSlotElement

  private range: VirtualListRangeEventData = { start: -1, end: -1 }
  private frameId = 0
  private resizeObserver = new ResizeObserver(() => this.scheduleLayout())

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('scroll', this.handleScroll)
    this.resizeObserver.observe(this)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    cancelAnimationFrame(this.frameId)
    this.removeEventListener('scroll', this.handleScroll)
    this.resizeObserver.disconnect()
  }

  protected firstUpdated() {
    this.updateListProperties()
    this.scheduleLayout()
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('height') ||
      changedProperties.has('itemHeight') ||
      changedProperties.has('overscan')
    ) {
      this.updateListProperties()
      this.scheduleLayout()
    }
  }

  private handleScroll = () => this.scheduleLayout()

  private handleSlotChange() {
    this.scheduleLayout()
  }

  private updateListProperties() {
    this.style.setProperty('--vl-height', `${Math.max(1, this.height)}px`)
    this.style.setProperty(
      '--vl-item-height',
      `${Math.max(1, this.itemHeight)}px`,
    )
  }

  private scheduleLayout() {
    cancelAnimationFrame(this.frameId)
    this.frameId = requestAnimationFrame(() => this.layoutItems())
  }

  private layoutItems() {
    const items = this.getItems()
    const safeItemHeight = Math.max(1, this.itemHeight)
    const safeOverscan = Math.max(0, this.overscan)

    if (items.length === 0) {
      this.style.setProperty('--vl-total-height', '0px')
      this.updateRange({ start: -1, end: -1 })
      return
    }

    const visibleCount = Math.ceil(this.clientHeight / safeItemHeight)
    const start = Math.max(
      0,
      Math.floor(this.scrollTop / safeItemHeight) - safeOverscan,
    )
    const end = Math.min(
      items.length - 1,
      start + visibleCount + safeOverscan * 2,
    )

    this.style.setProperty(
      '--vl-total-height',
      `${items.length * safeItemHeight}px`,
    )

    for (const [index, item] of items.entries()) {
      const isVisible = index >= start && index <= end
      item.hidden = !isVisible

      if (isVisible) {
        item.style.transform = `translateY(${index * safeItemHeight}px)`
      }
    }

    this.updateRange({ start, end })
  }

  private updateRange(range: VirtualListRangeEventData) {
    if (range.start === this.range.start && range.end === this.range.end) {
      return
    }

    this.range = range
    this.dispatchEvent(
      new CustomEvent<VirtualListRangeEventData>('range', {
        detail: this.range,
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
      <div class="spacer" style="height: var(--vl-total-height, 0px)">
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `
  }
}
