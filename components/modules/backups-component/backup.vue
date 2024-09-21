<template>
  <section>
    <Table>
      <div class="h-full">
        <div class="table static bg-mainbg_300 rounded-t-2xl">
          <p>سرور</p>
          <p>تاریخ</p>
          <p>عمل</p>
        </div>
        <div class="h-[30rem] overflow-scroll">
          <div v-for="backup in backups" :key="backup" class="table items">
            <p class="font-semibold">{{ backup.tserver.name }}</p>
            <p>{{ backup.createdAt }}</p>
            <div class="flex gap-4">
              <img
                class="cursor-pointer w-8 h-8"
                src="/images/arrow-up.png"
                alt=""
              />
              <img
                class="cursor-pointer w-8 h-8"
                src="/images/trash.png"
                @click="(deleteDomainTab = true), (selectedDomain = domain)"
              />
            </div>
          </div>
        </div>
      </div>
    </Table>
    <button
      class="flex w-full items-center justify-center btn rounded-xl mt-auto py-3"
      @click.prevent="makeServerTab = true"
    >
      افزودن
      <img src="/images/addon.png" alt="" />
    </button>
  </section>
</template>
<script setup>
import Table from '~/components/reusable/table.vue';

const store = apiStore();
const { url } = storeToRefs(store);

const backups = ref();
async function getBackups() {
  const respone = await $fetch(`${url.value}/api/v4/snapshots`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  backups.value = respone;
  console.log(backups.value);
}
getBackups();
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
