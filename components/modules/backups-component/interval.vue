<template>
  <section>
    <Table>
      <div class="h-full overflow-y-scroll">
        <div class="table bg-mainbg_300 rounded-t-2xl">
          <p>سرور</p>
          <p>دوره</p>
          <p>عمل</p>
        </div>
        <div class="h-[30rem] overflow-scroll">
          <div v-if="status === 'pending'" v-for="_ in 5" class="table items">
            <USkeleton
                class="h-5 w-40"
                :ui="{ background: 'dark:bg-gray-500' }"
            />
            <USkeleton
                class="h-5 w-20"
                :ui="{ background: 'dark:bg-gray-500' }"
            />
            <USkeleton
                class="h-5 w-10"
                :ui="{ background: 'dark:bg-gray-500' }"
            />
          </div>
          <div
            v-else
            v-for="interval in intervals"
            :key="interval"
            class="table items"
          >
            <p class="font-semibold">{{ interval.tserver.name }}</p>
            <p>{{ interval.interval }}</p>
            <div class="flex gap-4">
              <img
                class="cursor-pointer w-8 h-8"
                src="/images/trash.png"
                @click="deleteInterval(interval.uuid)"
              />
            </div>
          </div>
        </div>
      </div>
      <button
        class="flex w-full items-center justify-center btn rounded-xl mt-auto py-3"
        @click="$emit('opentab')"
      >
        افزودن
        <img src="/images/addon.png" alt="" />
      </button>
    </Table>
  </section>
</template>
<script setup>
import Table from '~/components/reusable/table.vue';

const store = apiStore();
const { url } = storeToRefs(store);


const { status, data: intervals, execute: getIntervals } = await useLazyFetch(`${url.value}/api/v4/snapshots/intervals`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});


async function deleteInterval(uuid) {
  await $fetch(`${url.value}/api/v4/snapshots/intervals/${uuid}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  await getIntervals();
}
</script>
<style scoped>
.table {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
  justify-items: center;
  padding: 1rem;
}
</style>
