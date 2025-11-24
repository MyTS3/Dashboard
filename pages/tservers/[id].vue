<template>
  <section
    class="h-full mx-auto flex flex-row w-full items-stretch text-white text-center gap-layout min-h-0"
    @dragend.prevent="onDragLeave()"
    @dragenter.prevent="enteringDraggingZone($event)"
    @dragexit.prevent="onDragLeave()"
    @drop.prevent="draggingFile = false"
  >
    <div
      :class="infoTab ? 'max-[700px]:hidden ' : 'max-[700px]:basis-full'"
      class="flex flex-col items-stretch bg-mainbg_400 h-full relative rounded-xl font-sans overflow-y-auto min-[701px]:basis-1/2"
    >
      <div
        class="absolute w-full h-full backdrop-blur-sm bg-mainbg_600/80 z-50 flex flex-col justify-center items-center"
        dropzone="true"
        @dragover.prevent
        @dragenter.prevent
        @drop.prevent="onDrop($event)"
        v-if="draggingFile"
      >
        <div
          @click="draggingFile = false"
          dropzone="true"
          @dragover.prevent
          @dragenter.prevent
          @drop.prevent="onDrop($event, true)"
          class="absolute bottom-0 right-0 w-full h-20 cursor-pointer z-[100] bg-gradient-to-t from-main_red/50 to-transparent grid items-center hover:from-main_red/80"
        >
          <p>لغو</p>
        </div>
        <img src="/images/backup.svg" class="w-30 mx-auto" alt="dropzone" />
        <p>بکاپ خودرا اینجا رها کنید</p>
      </div>
      <header class="relative my-4 px-4">
        <span
          v-if="serverInfoStatus === 'success' && serverInfo"
          :class="selectedRow?.rowType == 'server' ? 'btn-active' : 'btn '"
          class="h-9 px-1 border-2 bg-white/10 rounded-2xl flex items-center justify-center cursor-pointer max-w-full truncate"
          @click="
            (selectedRow = { rowType: 'server', level: 0 }),
              screenWidth < 701 ? (infoTab = true) : null
          "
          @contextmenu.prevent="selectedRow = { rowType: 'server', level: 0 }"
        >
          {{ serverInfo.name.slice(-35) }}
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
        class="flex items-stretch flex-col teamspeak text-xs px-4 flex-1 overflow-y-auto scroll-bar"
      >
        <template v-for="row in teamspeakserver" :key="objectHash(row)">
          <div
            v-if="row.rowType == 'channel'"
            ref="therow"
            dropzone="true"
            class="flex gap-1 py-1 overflow-hidden px-3 rounded-lg min-h-6"
            :class="[
              sameRow(selectedRow, row)
                ? 'bg-main_orange/70'
                : 'hover:bg-main_orange/10',
            ]"
            :style="{ 'padding-left': row.level * 1 + 'rem' }"
            @drop="dragended(row.channel)"
            @dragover.prevent
            @dragenter.prevent
            @click="
              (selectedRow = row), screenWidth < 701 ? (infoTab = true) : null
            "
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
            class="flex gap-1 py-1 h-5 overflow-hidden px-3 rounded-lg min-h-6 cursor-pointer"
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
            @click="
              (selectedRow = row), screenWidth < 701 ? (infoTab = true) : null
            "
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
            class="flex gap-1 py-1 h-5 overflow-hidden px-3 rounded-lg min-h-6 cursor-pointer"
            :class="
              sameRow(selectedRow, row)
                ? 'bg-main_orange/70'
                : 'hover:bg-main_orange/10'
            "
            :style="{ 'padding-left': row.level * 1 + 'rem' }"
            @dragstart="draged(row.user)"
            @click="
              (selectedRow = row), screenWidth < 701 ? (infoTab = true) : null
            "
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
        v-if="
          teamspeakserverStatus == 'pending' &&
          !alrreadyVisited &&
          serverInfo?.mustRunning
        "
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
      <template
        v-if="teamspeakserverStatus == 'error' && serverInfo?.mustRunning"
      >
        <main
          class="w-full h-full flex justify-center items-center flex-col gap-5"
        >
          <div
            class="w-full h-full flex flex-col justify-center items-end gap-10"
          >
            <div>
              <img src="/images/server-is-off.png" alt="" />
            </div>
            <div class="self-center">
              <p class="font-bold text-xl text-white my-2">خطا در اتصالات</p>
              <p>اگه با چند بار تلاش درست نشد با پشتیبانی تماس بگیر</p>
            </div>
            <button
              class="bg-main_green/80 p-4 rounded-xl mx-auto"
              @click="getUsersAndChannels()"
            >
              امتحان مجدد
            </button>
          </div>
        </main>
      </template>
    </div>

    <div
      :class="[!infoTab ? 'max-[700px]:hidden ' : 'max-[700px]:basis-full', ,]"
      class="bg-mainbg_400 min-[701px]:basis-1/2 rounded-xl overflow-y-auto p-4 relative"
    >
      <!-- <img
        @click="selectedRow = null"
        class="absolute top-3 w-7 cursor-pointer z-10 min-[701px]:hidden"
        src="/images/Arrow - Left.png"
        alt=""
      /> -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 48 48"
        role="img"
        aria-label="Switch panels"
        @click="(infoTab = false), (selectedRow = null)"
        class="absolute w-[43px] cursor-pointer z-10 min-[701px]:hidden"
        :class="
          selectedRow?.rowType == 'musicBot'
            ? 'left-[105px] top-[0.67rem]'
            : ' top-1 left-3'
        "
      >
        <!-- rounded frame -->
        <rect
          x="4"
          y="6"
          width="40"
          height="36"
          rx="4"
          fill="rgba(37,40,65,1)"
          stroke="rgba(108,135,168,1)"
          stroke-width="1.2"
        />
        <!-- left panel -->
        <rect
          x="8"
          y="10"
          width="16"
          height="28"
          rx="2"
          fill="rgba(56,61,99,1)"
        />
        <!-- right panel -->
        <rect
          x="24"
          y="10"
          width="12"
          height="28"
          rx="2"
          fill="rgba(20,25,49,1)"
        />
        <!-- arrow left-to-right -->
        <path
          d="M19 22h8"
          fill="none"
          stroke="rgb(236,102,0)"
          stroke-width="2.4"
          stroke-linecap="round"
        />
        <path
          d="M25 19l3 3-3 3"
          fill="none"
          stroke="rgb(236,102,0)"
          stroke-width="2.0"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <!-- arrow right-to-left (subtle) -->
        <path
          d="M17.5 28h-6"
          fill="none"
          stroke="rgba(108,135,168,1)"
          stroke-width="1.4"
          stroke-linecap="round"
          opacity="0.9"
        />
        <path
          d="M11.7 25.7l-2.2 2.3 2.2 2.3"
          fill="none"
          stroke="rgba(108,135,168,1)"
          stroke-width="1.2"
          stroke-linecap="round"
          stroke-linejoin="round"
          opacity="0.95"
        />
      </svg>

      <template v-if="selectedRow?.rowType == 'server'">
        <ServerView
          v-if="serverInfoStatus === 'success'"
          :server-info="serverInfo"
          :users-count="usersCount"
          @get-server-deatails="getServerDeatails"
          @resetAlreadyvisited="alrreadyVisited = false"
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
        @refresh="getUsersAndChannels"
      />
      <AddDraggedBackup
        v-if="AddDraggedBackupTab"
        @close="
          (AddDraggedBackupTab = false),
            (backupFile = null),
            getUsersAndChannels()
        "
        :backup="backupFile"
        :serverinfo="serverInfo"
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
import AddDraggedBackup from '~/components/modules/server/addDraggedBackup.vue';
//responsive code
const infoTab = ref(false);
//

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
  hasBot: boolean;
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
const selectedRow = ref<row | null>({ rowType: 'server', level: 0 });
const movingUser = ref<string>();
const usersCount = ref<number | undefined>();
const botsCount = ref<number | undefined>();
const lastScrollesPosition = ref();
const { y } = useScroll(el);
const alrreadyVisited = ref(false);
const screenWidth = window.innerWidth;
const draggingFile = ref(false);
const backupFile = ref<null | string>(null);
const AddDraggedBackupTab = ref(false);
//function
function enteringDraggingZone(e: DragEvent) {
  if (e.dataTransfer && e.dataTransfer.items.length > 0) {
    if (e.dataTransfer?.items[0].kind) draggingFile.value = true;
  }
}
function onDragLeave() {
  draggingFile.value = false;
}
function onDrop(e: DragEvent, cancelled = false) {
  e.stopPropagation();
  draggingFile.value = false;
  if (cancelled) return;
  const file = e.dataTransfer?.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    backupFile.value = (reader.result as string).trim();
    AddDraggedBackupTab.value = true;
  };
  reader.readAsText(file);

  // toast.add({
  //   title: 'این فرمت پشتیبانی نمیشود',
  //   timeout: 2000,
  //   color: 'red',
  // });
}

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
function sameRow(r1: row | null, r2: row) {
  if (!r1) return false;
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
  deployedOn: string | null;
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
} = useLazyFetch<serverInfoType>(`${url.value}/api/v4/tservers/${serverUuid}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

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
          name: splitedName[1].repeat(
            screenWidth / (splitedName[1].length ** 2 * 50),
          ),
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
      let botNumbeer = 0;
      users.forEach((u) => {
        if (u.cid == channel.cid) userNumber += 1;
      });
      musicBots.forEach((m) => {
        if (m.cid == channel.cid) botNumbeer += 1;
      });
      const channelType = channelTypeAndName.type;
      const channelName = channelTypeAndName.name;
      const align = channelTypeAndName.align;
      const channelFullName = channelTypeAndName.channelFullName;
      const isDeafault = isDeafaultChannel(channel);
      const hasBot = botNumbeer > 0 ? true : false;
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
          hasBot,
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
    const foundedSelectedRow = rows.find((r) =>
      selectedRow.value ? sameRow(r, selectedRow.value) : null,
    );
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
        await getUsersAndChannels();
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
onMounted(() => {
  window.addEventListener('blur', () => {
    draggingFile.value = false;
  });
});
onUnmounted(() => {
  longpollController.abort();
  window.removeEventListener('blur', () => {
    draggingFile.value = false;
  });
});

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
if (screenWidth < 701) selectedRow.value = null;
</script>
