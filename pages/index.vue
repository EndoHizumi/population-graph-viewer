<script setup lang="ts">
import type { EmblaCarouselType } from 'embla-carousel';
import emblaCarouselVue from 'embla-carousel-vue'

const canScrollPrev = ref(false);
const canScrollNext = ref(false);
const [emblaRef, emblaApi] = emblaCarouselVue();
const prefecturesList = [
  { "prefCode": 1, "prefName": "北海道" },
  { "prefCode": 2, "prefName": "青森県" }
];
const chartOptions = {
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
}

onMounted(() => {
  if (!emblaApi.value) return;

  updateButtonStates(emblaApi.value);
  emblaApi.value.on("select", updateButtonStates);
})

const onClick = (id: number) => {
  console.log(id);
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
        <div class="h-1/2">
          <highcharts :options="chartOptions" class="w-full h-full" />
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
        <div class="detail flex-1 flex justify-center items-center text-2xl text-gray-400">
          ここに選択した都道府県のデータが表示されます
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