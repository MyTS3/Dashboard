<template>
  <section
    class="list-none flex flex-col justify-between w-full h-full text-center relative"
  >
    <div>
      <h1 class="font-medium">کاربر</h1>
      <img class="my-6 w-full" src="/images/seprator-line.png" alt="" />
      <header class="grid text-right user-grid">
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
      <img class="my-6 w-full" src="/images/seprator-line.png" alt="" />
      <main>
        <div class="text-left">
          <li v-for="servergroup in servergroups" :key="servergroup.sgid">
            {{ servergroup.name }}
          </li>
        </div>
      </main>
    </div>
    <div />
    <footer class="grid grid-cols-2 w-full gap-3">
      <UTooltip
        v-if="selectedRow.user.clientUniqueIdentifier != 'serveradmin'"
        class="flex justify-center items-center gap-2 rounded-tl-lg"
        :text="
          banDisable ? 'نمیتوانید شخصی یا رنک سرور کوئری را بن کنید' : 'ban'
        "
      >
        <button
          :class="banDisable ? 'btn-disable' : 'btn'"
          :disabled="banDisable"
          class="w-full h-20 flex justify-center items-center rounded-tl-xl parent"
          @click="banUserTab = true"
        >
          <p>بن از سرور</p>
          <img src="/images/ban_client.png" alt="" />
        </button>
      </UTooltip>
      <button
        v-if="selectedRow.user.clientUniqueIdentifier != 'serveradmin'"
        class="flex h-20 justify-center items-center gap-2 py-2 btn rounded-tr-xl"
        @click="kickFromServerTab = true"
      >
        <p>کیک از سرور</p>
        <img src="/images/kick_server.png" alt="" />
      </button>
      <button
        v-if="selectedRow.user.clientUniqueIdentifier != 'serveradmin'"
        class="flex h-20 justify-center items-center gap-2 py-2 btn rounded-bl-xl"
        @click="servergroupsTab = true"
      >
        <p>رنک ها</p>
        <img src="/images/ranks.png" alt="" />
      </button>
      <UTooltip
        class="flex justify-center items-center gap-2 rounded-tl-lg"
        :text="banDisable ? 'نمیتوانید شخصی را از چنل دیفالت کیک کنید' : 'کیک'"
      >
        <button
          v-if="selectedRow.user.clientUniqueIdentifier != 'serveradmin'"
          :class="selectedRow.user.inDefaultChannel ? 'btn-disable' : 'btn'"
          :disabled="selectedRow.user.inDefaultChannel"
          class="w-full h-20 flex justify-center items-center rounded-br-xl parent"
          @click="kickFromChannelTab = true"
        >
          <p>کیک از چنل</p>
          <img src="/images/kick_channel.png" alt="" />
        </button>
      </UTooltip>
    </footer>
  </section>
  <banFromServer
    v-if="banUserTab"
    :user="selectedRow.user.userNickname"
    :server-info="serverInfo"
    @close="banUserTab = false"
  />
  <kickFromChannel
    v-if="kickFromChannelTab"
    :user="selectedRow.user.userNickname"
    :server-info="serverInfo"
    @close="kickFromChannelTab = false"
  />
  <kickFromServer
    v-if="kickFromServerTab"
    :user="selectedRow.user.userNickname"
    :server-info="serverInfo"
    @close="kickFromServerTab = false"
  />
  <changeServerGroups
    v-if="servergroupsTab"
    :server-info="serverInfo"
    :user="selectedRow.user.userNickname"
    @close="getServerGroups(), (servergroupsTab = false)"
  />
</template>
<script setup lang="ts">
import banFromServer from './modules/user/banFromServer.vue';
import kickFromChannel from './modules/user/kickFromChannel.vue';
import kickFromServer from './modules/user/kickFromServer.vue';
import changeServerGroups from './modules/user/changeServerGroups.vue';

const banDisable = ref(false);
const props = defineProps(['selectedRow', 'serverInfo']);
const serverInfo = props.serverInfo;
const kickFromChannelTab = ref(false);
const kickFromServerTab = ref(false);
const banUserTab = ref(false);
const servergroupsTab = ref(false);
const store = apiStore();
const { url } = storeToRefs(store);
const servergroups = ref();

const persianNumbers: { [key: string]: string } = {
  '0': '۰',
  '1': '۱',
  '2': '۲',
  '3': '۳',
  '4': '۴',
  '5': '۵',
  '6': '۶',
  '7': '۷',
  '8': '۸',
  '9': '۹',
};

function convertEnglishNumberToPersian(number: number) {
  const string = number.toString();
  let persianString = '';
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

  let string = '\u200F';
  if (numyears) string += convertEnglishNumberToPersian(numyears) + ' سال ';
  if (numdays) string += convertEnglishNumberToPersian(numdays) + ' روز ';
  if (numhours) string += convertEnglishNumberToPersian(numhours) + ' ساعت ';
  if (numminutes)
    string += convertEnglishNumberToPersian(numminutes) + ' دقیقه ';
  // if (numseconds) string += convertEnglishNumberToPersian(numseconds) + " ثانیه "

  return string;
}

function calculateUptime(lastConnected: number) {
  const now = Number(Date.now() / 1000);
  const uptime = now - lastConnected;
  return secondsToString(uptime);
}
async function getServerGroups() {
  const response: {
    sgid: number;
    name: string;
    type: number;
    iconid: string;
    sortid: number;
  }[] = await $fetch(
    `${url.value}/api/v4/tservers/${props.serverInfo.uuid}/users/${props.selectedRow.user.userNickname}/servergroups`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
  servergroups.value = response;
  banDisable.value = false;
  response.forEach((re) => {
    if (re.name.includes('Admin Server Query')) banDisable.value = true;
  });
}
await getServerGroups();
</script>
<style scoped>
.parent:hover .child {
  display: block;
}
</style>
