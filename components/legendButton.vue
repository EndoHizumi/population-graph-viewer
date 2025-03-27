<template>
    <div :style="{ backgroundColor: bgColor }"
        class="item w-[67px] h-[67px] bg-gray-200 rounded-xl flex flex-col justify-center items-center select-none cursor-pointer hover:opacity-70"
        @click="onClick">
        <img :src="props.imageSrc" :alt="props.name" class="w-[45px] h-[40px]">
        <span>{{ props.name }}</span>
    </div>
</template>

<script setup lang="ts">

import { buttonMap } from '#imports';
const props = defineProps({
    id: { type: Number, required: true },
    name: String,
    imageSrc: String,
});
const emit = defineEmits(['click']);
const bgColor = ref('rgb(229, 231, 235)');
const isClicked = ref(false);

const onClick = () => {
    isClicked.value = !isClicked.value;
    bgColor.value = isClicked.value ? buttonMap[props.id] : 'rgb(229, 231, 235)';
    emit('click', props.id)
}

</script>

