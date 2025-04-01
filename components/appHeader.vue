<script setup lang="ts">
  defineProps({
    title: {
      type: String,
      default: 'population-graph-viewer'
    }
  })
</script>
<template>
    <div class="header w-full bg-white m-0 text-3xl pl-4 text-black-200">
        <span class="title-color text-center align-baseline font-bold">
          {{ title }}
        </span>
    </div>
</template>

<style scoped>

.header {
  height: 30px;
}

.title-color {
    color: #5E5656;
    /* text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); */
}
</style>
