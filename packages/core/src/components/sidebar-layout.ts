import { css, html, LitElement } from "lit"
import { customElement, property } from "lit/decorators.js"

export interface SidebarLayoutEventData {
  collapsed: boolean
  inlineSize: number
}

@customElement("sidebar-layout")
export class SidebarLayout extends LitElement {
  static styles = css`
    :host {
      display: grid;
      grid-template-columns: var(
        --sl-columns,
        var(--sl-sidebar-width, 280px) minmax(0, 1fr)
      );
      gap: var(--sl-gap, 24px);
      width: 100%;
      box-sizing: border-box;
    }

    :host([side="right"]) {
      grid-template-columns: var(
        --sl-columns,
        minmax(0, 1fr) var(--sl-sidebar-width, 280px)
      );
    }

    :host([data-collapsed]) {
      grid-template-columns: minmax(0, 1fr);
    }

    :host([side="right"]:not([data-collapsed])) .sidebar {
      order: 2;
    }

    :host([side="right"]:not([data-collapsed])) .content {
      order: 1;
    }

    .sidebar,
    .content {
      min-width: 0;
      box-sizing: border-box;
    }
  `

  @property({ reflect: true })
  side: "left" | "right" = "left"

  @property({ attribute: "sidebar-width" })
  sidebarWidth = "280px"

  @property({ type: Number })
  gap = 24

  @property({ type: Number, attribute: "collapse-at" })
  collapseAt = 720

  private collapsed: boolean | null = null
  private resizeObserver = new ResizeObserver(() => this.updateLayout())

  connectedCallback() {
    super.connectedCallback()
    this.updateLayoutProperties()
    this.resizeObserver.observe(this)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.resizeObserver.disconnect()
  }

  protected firstUpdated() {
    this.updateLayout()
  }

  protected updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has("collapseAt") ||
      changedProperties.has("gap") ||
      changedProperties.has("sidebarWidth") ||
      changedProperties.has("side")
    ) {
      this.updateLayoutProperties()
      this.updateLayout()
    }
  }

  private updateLayoutProperties() {
    this.style.setProperty("--sl-gap", `${Math.max(0, this.gap)}px`)
    this.style.setProperty("--sl-sidebar-width", this.sidebarWidth || "280px")
  }

  private updateLayout() {
    const inlineSize = this.clientWidth

    if (!inlineSize) {
      return
    }

    const nextCollapsed = inlineSize < Math.max(1, this.collapseAt)
    this.toggleAttribute("data-collapsed", nextCollapsed)

    if (nextCollapsed === this.collapsed) {
      return
    }

    this.collapsed = nextCollapsed
    this.dispatchEvent(
      new CustomEvent<SidebarLayoutEventData>("sidebar", {
        detail: { collapsed: nextCollapsed, inlineSize },
        bubbles: true,
        composed: true,
      }),
    )
  }

  render() {
    return html`
      <div class="sidebar">
        <slot name="sidebar"></slot>
      </div>
      <div class="content">
        <slot name="content"></slot>
      </div>
    `
  }
}
