<template>
  <section
    style="max-width: 69rem"
    class="mt-6 grid w-full grid-cols-2 h-[40rem] mx-auto text-white text-center gap-2"
  >
    <div class="bg-mainbg_400 w-full rounded-xl">
      <header class="w-full relative my-4 px-4">
        <h1
          @click="selectedRow = { rowType: 'server', level: 0 }"
          :class="selectedRow?.rowType == 'server' ? 'btn-active' : 'btn '"
          class="p-1 border-2 bg-white/10 rounded-2xl"
        >
          {{ serverInfo.name }}
        </h1>
        <img class="mt-3 w-full" src="/images/seprator-line.png" alt="" />
      </header>
      <main class="list-none teamspeak text-xs px-4">
        <!-- <div>
        <div class="rounded-lg p-1 px-3 hover:bg-main_orange/20">
          <p>Music Channels</p>
        </div>
      </div> -->
        <div v-for="row in teamspeakserver">
          <div
            @click="selectedRow = row"
            class="py-1 max-h-7 overflow-hidden px-3 rounded-lg"
            :class="
              selectedRow == row ? 'btn-active' : 'hover:bg-main_orange/20'
            "
          >
            <div :style="{ 'margin-left': row.level * 1 + 'rem' }">
              <div
                @click=" selectedChannel = row.channel "
                dropzone="true"
                @drop="dragended(row.channel)"
                @dragover.prevent
                @dragenter.prevent
                class="flex gap-1 "
                v-if="row.rowType == 'channel'"
              >
                <img
                  v-if="row.channel.channelType == 'normal'"
                  src="/images/channel-icon.png"
                  alt=""
                />
                <p
                  :style="{ 'text-align': row.channel.align }"
                  class="w-full text-left"
                >
                  {{ row.channel.channelName }}
                </p>
              </div>
              <div
                draggable="true"
                @dragstart="draged(row.user)"
                class="flex gap-1"
                v-if="row.rowType == 'user'"
              >
                <img
                  v-if="row.user.status == 'openMic'"
                  src="/images/normal-user.png"
                  alt=""
                />
                <img
                  v-if="row.user.status == 'micMute'"
                  src="/images/input_muted.png"
                  alt=""
                />
                <img
                  v-if="row.user.status == 'soundMute'"
                  src="/images/output_muted.png"
                  alt=""
                />
                <img
                  v-if="row.user.status == 'away'"
                  src="/images/away.png"
                  alt=""
                />
                <p class="w-full text-left">
                  {{ row.user.userNickname }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    <div class="bg-mainbg_400 w-full rounded-xl">
      <server
        @getServerDeatails="getServerDeatails"
        :serverInfo.value="serverInfo"
        v-if="selectedRow?.rowType == 'server'"
      />
      <user
        :serverInfo.value="serverInfo"
        :selectedRow.value="selectedRow"
        v-if="selectedRow?.rowType == 'user'"
      />
      <channel
        :selectedChannel="selectedChannel"
        v-if="selectedRow?.rowType == 'channel'"
      />
      <!-- <musicbot v-if="selectedRow?.rowType=='musicbot' " /> -->
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref } from "vue";
import musicbot from "~/components/musicbot.vue";
import { useRoute } from "#app";
import { apiStore } from "#imports";
import { storeToRefs } from "#imports";
import nuxtStorage from "nuxt-storage";

//variables
type alignType = "start" | "center" | "end";
type statusType = "openMic" | "micMute" | "soundMute" | "away";
type row =
  | { rowType: "channel"; channel: channel; level: number }
  | { rowType: "user"; user: user; level: number }
  | { rowType: "server"; level: 0 };
type channel = {
  channelFullName:string,
  channelName: string;
  align: alignType;
  cid: string;
  channelType: channelType;
};
type user = {
  userNickname: string;
  status: statusType;
  clientLastconnected: number;
  clientVersion: string;
  clientPlatform: string;
  clientUniqueIdentifier: string;
};
const teamspeakserver = ref<row[]>([]);
const route = useRoute();
const serverUuid = route.params.id;
const store = apiStore();
const { url } = storeToRefs(store);
const serverInfo = ref();
const selectedRow = ref<row>({ rowType: "server", level: 0 });
const movingUser = ref<string>()
const selectedChannel = ref<channel>()
//function
function draged(user:user){
  movingUser.value = user.userNickname
}
async function dragended(channel:channel){
  const respone = await $fetch(`${url.value}/api/v1/tservers/${serverUuid}/users/${movingUser.value}/move`,{
    method:"POST",
    headers: {
      Authorization: `Bearer ${nuxtStorage.localStorage.getData("token")}`,
    },
    body:JSON.stringify({
      "channel":channel.channelFullName
    })
  })
}
async function getServerDeatails() {
  const respone: {
    deployedOn: String;
    mustRunning: boolean;
    name: String;
    queryPassword: String;
    queryPort: Number;
    slots: Number;
    uuid: String;
    version: String;
  } = await $fetch(`${url.value}/api/v1/tservers/${serverUuid}`, {
    headers: {
      Authorization: `Bearer ${nuxtStorage.localStorage.getData("token")}`,
    },
  });
  serverInfo.value = await respone;
}

type channelType = "*spacer" | "lspacer" | "cspacer" | "rspacer" | "normal";
function findChannelTypeAndNameByFullName(fullName: string): {
  channelFullName:string,
  type: channelType;
  name: string;
  align: alignType;
} {
  const splitedName = fullName.split("]");
  if (splitedName.length > 1) {
    if (splitedName[0].startsWith("[")) {
      if (splitedName[0].includes("cspacer"))
        return { type: "cspacer", name: splitedName[1], align: "center", channelFullName: fullName };
      if (splitedName[0].includes("lspacer"))
        return { type: "lspacer", name: splitedName[1], align: "start", channelFullName: fullName };
      if (splitedName[0].includes("rspacer"))
        return { type: "rspacer", name: splitedName[1], align: "end", channelFullName: fullName };
      if (splitedName[0].includes("*spacer"))
        return {
          type: "*spacer",
          name: splitedName[1].repeat(100),
          align: "center",
          channelFullName: fullName
        };
    }
  }
  return { type: "normal", name: fullName, align: "start", channelFullName: fullName };
}

async function getUsersAndChannels(){
  const channelsReq: Promise<{
    channelName: string;
    cid: string;
    pid: string
  }[]> = $fetch(`${url.value}/api/v1/tservers/${serverUuid}/channels`, {
    headers: {
      Authorization: `Bearer ${nuxtStorage.localStorage.getData("token")}`,
    },
  });

  const usersReq: Promise<{
    cid: string;
    clid: string;
    clientInputMuted: boolean;
    clientInputHardware: boolean;
    clientOutputMuted: boolean;
    clientOutputHardware: boolean;
    clientNickname: string;
    clientAway: boolean;
    clientLastconnected: number;
    clientVersion: string;
    clientPlatform: string;
    clientUniqueIdentifier: string;
  }[]> = $fetch(`${url.value}/api/v1/tservers/${serverUuid}/users`, {
    headers: {
      Authorization: `Bearer ${nuxtStorage.localStorage.getData("token")}`,
    },
  });

  const rows: row[] = [];
  const channels = await channelsReq
  channels.forEach((channel) => {
    const channelTypeAndName = findChannelTypeAndNameByFullName(channel.channelName);
    const channelType = channelTypeAndName.type;
    const channelName = channelTypeAndName.name;
    const align = channelTypeAndName.align;
    const channelFullName = channelTypeAndName.channelFullName

    let level = 0;
    let parentChannel:
      | { cid: string; pid: string; channelName: string } | undefined = channel;
    while (parentChannel) {
      level += 1;
      parentChannel = channels.find((c) => {
        if (!parentChannel) return false;
        return c.cid == parentChannel.pid;
      });
    }
    rows.push({
      rowType: "channel",
      channel: {
        channelFullName,
        channelName,
        cid: channel.cid,
        channelType,
        align,
      },
      level,
    });
  });

  const users = await usersReq
  users.forEach((user) => {
    const channelIndex = rows.findIndex((row) => {
      if (row.rowType != "channel") return false;
      return row.channel.cid == user.cid;
    });
    let status: statusType = "openMic";
    if (user.clientInputMuted || !user.clientInputHardware) status = "micMute";
    if (user.clientOutputMuted || !user.clientOutputHardware)
      status = "soundMute";
    if (user.clientAway) status = "away";
    rows.splice(channelIndex + 1, 0, {
      rowType: "user",
      user: {
        userNickname: user.clientNickname,
        status,
        clientLastconnected: user.clientLastconnected,
        clientVersion: user.clientVersion,
        clientPlatform: user.clientPlatform,
        clientUniqueIdentifier: user.clientUniqueIdentifier,
      },
      level: rows[channelIndex].level + 1,
    });
  });
  teamspeakserver.value = rows
}
await getServerDeatails();
if (serverInfo.value.mustRunning) {
  longpoll()
}
function longpoll(time = 1){
  fetch(`${url.value}/api/v1/tservers/${serverInfo.value.uuid}/last-server-event-after/${time}`,{
    headers: {
      Authorization: `Bearer ${nuxtStorage.localStorage.getData("token")}`,
    },
  })
  .then(re => re.json())
  .then(async(data) => {
    await getUsersAndChannels()
    longpoll(data.at)
  })
}
</script>
