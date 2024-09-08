<template>
  <section class="list-none w-full h-full text-center relative">
    <h1 class="font-medium my-3">کاربر</h1>
    <img src="/images/seprator-line.png" alt="" />
    <header class="grid text-right user-grid my-4 px-4">
      <p>{{ selectedRow.user.userNickname }}</p>
      <p>:نام</p>
      <p v-if="selectedRow.user.clientPlatform != 'unknown'">
        {{ selectedRow.user.clientPlatform }}
      </p>
      <p v-if="selectedRow.user.clientPlatform != 'unknown'">:پلتفرم</p>
      <p v-if="selectedRow.user.clientVersion != 'unknown'">
        {{ selectedRow.user.clientVersion }}
      </p>
      <p v-if="selectedRow.user.clientVersion != 'unknown'">:ورژن</p>

      <p v-if="selectedRow.user.clientLastconnected != 0">
        {{ calculateUptime(selectedRow.user.clientLastconnected) }}
      </p>
      <p v-if="selectedRow.user.clientLastconnected != 0">:اپتایم</p>
    </header>
    <img src="/images/seprator-line.png" alt="" />
    <main>
      <div class="text-left mt-3 mb-6 px-4">
        <li v-for="servergroup in servergroups">{{ servergroup.name }}</li>
      </div>
    </main>
    <footer class="grid grid-cols-2 absolute w-full bottom-8 gap-3 px-3">
      <button
        v-if="selectedRow.user.clientUniqueIdentifier != 'serveradmin'"
        @click="banUserTab = true"
        class="flex justify-center items-center gap-2 py-2 btn rounded-tl-lg"
      >
        <p>بن از سرور</p>
        <img src="/images/ban_client.png" alt="" />
      </button>
      <button
        v-if="selectedRow.user.clientUniqueIdentifier != 'serveradmin'"
        @click="kickFromServerTab = true"
        class="flex justify-center items-center gap-2 py-2 btn rounded-tr-lg"
      >
        <p>کیک از سرور</p>
        <img src="/images/kick_server.png" alt="" />
      </button>
      <button
        @click="servergroupsTab = true"
        v-if="selectedRow.user.clientUniqueIdentifier != 'serveradmin'"
        class="flex justify-center items-center gap-2 py-2 btn rounded-bl-lg"
      >
        <p>رنک ها</p>
        <img src="/images/ranks.png" alt="" />
      </button>
      <button
        v-if="selectedRow.user.clientUniqueIdentifier != 'serveradmin'"
        @click="kickFromChannelTab = true"
        class="flex justify-center items-center gap-2 py-2 btn rounded-br-lg"
      >
        <p>کیک از چنل</p>
        <img src="/images/kick_channel.png" alt="" />
      </button>
    </footer>
  </section>
  <banFromServer
    :user="selectedRow.user.userNickname"
    :serverInfo="serverInfo"
    @close="banUserTab = false"
    v-if="banUserTab"
  />
  <kickFromChannel
    :user="selectedRow.user.userNickname"
    :serverInfo="serverInfo"
    @close="kickFromChannelTab = false"
    v-if="kickFromChannelTab"
  />
  <kickFromServer
    :user="selectedRow.user.userNickname"
    :serverInfo="serverInfo"
    @close="kickFromServerTab = false"
    v-if="kickFromServerTab"
  />
  <changeServerGroups
    :serverInfo="serverInfo"
    :user="selectedRow.user.userNickname"
    @close="servergroupsTab = false"
    v-if="servergroupsTab"
  />
</template>
<script setup lang="ts">
import banFromServer from "./modules/user/banFromServer.vue";
import kickFromChannel from "./modules/user/kickFromChannel.vue";
import kickFromServer from "./modules/user/kickFromServer.vue";
import changeServerGroups from "./modules/user/changeServerGroups.vue";
import nuxtStorage from "nuxt-storage";

const props = defineProps(["selectedRow", "serverInfo"]);
const serverInfo = props.serverInfo;
const kickFromChannelTab = ref(false);
const kickFromServerTab = ref(false);
const banUserTab = ref(false);
const servergroupsTab = ref(false);
const store = apiStore();
const { url } = storeToRefs(store);
const servergroups = ref();

const persianNumbers: { [key: string]: string } = {
  "0": "۰",
  "1": "۱",
  "2": "۲",
  "3": "۳",
  "4": "۴",
  "5": "۵",
  "6": "۶",
  "7": "۷",
  "8": "۸",
  "9": "۹",
};

function convertEnglishNumberToPersian(number: number) {
  const string = number.toString();
  let persianString = "";
  for (const c of string) {
    persianString += persianNumbers[c];
  }
  return persianString;
}

function secondsToString(seconds: number) {
  const numyears = Math.floor(seconds / 31536000);
  const numdays = Math.floor((seconds % 31536000) / 86400);
  const numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
  const numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
  // const numseconds = Math.floor((((seconds % 31536000) % 86400) % 3600) % 60);

  let string = "\u200F";
  if (numyears) string += convertEnglishNumberToPersian(numyears) + " سال ";
  if (numdays) string += convertEnglishNumberToPersian(numdays) + " روز ";
  if (numhours) string += convertEnglishNumberToPersian(numhours) + " ساعت ";
  if (numminutes)
    string += convertEnglishNumberToPersian(numminutes) + " دقیقه ";
  // if (numseconds) string += convertEnglishNumberToPersian(numseconds) + " ثانیه "

  return string;
}

function calculateUptime(lastConnected: number) {
  const now = Number(Date.now() / 1000);
  const uptime = now - lastConnected;
  return secondsToString(uptime);
}
async function getServerGroups() {
  const response = await $fetch(
    `${url.value}/api/v1/tservers/${props.serverInfo.uuid}/users/${props.selectedRow.user.userNickname}/servergroups`,
    {
      headers: {
        Authorization: `Bearer ${nuxtStorage.localStorage.getData("token")}`,
      },
    },
  );
  servergroups.value = response;
}
await getServerGroups();
</script>
