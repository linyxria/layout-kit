import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export interface ScaleEventData {
  blockSize: number
  inlineSize: number
  scale: number
}

@customElement('screen-fit')
export class ScreenFit extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      overflow: hidden;
      contain: layout paint;
      box-sizing: border-box;
    }

    .viewport {
      width: var(--sf-width);
      height: var(--sf-height);
      transform: translate(
          var(--sf-translate-x, 0px),
          var(--sf-translate-y, 0px)
        )
        scale(var(--sf-scale, 1));
      transform-origin: top left;
      transition: transform 0.3s;
    }

    ::slotted(*) {
      box-sizing: border-box;
    }
  `

  @property({ type: Number, attribute: 'draft-width' })
  draftWidth = 0

  @property({ type: Number, attribute: 'draft-height' })
  draftHeight = 0

  @property()
  fit: 'contain' | 'cover' = 'contain'

  private currentScale = Number.NaN
  private hasWarnedInvalidSize = false
  private frameId = 0
  private resizeObserver = new ResizeObserver(() => this.scheduleTransform())

  connectedCallback() {
    super.connectedCallback()
    this.resizeObserver.observe(this)
    this.updateSizeProperties()
    this.scheduleTransform()
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('draftWidth') ||
      changedProperties.has('draftHeight') ||
      changedProperties.has('fit')
    ) {
      this.updateSizeProperties()
      this.scheduleTransform()
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    cancelAnimationFrame(this.frameId)
    this.resizeObserver.disconnect()
  }

  private updateSizeProperties() {
    this.style.setProperty('--sf-width', `${this.draftWidth}px`)
    this.style.setProperty('--sf-height', `${this.draftHeight}px`)
  }

  private scheduleTransform() {
    cancelAnimationFrame(this.frameId)
    this.frameId = requestAnimationFrame(() => this.updateTransform())
  }

  private updateTransform() {
    const inlineSize = this.clientWidth
    const blockSize = this.clientHeight

    if (!this.draftWidth || !this.draftHeight || !inlineSize || !blockSize) {
      if (!this.hasWarnedInvalidSize) {
        console.warn(
          'screen-fit must have draft-width, draft-height, and a visible container size',
        )
        this.hasWarnedInvalidSize = true
      }

      return
    }

    const scaleX = inlineSize / this.draftWidth
    const scaleY = blockSize / this.draftHeight
    const nextScale =
      this.fit === 'cover' ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY)

    const translateX = (inlineSize - this.draftWidth * nextScale) / 2
    const translateY = (blockSize - this.draftHeight * nextScale) / 2

    this.style.setProperty('--sf-scale', `${nextScale}`)
    this.style.setProperty('--sf-translate-x', `${translateX}px`)
    this.style.setProperty('--sf-translate-y', `${translateY}px`)

    if (nextScale === this.currentScale) {
      return
    }

    this.currentScale = nextScale
    this.dispatchEvent(
      new CustomEvent<ScaleEventData>('scale', {
        detail: { blockSize, inlineSize, scale: nextScale },
        bubbles: true,
        composed: true,
      }),
    )
  }

  render() {
    return html`<div class="viewport"><slot></slot></div>`
  }
}
