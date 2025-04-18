<template>
  <section class="min-h-0 flex-1 mb-16 relative">
    <div dir="rtl" class="table bg-mainbg_300 rounded-t-2xl">
      <p>سرور</p>
      <p>تاریخ</p>
      <p>عمل</p>
    </div>
    <Table :items="backups" @next-page="end()">
      <div class="h-full">
        <div class="h-full">
          <div
            v-if="!isLoading && backups.length < 1"
            class="flex flex-col w-full h-full justify-center gap-layout items-center"
          >
            <img
              class="min-w-[15rem] w-[10vw]"
              src="/images/new/no-backup.png"
              alt=""
            />
            <div class="grid text-center text-[1vw]">
              <p class="font-bold text-white">هیچ بکاپی وجود ندارد</p>
              <p>با کلیک برروی دکمه زیر اولین بکاپ خودرا بسازید</p>
            </div>
          </div>
          <div class="">
            <div v-for="backup in backups" :key="backup" class="table items">
              <p class="font-semibold">{{ backup.tserver.name }}</p>
              <p>{{ backup.createdAt }}</p>
              <div class="flex gap-layout">
                <UTooltip text="اعمال بکاپ">
                  <img
                    class="cursor-pointer w-8 h-8"
                    src="/images/arrow-up.png"
                    alt=""
                    @click="
                      (deployBackupTab = true), (selecteduuid = backup.uuid)
                    "
                  />
                </UTooltip>
                <UTooltip text="حذف بکاپ">
                  <img
                    class="cursor-pointer w-8 h-8"
                    src="/images/trash.png"
                    @click="
                      (deleteBackupTab = true), (selecteduuid = backup.uuid)
                    "
                  />
                </UTooltip>
              </div>
            </div>
          </div>
          <template v-if="isLoading">
            <div v-for="_ in 20" :key="_" class="table items">
              <USkeleton
                class="h-5 w-40"
                :ui="{ background: 'dark:bg-gray-500' }"
              />
              <USkeleton
                class="h-5 w-40"
                :ui="{ background: 'dark:bg-gray-500' }"
              />
              <USkeleton
                class="h-5 w-10"
                :ui="{ background: 'dark:bg-gray-500' }"
              />
            </div>
          </template>
        </div>
      </div>
    </Table>
    <button
      class="flex absolute -bottom-16 w-full gap-btn items-center justify-center btn rounded-xl mt-auto py-3"
      @click="$emit('opentab')"
    >
      افزودن
      <img src="/images/addon.png" alt="" />
    </button>

    <DeleteBackups
      v-if="deleteBackupTab"
      :selecteduuid="selecteduuid"
      @close="(deleteBackupTab = false), getBackups()"
    />
    <restoreBackup
      v-if="deployBackupTab"
      :selecteduuid="selecteduuid"
      @close="deployBackupTab = false"
    />
  </section>
</template>
<script setup>
import DeleteBackups from './deleteBackups.vue';
import restoreBackup from './restoreBackup.vue';
import Table from '~/components/reusable/table.vue';

const store = apiStore();
const { url } = storeToRefs(store);

const deleteBackupTab = ref(false);
const selecteduuid = ref();
const deployBackupTab = ref(false);
const backups = ref([]);
const isLoading = ref(false);
let page = 0;
function end() {
  if (!isLoading.value) getPages();
}
async function getPages() {
  isLoading.value = true;
  const data = await $fetch(
    `${url.value}/api/v4/snapshots?page=${page}&pageSize=20`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
  data.forEach((d) => backups.value.push(d));
  page += 1;
  isLoading.value = false;
}
getPages();
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
