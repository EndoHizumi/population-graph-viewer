<template>
    <div 
        :id="`prefecture-${props.id}`"
        :style="{ backgroundColor: bgColor }"
        class="item w-[67px] h-[67px] bg-gray-200 rounded-xl flex flex-col justify-center items-center select-none cursor-pointer hover:opacity-70"
        role="button"
        tabindex="0"
        @click="onClick"
        @keydown.enter="onClick"
        @keydown.space.prevent="onClick">
        <img :src="prefecturesMap[props.id].icon" :alt="props.name" class="w-[45px] h-[40px]">
        <span>{{ props.name }}</span>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { prefecturesMap } from '~/utils/const';

const props = defineProps({
    id: { type: Number, required: true },
    name: { type: String, required: true },
});
const emit = defineEmits(['click']);
const bgColor = ref('rgb(229, 231, 235)');
const isClicked = ref(false);

const onClick = () => {
    isClicked.value = !isClicked.value;
    bgColor.value = isClicked.value ? prefecturesMap[props.id].color : 'rgb(229, 231, 235)';
    emit('click', { id: props.id, isClicked: isClicked.value });
}

</script>
