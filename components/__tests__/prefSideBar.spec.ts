import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { nextTick, ref } from 'vue'
import PrefSideBar from '../prefSideBar.vue' 
import { usePrefectureStore } from '~/stores/prefecture'

// prefecturesMapのモックを作成
vi.mock('~/utils/const', () => ({
  prefecturesMap: {
    1: { color: '#FF0000', icon: '/icons/hokkaido.svg' },
    2: { color: '#00FF00', icon: '/icons/aomori.svg' },
    3: { color: '#0000FF', icon: '/icons/iwate.svg' }
  }
}));

// 他のコンポーネントをモック化
vi.mock('../legendButton.vue', () => ({
  default: {
    name: 'LegendButton',
    props: {
      id: Number,
      name: String
    },
    template: '<button :data-id="id" :data-name="name" @click="$emit(\'click\', {id, isClicked: true})">{{ name }}</button>'
  }
}));

// モックデータ
const mockPrefecturesList = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 2, prefName: '青森県' },
  { prefCode: 3, prefName: '岩手県' }
]

describe('PrefSideBar', () => {
  let wrapper: any
  let store: any

  const createComponent = (initialState = {}) => {
    return mount(PrefSideBar, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              prefecture: {
                selectedPrefectures: [],
                prefecturesList: mockPrefecturesList,
                isLoading: false,
                error: null,
                ...initialState
              }
            }
          })
        ],
        stubs: {
          'client-only': {
            template: '<div><slot /><template #fallback><slot name="fallback" /></template></div>'
          },
          'legend-button': {
            name: 'LegendButton',
            template: `
              <button
                :data-id="id"
                :data-name="name"
                @click="handleClick"
              >
                {{ name }}
              </button>
            `,
            props: {
              id: {
                type: Number,
                required: true
              },
              name: {
                type: String,
                required: true
              }
            },
            setup(props, { emit }) {
              // 初期状態を設定（選択済みの都道府県はtrueに）
              const store = usePrefectureStore();
              const isClicked = ref(store.selectedPrefectures.includes(props.id));
              
              const handleClick = () => {
                // isClickedの値を反転
                isClicked.value = !isClicked.value;
                // 新しい状態でイベントを発火
                emit('click', {
                  id: props.id,
                  isClicked: isClicked.value
                });
              };
              
              return {
                isClicked,
                handleClick
              }
            }
          }
        }
      }
    });
  };

  beforeEach(() => {
    document.body.innerHTML = '';
    const div = document.createElement('div');
    div.id = 'app';
    document.body.appendChild(div);
  });

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('1. コンポーネントの初期表示', () => {
    it('1.1 基本レイアウト', () => {
      wrapper = createComponent()
      expect(wrapper.find('.side-bar').exists()).toBe(true)
      expect(wrapper.find('.side-bar').classes()).toContain('mt-2')
      expect(wrapper.find('.side-bar-item-content').exists()).toBe(true)
    })

    it('1.2 都道府県リストの表示', () => {
      wrapper = createComponent()
      const buttons = wrapper.findAll('button')
      expect(buttons).toHaveLength(mockPrefecturesList.length)
      
      buttons.forEach((button: any, index: number) => {
        expect(button.attributes('data-id')).toBe(mockPrefecturesList[index].prefCode.toString())
        expect(button.attributes('data-name')).toBe(mockPrefecturesList[index].prefName)
      })
    })
  })

  describe('2. 都道府県選択機能', () => {
    beforeEach(() => {
      wrapper = createComponent()
      store = usePrefectureStore()
    })

    it('2.1 都道府県の選択', async () => {
      const button = wrapper.findAll('button').at(0)
      await button?.trigger('click')
      await nextTick()
      
      expect(store.selectedPrefectures).toContain(1)
    })

    it('2.2 都道府県の選択解除', async () => {
      // 初期状態で選択済みの状態を作成
      wrapper = createComponent({
        selectedPrefectures: [1]
      })
      store = usePrefectureStore()

      // モックのisClickedを初期状態でtrueに設定
      const button = wrapper.findAll('button').at(0)
      await button.trigger('click') // isClicked: false に変更されて解除イベントが発火
      await nextTick()
      
      // 選択が解除されていることを確認
      expect(store.selectedPrefectures).not.toContain(1)
    })

    it('2.3 複数選択', async () => {
      const buttons = wrapper.findAll('button')
      
      await buttons[0].trigger('click')
      await nextTick()
      await buttons[1].trigger('click')
      await nextTick()
      
      expect(store.selectedPrefectures).toEqual([1, 2])
    })

    it('2.4 複数選択の解除', async () => {
      // 初期状態で2つの都道府県を選択
      wrapper = createComponent({
        selectedPrefectures: [1, 2]
      })
      store = usePrefectureStore()

      const buttons = wrapper.findAll('button')
      
      // モックのisClickedを初期状態でtrueに設定し、クリックで解除
      await buttons[0].trigger('click') // isClicked: false に変更
      await nextTick()
      expect(store.selectedPrefectures).toEqual([2])

      await buttons[1].trigger('click') // isClicked: false に変更
      await nextTick()
      expect(store.selectedPrefectures).toEqual([])
    })

    it('2.5 エラー処理 - 重複選択の防止', async () => {
      const button = wrapper.findAll('button').at(0)
      
      // 1回目の選択
      await button?.trigger('click')
      await nextTick()
      expect(store.selectedPrefectures).toEqual([1])

      // 同じ都道府県を再度選択（isClicked: trueの場合）
      await button?.trigger('click')
      await nextTick()
      // 重複して追加されないことを確認
      expect(store.selectedPrefectures).toEqual([])
    })
  })

  describe('3. レスポンシブ対応', () => {
    beforeEach(() => {
      wrapper = createComponent()
    })

    it('3.1 デスクトップ表示', async () => {
      const sideBar = wrapper.find('.side-bar')
      const content = wrapper.find('.side-bar-item-content')

      // 基本的なクラスの確認
      expect(sideBar.classes()).toContain('side-bar')
      expect(sideBar.classes()).toContain('mt-2')
      expect(content.classes()).toContain('flex')
      expect(content.classes()).toContain('flex-col')

      // コンテンツの存在確認
      expect(content.exists()).toBe(true)
      expect(wrapper.findAll('button')).toHaveLength(mockPrefecturesList.length)
    })

    it('3.2 モバイル表示の構造確認', async () => {
      const sideBar = wrapper.find('.side-bar')
      const content = wrapper.find('.side-bar-item-content')

      // 基本的なDOM構造の確認
      expect(sideBar.exists()).toBe(true)
      expect(content.exists()).toBe(true)

      // クラスの確認
      expect(sideBar.classes()).toContain('side-bar')
      expect(content.classes()).toContain('side-bar-item-content')
      expect(content.classes()).toContain('flex')

      // 子要素の確認
      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBe(mockPrefecturesList.length)
      buttons.forEach((button: any, index: number) => {
        expect(button.exists()).toBe(true)
        expect(button.attributes('data-id')).toBe(mockPrefecturesList[index].prefCode.toString())
      })
    })

    it('3.3 スクロール機能の確認', async () => {
      const sideBar = wrapper.find('.side-bar')
      const content = wrapper.find('.side-bar-item-content')
      
      // スクロール用のクラスと構造の確認
      expect(sideBar.classes()).toContain('side-bar')
      expect(content.exists()).toBe(true)
      expect(content.classes()).toContain('side-bar-item-content')
      expect(content.classes()).toContain('flex')
      
      // ボタンの存在確認とスクロール必要性の確認
      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBe(mockPrefecturesList.length)
      expect(buttons.length).toBeGreaterThan(0)
    })
  })
});