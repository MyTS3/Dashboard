<template>
  <div class="bg-mainbg_400 w-full rounded-xl text-center mr-3">
    <header class="w-full relative my-4 px-4">
      <h1
        @click="selectedRow = {rowType:'server', server:{name:serverInfo.name}}"
        :class=" selectedRow?.rowType == 'server' ?'btn-active':'btn '  "
        class="p-1 border-2 bg-white/10 rounded-2xl "
      >
        {{serverInfo.name}}
      </h1>
      <img class="mt-3" src="/images/seprator-line.png" alt="" />
    </header>
    <main class="list-none teamspeak text-xs px-4 ">
      <!-- <div>
        <div class="rounded-lg p-1 px-3 hover:bg-main_orange/20">
          <p>Music Channels</p>
        </div>
      </div> -->
      <div v-for="row in teamspeakserver">
        <div
          @click="selectedRow = row"
          class=" p-1 max-h-6 overflow-hidden px-3 rounded-lg "
          :class=" selectedRow == row?'btn-active':'hover:bg-main_orange/20' "
        >
          <div :style="{'margin-left': row.level * 1 + 'rem'}">
            <div class="flex gap-1" v-if="row.rowType == 'channel'">
              <img
                v-if="row.channel.channelType=='normal'"
                src="/images/channel-icon.png"
                alt=""
              />
              <p
                :style="{'text-align': row.channel.align}"
                class="w-full text-left"
              >
                {{row.channel.channelName}}
              </p>
            </div>
            <div class="flex gap-1" v-if="row.rowType == 'user'">
              <img
                v-if="row.user.status=='openMic'"
                src="/images/normal-user.png"
                alt=""
              />
              <img
                v-if="row.user.status=='micMute'"
                src="/images/input_muted.png"
                alt=""
              />
              <img
                v-if="row.user.status=='soundMute'"
                src="/images/output_muted.png"
                alt=""
              />
              <img
                v-if="row.user.status=='away'"
                src="/images/away.png"
                alt=""
              />
              <p class="w-full text-left">
                {{row.user.userNickname}}
              </p>
            </div>
          </div>
        </div>

        <!-- <li
          class="flex pl-6 gap-1 my-1
          p-2 px-3 rounded-lg hover:bg-main_orange/20
        "
        >
          <img src="/images/normal-user.png" alt="" />
          <p ></p>
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
    <server
      @getServerDeatails="getServerDeatails"
      :serverInfo.value="serverInfo"
      v-if="selectedRow?.rowType=='server' "
    />
    <user v-if="selectedRow?.rowType=='user' " />
    <channel v-if="selectedRow?.rowType=='channel' " />
    <!-- <musicbot v-if="selectedRow?.rowType=='musicbot' " /> -->
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import musicbot from '~/components/musicbot.vue';
import { useRoute } from '#app';
import { apiStore } from '#imports';
import { storeToRefs } from '#imports';

//variables
type alignType = 'start' | 'center' | 'end'
type statusType = 'openMic' | 'micMute' | 'soundMute' | 'away'
type row = {rowType: 'channel', channel: channel, level: number} | {rowType: 'user', user: user, level: number} | {rowType: 'server', server: server}
type channel = {channelName: string, align: alignType, cid: string, channelType: channelType}
type user = {userNickname: string, status: statusType}
type server = {name:string}
const teamspeakserver = ref<row[]>([])
const route = useRoute()
const serverUuid = route.params.id
const store = apiStore()
const {url} = storeToRefs(store)
const serverInfo = ref()
const selectedRow = ref<row>()
//function
async function getServerDeatails(){
  const respone:{
    deployedOn: String,
    mustRunning: boolean,
    name:String,
    queryPassword:String,
    queryPort:Number,
    slots:Number,
    uuid:String,
    version:String
   } = await $fetch(`${url.value}/api/v1/tservers/${serverUuid}`)
  serverInfo.value = await respone
}

type channelType = "*spacer" | "lspacer" | "cspacer" | "rspacer" | "normal"
function findChannelTypeAndNameByFullName(fullName: string): {type: channelType, name: string, align: alignType} {
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
  const response: {channelName: string, cid: string, pid: string}[] = await $fetch(`${url.value}/api/v1/tservers/${serverUuid}/channels`)
  response.forEach((channel)=>{
    const channelTypeAndName = findChannelTypeAndNameByFullName(channel.channelName)
    const channelType = channelTypeAndName.type
    const channelName = channelTypeAndName.name
    const align = channelTypeAndName.align

    let level = 0
    let parentChannel: {cid: string, pid: string, channelName: string} | undefined = channel
    while (parentChannel) {
      level+=1
      parentChannel = response.find(c => {
        if (!parentChannel) return false
        return c.cid == parentChannel.pid
      })
    }
    teamspeakserver.value.push({rowType: 'channel', channel: {
      channelName,
      cid:channel.cid,
      channelType,
      align,
    }, level})
  })

}
async function getTeamspeakUsers(){
  const users: {
    cid: string,
    clid: string,
    clientInputMuted: boolean,
    clientInputHardware: boolean,
    clientOutputMuted: boolean,
    clientOutputHardware: boolean,
    clientNickname: string,
    clientAway: boolean
  }[] = await $fetch(`${url.value}/api/v1/tservers/${serverUuid}/users`)
  users.forEach(user => {
    const channelIndex = teamspeakserver.value.findIndex(row => {
      if (row.rowType != 'channel') return false
      return row.channel.cid == user.cid
    })
    let status: statusType = 'openMic'
    if (user.clientInputMuted || !user.clientInputHardware) status = 'micMute'
    if (user.clientOutputMuted || !user.clientOutputHardware) status = 'soundMute'
    if (user.clientAway) status = 'away'
    teamspeakserver.value.splice(channelIndex+1, 0, {rowType: 'user', user: {userNickname: user.clientNickname, status}, level: teamspeakserver.value[channelIndex].level+1})
  })
}
await getServerDeatails()
if(serverInfo.value.mustRunning){
  await getTeamspeakChannels()
  await getTeamspeakUsers()
}
</script>
