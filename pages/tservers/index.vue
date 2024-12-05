<template>
  <div class="min-h-0 flex-1 mb-10 relative">
    <div
      v-if="status == 'error'"
      class="w-full text-center p-5 bg-main_orange rounded-xl"
    >
      <p class="font-bold">
        پنل از دسترس خارج شده و به زودی در دسترس قرار میگیرد
      </p>
    </div>
    <template v-else>
      <div dir="rtl" class="table bg-mainbg_300 text-nowrap rounded-t-2xl">
        <p>نام</p>
        <p>تعداد اسلات</p>
        <p>تاریخ ساخت</p>
        <p>عمل</p>
      </div>

      <Table>
        <div class="h-full relative">
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
                v-if="servers.length < 1"
                class="flex flex-col w-full h-full justify-center gap-4 items-center"
              >
                <img
                  v-if="servers"
                  class="min-w-[15rem] w-[10vw]"
                  src="/images/new/no-server.png"
                  alt=""
                />
                <div class="grid text-center text-[1vw]">
                  <p class="font-bold text-white">هیچ سروری وجود ندارد</p>
                  <p>با کلیک برروی دکمه زیر اولین سرور خودرا بسازید</p>
                </div>
              </div>
              <div class="flex flex-col pb-20">
                <div
                  v-for="server in servers"
                  :key="server.uuid"
                  class="table items hover:bg-main_orange/30 cursor-pointer"
                >
                  <div
                    class="h-full w-full flex justify-center items-center"
                    @click="serverClicked(server)"
                  >
                    <p>
                      {{ server.name }}
                    </p>
                  </div>
                  <div
                    class="h-full w-full flex justify-center items-center"
                    @click="serverClicked(server)"
                  >
                    <p>
                      {{ convertEnglishNumberToPersian(server.slots) }}
                    </p>
                  </div>
                  <div
                    class="h-full w-full flex justify-center items-center"
                    @click="serverClicked(server)"
                  >
                    <p>
                      {{ timeAgo.format(new Date(server.createdAt)) }}
                    </p>
                  </div>

                  <div class="grid grid-cols-2 gap-5">
                    <img
                      class="cursor-pointer w-6"
                      src="/images/trash.png"
                      alt=""
                      @click="removeServer(server.name, server.uuid)"
                    />
                    <a
                      class="cursor-pointer w-6"
                      :href="`ts3server://${server.name}`"
                      ><img src="/images/connect.svg" alt=""
                    /></a>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </Table>
      <button
        class="flex absolute -bottom-16 w-full items-center justify-center btn rounded-xl mt-auto py-3"
        @click.prevent="makeServerTab = true"
      >
        ساخت سرور
        <img src="/images/addon.png" alt="" />
      </button>
    </template>

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
const errors = errorHandle();
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
  error,
  refresh: getServers,
} = await useLazyFetch(`${url.value}/api/v4/tservers/`, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});
if (error.value) {
  errors.handle(error.value.data.code);
}

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
  height: 4rem;
  justify-content: center;
  align-items: center;
}
</style>
