<template>
  <div class="h-full flex flex-col min-h-0 relative">
    <div dir="rtl" class="table bg-mainbg_300 text-nowrap rounded-t-2xl">
      <p>نام</p>
      <p class="max-[737px]:hidden">تعداد اسلات</p>
      <p class="max-[930px]:hidden">تاریخ ساخت</p>
      <p class="max-[629px]:hidden">عمل</p>
    </div>
    <div class="overflow-y-auto h-full bg-mainbg_400">
      <Table class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div class="h-full relative">
          <div class="h-full">
            <template v-if="status === 'pending'">
              <!-- Desktop skeletons -->
              <div class="hidden min-[930px]:block">
                <div v-for="_ in 5" :key="`desktop-${_}`" class="table items">
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
              </div>

              <!-- Mobile skeletons -->
              <div class="block min-[930px]:hidden">
                <div v-for="_ in 5" :key="`mobile-${_}`">
                  <USkeleton
                    class="h-16 w-full mb-1"
                    :ui="{ background: 'dark:bg-gray-500' }"
                  />
                </div>
              </div>
            </template>
            <template v-if="status === 'success'">
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
              <div class="flex flex-col">
                <div
                  v-for="(server, i) in servers"
                  :key="server.uuid"
                  class="table items parent min-[630px]:hover:bg-main_orange/5 cursor-pointer relative"
                  @touchstart="handleStart($event)"
                  @touchmove="handleMove($event)"
                  @touchend="handleEnd(server.uuid)"
                >
                  <div
                    class="h-full min-[400px]:max-w-full flex justify-center items-center truncate"
                    @click="serverClicked(server)"
                  >
                    <p>
                      {{ server.name }}
                    </p>
                  </div>
                  <div
                    class="h-full w-full flex justify-center items-center max-[737px]:hidden"
                    @click="serverClicked(server)"
                  >
                    <p>
                      {{ convertEnglishNumberToPersian(server.slots) }}
                    </p>
                  </div>
                  <div
                    class="h-full w-full flex justify-center items-center max-[930px]:hidden"
                    @click="serverClicked(server)"
                  >
                    <p>
                      {{ timeAgo.format(new Date(server.createdAt)) }}
                    </p>
                  </div>

                  <div
                    :class="[
                      activeOptions == server.uuid
                        ? 'max-[629px]:scale-x-1'
                        : 'max-[629px]:scale-x-0',
                      i % 2 === 0
                        ? 'max-[629px]:bg-mainbg_500'
                        : 'max-[629px]:bg-[#272b4d]',
                    ]"
                    class="flex flex-row-reverse max-[629px]:absolute max-[629px]:left-0 max-[629px]:w-full max-[629px]:justify-around transition-transform origin-left"
                  >
                    <img
                      class="cursor-pointer w-10 trashcan px-2 hover:opacity-50"
                      src="/images/trash.png"
                      @click="removeServer(server.name, server.uuid)"
                    />
                    <a
                      class="cursor-pointer w-10 connect px-2 hover:opacity-50"
                      :href="`ts3server://${server.name}`"
                      ><img class="max-w-6" src="/images/connect.svg" />
                    </a>
                    <img
                      class="cursor-pointe w-10 px-2 cam"
                      src="/images/cam.svg"
                      @click="serverClicked(server)"
                    />
                    <!-- <img
                      @click="activeOptions = null"
                      class="pr-4 ml-4 min-[629px]:hidden"
                      src="/images/Arrow - Left.png"
                      alt=""
                    /> -->
                  </div>
                  <!-- <div
                    :class="channelOptions ? 'hidden' : ''"
                    class="w-6 mr-auto min-[629px]:hidden"
                  >
                    <img
                      @click="activeOptions = server.uuid"
                      class="w-full"
                      src="/images/Arrow-Right.png"
                      alt=""
                    />
                  </div> -->
                </div>
              </div>
            </template>
            <template v-if="status === 'error'">
              <main
                class="w-full h-full flex justify-center items-center flex-col gap-5"
              >
                <p>خطایی رخ داد لطفا دوباره امتحان کنید</p>
                <button
                  class="bg-main_green/80 p-4 rounded-xl"
                  @click="getServers()"
                >
                  امتحان مجدد
                </button>
              </main>
            </template>
          </div>
        </div>
      </Table>
    </div>
    <UTooltip
      v-if="limits && servers && servers.length >= limits.value.maxTServers"
      :text="'شما به حداکثر تعداد سرور های خود رسیده اید'"
    >
      <button
        class="flex w-full gap-btn items-center btn-disable justify-center rounded-xl py-3"
        @click.prevent="makeServerTab = true"
        :disabled="true"
      >
        ساخت سرور
        <img src="/images/addon.png" alt="" />
      </button>
    </UTooltip>
    <button
      v-else
      class="flex w-full gap-btn items-center btn justify-center rounded-xl py-3"
      @click.prevent="makeServerTab = true"
    >
      ساخت سرور
      <img src="/images/addon.png" alt="" />
    </button>
    <makeServer
      v-if="makeServerTab"
      :routeSlot="routeSlot"
      @close="getServers(), (makeServerTab = false), (routeSlot = null)"
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
import { limits } from '~/stores/limits';
//responive codes
const activeOptions = ref(null);
let startX = 0;
let deltaX = 0;
const handleStart = (e) => {
  startX = e.touches[0].clientX;
};

const handleMove = (e) => {
  deltaX = e.touches[0].clientX - startX;
};

const handleEnd = (uuid) => {
  if (deltaX > 50) {
    activeOptions.value = uuid;
  } else if (deltaX < -50) {
    activeOptions.value = null;
  }
  deltaX = 0;
};
//

const errors = errorHandle();
const store = apiStore();
const { url } = storeToRefs(store);
const route = useRoute();
const makeServerTab = ref(false);
const ServerDeleteTab = ref(false);
const selectedServer = ref();
const routeSlot = ref(null);
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
} = useLazyFetch(`${url.value}/api/v4/tservers/`, {
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

if (route.query.slot) {
  routeSlot.value = route.query.slot;
  makeServerTab.value = true;
}
</script>
<style scoped>
.table {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr;
  text-align: center;
  justify-items: center;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}
.parent:hover .cam {
  opacity: 0.5;
}
.trashcan:hover ~ .cam {
  opacity: 1;
}
.connect:hover ~ .cam {
  opacity: 1;
}
.operator:nth-child(even) {
  background-color: rgba(39, 43, 77, 1);
}
.operator:nth-child(odd) {
  background-color: rgb(0, 0, 0);
}
@media screen and (width < 930px) {
  .table {
    grid-template-columns: 3fr 1fr 1fr;
  }
}
@media screen and (width < 735px) {
  .table {
    grid-template-columns: 3fr 1fr;
  }
}
@media screen and (width < 629px) {
  .table {
    grid-template-columns: 1fr;
  }
}
</style>
