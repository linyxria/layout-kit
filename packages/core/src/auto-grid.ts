import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export interface AutoGridEventData {
  columns: number
}

@customElement('auto-grid')
export class AutoGrid extends LitElement {
  static styles = css`
    :host {
      display: grid;
      grid-template-columns: repeat(
        auto-fit,
        minmax(min(100%, var(--ag-column-width, 240px)), 1fr)
      );
      gap: var(--ag-gap, 16px);
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

  @property({ type: Number, attribute: 'column-width' })
  columnWidth = 240

  @property({ type: Number })
  gap = 16

  private columns = 0
  private resizeObserver = new ResizeObserver(() => this.updateColumns())

  connectedCallback() {
    super.connectedCallback()
    this.resizeObserver.observe(this)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.resizeObserver.disconnect()
  }

  protected firstUpdated() {
    this.updateGridProperties()
    this.updateColumns()
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('columnWidth') || changedProperties.has('gap')) {
      this.updateGridProperties()
      this.updateColumns()
    }
  }

  private updateGridProperties() {
    this.style.setProperty(
      '--ag-column-width',
      `${Math.max(1, this.columnWidth)}px`,
    )
    this.style.setProperty('--ag-gap', `${Math.max(0, this.gap)}px`)
  }

  private updateColumns() {
    const inlineSize = this.clientWidth

    if (!inlineSize) {
      return
    }

    const safeGap = Math.max(0, this.gap)
    const safeColumnWidth = Math.max(1, this.columnWidth)
    const columns = Math.max(
      1,
      Math.floor((inlineSize + safeGap) / (safeColumnWidth + safeGap)),
    )

    if (columns === this.columns) {
      return
    }

    this.columns = columns
    this.dispatchEvent(
      new CustomEvent<AutoGridEventData>('grid', {
        detail: { columns },
        bubbles: true,
        composed: true,
      }),
    )
  }

  render() {
    return html`<slot></slot>`
  }
}
