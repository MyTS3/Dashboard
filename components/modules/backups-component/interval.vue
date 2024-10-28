<template>
  <section class="min-h-0 flex-1 mb-28">
    <div class="table bg-mainbg_300 rounded-t-2xl">
      <p>سرور</p>
      <p>دوره</p>
      <p>عمل</p>
    </div>
    <Table>
      <div>
        <div>
          <template v-if="status !== 'success'">
            <div v-for="_ in 5" :key="_" class="table items">
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
          </template>
          <template v-else>
            <div
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
                  @click="
                    (selectedInterval = interval.uuid),
                      (delteIntervalTab = true)
                  "
                />
              </div>
            </div>
          </template>
        </div>
      </div>
    </Table>
    <button
      class="flex w-full items-center justify-center btn rounded-xl mt-auto py-3"
      @click="$emit('opentab')"
    >
      افزودن
      <img src="/images/addon.png" alt="" />
    </button>
    <DeleteInterval
      v-if="delteIntervalTab"
      :selected-interval="selectedInterval"
      @close="(delteIntervalTab = false), getIntervals()"
    />
  </section>
</template>
<script setup>
import Table from '~/components/reusable/table.vue';
import DeleteInterval from './deleteInterval.vue';

const store = apiStore();
const { url } = storeToRefs(store);
const selectedInterval = ref();
const delteIntervalTab = ref(false);

const {
  status,
  data: intervals,
  execute: getIntervals,
} = await useLazyFetch(`${url.value}/api/v4/snapshots/intervals`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});
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
