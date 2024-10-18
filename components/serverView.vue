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
      <main class="list-none flex flex-col gap-5">
        <li class="grid gridList">
          <p>{{ selectedServer.name }}</p>
          <p>:نام</p>
          <a class="absolute left-0" :href="tsUrl">
            <img
              class="cursor-pointer w-8"
              src="/images/User info.png"
              alt=""
            />
          </a>
        </li>
        <li class="grid gridList relative">
          <div class="flex gap-1">
            <p v-if="usersCount">{{ usersCount }}</p>
            <p v-if="usersCount">/</p>
            <p>{{ selectedServer.slots }}</p>
          </div>
          <p>:تعداد اسلات</p>
          <button class="absolute left-0" @click="changeSlotTab = true">
            <img src="/images/edit.png" alt="" />
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
            <img src="/images/location.png" alt="" />
          </button>
        </li>
        <li class="grid gridList relative">
          <p v-if="!selectedServer.mustRunning" class="text-main_red">خاموش</p>
          <p v-if="selectedServer.mustRunning" class="text-main_green">روشن</p>
          <p>:وضعیت</p>
          <div class="absolute left-0 top-1/3">
            <input
              id="server-status"
              :checked="selectedServer.mustRunning"
              class="hidden"
              type="checkbox"
              @click.prevent="turnServerOffOrOn()"
            />
            <label class="button" for="server-status" />
          </div>
        </li>
        <p
          class="m-3 text-main_orange text-right cursor-pointer font-bold"
          @click="yatqaExampleTab = true"
        >
          برای مشاهده اطلاعات یاتکا کلیک کنید
        </p>
      </main>
    </span>
    <footer class="grid grid-cols-2 w-full gap-3">
      <button
        class="flex border w-full gap-3 justify-center h-20 items-center rounded-tl-lg btn"
        @click="restartServerTab = true"
      >
        <p>ری استارت</p>
        <img src="/images/restart.png" alt="" />
      </button>
      <button
        class="flex border w-full gap-3 justify-center h-20 items-center rounded-tr-lg btn"
        @click="bansListTab = true"
      >
        <p>لیست بن ها</p>
        <img src="/images/ban_list.png" alt="" />
      </button>
      <button
        class="flex border w-full gap-3 justify-center h-20 items-center rounded-bl-lg btn"
        @click="resetConfigTab = true"
      >
        <p>ریسیت کانفگ</p>
        <img src="/images/ban_list.png" alt="" />
      </button>
      <button
        class="flex border w-full gap-3 justify-center h-20 items-center rounded-br-lg btn"
        @click="subdomainTab = true"
      >
        <p>ساب دامنه ها</p>
        <img src="/images/ban_list.png" alt="" />
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
const emit = defineEmits(['getServerDeatails']);
const store = apiStore();
const { url } = storeToRefs(store);

const selectedServer = ref(props.serverInfo);
const tsUrl = ref(`ts3server://${props.serverInfo.name}`);

function getServerDeatails() {
  emit('getServerDeatails');
}

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
    }
    getServerDeatails();
  }
}
</script>
