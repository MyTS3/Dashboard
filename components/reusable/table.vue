<template>
  <section dir="rtl" class="w-full h-full flex flex-col">
    <main
      ref="table"
      class="w-full h-full flex flex-col bg-mainbg_500 rounded-2xl rounded-t-none"
    >
      <slot />
    </main>
  </section>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useInfiniteScroll } from '@vueuse/core';
const table = ref(null);
const emits = defineEmits(['nextPage']);
const props = defineProps(['items']);
onMounted(() => {
  if (!table.value) return;

  useInfiniteScroll(
    table,
    async () => {
      emits('nextPage');
      console.log('end');
    },
    {
      distance: 10,
      canLoadMore: () => props.items?.length == 20,
    },
  );
});
</script>
