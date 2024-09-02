<template>
  <div class="bg-mainbg_400 w-full rounded-xl text-center mr-3">
    <header class="w-full relative my-4 px-4">
      <h1
        class=" p-1 border-2 bg-white/10 rounded-2xl btn
      "
      >
        daniel.v4.myts.ir
      </h1>
      <img class="mt-3" src="/images/seprator-line.png" alt="" />
    </header>
    <main class="list-none teamspeak text-xs px-4">
      <!-- <div>
        <div class="rounded-lg p-1 px-3 hover:bg-main_orange/20">
          <p>Music Channels</p>
        </div>
      </div> -->
      <div v-for="channel in teamspeakserver">
        <div class="flex p-1 px-3 rounded-lg hover:bg-main_orange/20 gap-1">
          <img
            v-if="channel.channelType=='normal'"
            src="/images/channel-icon.png"
            alt=""
          />
          <p :style="{'text-align':channel.align}" class="w-full text-left">
            {{channel.channelName}}
          </p>
        </div>

        <!-- <li
          class="flex pl-6 gap-1 my-1
          p-2 px-3 rounded-lg hover:bg-main_orange/20
        "
        >
          <img src="/images/normal-user.png" alt="" />
          <p>Daniel</p>
        </li> -->
        <!-- ////// -->
        <!-- <li
          class="flex pl-6 gap-1 my-1
          p-2 px-3 rounded-lg hover:bg-main_orange/20
        "
        >
          <img src="/images/bot-icon.png" alt="" />
          <p>RadioJavan</p>
        </li> -->
      </div>
      <!-- <div>
        <div class="flex p-2 px-3 rounded-lg hover:bg-main_orange/20 gap-1">
          <img src="/images/channel-icon.png" alt="" />
          <p>Music Channels 2</p>
        </div>

        <li
          class="flex pl-6 gap-1 my-1
          p-2 px-3 rounded-lg hover:bg-main_orange/20
        "
        >
          <img src="/images/output_muted.png" alt="" />
          <p>toz</p>
        </li>
      </div>
      <div>
        <div class="flex p-2 px-3 rounded-lg hover:bg-main_orange/20 gap-1">
          <img src="/images/channel-icon.png" alt="" />
          <p>Music Channels 3</p>
        </div>

        <li
          class="flex pl-6 gap-1 my-1
          p-2 px-3 rounded-lg hover:bg-main_orange/20
        "
        >
          <img src="/images/input_muted.png" alt="" />
          <p>oblack</p>
        </li>
      </div>
      <div>
        <div class="flex p-2 px-3 rounded-lg hover:bg-main_orange/20 gap-1">
          <img src="/images/channel-icon.png" alt="" />
          <p>Music Channels 4</p>
        </div>

        <li
          class="flex pl-6 gap-1 my-1
          p-2 px-3 rounded-lg hover:bg-main_orange/20 
        "
        >
          <img src="/images/away.png" alt="" />
          <p>fier</p>
        </li>
      </div> -->
    </main>
  </div>
  <div class="bg-mainbg_400 w-full rounded-xl ml-3">
    <server v-if="activeTab=='server' " />
    <user v-if="activeTab=='user' " />
    <channel v-if="activeTab=='channel' " />
    <musicbot v-if="activeTab=='musicbot' " />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import musicbot from '~/components/musicbot.vue';
import { useRoute } from '#app';
import { apiStore } from '#imports';
import { storeToRefs } from '#imports';

//variables
const activeTab = ref("server")
const teamspeakserver  = ref<{channelName: string, align:string, cid: string, channelType: channelType, users: []}[]>([])
const route = useRoute()
const serverUuid = route.params.id
const store = apiStore()
const {url} = storeToRefs(store)
//function

type channelType = "*spacer" | "lspacer" | "cspacer" | "rspacer" | "normal"
function findChannelTypeAndNameByFullName(fullName: string): {type: channelType, name: string, align:string} {
  const splitedName = fullName.split(']')
  if (splitedName.length > 1) {
    if (splitedName[0].startsWith('[')) {
      if (splitedName[0].includes("cspacer")) return {type: "cspacer", name: splitedName[1], align:"center"};
      if (splitedName[0].includes("lspacer")) return {type: "lspacer", name: splitedName[1], align:"start"};
      if (splitedName[0].includes("rspacer")) return {type: "rspacer", name: splitedName[1], align:"end"};
      if (splitedName[0].includes("*spacer")) return {type: "*spacer", name: splitedName[1].repeat(100), align:"center"};
    }
  }
  return {type: "normal", name: fullName, align:'start'}
}

async function getTeamspeakChannels(){
  const response: {channelName: string, cid: string}[] = await $fetch(`${url.value}/api/v1/tservers/${serverUuid}/channels`)
  console.log(response)
  response.forEach((res)=>{
    const channelTypeAndName = findChannelTypeAndNameByFullName(res.channelName)
    const channelType = channelTypeAndName.type
    const channelName = channelTypeAndName.name
    const align = channelTypeAndName.align
    teamspeakserver.value.push({
      channelName,
      cid:res.cid,
      channelType,
      align,
      users:[]
    })
  })

}
await getTeamspeakChannels()
</script>
