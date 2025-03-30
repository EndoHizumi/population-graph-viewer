<script setup lang="ts">
import type { EmblaCarouselType } from 'embla-carousel';
import emblaCarouselVue from 'embla-carousel-vue'
import { type PopulationCompositionPerYear, type PopulationDataItem, type Prefecture, type YearlyData } from '~/types/response';

import type { Chart } from 'highcharts';

const chartRef = ref<{ chart: Chart }>();
const canScrollPrev = ref(false);
const canScrollNext = ref(false);
const [emblaRef, emblaApi] = emblaCarouselVue();
const { data: prefectureData } = await useFetch<Prefecture>('/api/v1/prefectures');
const prefecturesList = ref(prefectureData.value);
const selectedPrefectures = ref<number[]>([]);
let index = 0;
  chart: {
    type: 'line'
  },
  title: {
    text: ''
  },
  xAxis: {
    categories: ['1月', '2月', '3月', '4月', '5月']
  },
  yAxis: {
    title: {
      text: '値'
    }
  },
  series: [{
    showInLegend: false,
    name: 'データ1',
    data: [10, 20, 15, 25, 30]
  }]
}

function scrollNext() {
  emblaApi?.value!.scrollNext();
}

function scrollPrev() {
  emblaApi?.value!.scrollPrev();
}

function updateButtonStates(emblaApi: EmblaCarouselType) {
  canScrollPrev.value = emblaApi.canScrollPrev();
  canScrollNext.value = emblaApi.canScrollNext();
  index = emblaApi.selectedScrollSnap();
  setSeries();
}

onMounted(() => {
  if (!emblaApi.value) return;

  updateButtonStates(emblaApi.value);
  emblaApi.value.on("select", updateButtonStates);
});
watch(selectedPrefectures, () => { console.log('selectedPrefectures'); setSeries(); }, { deep: true })

let populationList = ref<PopulationDataItem[]>([]);
const getPopulationCompositionPerYear = async (prefCode: number) => {
  const { data: populationData } = await $fetch<PopulationCompositionPerYear>(`/api/v1/population/?prefCode=${prefCode}`);
  populationList.value = populationData.map((item: any) => {
    return item.data.map((data: YearlyData) => {
      return {
        x: data.year,
        y: data.value,
      }
    })
  })
}

const setSeries = () => {
  selectedPrefectures.value.forEach(async (id) => {
    await getPopulationCompositionPerYear(id);
    chartOptions.series.push({
      id,
      type: 'line',
      showInLegend: false,
      name: prefecturesList.value?.find(p => p.prefCode === id)?.prefName || '都道府県データ',
      color: prefecturesMap[id].color,
      data: populationList.value[index]
    });
  })
}

const onClick = async (event: { id: number, isClicked: boolean }) => {
  const { id, isClicked } = event;
  console.log('onClick', id, isClicked);
  if (!isClicked) {
    selectedPrefectures.value.splice(selectedPrefectures.value.indexOf(id), 1);
    return;
  }
  selectedPrefectures.value.push(id);
  console.log('selectedPrefectures', selectedPrefectures);
}
</script>

<template>
  <div class="container w-full">
    <div class="header w-full bg-white m-0 text-3xl pl-4 py-3 text-black-200">
      <span class="title-color text-center align-baseline font-bold">
        population-graph-viewer
      </span>
    </div>
    <div class="content flex flex-row">
      <div class="chart flex-2 flex flex-col m-[10px] gap-2 relative">
        <div class="chart-container">
          <client-only>
            <highcharts :options="chartOptions" ref="chartRef" />
          </client-only>
        </div>
        <button @click="scrollPrev" :disabled="!canScrollPrev" class="embla__button embla__button--prev"><</button>
        <div class="embla" ref="emblaRef">
          <div class="embla__container">
            <div class="embla__slide">総人口</div>
            <div class="embla__slide">年少人口</div>
            <div class="embla__slide">生産年齢人口</div>
            <div class="embla__slide">老年人口</div>
          </div>
        </div>
        <button @click="scrollNext" :disabled="!canScrollNext" class="embla__button embla__button--next">></button>
            <div class="detail flex-1 flex flex-col text-2xl text-gray-400">
              <div class="text-gray-400 w-full">選択した都道府県の人口推移</div>
                <table class="population-table">
                  <thead>
                    <tr>
                      <th>年度</th>
                      <th>人口</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- 実際の年データが利用可能な場合 -->
                    <tr v-for="(yearData, yearIndex) in populationList[index]" :key="yearIndex">
                      <td>{{ yearData.x }}</td>
                      <td>{{ yearData.y }}</td>
                    </tr>
                  </tbody>
                </table>
        </div>
      </div>
      <div class="side-bar mt-2">
        <div class="side-bar-item-content flex flex-col gap-2 pt-4 justify-center items-center">
          <legend-button v-for="prefecture in prefecturesList" :key="prefecture.prefCode" :id="prefecture.prefCode"
            :name="prefecture.prefName" :imageSrc="prefectures[prefecture.prefCode - 1]" @click="onClick" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 100vw;
  background-color: #f7f5f7;
}

.side-bar {
  width: 100px;
  height: calc(100vh - 90px);
  background-color: white;
  overflow-y: scroll;
}

.detail {
  background-color: white;
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
  top: 49.4%;
  font-weight: bold;
  font-size: 2rem;
}

.embla__button--prev {
  left: 27px;
}

.embla__button--next {
  right: 27px;
}
</style>