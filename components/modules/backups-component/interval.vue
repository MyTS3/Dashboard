<template>
  <section class="h-full flex flex-col min-h-0 relative">
    <div dir="rtl" class="table bg-mainbg_300 rounded-t-2xl">
      <p>سرور</p>
      <p>دوره</p>
      <p>عمل</p>
    </div>
    <div class="overflow-y-auto h-full bg-mainbg_400">
      <Table class="flex-1 min-h-0 overflow-y-auto">
        <div class="h-full">
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
              v-if="intervals.length < 1"
              class="flex flex-col w-full h-full justify-center gap-4 items-center"
            >
              <img
                class="min-w-[15rem] w-[10vw]"
                src="/images/new/no-backup.png"
                alt=""
              />
              <div class="grid text-center text-[1vw]">
                <p class="font-bold text-white">هیچ دوره وجود ندارد</p>
                <p>با کلیک برروی دکمه زیر اولین دوره خودرا بسازید</p>
              </div>
            </div>
            <div>
              <div
                v-for="interval in intervals"
                :key="interval"
                class="table items"
              >
                <p dir="ltr" class="font-semibold truncate w-full">
                  {{ interval.tserver.name }}
                </p>
                <p>{{ interval.interval }}</p>
                <div class="flex">
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
            </div>
          </template>
        </div>
      </Table>
    </div>
    <button
      class="flex w-full gap-btn items-center justify-center btn rounded-xl py-3"
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
