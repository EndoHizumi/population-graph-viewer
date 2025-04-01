import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { ref } from 'vue'
import PrefChart from '../prefChart.vue'
import { createTestingPinia } from '@pinia/testing'
import { usePrefectureStore } from '../../stores/prefecture'
import type { YearlyData, Prefecture, PopulationDataItem } from '../../types/response'

// Highchartsのモック
vi.mock('highcharts-vue', () => ({
  default: {
    install: vi.fn(),
    Chart: {
      name: 'highcharts',
      template: '<div class="highcharts-mock"></div>',
      props: ['options'],
      setup: () => ({})
    }
  }
}))

// embla-carousel-vueのモック
const mockEmblaApi = {
  canScrollPrev: vi.fn().mockReturnValue(false),
  canScrollNext: vi.fn().mockReturnValue(true),
  scrollPrev: vi.fn(),
  scrollNext: vi.fn(),
  on: vi.fn(),
  selectedScrollSnap: vi.fn().mockReturnValue(1)
}

vi.mock('embla-carousel-vue', () => ({
  default: () => {
    const emblaRef = ref(null)
    const emblaApi = ref(mockEmblaApi)
    return [emblaRef, emblaApi]
  }
}))

// テストデータ
const mockYearlyData: YearlyData[] = [
  {
    year: 2015,
    value: 5000000
  },
  {
    year: 2020,
    value: 4800000
  }
]

const mockPopulationDataItem: PopulationDataItem = {
  label: '総人口',
  data: mockYearlyData
}

const mockPopulationData: Record<number, PopulationDataItem[]> = {
  1: [mockPopulationDataItem],
  2: [mockPopulationDataItem]
}

const mockPrefecturesList: Prefecture[] = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 2, prefName: '青森県' }
]

describe('PrefChart', () => {
  let wrapper: VueWrapper
  let store: ReturnType<typeof usePrefectureStore>

  beforeEach(() => {
    // テスト用のPiniaストアを作成
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        prefecture: {
          selectedPrefectures: [1],
          prefecturesList: mockPrefecturesList,
          populationData: mockPopulationData,
          isLoading: false,
          currentPage: 0
        }
      },
      stubActions: false
    })

    // コンポーネントのマウント
    wrapper = mount(PrefChart, {
      global: {
        plugins: [pinia],
        stubs: {
          'client-only': true,
          'highcharts': true
        }
      }
    })

    store = usePrefectureStore()
    // ストアのメソッドをモック
    store.fetchPopulationData = vi.fn().mockImplementation(async (prefCode: number) => {
      store.populationData[prefCode] = [mockPopulationDataItem]
    })
  })

  afterEach(() => {
    wrapper.unmount()
    vi.clearAllMocks()
  })

  describe('1. コンポーネントの初期表示', () => {
    it('1.1 基本レイアウトが正しく表示される', () => {
      expect(wrapper.find('.chart-container').exists()).toBe(true)
      expect(wrapper.find('.embla').exists()).toBe(true)
      expect(wrapper.find('.embla__button--prev').exists()).toBe(true)
      expect(wrapper.find('.embla__button--next').exists()).toBe(true)
    })

    it('1.2 初期状態が正しく設定される', () => {
      const vm = wrapper.vm as any
      expect(vm.chartOptions.series).toHaveLength(0)
      expect(wrapper.find('.embla__slide').text()).toBe('総人口')
      expect(wrapper.find('.embla__button--prev').attributes('disabled')).toBeDefined()
    })
  })

  describe('2. グラフ機能', () => {
    it('2.1 都道府県選択時にデータが表示される', async () => {
      const vm = wrapper.vm as any
      await vm.setSeries()
      expect(vm.chartOptions.series).toHaveLength(1)
      expect(vm.chartOptions.series[0].name).toBe('北海道')
    })

    it('2.2 グラフが更新される', async () => {
      const vm = wrapper.vm as any
      store.selectedPrefectures = [1, 2]
      await vm.setSeries()
      expect(vm.chartOptions.series).toHaveLength(2)
    })
  })

  describe('3. カルーセル機能', () => {
    it('3.1 ナビゲーションボタンが機能する', async () => {
      const vm = wrapper.vm as any
      const nextButton = wrapper.find('.embla__button--next')
      await nextButton.trigger('click')
      await vm.changePage(mockEmblaApi)
      expect(vm.currentPage).toBe(1)
    })

    it('3.2 データ切り替えが正しく動作する', async () => {
      const vm = wrapper.vm as any
      await vm.changePage({ selectedScrollSnap: () => 1 })
      expect(vm.currentPage).toBe(1)
    })
  })

  describe('4. データ管理', () => {
    it('4.1 データ更新が正しく処理される', async () => {
      const vm = wrapper.vm as any
      store.selectedPrefectures = [2]
      await vm.setSeries()
      expect(vm.chartOptions.series[0].id).toBe(2)
    })
  })
})