<script setup lang="ts">
import { usePrefectureStore } from '~/stores/prefecture'
import { ref, watch, computed } from 'vue';
const prefectureStore = usePrefectureStore();

const isLoading = ref(false);
const yearList = computed(() => prefectureStore.yearList);
const currentTab = computed(() => prefectureStore.currentTab);
const selectedPrefectures = computed(() => prefectureStore.selectedPrefectures);
const populationData = computed(() => prefectureStore.populationData);
const prefecturesList = computed(() => prefectureStore.prefecturesList);

// 選択された都道府県が変わったら、データを取得する
watch(selectedPrefectures, async (newVal) => {
    if (newVal.length > 0) {
        isLoading.value = true;
        try {
            // すべての選択された都道府県のデータを取得
            await Promise.all(newVal.map(id => prefectureStore.fetchPopulationData(id)));
        } finally {
            isLoading.value = false;
        }
    }
}, { deep: true });

</script>

<template>
    <div
        class="detail flex-1 flex flex-col text-2xl text-gray-400 text-center bg-white rounded-lg shadow-md p-4 overflow-y-scroll">
        <span v-if="selectedPrefectures.length <= 0">都道府県を選択してください</span>
        <table v-else class="w-full overflow-y-auto">
            <thead>
                <tr class="border-1">
                    <th class="border-1">年号</th>
                    <th class="border-1" v-for="(id, index) in selectedPrefectures" :key="index">
                        {{prefecturesList?.find(p => p.prefCode === id)?.prefName}}
                    </th>
                </tr>
            </thead>
            <tbody class="text-right">
                <tr class="border-1" v-for="(year, rowIndex) in yearList" :key="rowIndex">
                    <td class="border-1">
                        {{ year }}
                    </td>
                    <td class="border-1" v-for="(id, index) in selectedPrefectures" :key="index">
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
    max-height: calc(100vh - 500px);
}
</style>