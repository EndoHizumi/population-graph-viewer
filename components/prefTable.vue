<script setup lang="ts">
import { usePrefectureStore } from '~/stores/prefecture'
import { computed } from 'vue'
import type { PopulationDataItem, YearlyData } from '~/types/response'

const prefectureStore = usePrefectureStore()

const currentCategory = computed(() => prefectureStore.currentTab === 0 ? 'total' : 'young')
const selectedPrefectures = computed(() => prefectureStore.selectedPrefectures)
const populationData = computed(() => prefectureStore.populationData)

const getValue = (id: number, rowIndex: number): number | undefined => {
  return populationData.value[id]?.[currentCategory.value]?.data?.[rowIndex]?.value
}
</script>

<template>
    <div class="detail flex-1 flex flex-col text-2xl text-gray-400 text-center">
        <div v-if="prefectureStore.isLoading">
            データを読み込み中...
        </div>
        <span v-else-if="selectedPrefectures.length <= 0">都道府県を選択してください</span>
        <table v-else class="w-full">
        <thead>
            <tr class="border-1">
            <th class="border-1">年号</th>
            <th class="border-1" v-for="(id, index) in selectedPrefectures" :key="index">
                {{prefectureStore.prefecturesList?.find(p => p.prefCode === id)?.prefName}}
            </th>
            </tr>
        </thead>
        <tbody class="text-right">
            <tr class="border-1" v-for="(year, rowIndex) in prefectureStore.yearList" :key="rowIndex">
            <td class="border-1">
                {{ year }}
            </td>
            <td class="border-1" v-for="(id, index) in selectedPrefectures" :key="index">
                {{getValue(id, rowIndex)}}
            </td>
            </tr>
        </tbody>
        </table>
    </div>
</template>
