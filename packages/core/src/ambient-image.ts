import { css, html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'

export interface AmbientImageEventData {
  blockSize: number
  color: string
  inlineSize: number
}

type FadeDirection = 'x' | 'y' | 'both' | 'none'
type AmbientImageVariant = 'blur' | 'fade'

@customElement('ambient-image')
export class AmbientImage extends LitElement {
  static styles = css`
    :host {
      --ai-background: #111827;
      --ai-blur: 36px;
      --ai-fade-size: 14%;
      --ai-image-radius: 8px;
      --ai-overlay: rgb(0 0 0 / 24%);
      --ai-padding: clamp(24px, 6vw, 72px);
      --ai-scale: 1.08;

      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      overflow: hidden;
      background: var(--ai-background);
      box-sizing: border-box;
      contain: layout paint;
    }

    .media {
      position: relative;
      z-index: 1;
      display: block;
      max-width: 100%;
      line-height: 0;
    }

    :host([variant='blur']) {
      padding: var(--ai-padding);
    }

    :host([variant='fade']) {
      padding: 0;
    }

    .backdrop {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
    }

    .backdrop img {
      width: 100%;
      height: 100%;
      max-width: none;
      object-fit: cover;
      filter: blur(var(--ai-blur));
      transform: scale(var(--ai-scale));
    }

    .backdrop::after {
      position: absolute;
      inset: 0;
      background: var(--ai-overlay);
      content: '';
    }

    img {
      display: block;
      max-width: 100%;
      width: auto;
      height: auto;
      border-radius: var(--ai-image-radius);
    }

    img.cover {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .fade {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .fade.x {
      background: linear-gradient(
        to right,
        var(--ai-background),
        rgb(0 0 0 / 0) var(--ai-fade-size),
        rgb(0 0 0 / 0) calc(100% - var(--ai-fade-size)),
        var(--ai-background)
      );
    }

    .fade.y {
      background: linear-gradient(
        to bottom,
        var(--ai-background),
        rgb(0 0 0 / 0) var(--ai-fade-size),
        rgb(0 0 0 / 0) calc(100% - var(--ai-fade-size)),
        var(--ai-background)
      );
    }

    .fade.both {
      background:
        linear-gradient(
          to right,
          var(--ai-background),
          rgb(0 0 0 / 0) var(--ai-fade-size),
          rgb(0 0 0 / 0) calc(100% - var(--ai-fade-size)),
          var(--ai-background)
        ),
        linear-gradient(
          to bottom,
          var(--ai-background),
          rgb(0 0 0 / 0) var(--ai-fade-size),
          rgb(0 0 0 / 0) calc(100% - var(--ai-fade-size)),
          var(--ai-background)
        );
    }
  `

  @property()
  src = ''

  @property()
  alt = ''

  @property()
  fit: 'contain' | 'cover' = 'contain'

  @property({ reflect: true })
  variant: AmbientImageVariant = 'blur'

  @property()
  fade: FadeDirection = 'x'

  @property({ attribute: 'fade-size' })
  fadeSize = '14%'

  @property()
  blur = '36px'

  @property({ attribute: 'image-radius' })
  imageRadius = '8px'

  @property({ attribute: 'overlay-color' })
  overlayColor = 'rgb(0 0 0 / 24%)'

  @property()
  padding = 'clamp(24px, 6vw, 72px)'

  @property({ attribute: 'backdrop-scale' })
  backdropScale = '1.08'

  @property({ attribute: 'background-color' })
  backgroundColor = '#111827'

  @property({
    attribute: 'auto-color',
    converter: {
      fromAttribute: (value) => value !== 'false',
      toAttribute: (value: boolean) => (value ? '' : 'false'),
    },
  })
  autoColor = true

  @property({ attribute: 'cross-origin' })
  crossOrigin: '' | 'anonymous' | 'use-credentials' | null = null

  @state()
  private resolvedColor = this.backgroundColor

  private requestId = 0

  protected updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('backgroundColor')) {
      this.resolvedColor = this.backgroundColor
    }

    this.updateStyleProperties()

    if (
      changedProperties.has('src') ||
      changedProperties.has('autoColor') ||
      changedProperties.has('crossOrigin')
    ) {
      this.resolveImageColor()
    }
  }

  private async resolveImageColor() {
    const currentRequest = ++this.requestId

    if (!this.src || !this.autoColor) {
      return
    }

    try {
      const image = await this.loadImage(this.src)

      if (currentRequest !== this.requestId) {
        return
      }

      const color = this.getAverageColor(image)
      this.resolvedColor = color
      this.updateStyleProperties()
      this.dispatchEvent(
        new CustomEvent<AmbientImageEventData>('ambient', {
          detail: {
            blockSize: image.naturalHeight,
            color,
            inlineSize: image.naturalWidth,
          },
          bubbles: true,
          composed: true,
        }),
      )
    } catch {
      this.resolvedColor = this.backgroundColor
      this.updateStyleProperties()
    }
  }

  private updateStyleProperties() {
    this.style.setProperty('--ai-background', this.resolvedColor)
    this.style.setProperty('--ai-blur', this.blur)
    this.style.setProperty('--ai-fade-size', this.fadeSize)
    this.style.setProperty('--ai-image-radius', this.imageRadius)
    this.style.setProperty('--ai-overlay', this.overlayColor)
    this.style.setProperty('--ai-padding', this.padding)
    this.style.setProperty('--ai-scale', this.backdropScale)
  }

  private loadImage(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()

      if (this.crossOrigin !== null) {
        image.crossOrigin = this.crossOrigin
      }

      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = src
    })
  }

  private getAverageColor(image: HTMLImageElement) {
    const sampleSize = 40
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d', { willReadFrequently: true })

    if (!context) {
      return this.backgroundColor
    }

    const scale = Math.min(
      1,
      sampleSize / Math.max(image.naturalWidth, image.naturalHeight),
    )
    const width = Math.max(1, Math.round(image.naturalWidth * scale))
    const height = Math.max(1, Math.round(image.naturalHeight * scale))

    canvas.width = width
    canvas.height = height
    context.drawImage(image, 0, 0, width, height)

    const { data } = context.getImageData(0, 0, width, height)
    let red = 0
    let green = 0
    let blue = 0
    let count = 0

    for (let index = 0; index < data.length; index += 4) {
      const alpha = data[index + 3] / 255

      if (alpha < 0.05) {
        continue
      }

      red += data[index] * alpha
      green += data[index + 1] * alpha
      blue += data[index + 2] * alpha
      count += alpha
    }

    if (!count) {
      return this.backgroundColor
    }

    return `rgb(${Math.round(red / count)} ${Math.round(green / count)} ${Math.round(
      blue / count,
    )})`
  }

  render() {
    const styles = {
      '--ai-background': this.resolvedColor,
      '--ai-fade-size': this.fadeSize,
    }
    const mediaStyles =
      this.fit === 'cover'
        ? {
            height: '100%',
            width: '100%',
          }
        : {}

    return html`
      ${this.variant === 'blur'
        ? html`
            <div class="backdrop" aria-hidden="true">
              <img src=${this.src} crossorigin=${this.crossOrigin ?? undefined} />
            </div>
          `
        : null}
      <div class="media" style=${styleMap(mediaStyles)}>
        <img
          class=${this.fit}
          src=${this.src}
          alt=${this.alt}
          crossorigin=${this.crossOrigin ?? undefined}
          style=${styleMap(styles)}
        />
        ${this.variant !== 'fade' || this.fade === 'none'
          ? null
          : html`<span class=${`fade ${this.fade}`} style=${styleMap(styles)}></span>`}
      </div>
    `
  }
}
