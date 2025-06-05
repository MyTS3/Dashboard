<template>
  <section
    class="flex-1 w-full h-full mx-auto flex flex-row items-stretch text-white text-center gap-layout min-h-0"
  >
    <div
      class="flex flex-col items-stretch w-1/2 bg-mainbg_400 h-full rounded-xl font-sans overflow-y-auto"
    >
      <header class="relative my-4 px-4">
        <span
          v-if="serverInfoStatus === 'success' && serverInfo"
          :class="selectedRow?.rowType == 'server' ? 'btn-active' : 'btn '"
          class="h-9 px-1 border-2 bg-white/10 rounded-2xl flex items-center justify-center cursor-pointer"
          @click="selectedRow = { rowType: 'server', level: 0 }"
          @contextmenu.prevent="selectedRow = { rowType: 'server', level: 0 }"
        >
          {{ serverInfo.name }}
        </span>
        <div v-else>
          <USkeleton
            :ui="{ background: 'dark:bg-gray-500' }"
            class="h-9 px-1 rounded-2xl"
          />
        </div>
        <img class="mt-3 w-full" src="/images/seprator-line.png" alt="" />
      </header>
      <main
        v-if="teamspeakserverStatus === 'success' && serverInfo?.mustRunning"
        id="scrollbale"
        ref="el"
        class="flex items-stretch flex-col teamspeak text-xs px-4 flex-1 overflow-y-auto"
      >
        <template v-for="row in teamspeakserver" :key="objectHash(row)">
          <div
            v-if="row.rowType == 'channel'"
            ref="therow"
            dropzone="true"
            class="flex gap-1 py-1 overflow-hidden px-3 rounded-lg min-h-fit"
            :class="
              sameRow(selectedRow, row)
                ? 'bg-main_orange/70'
                : 'hover:bg-main_orange/10'
            "
            :style="{ 'padding-left': row.level * 1 + 'rem' }"
            @drop="dragended(row.channel)"
            @dragover.prevent
            @dragenter.prevent
            @click="selectedRow = row"
            @contextmenu.prevent="selectedRow = row"
          >
            <img
              v-if="row.channel.channelType == 'normal'"
              src="/images/channel-icon.png"
              alt=""
            />
            <p
              :style="{ 'text-align': row.channel.align }"
              class="w-full h-4 text-left cursor-pointer"
            >
              {{ row.channel.channelName }}
            </p>
          </div>
          <div
            v-if="row.rowType == 'musicBot'"
            class="flex gap-1 py-1 h-5 overflow-hidden px-3 rounded-lg min-h-fit cursor-pointer"
            draggable="true"
            :class="[
              sameRow(selectedRow, row)
                ? 'bg-main_orange/70'
                : 'hover:bg-main_orange/10',
              !('connected' in row.musicBot) ? 'opacity-50' : '',
            ]"
            :style="{ 'padding-left': row.level * 1 + 'rem' }"
            @dragstart="draged(row.musicBot)"
            @contextmenu.prevent="selectedRow = row"
            @click="selectedRow = row"
          >
            <img src="/images/bot-icon.png" alt="" />
            <p class="w-full text-left">
              {{
                row.musicBot.connected
                  ? row.musicBot.connected.name
                  : row.musicBot.name
              }}
            </p>
          </div>
          <div
            v-if="row.rowType == 'user'"
            draggable="true"
            class="flex gap-1 py-1 h-5 overflow-hidden px-3 rounded-lg min-h-fit cursor-pointer"
            :class="
              sameRow(selectedRow, row)
                ? 'bg-main_orange/70'
                : 'hover:bg-main_orange/10'
            "
            :style="{ 'padding-left': row.level * 1 + 'rem' }"
            @dragstart="draged(row.user)"
            @click="selectedRow = row"
            @contextmenu.prevent="selectedRow = row"
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
      <main
        v-if="teamspeakserverStatus == 'pending' && !alrreadyVisited"
        class="h-full px-4 overflow-y-hidden"
      >
        <USkeleton
          v-for="_ in 20"
          :key="_"
          :ui="{ background: 'dark:bg-gray-500' }"
          class="h-6 my-2 px-3 rounded-lg w-full"
        />
      </main>
      <main v-if="serverInfo && !serverInfo.mustRunning" class="h-full">
        <div
          class="w-full h-full flex flex-col justify-center items-end gap-10"
        >
          <div>
            <img src="/images/server-is-off.png" alt="" />
          </div>
          <div class="self-center">
            <p class="font-bold text-xl text-white my-2">سرور خاموشه</p>
            <p>
              برای روشن کردن سرور در پنجره بغل بر روی سوییچ روشن و خاموش کلیک
              کنید
            </p>
          </div>
        </div>
      </main>
      <main v-if="teamspeakserverStatus == 'error'" class="h-full">
        <div
          class="w-full h-full flex flex-col justify-center items-end gap-10"
        >
          <div>
            <img src="/images/server-is-off.png" alt="" />
          </div>
          <div class="self-center">
            <p class="font-bold text-xl text-white my-2">خطا در اتصالات</p>
            <p>به مشکلی بر خوردیم، اگه اینو میبینی با پشتیبانی تماس بگیر</p>
          </div>
        </div>
      </main>
    </div>

    <div class="bg-mainbg_400 basis-1/2 w-full rounded-xl overflow-y-auto p-4">
      <template v-if="selectedRow?.rowType == 'server'">
        <ServerView
          v-if="serverInfoStatus === 'success'"
          :server-info="serverInfo"
          :server-info-status="() => serverInfoStatus"
          :users-count="usersCount"
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
        :botsCount="botsCount"
      />
      <MusicbotView
        v-if="selectedRow?.rowType == 'musicBot'"
        :selected-row="selectedRow"
      />
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from '#app';
import { apiStore, storeToRefs } from '#imports';
import objectHash from 'object-hash';
import MusicbotView from '~/components/modules/musicbot/musicbotView.vue';
import { useScroll } from '@vueuse/core';
import { pauseRequests } from '~/stores/globalVaribles';

type alignType = 'start' | 'center' | 'end';
type statusType = 'openMic' | 'micMute' | 'soundMute' | 'away';
type row =
  | { rowType: 'channel'; channel: channel; level: number }
  | { rowType: 'user'; user: user; level: number }
  | { rowType: 'server'; level: 0 }
  | { rowType: 'musicBot'; musicBot: musicBot; level: number };
type channel = {
  channelFullName: string;
  channelName: string;
  align: alignType;
  cid: string;
  channelType: channelType;
  isDeafault: boolean;
  numberOfUsers: number;
};
type user = {
  userNickname: string;
  status: statusType;
  clientLastconnected: number;
  clientVersion: string;
  clientPlatform: string;
  inDefaultChannel: boolean;
  clientUniqueIdentifier: string;
};
type musicBot = {
  uuid: string;
  cid: string;
  name: string;
  connected?: {
    uid: string;
    cid: number;
    name: string;
  };
};

const route = useRoute();
const el = ref<HTMLElement | null>(null);
const therow = ref<HTMLElement | null>(null);
const serverUuid = route.params.id;
const store = apiStore();
const { url } = storeToRefs(store);
const selectedRow = ref<row>({ rowType: 'server', level: 0 });
const movingUser = ref<string>();
const usersCount = ref<number | undefined>();
const botsCount = ref<number | undefined>();
const lastScrollesPosition = ref();
const { y } = useScroll(el);
const alrreadyVisited = ref(false);
//function
function draged(entity: user | musicBot) {
  if ('userNickname' in entity) movingUser.value = entity.userNickname;
  if ('connected' in entity && entity.connected && 'name' in entity.connected)
    movingUser.value = entity.connected.name;
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
        cid: channel.cid,
      }),
    },
  ).catch((e) => {
    throw e;
  });
}
function sameRow(r1: row, r2: row) {
  if (r1.rowType == r2.rowType) {
    if (r1.rowType == 'server' && r2.rowType == 'server') {
      return true;
    } else if (r1.rowType == 'channel' && r2.rowType == 'channel') {
      return r1.channel.cid == r2.channel.cid;
    } else if (r1.rowType == 'user' && r2.rowType == 'user') {
      return r1.user.userNickname == r2.user.userNickname;
    } else if (r1.rowType == 'musicBot' && r2.rowType == 'musicBot') {
      return r1.musicBot.uuid == r2.musicBot.uuid;
    }
  }
  return false;
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

      if (splitedName[0].includes('rspacer'))
        return {
          type: 'rspacer',
          name: splitedName[1],
          align: 'end',
          channelFullName: fullName,
        };
      if (splitedName[0].includes('*spacer')) {
        return {
          type: '*spacer',
          name: splitedName[1].repeat(50),
          align: 'center',
          channelFullName: fullName,
        };
      }
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
    }
  }
  return {
    type: 'normal',
    name: fullName,
    align: 'start',
    channelFullName: fullName,
  };
}
const teamspeakserver = ref<row[]>();
const { execute: getUsersAndChannels, status: teamspeakserverStatus } =
  useLazyAsyncData(async () => {
    const channelsReq: Promise<
      {
        channelName: string;
        cid: string;
        pid: string;
        channelFlagDefault: boolean;
      }[]
    > = $fetch(`${url.value}/api/v4/tservers/${serverUuid}/channels`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const botReq: Promise<musicBot[]> = $fetch(
      `${url.value}/api/v4/tservers/${serverUuid}/bots`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    );
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
    const users = await usersReq;
    const musicBots = await botReq;
    let defaultPid: string;
    function isDeafaultChannel(channel: {
      channelName: string;
      cid: string;
      pid: string;
      channelFlagDefault: boolean;
    }): boolean {
      if (channel.channelFlagDefault) {
        defaultPid = channel.cid;
        return true;
      }
      return false;
    }
    const rows: row[] = [];
    const channels = await channelsReq;
    channels.forEach((channel) => {
      const channelTypeAndName = findChannelTypeAndNameByFullName(
        channel.channelName,
      );
      let userNumber = 0;
      users.forEach((u) => {
        if (u.cid == channel.cid) userNumber += 1;
      });
      const channelType = channelTypeAndName.type;
      const channelName = channelTypeAndName.name;
      const align = channelTypeAndName.align;
      const channelFullName = channelTypeAndName.channelFullName;
      const isDeafault = isDeafaultChannel(channel);
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
          isDeafault,
          numberOfUsers: userNumber,
        },
        level,
      });
    });
    botsCount.value = musicBots.length;
    musicBots.forEach((musicBot) => {
      if (!('connected' in musicBot)) {
        let channelIndex = rows.findIndex((row) => {
          if (row.rowType != 'channel') return false;
          return row.channel.cid == musicBot.cid;
        });
        if (channelIndex == -1) {
          channelIndex = channels.findIndex(
            (channel) => channel.channelFlagDefault,
          );
        }
        rows.splice(channelIndex + 1, 0, {
          rowType: 'musicBot',
          musicBot,
          level: rows[channelIndex].level + 1,
        });
      }
    });
    usersCount.value = users.length;
    users.forEach((user) => {
      const channelIndex = rows.findIndex((row) => {
        if (row.rowType != 'channel') return false;
        return row.channel.cid == user.cid;
      });
      let inDefaultChannel = false;
      if (user.cid == defaultPid) inDefaultChannel = true;
      let status: statusType = 'openMic';
      if (user.clientInputMuted || !user.clientInputHardware)
        status = 'micMute';
      if (user.clientOutputMuted || !user.clientOutputHardware)
        status = 'soundMute';
      if (user.clientAway) status = 'away';

      const musicBot = musicBots.find(
        (b) => b.connected && b.connected.name == user.clientNickname,
      );
      if (musicBot) {
        rows.splice(channelIndex + 1, 0, {
          rowType: 'musicBot',
          musicBot,
          level: rows[channelIndex].level + 1,
        });
      } else {
        rows.splice(channelIndex + 1, 0, {
          rowType: 'user',
          user: {
            userNickname: user.clientNickname,
            status,
            inDefaultChannel: inDefaultChannel,
            clientLastconnected: user.clientLastconnected,
            clientVersion: user.clientVersion,
            clientPlatform: user.clientPlatform,
            clientUniqueIdentifier: user.clientUniqueIdentifier,
          },
          level: rows[channelIndex].level + 1,
        });
      }
    });
    const foundedSelectedRow = rows.find((r) => sameRow(r, selectedRow.value));
    if (!foundedSelectedRow)
      selectedRow.value = { rowType: 'server', level: 0 };
    else selectedRow.value = foundedSelectedRow;
    teamspeakserver.value = rows;
    alrreadyVisited.value = true;
    const theInterval = setInterval(() => {
      if (el.value != null && el.value.children.length > 0) {
        y.value = lastScrollesPosition.value;
        clearInterval(theInterval);
      }
    }, 100);
  });

const lastTimeReccived = ref(1);
const longpollController = new AbortController();
useFetch<{
  message: string;
  at: number;
}>(
  () =>
    `${url.value}/api/v4/tservers/${serverUuid}/last-server-event-after/${lastTimeReccived.value}`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    lazy: true,
    onResponse: async (res) => {
      const handle = async () => {
        if (pauseRequests.value)
          return new Promise((resolve) =>
            setTimeout(async () => resolve(await handle()), 1000),
          );
        if (lastTimeReccived.value > 1) await getUsersAndChannels();
        if (res.response._data.at) {
          lastTimeReccived.value = res.response._data.at;
        }
      };
      await handle();
    },
    retry: 30,
    retryDelay: 1000,
    cache: 'no-cache',
    signal: longpollController.signal,
  },
);
onUnmounted(() => longpollController.abort());

const theInterval = setInterval(() => {
  if (el.value != null && el.value.children.length > 0) {
    const defaultChannelIndex =
      teamspeakserver.value?.findIndex(
        (r) => 'channel' in r && r.channel.isDeafault,
      ) ?? 0;

    y.value = defaultChannelIndex * 16;
    clearInterval(theInterval);
  }
}, 500);
watch(y, () => {
  lastScrollesPosition.value = y.value;
});
</script>
