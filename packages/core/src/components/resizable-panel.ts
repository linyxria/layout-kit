import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export interface ResizablePanelEventData {
  size: number
}

@customElement('resizable-panel')
export class ResizablePanel extends LitElement {
  static styles = css`
    :host {
      display: flex;
      width: 100%;
      height: 100%;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
      box-sizing: border-box;
    }

    :host([direction='vertical']) {
      flex-direction: column;
    }

    .pane {
      min-width: 0;
      min-height: 0;
      overflow: auto;
    }

    .primary {
      flex: 0 0 var(--rp-size, 50%);
    }

    .secondary {
      flex: 1 1 auto;
    }

    .handle {
      position: relative;
      flex: 0 0 10px;
      cursor: col-resize;
      background: transparent;
      touch-action: none;
    }

    :host([direction='vertical']) .handle {
      cursor: row-resize;
    }

    .handle::before {
      position: absolute;
      inset: 0;
      margin: auto;
      width: 2px;
      height: 32px;
      border-radius: 999px;
      background: var(--rp-handle-color, #c5c7ce);
      content: '';
    }

    :host([direction='vertical']) .handle::before {
      width: 32px;
      height: 2px;
    }
  `

  @property({ reflect: true })
  direction: 'horizontal' | 'vertical' = 'horizontal'

  @property({ type: Number })
  size = 50

  @property({ type: Number })
  min = 15

  @property({ type: Number })
  max = 85

  private dragStartPosition = 0
  private dragStartSize = 0

  protected firstUpdated() {
    this.updateSizeProperty()
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('size') ||
      changedProperties.has('min') ||
      changedProperties.has('max')
    ) {
      this.size = this.clampSize(this.size)
      this.updateSizeProperty()
    }
  }

  private startResize(event: PointerEvent) {
    event.preventDefault()
    this.dragStartPosition =
      this.direction === 'vertical' ? event.clientY : event.clientX
    this.dragStartSize = this.size
    this.setPointerCapture(event.pointerId)
    this.addEventListener('pointermove', this.resize)
    this.addEventListener('pointerup', this.stopResize)
    this.addEventListener('pointercancel', this.stopResize)
  }

  private resize = (event: PointerEvent) => {
    const rect = this.getBoundingClientRect()
    const totalSize = this.direction === 'vertical' ? rect.height : rect.width

    if (!totalSize) {
      return
    }

    const position =
      this.direction === 'vertical' ? event.clientY : event.clientX
    const delta = ((position - this.dragStartPosition) / totalSize) * 100
    this.size = this.clampSize(this.dragStartSize + delta)
    this.updateSizeProperty()
    this.dispatchEvent(
      new CustomEvent<ResizablePanelEventData>('resize', {
        detail: { size: this.size },
        bubbles: true,
        composed: true,
      }),
    )
  }

  private stopResize = (event: PointerEvent) => {
    if (this.hasPointerCapture(event.pointerId)) {
      this.releasePointerCapture(event.pointerId)
    }

    this.removeEventListener('pointermove', this.resize)
    this.removeEventListener('pointerup', this.stopResize)
    this.removeEventListener('pointercancel', this.stopResize)
  }

  private clampSize(size: number) {
    const min = Math.max(0, Math.min(this.min, this.max))
    const max = Math.min(100, Math.max(this.min, this.max))
    return Math.min(max, Math.max(min, size))
  }

  private updateSizeProperty() {
    this.style.setProperty('--rp-size', `${this.clampSize(this.size)}%`)
  }

  render() {
    return html`
      <div class="pane primary">
        <slot name="start"></slot>
      </div>
      <div
        class="handle"
        role="separator"
        aria-orientation=${this.direction}
        @pointerdown=${this.startResize}
      ></div>
      <div class="pane secondary">
        <slot name="end"></slot>
      </div>
    `
  }
}
