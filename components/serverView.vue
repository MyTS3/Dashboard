<template>
  <section
    class="h-full flex flex-col justify-between relative overflow-y-auto"
  >
    <span>
      <header class="relative">
        <div class="flex justify-between items-center">
          <div />
          <h1 class="text-center">سرور</h1>
          <img
            class="cursor-pointer w-6"
            src="/images/trash.png"
            alt=""
            @click.prevent="deleteServerTab = true"
          />
        </div>

        <img
          class="w-full mx-auto my-6"
          src="/images/seprator-line.png"
          alt=""
        />
      </header>
      <main class="list-none flex flex-col gap-layout">
        <li class="grid gridList">
          <p
            v-if="selectedServer != 'loading'"
            dir="rtl"
            class="max-w-full truncate -pr-10"
          >
            {{ selectedServer.name }}
          </p>
          <USkeleton
            v-else
            class="h-5 w-20"
            :ui="{ background: 'dark:bg-gray-500' }"
          />
          <p>:نام</p>
          <a
            v-show="selectedServer.mustRunning"
            class="absolute left-0"
            :href="tsUrl"
          >
            <img
              class="cursor-pointer h-6 w-6"
              src="/images/connect.svg"
              alt=""
            />
          </a>
        </li>
        <li class="grid gridList relative">
          <div class="flex gap-1">
            <p v-if="usersCount && selectedServer != 'loading'">
              {{ usersCount }}
            </p>
            <p v-if="usersCount && selectedServer != 'loading'">/</p>
            <p>{{ selectedServer.slots }}</p>
            <USkeleton
              v-if="!usersCount || selectedServer == 'loading'"
              class="h-5 w-7"
              :ui="{ background: 'dark:bg-gray-500' }"
            />
          </div>
          <p>:تعداد اسلات</p>
          <button
            v-show="selectedServer.mustRunning"
            class="absolute left-0"
            @click="changeSlotTab = true"
          >
            <img
              src="/images/change_nickname.svg"
              class="cursor-pointer h-6 w-6"
              alt=""
            />
          </button>
        </li>
        <li class="grid gridList">
          <p
            @click="changeIpOrDomain"
            v-if="serverIp"
            class="cursor-pointer select-none"
          >
            {{ serverIp[ipOrDomain] }}
          </p>
          <USkeleton
            v-if="!serverIp"
            class="h-5 w-40"
            :ui="{ background: 'dark:bg-gray-500' }"
          />
          <p>:موقعیت مکانی</p>
          <button disabled class="absolute left-0">
            <img
              v-if="serverIp"
              src="/images/change_nickname.svg"
              class="h-6 w-6 opacity-50"
              alt=""
            />
          </button>
        </li>
        <li class="grid gridList relative">
          <p
            v-if="(selectedServer != 'loading') & !selectedServer.mustRunning"
            class="text-main_red"
          >
            خاموش
          </p>
          <p
            v-if="(selectedServer != 'loading') & selectedServer.mustRunning"
            class="text-main_green"
          >
            روشن
          </p>
          <USkeleton
            v-if="selectedServer == 'loading'"
            class="h-5 w-10"
            :ui="{ background: 'dark:bg-gray-500' }"
          />
          <p>:وضعیت</p>
          <div class="absolute left-0">
            <!-- <input
              id="server-status"
              :checked="selectedServer.mustRunning"
              class="hidden"
              type="checkbox"
              @click.prevent="turnServerOffOrOn()"
            />
            <label class="button" for="server-status" /> -->
            <UToggle
              v-if="selectedServer != 'loading'"
              @change="turnServerOffOrOn"
              :loading="serverRunningSwitch"
              v-model="serverRunningToggle"
            />
          </div>
        </li>
        <p
          v-show="selectedServer.mustRunning"
          class="m-3 text-main_orange text-right cursor-pointer font-bold max-[800px]:hidden"
          @click="yatqaExampleTab = true"
        >
          برای مشاهده اطلاعات یاتکا کلیک کنید
        </p>
      </main>
    </span>
    <footer
      v-show="selectedServer.mustRunning"
      class="grid grid-cols-2 w-full gap-layout"
    >
      <button
        class="flex border w-full gap-btn justify-center h-20 items-center rounded-tl-xl btn"
        @click="(restartServerTab = true), emit('resetAlreadyvisited')"
      >
        <p>ری استارت</p>
        <img src="/images/restart.png" alt="" />
      </button>
      <button
        class="flex border w-full gap-btn justify-center h-20 items-center rounded-tr-xl btn"
        @click="bansListTab = true"
      >
        <p>لیست بن ها</p>
        <img src="/images/ban_list.png" alt="" />
      </button>
      <button
        class="flex border w-full gap-btn justify-center h-20 items-center rounded-bl-xl btn"
        @click="(resetConfigTab = true), emit('resetAlreadyvisited')"
      >
        <p>ریست کانفیگ</p>
        <img class="h-12" src="/images/theme.svg" alt="" />
      </button>
      <button
        class="flex border w-full gap-btn justify-center h-20 items-center rounded-br-xl btn"
        @click="subdomainTab = true"
      >
        <p>ساب دامنه ها</p>
        <img src="/images/weblist.svg" class="h-12" alt="" />
      </button>
    </footer>
  </section>
  <changeSlot
    v-if="changeSlotTab"
    :selected-server="selectedServer"
    @close="getServerDeatails(), (changeSlotTab = false)"
  />

  <moveLocation
    v-if="serverLocationTab"
    :selected-server="selectedServer"
    @close="getServerDeatails(), (serverLocationTab = false)"
  />
  <restartServer
    v-if="restartServerTab"
    :selected-server="selectedServer"
    @close="restartServerTab = false"
    @restart="emit('getServerDeatails')"
  />
  <turnoffServer
    v-if="turnOffServerTab"
    :selected-server="selectedServer"
    @close="getServerDeatails(), (turnOffServerTab = false)"
  />
  <deleteServer
    v-if="deleteServerTab"
    :selected-server="selectedServer"
    @close="deleteServerTab = false"
  />
  <banList
    v-if="bansListTab"
    :selected-server="selectedServer"
    @close="bansListTab = false"
  />
  <resetConfig
    v-if="resetConfigTab"
    :selected-server="selectedServer"
    @close="resetConfigTab = false"
  />
  <yatqaExample
    v-if="yatqaExampleTab"
    :selected-server="selectedServer"
    @close="(yatqaExampleTab = false), emit('getServerDeatails')"
  />
  <subdomains
    v-if="subdomainTab"
    :selected-server="selectedServer"
    @close="subdomainTab = false"
    :serverName="props.serverInfo.name"
  />
</template>
<script setup>
import changeSlot from './modules/server/changeSlot.vue';
import subdomains from './modules/server/subdomainList.vue';
import moveLocation from './modules/server/moveLocation.vue';
import restartServer from './modules/server/restartServer.vue';
import turnoffServer from './modules/server/turnoffServer.vue';
import deleteServer from './modules/server/deleteServer.vue';
import banList from './modules/server/banList.vue';
import resetConfig from './modules/server/resetConfig.vue';
import yatqaExample from './modules/server/yatqaExample.vue';
import { apiStore } from '~/stores/apistore';
import { storeToRefs } from 'pinia';
import { pauseRequests } from '#imports';

const serverRunningSwitch = ref(false);
const deleteServerTab = ref(false);
const changeSlotTab = ref(false);
const turnOffServerTab = ref(false);
const serverLocationTab = ref(false);
const bansListTab = ref(false);
const restartServerTab = ref(false);
const resetConfigTab = ref(false);
const yatqaExampleTab = ref(false);
const subdomainTab = ref(false);
const toast = useToast();
const props = defineProps(['serverInfo', 'usersCount']);
const emit = defineEmits(['getServerDeatails', 'resetAlreadyvisited']);
const store = apiStore();
const { url } = storeToRefs(store);
const selectedServer = ref(props.serverInfo);
const ipOrDomain = ref('hostname');
const params = useRoute().params.id;
watch(props, () => {
  selectedServer.value = props.serverInfo;
  serverRunningToggle.value = selectedServer.value.mustRunning;
});
const serverRunningToggle = ref(selectedServer.value.mustRunning);

pauseRequests.value = !selectedServer.value.mustRunning;
const tsUrl = ref(`ts3server://${props.serverInfo.name}`);

function getServerDeatails() {
  emit('getServerDeatails');
}

async function turnServerOffOrOn() {
  if (selectedServer.value.mustRunning === true) {
    turnOffServerTab.value = true;
  } else {
    pauseRequests.value = true;
    serverRunningSwitch.value = true;
    try {
      await $fetch(
        `${url.value}/api/v4/tservers/${selectedServer.value.uuid}/start`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
    } catch (err) {
      const errorCode = err.data.code ?? '';
      if (errorCode === 'NEED_MORE_BALANCE') {
        toast.add({
          title: 'قبل از هر کاری از بالای صفحه کیف پولتو شارژ کن',
          timeout: 2000,
          color: 'red',
        });
      } else {
        toast.add({
          title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
          timeout: 2000,
          color: 'red',
        });
      }
    }
    pauseRequests.value = false;
    serverRunningSwitch.value = false;
    getServerDeatails();
  }
}

//
let changeIpOrDomainstep = 0;
let step = 1;
function changeIpOrDomain() {
  changeIpOrDomainstep += step;
  if (changeIpOrDomainstep == 3) {
    ipOrDomain.value = 'ipv4';
    step = -1;
  }
  if (changeIpOrDomainstep == 0) {
    ipOrDomain.value = 'hostname';
    step = 1;
  }
}

const { data: serverIp } = useFetch(
  `${url.value}/api/v4/tservers/${params}/location`,
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
);
</script>
