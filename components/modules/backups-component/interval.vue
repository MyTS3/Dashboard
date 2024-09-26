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
                @click="(deleteDomainTab = true), (selectedDomain = domain)"
              />
            </div>
          </div>
        </div>
      </div>
      <button
        class="flex w-full items-center justify-center btn rounded-xl mt-auto py-3"
        @click.prevent="makeServerTab = true"
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

const intervals = ref();
async function getIntervals() {
  const respone = await $fetch(`${url.value}/api/v4/snapshots/intervals`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  intervals.value = respone;
}
getIntervals();
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
