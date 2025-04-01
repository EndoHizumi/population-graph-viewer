import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Prefecture, PopulationDataItem } from '~/types/response'

export const usePrefectureStore = defineStore('prefecture', () => {
  const selectedPrefectures = ref<number[]>([])
  const prefecturesList = ref<Prefecture[] | null>(null)
  const populationData = ref<Record<number, PopulationDataItem[]>>({})
  const isLoading = ref(false)

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
    fetchPopulationData
  }
})