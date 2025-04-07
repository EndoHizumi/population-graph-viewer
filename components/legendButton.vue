<template>
    <div v-if="isValid"
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
    <div v-else
        class="item w-[67px] h-[67px] bg-gray-300 rounded-xl flex flex-col justify-center items-center">
        <span class="text-red-500">エラー</span>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { inject } from 'vue';

interface Prefecture {
  icon: string;
  color: string;
  name: string;
}

interface PrefecturesMap {
  [key: number]: Prefecture;
}

const prefecturesMap = inject<PrefecturesMap>('prefecturesMap', {});
const props = defineProps({
    id: { type: Number, required: true },
    name: { type: String, required: true },
});
const emit = defineEmits(['click']);
const bgColor = ref('rgb(229, 231, 235)');
const isClicked = ref(false);

const isValid = computed(() => {
    return props.id != null &&
           props.name != null &&
           typeof props.id === 'number' &&
           typeof props.name === 'string' &&
           props.name !== '' &&
           prefecturesMap[props.id] != null;
});

const onClick = () => {
    isClicked.value = !isClicked.value;
    bgColor.value = isClicked.value ? prefecturesMap[props.id].color : 'rgb(229, 231, 235)';
    emit('click', { id: props.id, isClicked: isClicked.value });
}

</script>
