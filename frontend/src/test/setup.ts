import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import type { ReactNode } from 'react'

vi.mock('framer-motion', async () => {
  const React = await import('react')
  const motionProps = new Set([
    'animate',
    'exit',
    'initial',
    'layout',
    'transition',
    'whileHover',
    'whileTap',
    'variants',
  ])

  interface MotionElementProps {
    children?: ReactNode
    [key: string]: unknown
  }

  function stripMotionProps(props: MotionElementProps): Record<string, unknown> {
    return Object.fromEntries(Object.entries(props).filter(([key]) => !motionProps.has(key)))
  }

  function motionValue(initial: number) {
    return {
      current: initial,
      get() {
        return this.current
      },
      set(next: number) {
        this.current = next
      },
      on() {
        return () => undefined
      },
    }
  }

  const motion = new Proxy(
    {},
    {
      get: (_, element: string) =>
        React.forwardRef<HTMLElement, MotionElementProps>((props, ref) => {
          const strippedProps = stripMotionProps(props)
          const children = strippedProps.children as ReactNode
          delete strippedProps.children
          const domProps = strippedProps
          return React.createElement(element, { ...domProps, ref }, children)
        }),
    },
  )

  return {
    AnimatePresence: ({ children }: { children: ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    motion,
    useScroll: () => ({ scrollY: motionValue(0) }),
    useSpring: (initial: number) => motionValue(initial),
    useTransform: (
      source: ReturnType<typeof motionValue>,
      transformerOrInput: ((latest: number) => unknown) | number[],
      output?: unknown[],
    ) => {
      if (typeof transformerOrInput === 'function') {
        return transformerOrInput(source.get())
      }
      return output?.[0] ?? source.get()
    },
  }
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.clearAllMocks()
  vi.useRealTimers()
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

class ResizeObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

globalThis.ResizeObserver = ResizeObserverMock
