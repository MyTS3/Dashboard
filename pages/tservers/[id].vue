<template>
  <section
    class="flex-1 mt-6 w-full mx-auto flex flex-row items-stretch text-white text-center gap-2 min-h-0"
  >
    <div
      class="flex flex-col items-stretch w-1/2 bg-mainbg_400 h-full rounded-xl"
    >
      <header class="relative my-4 px-4">
        <h1
          v-if="serverInfoStatus === 'success' && serverInfo"
          :class="selectedRow?.rowType == 'server' ? 'btn-active' : 'btn '"
          class="h-9 px-1 border-2 bg-white/10 rounded-2xl flex items-center justify-center"
          @click="selectedRow = { rowType: 'server', level: 0 }"
          @contextmenu.prevent="selectedRow = { rowType: 'server', level: 0 }"
        >
          <div>
            {{ serverInfo.name }}
          </div>
        </h1>
        <div v-else>
          <USkeleton
            :ui="{ background: 'dark:bg-gray-500' }"
            class="h-9 px-1 rounded-2xl"
          />
        </div>
        <img class="mt-3 w-full" src="/images/seprator-line.png" alt="" />
      </header>
      <main
        v-if="teamspeakserverStatus === 'success'"
        class="flex items-stretch flex-col teamspeak text-xs px-4 flex-1 overflow-y-auto"
      >
        <template v-for="row in teamspeakserver" :key="objectHash(row)">
          <div
            v-if="row.rowType == 'channel'"
            dropzone="true"
            @drop="dragended(row.channel)"
            @dragover.prevent
            @dragenter.prevent
            class="flex gap-1 py-1 overflow-hidden px-3 rounded-lg min-h-fit"
            :class="
              selectedRow == row ? 'btn-active' : 'hover:bg-main_orange/20'
            "
            @click="selectedRow = row"
            @contextmenu.prevent="selectedRow = row"
            :style="{ 'padding-left': row.level * 1 + 'rem' }"
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
            v-if="row.rowType == 'user'"
            draggable="true"
            @dragstart="draged(row.user)"
            class="flex gap-1 py-1 h-5 overflow-hidden px-3 rounded-lg min-h-fit"
            :class="
              selectedRow == row ? 'btn-active' : 'hover:bg-main_orange/20'
            "
            @click="selectedRow = row"
            @contextmenu.prevent="selectedRow = row"
            :style="{ 'padding-left': row.level * 1 + 'rem' }"
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
        </template>
      </main>
      <main v-else class="h-full px-4 overflow-y-hidden">
        <USkeleton
          v-for="_ in 20"
          :key="_"
          :ui="{ background: 'dark:bg-gray-500' }"
          class="h-6 my-2 px-3 rounded-lg w-full"
        />
      </main>
    </div>
    <div class="bg-mainbg_400 basis-1/2 w-full rounded-xl overflow-y-auto">
      <template v-if="selectedRow?.rowType == 'server'">
        <ServerView
          v-if="serverInfoStatus === 'success'"
          :server-info="serverInfo"
          :server-info-status="() => serverInfoStatus"
          @get-server-deatails="getServerDeatails"
        />
        <ServerViewSkeleton v-else />
      </template>
      <UserView
        v-if="selectedRow?.rowType == 'user'"
        :server-info="serverInfo"
        :selected-row="selectedRow"
      />
      <ChannelView
        v-if="selectedRow?.rowType == 'channel'"
        :selected-channel="selectedRow.channel"
      />
      <!-- <musicbot v-if="selectedRow?.rowType=='musicbot' " /> -->
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from '#app';
import { apiStore, storeToRefs } from '#imports';
import objectHash from 'object-hash';

type alignType = 'start' | 'center' | 'end';
type statusType = 'openMic' | 'micMute' | 'soundMute' | 'away';
type row =
  | { rowType: 'channel'; channel: channel; level: number }
  | { rowType: 'user'; user: user; level: number }
  | { rowType: 'server'; level: 0 };
type channel = {
  channelFullName: string;
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
const route = useRoute();
const serverUuid = route.params.id;
const store = apiStore();
const { url } = storeToRefs(store);
const selectedRow = ref<row>({ rowType: 'server', level: 0 });
const movingUser = ref<string>();
//function
function draged(user: user) {
  movingUser.value = user.userNickname;
}
async function dragended(channel: channel) {
  $fetch(
    `${url.value}/api/v4/tservers/${serverUuid}/users/${movingUser.value}/move`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        channel: channel.channelFullName,
      }),
    },
  ).catch((e) => {
    throw e;
  });
}

type serverInfoType = {
  deployedOn: string;
  mustRunning: boolean;
  name: string;
  queryPassword: string;
  queryPort: number;
  slots: number;
  uuid: string;
  version: string;
};
const {
  data: serverInfo,
  status: serverInfoStatus,
  execute: getServerDeatails,
} = await useLazyFetch<serverInfoType>(
  `${url.value}/api/v4/tservers/${serverUuid}`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
);

type channelType =
  | '*spacer'
  | 'spacer'
  | 'lspacer'
  | 'cspacer'
  | 'rspacer'
  | 'normal';
function findChannelTypeAndNameByFullName(fullName: string): {
  channelFullName: string;
  type: channelType;
  name: string;
  align: alignType;
} {
  const splitedName = fullName.split(']');
  if (splitedName.length > 1) {
    if (splitedName[0].startsWith('[')) {
      if (splitedName[0].includes('cspacer'))
        return {
          type: 'cspacer',
          name: splitedName[1],
          align: 'center',
          channelFullName: fullName,
        };
      if (
        splitedName[0].includes('lspacer') ||
        splitedName[0].includes('spacer')
      )
        return {
          type: 'lspacer',
          name: splitedName[1],
          align: 'start',
          channelFullName: fullName,
        };
      if (splitedName[0].includes('rspacer'))
        return {
          type: 'rspacer',
          name: splitedName[1],
          align: 'end',
          channelFullName: fullName,
        };
      if (splitedName[0].includes('*spacer'))
        return {
          type: '*spacer',
          name: splitedName[1].repeat(25),
          align: 'center',
          channelFullName: fullName,
        };
    }
  }
  return {
    type: 'normal',
    name: fullName,
    align: 'start',
    channelFullName: fullName,
  };
}

const {
  data: teamspeakserver,
  execute: getUsersAndChannels,
  status: teamspeakserverStatus,
} = useLazyAsyncData<row[]>(async () => {
  const channelsReq: Promise<
    {
      channelName: string;
      cid: string;
      pid: string;
    }[]
  > = $fetch(`${url.value}/api/v4/tservers/${serverUuid}/channels`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  const usersReq: Promise<
    {
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
    }[]
  > = $fetch(`${url.value}/api/v4/tservers/${serverUuid}/users`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  const rows: row[] = [];
  const channels = await channelsReq;
  channels.forEach((channel) => {
    const channelTypeAndName = findChannelTypeAndNameByFullName(
      channel.channelName,
    );
    const channelType = channelTypeAndName.type;
    const channelName = channelTypeAndName.name;
    const align = channelTypeAndName.align;
    const channelFullName = channelTypeAndName.channelFullName;

    let level = 0;
    let parentChannel:
      | { cid: string; pid: string; channelName: string }
      | undefined = channel;
    while (parentChannel) {
      level += 1;
      parentChannel = channels.find((c) => {
        if (!parentChannel) return false;
        return c.cid == parentChannel.pid;
      });
    }
    rows.push({
      rowType: 'channel',
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

  const users = await usersReq;
  users.forEach((user) => {
    const channelIndex = rows.findIndex((row) => {
      if (row.rowType != 'channel') return false;
      return row.channel.cid == user.cid;
    });
    let status: statusType = 'openMic';
    if (user.clientInputMuted || !user.clientInputHardware) status = 'micMute';
    if (user.clientOutputMuted || !user.clientOutputHardware)
      status = 'soundMute';
    if (user.clientAway) status = 'away';
    rows.splice(channelIndex + 1, 0, {
      rowType: 'user',
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
  return rows;
});

function longpoll(time = 1) {
  fetch(
    `${url.value}/api/v4/tservers/${serverUuid}/last-server-event-after/${time}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  )
    .then((re) => re.json())
    .then((data) => getUsersAndChannels().then(() => longpoll(data.at)));
}
longpoll();
</script>
