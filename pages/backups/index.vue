<template>
  <section style="max-width: 69rem" class="w-full h-full mx-auto">
    <div class="max-w-[40rem] my-4 ml-auto grid grid-cols-2 self-start">
      <button
        :class="activeTab == 'interval' ? 'btn-active' : ''"
        class="rounded-l-xl p-4 bg-mainbg_400"
        @click="activeTab = 'interval'"
      >
        دوره ها
      </button>
      <button
        :class="activeTab == 'backup' ? 'btn-active' : ''"
        class="rounded-r-xl p-4 bg-mainbg_400"
        @click="activeTab = 'backup'"
      >
        بکاپ ها
      </button>
    </div>
    <interval v-if="activeTab == 'interval'" />
    <backup v-if="activeTab == 'backup'" />
    <add-backup v-if="addBackupTab" @close="addBackupTab = false" />
  </section>
</template>
<script setup>
import interval from '~/components/modules/backups-component/interval.vue';
import backup from '~/components/modules/backups-component/backup.vue';
import addBackup from '~/components/modules/backups-component/addBackup.vue';
const activeTab = ref('interval');
const addBackupTab = ref(true);
</script>
