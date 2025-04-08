<script setup lang="ts">
import { usePrefectureStore } from '~/stores/prefecture'
import { ref, watch, computed } from 'vue'
const prefectureStore = usePrefectureStore()

const isLoading = ref(false)
const yearList = computed(() => prefectureStore.yearList)
const currentTab = computed(() => prefectureStore.currentTab)
const selectedPrefectures = computed(() => prefectureStore.selectedPrefectures)
const populationData = computed(() => prefectureStore.populationData)
const prefecturesList = computed(() => prefectureStore.prefecturesList)

// 選択された都道府県が変わったら、データを取得する
watch(selectedPrefectures, async (newVal) => {
    if (newVal.length > 0) {
        isLoading.value = true
        try {
            // すべての選択された都道府県のデータを取得
            await Promise.all(newVal.map(id => prefectureStore.fetchPopulationData(id)))
        } finally {
            isLoading.value = false
        }
    }
}, { deep: true })

</script>

<template>
    <div class="detail">
        <span v-if="selectedPrefectures.length <= 0">都道府県を選択してください</span>
        <table v-else class="w-full overflow-y-auto">
            <thead>
                <tr class="border-1">
                    <th class="border-1">年号</th>
                    <th v-for="(id, index) in selectedPrefectures" :key="index" class="border-1">
                        {{prefecturesList?.find(p => p.prefCode === id)?.prefName}}
                    </th>
                </tr>
            </thead>
            <tbody class="text-right">
                <tr v-for="(year, rowIndex) in yearList" :key="rowIndex" class="border-1">
                    <td class="border-1">
                        {{ year }}
                    </td>
                    <td v-for="(id, index) in selectedPrefectures" :key="index" class="border-1">
                        {{ populationData[id].data[currentTab].data[rowIndex].value }}
                        ({{ populationData[id].data[currentTab].data[rowIndex].rate || '-' }}%)
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.detail {
    max-height: calc(100vh - 475px);
    flex: 1 1 0%;
    display: flex;
    flex-direction: column;
    font-size: 1.5rem;
    line-height: 2rem;
    color: rgb(156, 163, 175);
    text-align: center;
    background-color: rgb(255, 255, 255);
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    overflow-y: scroll;
}

@media (max-width: 700px) {
    .detail {
        display: none;
    }
}
</style>