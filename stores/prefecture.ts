import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Prefecture, PopulationDataItem, YearlyData, PopulationCompositionPerYear } from '~/types/response'

export const usePrefectureStore = defineStore('prefecture', () => {
  const selectedPrefectures = ref<number[]>([])
  const prefecturesList = ref<Prefecture[]>([])
  const populationData = ref<{ [prefCode: number]: PopulationCompositionPerYear }>({})
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
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const populationResult: PopulationCompositionPerYear = await response.json();
      if (!populationResult.data) {
        throw new Error(`Invalid data format for prefecture ${prefCode}`);
      }

      populationData.value[prefCode] = populationResult;

      if (yearList.value.length === 0 && populationResult.data[0]?.data?.length > 0) {
        yearList.value = populationResult.data[0].data.map((data: YearlyData) => data.year.toString());
      }

    } catch (error) {
      console.error('Failed to fetch population data:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const fetchPrefectures = async () => {
    if (prefecturesList.value?.length > 0) return prefecturesList.value;

    isLoading.value = true;
    try {
      const response = await fetch('/api/v1/prefectures');
      if (!response.ok) throw new Error('Failed to fetch prefectures');

      const data = await response.json();
      prefecturesList.value = data;
      return prefecturesList.value;
    } catch (error) {
      console.error('Error fetching prefectures:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

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

