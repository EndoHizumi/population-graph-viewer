<script setup lang="ts">

import { usePrefectureStore } from '~/stores/prefecture'
const prefectureStore = usePrefectureStore()

onBeforeMount(async() => {
  await prefectureStore.fetchPrefectures()
})
</script>

<template>
  <div class="container w-full">
    <app-header />
    <div class="content flex flex-row">
      <div class="chart flex-2 flex flex-col m-[10px] gap-2 relative">
        <pref-chart/>
        <pref-table/>
      </div>
      <pref-side-bar/>
    </div>
    </div>
</template>

<style scoped>

.container {
  max-width: 100vw;
  max-height: 100vh;
  background-color: #f7f5f7;
  display: flex;
  flex-direction: column;
}

@media (max-width: 700px) {

  .content {
    flex-direction: column;
    height: calc(100vh - 30px);
  }

  .chart {
    margin: 10px 10px 0 10px;
    flex-grow: 1
  }

}
</style>