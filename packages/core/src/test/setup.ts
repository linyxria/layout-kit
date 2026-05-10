import { vi } from "vitest"

type ResizeCallback = ResizeObserverCallback

class TestResizeObserver implements ResizeObserver {
  static callbacks = new Set<ResizeCallback>()

  constructor(private callback: ResizeCallback) {
    TestResizeObserver.callbacks.add(callback)
  }

  disconnect() {
    TestResizeObserver.callbacks.delete(this.callback)
  }

  observe() {}

  unobserve() {}

  static flush() {
    for (const callback of TestResizeObserver.callbacks) {
      callback([], {} as ResizeObserver)
    }
  }
}

class TestMutationObserver implements MutationObserver {
  disconnect() {}

  observe() {}

  takeRecords() {
    return []
  }
}

export function setupDom() {
  vi.stubGlobal("ResizeObserver", TestResizeObserver)
  vi.stubGlobal("MutationObserver", TestMutationObserver)
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callback(0)
    return 0
  })
  vi.stubGlobal("cancelAnimationFrame", () => {})
}

export function setClientSize(
  element: Element,
  inlineSize: number,
  blockSize: number,
) {
  Object.defineProperty(element, "clientWidth", {
    configurable: true,
    value: inlineSize,
  })
  Object.defineProperty(element, "clientHeight", {
    configurable: true,
    value: blockSize,
  })
}

export function setRect(
  element: Element,
  inlineSize: number,
  blockSize: number,
) {
  element.getBoundingClientRect = () =>
    ({
      bottom: blockSize,
      height: blockSize,
      left: 0,
      right: inlineSize,
      top: 0,
      width: inlineSize,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect
}

export function flushResizeObserver() {
  TestResizeObserver.flush()
}

export async function nextFrame() {
  await Promise.resolve()
}
