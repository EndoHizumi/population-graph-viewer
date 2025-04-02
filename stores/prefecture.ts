import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Prefecture, PopulationDataItem } from '~/types/response'

export const usePrefectureStore = defineStore('prefecture', () => {
  const selectedPrefectures = ref<number[]>([])
  const prefecturesList = ref<Prefecture[] | null>(null)
  const populationData = ref<{[prefCode: number]: {[key: string]: PopulationDataItem}}>({})
  const isLoading = ref(false)
  const currentTab = ref(0)
  const yearList = ref<string[]>([])

  const fetchPopulationData = async (prefCode: number) => {
    if (populationData.value[prefCode]) {
      return;
    }
    isLoading.value = true
    try {
      const response = await fetch(`/api/v1/population?prefCode=${prefCode}`)
      const data = await response.json()
      populationData.value[prefCode] = data.result.data
    } catch (error) {
      console.error('Failed to fetch population data:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    selectedPrefectures,
    prefecturesList,
    populationData,
    isLoading,
    currentTab,
    yearList,
    fetchPopulationData
  }
})