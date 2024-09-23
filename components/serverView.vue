<template>
  <section class="h-full relative">
    <header class="relative">
      <h1 class="text-center my-4">سرور</h1>
      <div class="absolute right-4 top-0 flex gap-2">
        <img
          class="cursor-pointer w-6"
          src="/images/trash.png"
          alt=""
          @click.prevent="deleteServerTab = true"
        />
      </div>

      <img
        class="w-ful mx-auto mt-6 mb-3"
        src="/images/seprator-line.png"
        alt=""
      />
    </header>
    <main class="list-none">
      <li class="grid gridList p-2">
        <p>{{ selectedServer.name }}</p>
        <p>:نام</p>
        <a class="absolute left-4" :href="tsUrl">
          <img class="cursor-pointer w-8" src="/images/User info.png" alt="" />
        </a>
      </li>
      <li class="grid gridList p-2 relative">
        <p>{{ selectedServer.slots }}</p>
        <p>:تعداد اسلات</p>
        <button class="absolute left-4" @click="changeSlotTab = true">
          <img src="/images/edit.png" alt="" />
        </button>
      </li>
      <li class="grid gridList p-2 relative">
        <p :style="{ '-webkit-text-security': showYatqaPass }">
          {{ selectedServer.queryPassword }}
        </p>
        <p>:رمز یاتکا</p>
        <div class="absolute left-4">
          <button @click.prevent="yatqaPassReset = true">
            <img src="/images/edit.png" alt="" />
          </button>
          <button v-if="showYatqaPass == 'none'" @click="copyYatqaPass()">
            <img src="/images/copy.png" alt="" />
          </button>
          <button
            v-if="showYatqaPass == 'disc'"
            @click.prevent="showYatqaPass = 'none'"
          >
            <img src="/images/hide.png" alt="" />
          </button>
        </div>
      </li>
      <li class="grid gridList p-2">
        <p>
          {{ selectedServer.queryPort }}
        </p>
        <p>پورت</p>
      </li>
      <li class="grid gridList p-2">
        <p class="w-2/3 text-nowrap overflow-hidden mx-auto">
          {{ selectedServer.uuid }}
        </p>
        <p>آیدی</p>
      </li>
      <li v-if="selectedServer.mustRunning" class="grid gridList p-2 relative">
        <p class="w-2/3 text-nowrap overflow-hidden mx-auto">
          {{ selectedServer.deployedOn }}
        </p>
        <p>:موقعیت مکانی</p>
        <button
          class="absolute left-4"
          @click.prevent="serverLocationTab = true"
        >
          <img src="/images/location.png" alt="" />
        </button>
      </li>
      <li class="grid gridList p-2 relative">
        <p v-if="!selectedServer.mustRunning" class="text-main_red">خاموش</p>
        <p v-if="selectedServer.mustRunning" class="text-main_green">روشن</p>
        <p>:وضعیت</p>
        <div class="absolute left-4 top-1/3">
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
        برای مشاهده مثال یاتکا کلیک کنید
      </p>
    </main>
    <footer class="grid grid-cols-2 gap-5 w-full absolute bottom-10 p-4">
      <button
        class="flex border w-full gap-3 justify-center h-20 items-center rounded-l-xl btn"
        @click="restartServerTab = true"
      >
        <p>ری استارت</p>
        <img src="/images/restart.png" alt="" />
      </button>
      <button
        class="flex border w-full gap-3 justify-center h-20 items-center rounded-r-xl btn"
        @click="bansListTab = true"
      >
        <p>لیست بن ها</p>
        <img src="/images/ban_list.png" alt="" />
      </button>
      <button
        class="flex border w-full gap-3 justify-center h-20 items-center rounded-l-xl btn"
        @click="resetConfigTab = true"
      >
        <p>ریسیت کانفگ</p>
        <img src="/images/ban_list.png" alt="" />
      </button>
      <button
        class="flex border w-full gap-3 justify-center h-20 items-center rounded-r-xl btn"
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
  <subdomains v-if="subdomainTab" @close="subdomainTab = false" />
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

const props = defineProps(['serverInfo']);
const emit = defineEmits(['getServerDeatails']);
const store = apiStore();
const { url } = storeToRefs(store);

const selectedServer = ref(props.serverInfo);
const tsUrl = ref(`ts3server://${props.serverInfo.name}`);

function getServerDeatails() {
  emit('getServerDeatails');
}

function copyYatqaPass() {
  navigator.clipboard.writeText(selectedServer.value.queryPassword);
}

async function turnServerOffOrOn() {
  if (selectedServer.value.mustRunning === true) {
    turnOffServerTab.value = true;
  } else {
    await $fetch(
      `${url.value}/api/v4/tservers/${selectedServer.value.uuid}/start`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    );
    getServerDeatails();
  }
}
</script>
