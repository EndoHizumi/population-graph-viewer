<script setup lang="ts">
import { type PopulationCompositionPerYear, type PopulationDataItem, type Prefecture, type YearlyData } from '~/types/response';

const { data: prefectureData } = await useFetch<Prefecture[]>('/api/v1/prefectures');
const prefecturesList = ref<Prefecture[] | null>(prefectureData.value);
const selectedPrefectures = ref<number[]>([]);


const onClick = (event: { id: number, isClicked: boolean }) => {
  const { id, isClicked } = event;
  if (!isClicked) {
    selectedPrefectures.value.splice(selectedPrefectures.value.indexOf(id), 1);
  } else {
    selectedPrefectures.value.push(id);
  }
}
</script>

<template>
  <div class="container w-full">
    <app-header></app-header>
    <div class="content flex flex-row">
      <div class="chart flex-2 flex flex-col m-[10px] gap-2 relative">
        <pref-chart/>
        <pref-table/>
      </div>
        <div class="side-bar mt-2">
          <div class="side-bar-item-content flex flex-col gap-2 pt-4 justify-center items-center">
          <legend-button v-for="prefecture in prefecturesList" :key="prefecture.prefCode" :id="prefecture.prefCode"
            :name="prefecture.prefName" @click="onClick" />
        </div>
      </div>
    </div>
    </div>
</template>

<style scoped>
/* コンテナ全体のスタイル */
.container {
  max-width: 100vw;
  max-height: 100vh;
  background-color: #f7f5f7;
  display: flex;
  flex-direction: column;
}



/* サイドバー */
.side-bar {
  min-width: 100px;
  /* ヘッダー高さを引いた残り */
  max-height: calc(100vh - 40px);
  background-color: white;
  overflow-y: auto;
  margin-top: 10px;
  margin-right: 10px;
  
}

/* レスポンシブ対応 */
@media (max-width: 700px) {

  .content {
    flex-direction: column;
    /* コンテンツを縦並びに */
    height: calc(100vh - 30px);
    /* ヘッダー高さを引いた残り */
  }

  .chart {
    margin: 10px 10px 0 10px;
    flex-grow: 1
  }


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