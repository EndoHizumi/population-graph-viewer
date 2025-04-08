import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import PrefTable from '../prefTable.vue'
import type { PopulationCompositionPerYear, PopulationDataItem, YearlyData } from '~/types/response'

// モックデータ
const mockPrefecturesList = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 2, prefName: '青森県' },
  { prefCode: 3, prefName: '岩手県' }
]

const mockYearlyData: YearlyData[] = [
  {
    year: 2015,
    value: 5000000
  },
  {
    year: 2020,
    value: 4800000
  },
  {
    year: 2025,
    value: 4600000
  }
]

const mockPopulationDataItem: PopulationDataItem = {
  label: '総人口',
  data: mockYearlyData
}

const mockYearList = [2015, 2020, 2025]

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

describe('PrefTable', () => {
  let wrapper: ReturnType<typeof mount>

  const createComponent = (initialState = {}) => {
    return mount(PrefTable, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              prefecture: {
                selectedPrefectures: [],
                prefecturesList: mockPrefecturesList,
                yearList: mockYearList,
                populationData: mockPopulationData,
                isLoading: false,
                currentTab: 0,
                ...initialState
              }
            }
          })
        ]
      }
    })
  }

  describe('1. コンポーネントの初期表示', () => {
    it('1.1 未選択時の表示', () => {
      wrapper = createComponent()
      expect(wrapper.text()).toContain('都道府県を選択してください')
      expect(wrapper.find('table').exists()).toBe(false)
    })
  })

  describe('2. テーブル機能', () => {
    beforeEach(() => {
      wrapper = createComponent({ selectedPrefectures: [1, 2] })
    })

    it('2.1 テーブルヘッダー', () => {
      const headers = wrapper.findAll('th')
      expect(headers[0].text()).toBe('年号')
      expect(headers[1].text()).toBe('北海道')
      expect(headers[2].text()).toBe('青森県')
      expect(headers[0].classes()).toContain('border-1')
    })

    it('2.2 テーブルボディ', () => {
      const rows = wrapper.findAll('tbody tr')
      expect(rows[0].findAll('td')[0].text()).toBe('2015')
      expect(rows[0].findAll('td')[1].text()).toBe('5000000 (-%)')
      expect(rows[0].findAll('td')[2].text()).toBe('5000000 (-%)')
      expect(wrapper.find('tbody').classes()).toContain('text-right')
    })
  })

  describe('3. データ更新', () => {
    it('3.1 都道府県選択時の更新', async () => {
      wrapper = createComponent({ selectedPrefectures: [1] })
      expect(wrapper.findAll('th').length).toBe(2) // 年号 + 1県

      wrapper = createComponent({ selectedPrefectures: [1, 2] })
      expect(wrapper.findAll('th').length).toBe(3) // 年号 + 2県
    })

    it('3.2 都道府県解除時の更新', async () => {
      wrapper = createComponent({ selectedPrefectures: [1, 2] })
      expect(wrapper.findAll('th').length).toBe(3) // 年号 + 2県

      wrapper = createComponent({ selectedPrefectures: [1] })
      expect(wrapper.findAll('th').length).toBe(2) // 年号 + 1県

      wrapper = createComponent({ selectedPrefectures: [] })
      expect(wrapper.text()).toContain('都道府県を選択してください')
    })
  })

  describe('4. タブ切り替え', () => {
    it('4.1 人口区分タブの切り替え', async () => {
      wrapper = createComponent({
        selectedPrefectures: [1],
        currentTab: 0
      })
      expect(wrapper.findAll('td')[1].text()).toBe('5000000 (-%)')

      wrapper = createComponent({
        selectedPrefectures: [1],
        currentTab: 1
      })
      expect(wrapper.findAll('td')[1].text()).toBe('5000000 (-%)')
    })
  })
})