<script setup lang="ts">
import { usePrefectureStore } from '~/stores/prefecture'
import type { EmblaCarouselType } from 'embla-carousel'
import emblaCarouselVue from 'embla-carousel-vue'
import type { Chart } from 'highcharts'
import { onMounted, onBeforeUnmount, ref, reactive, nextTick, computed, watch } from 'vue'
import type { YearlyData } from '~/types/response'

import { prefecturesMap } from '~/utils/const'

const prefectureStore = usePrefectureStore()
const chartRef = ref<{ chart: Chart }>()
const [emblaRef, emblaApi] = emblaCarouselVue()
const canScrollPrev = ref(false)
const canScrollNext = ref(true)

const populationData = computed(() => prefectureStore.populationData)
const prefecturesList = computed(() => prefectureStore.prefecturesList)
const yearList = computed(() => prefectureStore.yearList)
const currentTab = computed(() => prefectureStore.currentTab)
const selectedPrefectures = computed(() => prefectureStore.selectedPrefectures)

watch(selectedPrefectures, async () => { await setSeries() }, { deep: true })
watch(currentTab, async () => { await setSeries() }, { deep: true })

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
  series: [] as Highcharts.SeriesOptionsType[],
  accessibility: { enabled: false }
})

const updateButtons = () => {
  if (emblaApi.value) {
    canScrollPrev.value = emblaApi.value.canScrollPrev()
    canScrollNext.value = emblaApi.value.canScrollNext()
  }
}

const changePage = (emblaApi: EmblaCarouselType) => {
  updateButtons()
  prefectureStore.currentTab = emblaApi.selectedScrollSnap()
  setSeries()
}

// リサイズハンドラーを関数として抽出
const handleResize = () => {
  if (chartRef.value && chartRef.value.chart) {
    chartRef.value.chart.chartWidth = window.innerWidth - 200
    chartRef.value.chart.reflow()
    chartRef.value.chart.redraw()
  }
}

onMounted(() => {
  if (!emblaApi.value) return
  emblaApi.value.on('select', changePage)
  window.addEventListener('resize', handleResize)
  updateButtons()

  // 初回のリサイズ処理を呼び出す
  nextTick(() => {
    handleResize()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})


const setSeries = async () => {
  chartOptions.series = []
  await Promise.all(selectedPrefectures.value.map(async (id) => await prefectureStore.fetchPopulationData(id)))
  if (chartOptions.xAxis.categories.length === 0) {
    chartOptions.xAxis.categories = yearList.value
  }

  selectedPrefectures.value.forEach(async (id) => {

    const boundaryYear = populationData.value[id].boundaryYear
    const dataName = prefecturesList.value?.find(p => p.prefCode === id)?.prefName || '都道府県データ'

    if (populationData.value[id]) {
      const chartData1 = populationData.value[id]
        .data[prefectureStore.currentTab]
        .data.filter((item: YearlyData) => item.year <= boundaryYear)
        .map((item: YearlyData) => ({ x: item.year, y: item.value }))
      const chartData2 = populationData.value[id]
        .data[prefectureStore.currentTab]
        .data.filter((item: YearlyData) => item.year >= boundaryYear)
        .map(
        (item: YearlyData) => ({ x: item.year, y: item.value })
      )

      chartOptions.series.push(
        {
          id: String(id),
          type: 'line',
          showInLegend: false,
          name: dataName,
          data: chartData1,
          color: prefecturesMap[id].color,
          dashStyle: 'Solid',
          linkedTo: `${id}-expect`,
        },
        {
          id: `${id}-expect`,
          type: 'line',
          showInLegend: false,
          name: `${dataName}(予測値)`,
          data: chartData2,
          color: prefecturesMap[id].color,
          dashStyle: 'Dash',
        })
    }
  })
}

</script>
<template>
  <div class="chart-container">
    <client-only>
      <highcharts ref="chartRef" :options="chartOptions" />
    </client-only>
  </div>
  <div class="wrapper relative">
    <button
:disabled="!canScrollPrev" class="embla__button embla__button--prev"
      @click="emblaApi?.scrollPrev()">&lt;</button>
    <button
:disabled="!canScrollNext" class="embla__button embla__button--next"
      @click="emblaApi?.scrollNext()">&gt;</button>
    <div ref="emblaRef" class="embla">
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