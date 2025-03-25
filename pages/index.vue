<template>
  <div>
    <h1>Highchartsサンプル</h1>
      <highcharts :options="chartOptions" />
  </div>
</template>

<script setup>

const chartOptions = {
  chart: {
    type: 'line'
  },
  title: {
    text: 'サンプルチャート'
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
    name: 'データ1',
    data: [10, 20, 15, 25, 30]
  }]
}
</script>

<style scoped>
div {
  padding: 20px;
}
</style>