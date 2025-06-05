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
          <p>{{ selectedServer.name }}</p>
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
            <p v-if="usersCount && selectedServer.mustRunning">
              {{ usersCount }}
            </p>
            <p v-if="usersCount && selectedServer.mustRunning">/</p>
            <p>{{ selectedServer.slots }}</p>
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
        <li v-if="selectedServer.mustRunning" class="grid gridList">
          <p class="">
            {{ selectedServer.deployedOn }}
          </p>
          <p>:موقعیت مکانی</p>
          <button
            class="absolute left-0"
            @click.prevent="serverLocationTab = true"
          >
            <img
              src="/images/change_nickname.svg"
              class="cursor-pointer h-6 w-6"
              alt=""
            />
          </button>
        </li>
        <li class="grid gridList relative">
          <p v-if="!selectedServer.mustRunning" class="text-main_red">خاموش</p>
          <p v-if="selectedServer.mustRunning" class="text-main_green">روشن</p>
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
            <UToggle v-model="serverRunningToggle" />
          </div>
        </li>
        <p
          v-show="selectedServer.mustRunning"
          class="m-3 text-main_orange text-right cursor-pointer font-bold"
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
    @close="getServerDeatails(), (restartServerTab = false)"
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
    @close="yatqaExampleTab = false"
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
const serverRunningToggle = ref(selectedServer.value.mustRunning);
pauseRequests.value = !selectedServer.value.mustRunning;
const tsUrl = ref(`ts3server://${props.serverInfo.name}`);

function getServerDeatails() {
  emit('getServerDeatails');
}
watch(serverRunningToggle, () => {
  emit('resetAlreadyvisited');
  turnServerOffOrOn();
});
async function turnServerOffOrOn() {
  if (selectedServer.value.mustRunning === true) {
    turnOffServerTab.value = true;
  } else {
    const { error } = await useFetch(
      `${url.value}/api/v4/tservers/${selectedServer.value.uuid}/start`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    );
    if (error.value) {
      toast.add({
        title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
        timeout: 2000,
        color: 'red',
      });
    } else pauseRequests.value = false;
    getServerDeatails();
  }
}
</script>
