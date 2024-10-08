<template>
  <div class="h-full">
    <div
      v-if="status == 'error'"
      class="w-full text-center p-5 bg-main_orange rounded-xl"
    >
      <p class="font-bold">
        پنل از دسترس خارج شده و به زودی در دسترس قرار میگیرد
      </p>
    </div>
    <Table v-else class="flex">
      <div class="h-full overflow-scroll">
        <div class="table bg-mainbg_300 rounded-t-2xl">
          <p>نام</p>
          <p>تعداد اسلات</p>
          <p>تاریخ ساخت</p>
          <p>عمل</p>
        </div>
        <div class="h-full overflow-scroll">
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
            <div class="h-1 flex flex-col">
              <div
                v-for="server in servers"
                :key="server.uuid"
                class="table items"
              >
                <p class="cursor-pointer" @click="serverClicked(server)">
                  {{ server.name }}
                </p>
                <p>{{ convertEnglishNumberToPersian(server.slots) }}</p>
                <p>{{ timeAgo.format(new Date(server.createdAt)) }}</p>
                <img
                  class="cursor-pointer"
                  src="/images/trash.png"
                  alt=""
                  @click="removeServer(server.name, server.uuid)"
                />
              </div>
            </div>
          </template>
        </div>
      </div>
      <button
        class="flex w-full items-center justify-center btn rounded-xl mt-auto py-3"
        @click.prevent="makeServerTab = true"
      >
        ساخت سرور
        <img src="/images/addon.png" alt="" />
      </button>
    </Table>
    <makeServer
      v-if="makeServerTab"
      :selected-server="selectedServer"
      @close="getServers(), (makeServerTab = false)"
    />
    <DeleteServer
      v-if="ServerDeleteTab"
      :selected-server="selectedServer"
      @close="getServers(), (ServerDeleteTab = false)"
    />
  </div>
</template>
<script setup>
import TimeAgo from 'javascript-time-ago';

import Table from '~/components/reusable/table.vue';
import makeServer from '/components/modules/makeServer.vue';
import { apiStore } from '~/stores/apistore';
import { storeToRefs } from 'pinia';
import DeleteServer from '~/components/modules/server/deleteServer.vue';

const store = apiStore();
const { url } = storeToRefs(store);
const makeServerTab = ref(false);

const ServerDeleteTab = ref(false);
const selectedServer = ref();
const router = useRouter();

const timeAgo = new TimeAgo('fa');

const persianNumbers = {
  0: '۰',
  1: '۱',
  2: '۲',
  3: '۳',
  4: '۴',
  5: '۵',
  6: '۶',
  7: '۷',
  8: '۸',
  9: '۹',
};

function convertEnglishNumberToPersian(number) {
  const string = number.toString();
  let persianString = '';
  for (const c of string) {
    persianString += persianNumbers[c];
  }
  return persianString;
}

const {
  status: status,
  data: servers,
  refresh: getServers,
} = await useLazyFetch(`${url.value}/api/v4/tservers/`, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

function removeServer(name, uuid) {
  ServerDeleteTab.value = true;
  selectedServer.value = { name: name, uuid: uuid };
}
function serverClicked(server) {
  router.push(`/tservers/${server.uuid}`);
}
///////////////////////////calling functions
</script>
<style scoped>
.table {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr;
  text-align: center;
  justify-items: center;
  padding: 1rem;
}
</style>
