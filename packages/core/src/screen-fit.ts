import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { debounce } from './util'

export interface ScaleEventData {
  scale: number
}

@customElement('screen-fit')
export class ScreenFit extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      inset: 0;
      display: block;
      width: var(--sf-width);
      height: var(--sf-height);
      transform: translate(var(--sf-translate-x), var(--sf-translate-y))
        scale(var(--sf-scale));
      transform-origin: top left;
      transition: transform 0.3s;
    }
  `

  @property({ type: Number, attribute: 'draft-width' })
  width = 0

  @property({ type: Number, attribute: 'draft-height' })
  height = 0

  private currentScale = 1

  connectedCallback() {
    super.connectedCallback()

    if (!this.width || !this.height) {
      console.warn('screen-fit must have a width and height')
      return
    }

    this.style.setProperty('--sf-width', `${this.width}px`)
    this.style.setProperty('--sf-height', `${this.height}px`)

    this.updateTransform()
    window.addEventListener('resize', this.updateTransform)
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null
  ) {
    super.attributeChangedCallback(name, _old, value)

    if (name === 'draft-width') {
      this.style.setProperty('--sf-width', `${value}px`)
      this.updateTransform()
    } else if (name === 'draft-height') {
      this.style.setProperty('--sf-height', `${value}px`)
      this.updateTransform()
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    window.removeEventListener('resize', this.updateTransform)
  }

  private updateTransform = debounce(() => {
    // 获取当前窗口的宽高
    const inlineSize = window.innerWidth
    const blockSize = window.innerHeight

    // 计算缩放比例
    const scaleX = inlineSize / this.width
    const scaleY = blockSize / this.height
    const nextScale = Math.min(scaleX, scaleY)

    // 如果缩放比例没有变化，则不更新
    if (nextScale === this.currentScale) {
      return
    }

    this.dispatchEvent(
      new CustomEvent<ScaleEventData>('scale', {
        detail: { scale: nextScale },
        bubbles: true,
        composed: true,
      })
    )

    // 计算偏移量
    const translateX = (inlineSize - this.width * nextScale) / 2
    const translateY = (blockSize - this.height * nextScale) / 2

    // 更新样式
    this.style.setProperty('--sf-scale', `${nextScale}`)
    this.style.setProperty('--sf-translate-x', `${translateX}px`)
    this.style.setProperty('--sf-translate-y', `${translateY}px`)

    // 更新缩放比例
    this.currentScale = nextScale
  }, 300)

  render() {
    return html`<slot></slot>`
  }
}
