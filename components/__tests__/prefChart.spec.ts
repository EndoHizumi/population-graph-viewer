import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import PrefChart from '../prefChart.vue'
import { createTestingPinia } from '@pinia/testing'
import { usePrefectureStore } from '../../stores/prefecture'
import type { YearlyData, Prefecture, PopulationDataItem, PopulationCompositionPerYear } from '../../types/response'
import { prefecturesMap } from '~/utils/const'

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

const mockPopulationData: {[prefCode: number]: PopulationCompositionPerYear} = {
  1: {
    boundaryYear: 2000,
    data: [
      mockPopulationDataItem,
      mockPopulationDataItem,
      mockPopulationDataItem,
      mockPopulationDataItem
    ]
  },
  2: {
    boundaryYear: 2000,
    data: [
      mockPopulationDataItem,
      mockPopulationDataItem,
      mockPopulationDataItem,
      mockPopulationDataItem
    ]
  }
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
        },
      }
    })

    store = usePrefectureStore()
    // ストアのメソッドをモック
    store.fetchPopulationData = vi.fn().mockImplementation(async (prefCode: number) => {
      store.populationData[prefCode] = {
        boundaryYear:2000,
        data:[
          mockPopulationDataItem,
          mockPopulationDataItem,
          mockPopulationDataItem,
          mockPopulationDataItem
        ]
      }
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
      expect(vm.chartOptions.series).toHaveLength(2)
      expect(vm.chartOptions.series[0].name).toBe('北海道')
    })

    it('2.2 グラフが更新される', async () => {
      const vm = wrapper.vm as any
      store.selectedPrefectures = [1,2]
      await vm.setSeries()
      expect(vm.chartOptions.series).toHaveLength(8)
    })
  })

  describe('3. カルーセル機能', () => {
    it('3.1 すべてのスライドが正しく表示される', () => {
      const slides = wrapper.findAll('.embla__slide')
      expect(slides).toHaveLength(4)
      expect(slides[0].text()).toBe('総人口')
      expect(slides[1].text()).toBe('年少人口')
      expect(slides[2].text()).toBe('生産年齢人口')
      expect(slides[3].text()).toBe('老年人口')
    })

    it('3.2 ナビゲーションボタンの状態が正しく管理される', async () => {
      const vm = wrapper.vm as any
      
      // 初期状態
      expect(vm.canScrollPrev).toBe(false)
      expect(vm.canScrollNext).toBe(true)

      // 次へボタンクリック後
      mockEmblaApi.canScrollPrev.mockReturnValue(true)
      mockEmblaApi.canScrollNext.mockReturnValue(true)
      await wrapper.find('.embla__button--next').trigger('click')
      await vm.updateButtons()
      expect(vm.canScrollPrev).toBe(true)
      expect(vm.canScrollNext).toBe(true)

      // 最後のスライドへ
      mockEmblaApi.canScrollNext.mockReturnValue(false)
      await vm.updateButtons()
      expect(vm.canScrollNext).toBe(false)
    })

    it('3.3 スライド切り替え時にストアが更新される', async () => {
      const vm = wrapper.vm as any
      await vm.changePage(mockEmblaApi)
      expect(store.currentTab).toBe(1)
      expect(mockEmblaApi.selectedScrollSnap).toHaveBeenCalled()
    })

    it('3.4 スライド切り替え時にデータが更新される', async () => {
      const vm = wrapper.vm as any
      
      // 初期データを設定
      store.selectedPrefectures = [1]
      store.populationData = mockPopulationData
      
      // スライド切り替えを実行
      await vm.changePage(mockEmblaApi)
      
      // 非同期処理の完了を待つ
      await nextTick()
      
      // 検証
      expect(store.currentTab).toBe(1)
      
      // setSeriesの効果を検証
      expect(vm.chartOptions.series).toBeDefined()
      expect(Array.isArray(vm.chartOptions.series)).toBe(true)
      
      // データが正しく更新されているか確認
      await vm.setSeries()
      const series = vm.chartOptions.series[0]
      expect(series).toBeDefined()
      expect(series.id).toBe(1)
      expect(series.name).toBe('北海道')
      expect(series.type).toBe('line')
      expect(series.data).toBeDefined()
      expect(Array.isArray(series.data)).toBe(true)
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