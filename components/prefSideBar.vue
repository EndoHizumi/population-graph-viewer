<script setup lang="ts">
import { computed } from 'vue';
import { usePrefectureStore } from '~/stores/prefecture';

const prefectureStore = usePrefectureStore();
const prefecturesList = computed(() => prefectureStore.prefecturesList);

const onClick = (event: { id: number, isClicked: boolean }) => {
  const { id, isClicked } = event;
  if (!isClicked) {
    const index = prefectureStore.selectedPrefectures.indexOf(id);
    if (index !== -1) {
      prefectureStore.selectedPrefectures.splice(index, 1);
    }
  } else {
    prefectureStore.selectedPrefectures.push(id);
  }
}
</script>
<template>
  <div class="side-bar mt-2">
    <div class="side-bar-item-content flex flex-col gap-2 pt-4 justify-center items-center">
      <client-only>
        <legend-button 
          v-for="prefecture in prefecturesList" 
          :key="prefecture.prefCode" 
          :id="prefecture.prefCode"
          :name="prefecture.prefName" 
          @click="onClick" 
        />
        <template #fallback>
          <div class="loading-placeholder">データを読み込み中...</div>
        </template>
      </client-only>
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


/* レスポンシブ対応 */
@media (max-width: 700px) {

.side-bar {
  width: auto;
  /* 幅を自動調整 */
  height: calc(50vh - 20px);
  /* 残り半分からマージン分を引く */
  margin: 5px 10px 10px 10px;
  overflow-y: scroll;
  /* スクロール可能に */
  flex: 1;
  /* 残りのスペースを占有 */
}

.side-bar-item-content {
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
  /* 上から詰めて表示 */
}
}
</style>