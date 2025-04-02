<script setup lang="ts">
import { usePrefectureStore } from '~/stores/prefecture'
import type { EmblaCarouselType } from 'embla-carousel';
import emblaCarouselVue from 'embla-carousel-vue'
import { type PopulationDataItem, type YearlyData } from '~/types/response';
import type { Chart } from 'highcharts';
import { onMounted, onBeforeUnmount, ref, reactive, nextTick } from 'vue';

const prefectureStore = usePrefectureStore();
const chartRef = ref<{ chart: Chart }>();
const [emblaRef, emblaApi] = emblaCarouselVue();
const canScrollPrev = ref(false);
const canScrollNext = ref(true);

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
  series: [] as any[]
})

const updateButtons = () => {
  if (emblaApi.value) {
    canScrollPrev.value = emblaApi.value.canScrollPrev();
    canScrollNext.value = emblaApi.value.canScrollNext();
  }
}

const changePage = (emblaApi: EmblaCarouselType) => {
  updateButtons();
  prefectureStore.currentTab = emblaApi.selectedScrollSnap();
  setSeries();
}

// リサイズハンドラーを関数として抽出
const handleResize = () => {
  if (chartRef.value && chartRef.value.chart) {
    chartRef.value.chart.chartWidth = window.innerWidth - 200;
    chartRef.value.chart.reflow();
    chartRef.value.chart.redraw();
  }
};

onMounted(() => {
  if (!emblaApi.value) return;
  emblaApi.value.on("select", changePage);
  window.addEventListener('resize', handleResize);
  updateButtons();

  // 初回のリサイズ処理を呼び出す
  nextTick(() => {
    handleResize();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});


const setSeries = async () => {
  chartOptions.series = [];
  await Promise.all(prefectureStore.selectedPrefectures.map(async (id) => await prefectureStore.fetchPopulationData(id)));
  prefectureStore.selectedPrefectures.forEach(async (id) => {
    if (prefectureStore.populationData[id] && prefectureStore.populationData[id][prefectureStore.currentTab]) {
      chartOptions.series.push({
        id,
        type: 'line',
        showInLegend: false,
        name: prefectureStore.prefecturesList?.find(p => p.prefCode === id)?.prefName || '都道府県データ',
        data: prefectureStore.populationData[id][prefectureStore.currentTab].data
      });
    }
    if (prefectureStore.populationData[id]) {
    }
  });
  const firstSelectedPrefecture = prefectureStore.selectedPrefectures[0];
  if (prefectureStore.populationData[firstSelectedPrefecture] && prefectureStore.populationData[firstSelectedPrefecture][0]) {
    prefectureStore.yearList = prefectureStore.populationData[firstSelectedPrefecture][0].data.map((data: YearlyData) => {
      return data.year.toString();
    });
    chartOptions.xAxis.categories = prefectureStore.yearList;
  }
}

</script>
<template>
    <div class="chart-container">
      <client-only>
        <highcharts :options="chartOptions" ref="chartRef" />
      </client-only>
    </div>
    <div class="wrapper relative">
      <button @click="emblaApi?.scrollPrev()" :disabled="!canScrollPrev" class="embla__button embla__button--prev">&lt;</button>
      <button @click="emblaApi?.scrollNext()" :disabled="!canScrollNext" class="embla__button embla__button--next">&gt;</button>
      <div class="embla" ref="emblaRef">
        <div class="embla__container">
          <div class="embla__slide">総人口</div>
          <div class="embla__slide">年少人口</div>
          <div class="embla__slide">生産年齢人口</div>
          <div class="embla__slide">老年人口</div>
        </div>
      </div>
    </div>
</template>

<style scoped>
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

@media (max-width: 700px) {
  
  .detail {
    display: none;
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

.embla__button--prev:disabled {
  opacity: 0.5;
}

.embla__button--next:disabled {
  opacity: 0.5;
}
</style>