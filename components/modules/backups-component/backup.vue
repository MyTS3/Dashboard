<template>
  <section class="min-h-0 flex-1 mb-28">
    <div dir="rtl" class="table bg-mainbg_300 rounded-t-2xl">
      <p>سرور</p>
      <p>تاریخ</p>
      <p>عمل</p>
    </div>
    <Table>
      <div class="h-full">
        <div class="h-full">
          <template v-if="status !== 'success'">
            <div v-for="_ in 5" :key="_" class="table items">
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
          <template v-else>
            <div
              v-if="backups.length < 1"
              class="flex flex-col w-full h-full justify-center gap-4 items-center"
            >
              <img
                class="min-w-[15rem] w-[10vw]"
                src="/images/new/no-server.png"
                alt=""
              />
              <div class="grid text-center text-[1vw]">
                <p class="font-bold text-white">هیچ بکاپی وجود ندارد</p>
                <p>با کلیک برروی دکمه زیر اولین بکاپ خودرا بسازید</p>
              </div>
            </div>
            <div>
              <div v-for="backup in backups" :key="backup" class="table items">
                <p class="font-semibold">{{ backup.tserver.name }}</p>
                <p>{{ backup.createdAt }}</p>
                <div class="flex gap-4">
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

const {
  data: backups,
  status,
  execute: getBackups,
} = await useLazyFetch(`${url.value}/api/v4/snapshots`, {
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
