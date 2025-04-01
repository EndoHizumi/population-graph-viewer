<script setup lang="ts">
import type { EmblaCarouselType } from 'embla-carousel';
import emblaCarouselVue from 'embla-carousel-vue'
import { type PopulationCompositionPerYear, type PopulationDataItem, type Prefecture, type YearlyData } from '~/types/response';

import type { Chart } from 'highcharts';

const chartRef = ref<{ chart: Chart }>();
const [emblaRef, emblaApi] = emblaCarouselVue();
const canScrollPrev = ref(false);
const canScrollNext = ref(false);
const { data: prefectureData } = await useFetch<Prefecture[]>('/api/v1/prefectures');
const selectedPrefectures = ref<number[]>([]);
const prefecturesList = ref<Prefecture[] | null>(prefectureData.value);

let currentPage = 0;

const chartOptions = reactive({
  chart: {
    reflow: true,
  },
  title: {
    text: ''
  },
  xAxis: {
    title: {
      text: '年'
    },
    categories: [] as string[]
  },
  yAxis: {
    title: {
      text: '人口'
    }
  },
  series: [] as any
})

const updateButtons = () => {
  canScrollPrev.value = emblaApi?.value!.canScrollPrev();
  canScrollNext.value = emblaApi?.value!.canScrollNext();
}

const changePage = (emblaApi: EmblaCarouselType) => {
  updateButtons();
  currentPage = emblaApi.selectedScrollSnap();
  setSeries();
}

// リサイズハンドラーを関数として抽出
const handleResize = () => {
  // highChartsのリサイズ処理を呼び出す
  if (chartRef.value && chartRef.value.chart) {
    chartRef.value.chart.chartWidth = window.innerWidth - 200;
    chartRef.value?.chart.reflow();
    chartRef.value?.chart.redraw();
  }
};

onMounted(() => {
  if (!emblaApi.value) return;
  emblaApi.value.on("select", changePage);
  window.addEventListener('resize', handleResize);
updateButtons()

  // 初回のリサイズ処理を呼び出す
  nextTick(() => {
    handleResize();
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// データ読み込み状態の管理
const isLoading = ref(false);
let populationList = ref<{ [key: string]: number[][] }>({});
const getPopulationCompositionPerYear = async (prefCode: number) => {
  // すでに取得済みのデータがある場合は、再取得しない
  if (populationList.value[prefCode]) {
    return;
  }
  isLoading.value = true;
  try {
    const { data: populationData } = await $fetch<PopulationCompositionPerYear>(`/api/v1/population/?prefCode=${prefCode}`);
    populationList.value[prefCode] = populationData.map((item: any) =>
      item.data.map((data: YearlyData) => data.value)
    );
    chartOptions.xAxis.categories = populationData[0].data.map((data: YearlyData) => {
      return data.year.toString();
    })
  } catch (error) {
    console.error('データ取得エラー:', error);
  } finally {
    isLoading.value = false; // 読み込み終了
  }
}

const setSeries = async () => {
  chartOptions.series = [];
  const promises = selectedPrefectures.value.map(id => getPopulationCompositionPerYear(id));
  await Promise.all(promises);
  selectedPrefectures.value.forEach(async (id) => {
    chartOptions.series.push({
      id,
      type: 'line',
      showInLegend: false,
      name: prefecturesList.value?.find(p => p.prefCode === id)?.prefName || '都道府県データ',
      color: prefecturesMap[id].color,
      data: populationList.value[id][currentPage]
    });
  })
}

const onClick = (event: { id: number, isClicked: boolean }) => {
  const { id, isClicked } = event;
  if (!isClicked) {
    selectedPrefectures.value.splice(selectedPrefectures.value.indexOf(id), 1);
  } else {
    selectedPrefectures.value.push(id);
  }
  setSeries();
}
</script>

<template>
  <div class="container w-full">
    <app-header></app-header>
    <div class="content flex flex-row">
      <div class="chart flex-2 flex flex-col m-[10px] gap-2 relative">
        <div class="chart-container">
          <client-only>
            <highcharts :options="chartOptions" ref="chartRef" />
          </client-only>
        </div>
        <div class="wrapper relative">
          <button @click="emblaApi?.scrollPrev()" :disabled="!canScrollPrev" class="embla__button embla__button--prev"><</button>
          <button @click="emblaApi?.scrollNext()" :disabled="!canScrollNext" class="embla__button embla__button--next">></button>
          <div class="embla" ref="emblaRef">
            <div class="embla__container">
              <div class="embla__slide">総人口</div>
              <div class="embla__slide">年少人口</div>
              <div class="embla__slide">生産年齢人口</div>
              <div class="embla__slide">老年人口</div>
            </div>
          </div>
        </div>
        <div class="detail flex-1 flex flex-col text-2xl text-gray-400 text-center">
          <span v-if="selectedPrefectures.length <= 0">都道府県を選択してください</span>
          <div v-else-if="isLoading">
            データを読み込み中...
          </div>
          <table v-else class="w-full">
            <thead>
              <tr class="border-1">
                <th class="border-1">年号</th>
                <th class="border-1"  v-for="(id, index) in selectedPrefectures" :key="index">
                  {{prefecturesList?.find(p => p.prefCode === id)?.prefName}}
                </th>
              </tr>
            </thead>
            <tbody class="text-right">
              <tr class="border-1" v-for="(year, rowIndex) in chartOptions.xAxis.categories" :key="rowIndex">
                <td class="border-1">
                  {{ year }}
                </td>
                <td class="border-1" v-for="(id, index) in selectedPrefectures" :key="index">
                  {{populationList[id][currentPage][rowIndex]}}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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

/* チャートコンテナ */
.chart-container {
  min-height: 400px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.detail {
  background-color: white;
  max-height: calc(100vh - 500px);
  border-radius: 8px;
  padding: 10px;
  overflow-y: auto;
}

/* レスポンシブ対応 */
@media (max-width: 700px) {
  .detail{
    display: none;
  }

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

@media (max-height: 400px) {
  .chart-container {
    height: 100%;
    /* 高さを小さく */
  }
}

.embla {
  overflow: hidden;
}

.embla__container {
  display: flex;
}

.embla__slide {
  flex: 0 0 100%;
  min-width: 0;
  text-align: center;
  user-select: none;
}

.embla__button {
  cursor: pointer;
  position: absolute;
  z-index: 1;
}

.embla__button--prev {
  left: 27px;
}

.embla__button--next {
  right: 27px;
}
</style>