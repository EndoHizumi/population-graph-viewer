<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePrefectureStore } from '~/stores/prefecture'

const prefectureStore = usePrefectureStore()
const { prefecturesList } = storeToRefs(prefectureStore)

const onClick = (event: { id: number, isClicked: boolean }) => {
  const { id, isClicked } = event
  
  // 配列を新しい参照に置き換えて更新
  if (isClicked) {
    // 選択された場合は追加（重複を防ぐ）
    if (!prefectureStore.selectedPrefectures.includes(id)) {
      prefectureStore.selectedPrefectures = [...prefectureStore.selectedPrefectures, id]
    }
  } else {
    // 選択解除の場合は削除
    prefectureStore.selectedPrefectures = prefectureStore.selectedPrefectures.filter(
      prefId => prefId !== id
    )
  }
}
</script>

<template>
  <div class="side-bar mt-2">
    <div class="side-bar-item-content">
        <legend-button
          v-for="prefecture in prefecturesList"
          :id="prefecture.prefCode"
          :key="prefecture.prefCode"
          :name="prefecture.prefName"
          @click="onClick"
        />
    </div>
  </div>
</template>

<style scoped>
.side-bar {
  min-width: 100px;
  max-height: calc(100vh - 40px);
  background-color: white;
  overflow-y: auto;
  margin-top: 10px;
  margin-right: 10px;
}

.side-bar-item-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 1rem;
  justify-content: center;
  align-items: center;
}

@media (max-width: 700px) {
  .side-bar {
    width: auto;
    height: calc(50vh - 20px);
    margin: 5px 10px 10px 10px;
    overflow-y: scroll;
    flex: 1;
  }

  .side-bar-item-content {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
  }
}
</style>