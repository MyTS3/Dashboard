<template>
  <section class="list-none w-full h-full text-center relative">
    <h1 class="font-medium my-3">کاربر</h1>
    <img src="/images/seprator-line.png" alt="" />
    <header class="grid  text-right user-grid my-4 px-4">
      <p>{{selectedRow.user.userNickname}}</p>
      <p>:نام</p>
      <p v-if="selectedRow.user.clientPlatform != 'unknown'">
        {{selectedRow.user.clientPlatform}}
      </p>
      <p v-if="selectedRow.user.clientPlatform != 'unknown'">:پلتفرم</p>
      <p v-if="selectedRow.user.clientVersion != 'unknown'">
        {{selectedRow.user.clientVersion}}
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
        <p>ServerGroups:</p>
        <li>-Configure</li>
        <li>Admin Server Query</li>
        <li>-Manager</li>
      </div>
      <div class="px-4 text-left ">
        <p>Channel Groups:</p>
        <li>-Guest</li>
      </div>
    </main>
    <footer class="grid grid-cols-2 absolute w-full bottom-8 gap-3 px-3">
      <button
        class="flex justify-center items-center gap-2 py-2 btn rounded-tl-lg"
      >
        <p>بن از سرور</p>
        <img src="/images/ban_client.png" alt="" />
      </button>
      <button
        class="flex justify-center items-center gap-2 py-2 btn rounded-tr-lg"
      >
        <p>کیک از سرور</p>
        <img src="/images/kick_server.png" alt="" />
      </button>
      <button
        class="flex justify-center items-center gap-2 py-2 btn rounded-bl-lg"
      >
        <p>رنک ها</p>
        <img src="/images/ranks.png" alt="" />
      </button>
      <button
        class="flex justify-center items-center gap-2 py-2 btn rounded-br-lg"
      >
        <p>کیک از چنل</p>
        <img src="/images/kick_channel.png" alt="" />
      </button>
    </footer>
  </section>
  <banFromServer class="hidden" />
  <kickFromChannel class="hidden" />
  <kickFromServer class="hidden" />
  <changeServerGroups class="hidden" />
</template>
<script setup>
import banFromServer from './modules/user/banFromServer.vue'
import kickFromChannel from './modules/user/kickFromChannel.vue'
import kickFromServer from './modules/user/kickFromServer.vue'
import changeServerGroups from './modules/user/changeServerGroups.vue'

const props = defineProps(["selectedRow"])

const persianNumbers = {
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
}

function convertEnglishNumberToPersian(number) {
  const string = number.toString()
  let persianString = ''
  for (const c of string) {
    persianString += persianNumbers[c]
  }
  return persianString
}


function secondsToString(seconds){
  const numyears = Math.floor(seconds / 31536000);
  const numdays = Math.floor((seconds % 31536000) / 86400);
  const numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
  const numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
  // const numseconds = Math.floor((((seconds % 31536000) % 86400) % 3600) % 60);

  let string = '\u200F'
  if (numyears) string += convertEnglishNumberToPersian(numyears) + " سال "
  if (numdays) string += convertEnglishNumberToPersian(numdays) + " روز "
  if (numhours) string += convertEnglishNumberToPersian(numhours) + " ساعت "
  if (numminutes) string += convertEnglishNumberToPersian(numminutes) + " دقیقه "
  // if (numseconds) string += convertEnglishNumberToPersian(numseconds) + " ثانیه "

  return string
}

function calculateUptime(lastConnected){
  const now = Number(Date.now()/1000)
  const uptime = now - lastConnected
  return secondsToString(uptime)
}
</script>
