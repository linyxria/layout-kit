import { css, html, LitElement } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

export interface MasonryLayoutEventData {
  columns: number
  height: number
}

@customElement('masonry-layout')
export class MasonryLayout extends LitElement {
  static styles = css`
    :host {
      position: relative;
      display: block;
      width: 100%;
      min-height: 1px;
      box-sizing: border-box;
    }

    ::slotted(*) {
      box-sizing: border-box;
      will-change: transform;
    }
  `

  @property({ type: Number, attribute: 'column-width' })
  columnWidth = 240

  @property({ type: Number })
  gap = 16

  @query('slot')
  private slotElement!: HTMLSlotElement

  private frameId = 0
  private previousColumns = 0
  private previousHeight = 0
  private resizeObserver = new ResizeObserver(() => this.scheduleLayout())
  private mutationObserver = new MutationObserver(() => this.scheduleLayout())

  connectedCallback() {
    super.connectedCallback()
    this.resizeObserver.observe(this)
    this.mutationObserver.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    cancelAnimationFrame(this.frameId)
    this.resizeObserver.disconnect()
    this.mutationObserver.disconnect()
  }

  protected firstUpdated() {
    this.scheduleLayout()
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('columnWidth') || changedProperties.has('gap')) {
      this.scheduleLayout()
    }
  }

  private handleSlotChange() {
    for (const element of this.getItems()) {
      this.resizeObserver.observe(element)
    }

    this.scheduleLayout()
  }

  private scheduleLayout() {
    cancelAnimationFrame(this.frameId)
    this.frameId = requestAnimationFrame(() => this.layoutItems())
  }

  private layoutItems() {
    const inlineSize = this.clientWidth
    const items = this.getItems()

    if (!inlineSize || items.length === 0) {
      this.style.height = ''
      return
    }

    const safeGap = Math.max(0, this.gap)
    const safeColumnWidth = Math.max(1, this.columnWidth)
    const columns = Math.max(
      1,
      Math.floor((inlineSize + safeGap) / (safeColumnWidth + safeGap)),
    )
    const itemWidth = (inlineSize - safeGap * (columns - 1)) / columns
    const heights = Array.from({ length: columns }, () => 0)

    for (const item of items) {
      item.style.position = 'absolute'
      item.style.width = `${itemWidth}px`
      item.style.left = '0'
      item.style.top = '0'

      const columnIndex = this.getShortestColumnIndex(heights)
      const x = columnIndex * (itemWidth + safeGap)
      const y = heights[columnIndex]

      item.style.transform = `translate(${x}px, ${y}px)`
      heights[columnIndex] += item.offsetHeight + safeGap
    }

    const height = Math.max(...heights) - safeGap
    const nextHeight = Math.max(0, height)
    this.style.height = `${nextHeight}px`

    if (
      columns !== this.previousColumns ||
      nextHeight !== this.previousHeight
    ) {
      this.previousColumns = columns
      this.previousHeight = nextHeight
      this.dispatchEvent(
        new CustomEvent<MasonryLayoutEventData>('layout', {
          detail: { columns, height: nextHeight },
          bubbles: true,
          composed: true,
        }),
      )
    }
  }

  private getShortestColumnIndex(heights: number[]) {
    return heights.reduce(
      (shortestIndex, height, index) =>
        height < heights[shortestIndex] ? index : shortestIndex,
      0,
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
    return html`<slot @slotchange=${this.handleSlotChange}></slot>`
  }
}
