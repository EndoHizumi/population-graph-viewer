import { describe, it, expect} from 'vitest'
import { mount } from '@vue/test-utils'
import LegendButton from '../legendButton.vue'

// 型定義
interface Prefecture {
  icon: string
  color: string
  name: string
}

interface PrefecturesMap {
  [key: number]: Prefecture
}

interface ClickEvent {
  id: number
  isClicked: boolean
}

type ClickEmitted = Array<[ClickEvent]>

// モックデータ
const mockPrefecturesMap: PrefecturesMap = {
  13: {
    icon: '/mock/path/to/icon.png',
    color: '#BA55D3',
    name: '東京都'
  }
}

// prefecturesMapのグローバルプロバイド
const globalMocks = {
  provide: {
    prefecturesMap: mockPrefecturesMap
  },
  stubs: {
    'img': {
      name: 'StubImage',
      template: '<div class="stub-img" :class="$attrs.class"></div>'
    }
  }
}

const createWrapper = (props = {}) => {
  return mount(LegendButton, {
    props: {
      id: 13,
      name: '東京都',
      ...props
    },
    global: {
      ...globalMocks
    }
  })
}

describe('LegendButton', () => {
  // 基本機能テスト
  describe('基本機能', () => {
    it('正常にマウントされること', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('必要な要素が存在すること', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('div').exists()).toBe(true)
      expect(wrapper.find('img').exists()).toBe(true)
      expect(wrapper.find('span').exists()).toBe(true)
    })

    it('都道府県名が正しく表示されること', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('span').text()).toBe('東京都')
    })
  })

  // イベントテスト
  describe('イベント', () => {
    it('クリック時にclickイベントが発火すること', async () => {
      const wrapper = createWrapper()
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('クリックイベントのペイロードが正しいこと', async () => {
      const wrapper = createWrapper()
      await wrapper.trigger('click')
      const emitted = wrapper.emitted('click') as ClickEmitted
      expect(emitted).toBeTruthy()
      expect(emitted[0][0]).toEqual({ id: 13, isClicked: true })
    })

    it('複数回クリックで状態が正しく切り替わること', async () => {
      const wrapper = createWrapper()
      await wrapper.trigger('click')
      const firstClick = (wrapper.emitted('click')![0][0] as ClickEvent)
      expect(firstClick.isClicked).toBe(true)
      
      await wrapper.trigger('click')
      const secondClick = (wrapper.emitted('click')![1][0] as ClickEvent)
      expect(secondClick.isClicked).toBe(false)
    })
  })

  // 状態管理テスト
  describe('状態管理', () => {
    it('初期状態で非選択状態であること', () => {
      const wrapper = createWrapper()
      const style = wrapper.attributes('style')
      expect(style).toContain('background-color: rgb(229, 231, 235)')
    })

    it('クリックで選択状態に変更されること', async () => {
      const wrapper = createWrapper()
      await wrapper.trigger('click')
      const style = wrapper.attributes('style')
      expect(style).toContain('background-color: #BA55D3')
      const emitted = wrapper.emitted('click')![0][0] as ClickEvent
      expect(emitted.isClicked).toBe(true)
    })

    it('背景色が正しく切り替わること', async () => {
      const wrapper = createWrapper()
      expect(wrapper.attributes('style')).toContain('background-color: rgb(229, 231, 235)')
      await wrapper.trigger('click')
      expect(wrapper.attributes('style')).toContain('background-color: #BA55D3')
      
      await wrapper.trigger('click')
      expect(wrapper.attributes('style')).toContain('background-color: rgb(229, 231, 235)')
    })
  })

  // スタイルテスト
  describe('スタイル', () => {
    it('コンポーネントのサイズが正しいこと', () => {
      const wrapper = createWrapper()
      expect(wrapper.classes()).toContain('w-[67px]')
      expect(wrapper.classes()).toContain('h-[67px]')
    })

    it('画像のサイズが正しいこと', () => {
      const wrapper = createWrapper()
      const img = wrapper.find('img')
      expect(img.classes()).toContain('w-[45px]')
      expect(img.classes()).toContain('h-[40px]')
    })

    it('インタラクションスタイルが適用されていること', () => {
      const wrapper = createWrapper()
      expect(wrapper.classes()).toContain('cursor-pointer')
      expect(wrapper.classes()).toContain('hover:opacity-70')
      expect(wrapper.classes()).toContain('select-none')
    })
  })

  // アクセシビリティテスト
  describe('アクセシビリティ', () => {
    it('画像にalt属性が設定されていること', () => {
      const wrapper = createWrapper()
      const img = wrapper.find('img')
      expect(img.attributes('alt')).toBe('東京都')
    })

    it('キーボード操作（Enter）でクリックイベントが発火すること', async () => {
      const wrapper = createWrapper()
      await wrapper.trigger('keydown.enter')
      const emitted = wrapper.emitted('click') as ClickEmitted
      expect(emitted).toBeTruthy()
      expect(emitted[0][0].isClicked).toBe(true)
    })

    it('キーボード操作（Space）でクリックイベントが発火すること', async () => {
      const wrapper = createWrapper()
      await wrapper.trigger('keydown.space')
      const emitted = wrapper.emitted('click') as ClickEmitted
      expect(emitted).toBeTruthy()
      expect(emitted[0][0].isClicked).toBe(true)
    })
  })

})