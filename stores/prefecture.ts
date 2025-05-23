import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Prefecture, YearlyData, PopulationCompositionPerYear } from '~/types/response'

export const usePrefectureStore = defineStore('prefecture', () => {
  const selectedPrefectures = ref<number[]>([])
  const prefecturesList = ref<Prefecture[]>([])
  const populationData = ref<{ [prefCode: number]: PopulationCompositionPerYear }>({})
  const isLoading = ref(false)
  const currentTab = ref(0)
  const yearList = ref<string[]>([])

  /**
   * 指定された都道府県の人口データを取得する
   * @param {number} prefCode - 都道府県コード
   * @returns {Promise<void>} 取得処理の完了を示すPromise
   * @throws {Error} ネットワークエラーまたはデータ形式エラー時
   */
  const fetchPopulationData = async (prefCode: number) => {
    if (populationData.value[prefCode]) {
      return
    }
    isLoading.value = true
    try {
      const response = await fetch(`/api/v1/population?prefCode=${prefCode}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const populationResult: PopulationCompositionPerYear = await response.json()
      if (!populationResult.data) {
        throw new Error(`Invalid data format for prefecture ${prefCode}`)
      }

      populationData.value[prefCode] = populationResult

      if (yearList.value.length === 0 && populationResult.data[0]?.data?.length > 0) {
        yearList.value = populationResult.data[0].data.map((data: YearlyData) => data.year.toString())
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 都道府県一覧を取得する
   * @returns {Promise<Prefecture[]>} 都道府県一覧
   * @throws {Error} ネットワークエラー時
   */
  const fetchPrefectures = async () => {
    if (prefecturesList.value?.length > 0) return prefecturesList.value

    isLoading.value = true
    try {
      const response = await fetch('/api/v1/prefectures')
      if (!response.ok) throw new Error('Failed to fetch prefectures')

      const data = await response.json()
      prefecturesList.value = data
      return prefecturesList.value
    } finally {
      isLoading.value = false
    }
  }

  return {
    selectedPrefectures,
    prefecturesList,
    isLoading,
    currentTab,
    yearList,
    populationData,
    fetchPopulationData,
    fetchPrefectures
  }
})

