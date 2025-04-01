import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// グローバルなコンポーネントのスタブ
config.global.stubs = {
  'client-only': true
}

// windowのリサイズイベントのモック
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024
})

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768
})

// ResizeObserverのモック
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))