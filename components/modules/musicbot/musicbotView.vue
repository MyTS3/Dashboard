<template>
  <section class="h-full relative overflow-y-hidden flex flex-col gap-2">
    <header class="flex w-full justify-between">
      <div class="flex gap-2">
        <img
          class="w-9 cursor-pointer"
          @click="editMusicBotTab = true"
          src="/images/edit.png"
          alt="edit-icon"
        />
        <img
          @click="addMusicTab = true"
          class="w-9 cursor-pointer"
          src="/images/add.png"
          alt="add-music"
        />
      </div>
      <h1 class="mx-auto font-bold p-2 my-auto">موزیک بات</h1>
      <img
        class="cursor-pointer"
        src="/images/trash.png"
        alt=""
        @click="deleteMusicBotTab = true"
      />
    </header>
    <img class="mx-auto w-full" src="/images/seprator-line.png" alt="" />
    <template v-if="'connected' in selectedRow.musicBot">
      <div class="flex grow flex-col overflow-hidden">
        <template v-if="musicsStatus === 'success'">
          <main
            class="w-4/5 bg-white/10 mx-auto h-full rounded-lg p-2 overflow-y-scroll"
          >
            <li
              v-for="music in musics?.musics"
              :key="music.Link"
              class="list-none my-1 p-3 rounded-xl relative"
              :class="
                music.Link === playingMusic?.Link
                  ? 'btn-active'
                  : 'hover:hover:bg-main_orange/20'
              "
            >
              <h2 class="text-lg">{{ music.Title }}</h2>
            </li>
          </main>
        </template>
        <template v-if="musicsStatus === 'pending'">
          <main
            class="w-4/5 bg-white/10 mx-auto h-full rounded-lg p-2 overflow-y-scroll flex flex-col gap-1"
          >
            <USkeleton
              v-for="_ in 20"
              :key="_"
              :ui="{ background: 'dark:bg-gray-500' }"
              class="w-full p-7 rounded-xl"
            />
          </main>
        </template>
        <footer
          class="mx-auto py-4 flex-shrink-0 flex-grow-0 basis-32 w-full gap-2 flex flex-col"
        >
          <div class="flex flex-col text-center">
            <h2 class="font-bold max-w-full overflow-hidden">
              {{ playingMusic?.Title }}
            </h2>
            <USkeleton
              v-if="musicStatus == 'pending' && !playingMusic.Title"
              :ui="{ background: 'dark:bg-gray-500' }"
              class="w-4/5 mx-auto p-3 rounded-xl"
            />
          </div>
          <div
            v-if="playingMusic && playingMusic.Length"
            class="flex items-center w-full justify-around"
          >
            <p v-if="playingMusic.Length" class="w-10">
              {{ Math.trunc(playingMusic.Position / 60) }}:{{
                Math.trunc(playingMusic.Position % 60)
              }}
            </p>
            <p v-else>0:0</p>
            <div class="audio-progress" />
            <p v-if="playingMusic.Length" class="w-10">
              {{ Math.trunc(playingMusic.Length / 60) }}:{{
                Math.trunc(playingMusic.Length % 60)
              }}
            </p>
            <p v-else>0:0</p>
          </div>
          <div class="flex w-full justify-center px-4">
            <div class="flex w-full max-w-52 justify-around">
              <button
                :disabled="disable"
                :class="disable && 'opacity-70'"
                @click="previous()"
              >
                <img src="/images/previous.png" alt="" />
              </button>
              <button
                :disabled="disable"
                :class="disable && 'opacity-70'"
                class="bg-main_orange rounded-full p-4"
                @click="playpause()"
              >
                <img
                  v-if="playingMusic && !playingMusic.Paused"
                  src="/images/pause.png"
                  alt=""
                />
                <img v-else src="/images/play.png" alt="" />
              </button>
              <button
                :disabled="disable"
                :class="disable && 'opacity-70'"
                @click="next()"
              >
                <img src="/images/next.png" alt="" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </template>
    <template v-else>
      <div class="h-full flex flex-col justify-between">
        <div class="my-auto grid gap-5">
          <img src="/images/server-is-off.png" class="scale-x-[-1]" alt="" />
          <p>موزیک بات قطع شده است</p>
        </div>

        <button
          :disabled="disableRestart"
          :class="disableRestart ? 'btn-disable' : 'btn'"
          class="flex gap-3 w-full items-center py-3 justify-center rounded-lg"
          @click="restartBot()"
        >
          <p>راه اندازی مجدد</p>
          <img src="/images/restart.png" alt="" />
        </button>
      </div>
    </template>
    <DeleteMusicBot
      v-if="deleteMusicBotTab"
      :selected-bot="selectedRow"
      @close="deleteMusicBotTab = false"
    />
    <EditMusicBot
      :bot="selectedRow"
      @close="editMusicBotTab = false"
      @refresh="$emit('refresh')"
      v-if="editMusicBotTab"
    />
    <AddMusic
      :row="props.selectedRow"
      v-if="addMusicTab"
      @close="(addMusicTab = false), getMusics()"
      @pause="handlePuase"
      @resume="handleResume"
    />
  </section>
</template>
<script setup lang="ts">
import AddMusic from '../playlist/addMusic.vue';
import DeleteMusicBot from './deleteMusicBot.vue';
import EditMusicBot from './editMusicBot.vue';

const addMusicTab = ref(false);
const editMusicBotTab = ref(false);
const deleteMusicBotTab = ref(false);
const store = apiStore();
const { url } = storeToRefs(store);
const toast = useToast();
const route = useRoute();
const props = defineProps(['selectedRow']);
const disableRestart = ref(false);
const disable = ref(false);
let element: HTMLElement | null;

const {
  data: musics,
  status: musicsStatus,
  refresh: getMusics,
} = useFetch<{
  musics: { Link: string; Title: string }[];
}>(
  () =>
    `${url.value}/api/v4/tservers/${route.params.id}/bots/${props.selectedRow.musicBot.uuid}/musics`,
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    watch: [() => props.selectedRow],
    default: () => ({
      musics: [],
    }),
  },
);
const {
  data: playingMusic,
  execute: getPlayingMusic,
  status: musicStatus,
} = useFetch<{
  Link: string;
  Title: string;
  Paused: boolean;
  Position: number;
  Length: number;
}>(
  () =>
    `${url.value}/api/v4/tservers/${route.params.id}/bots/${props.selectedRow.musicBot.uuid}/music`,
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    watch: [() => props.selectedRow],
    default: () => ({
      Link: '',
      Title: '',
      Paused: true,
      Position: 0,
      Length: 0,
    }),
  },
);
let pauseInterval: boolean = false;
const mainInterval = setInterval(async () => {
  if (pauseInterval) return;
  await getPlayingMusic();
}, 5000);
const handlePuase = () => (pauseInterval = true);
const handleResume = () => (pauseInterval = false);
async function next() {
  pauseInterval = true;
  disable.value = true;
  await useFetch(
    `${url.value}/api/v4/tservers/${route.params.id}/bots/${props.selectedRow.musicBot.uuid}/next`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
  await getPlayingMusic();
  disable.value = false;
  pauseInterval = false;
}

async function playpause() {
  disable.value = true;
  if (!playingMusic.value || playingMusic.value.Paused)
    await useFetch(
      `${url.value}/api/v4/tservers/${route.params.id}/bots/${props.selectedRow.musicBot.uuid}/play`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    );
  else
    await useFetch(
      `${url.value}/api/v4/tservers/${route.params.id}/bots/${props.selectedRow.musicBot.uuid}/pause`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    );

  await getPlayingMusic();
  disable.value = false;
}

async function previous() {
  pauseInterval = true;
  disable.value = true;
  await useFetch(
    `${url.value}/api/v4/tservers/${route.params.id}/bots/${props.selectedRow.musicBot.uuid}/previous`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
  await getPlayingMusic();
  disable.value = false;
  pauseInterval = false;
}

async function restartBot() {
  disableRestart.value = true;
  setTimeout(() => (disableRestart.value = false), 10000);
  const { error } = await useFetch(
    `${url.value}/api/v4/tservers/${route.params.id}/bots/${props.selectedRow.musicBot.uuid}/restart`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
  if (error.value) {
    toast.add({
      title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
      timeout: 2000,
      color: 'red',
    });
  }
}
onMounted(() => {
  element = document.querySelector('.audio-progress');
  if (element) {
    element.style.setProperty('--before-left', '0%');
    element.style.setProperty('--after-width', '0%');
  }
  onUnmounted(() => {
    element = null;
    clearInterval(mainInterval);
  });
});
</script>
<style scoped>
.audio-progress {
  position: relative;
  width: 70%;
  height: 2px;
  background-color: white;
}

.audio-progress::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background-color: rgba(255, 158, 11, 1);
  top: 50%;
  transform: translateY(-50%);
  left: var(--before-left);
}

.audio-progress::after {
  content: '';
  position: absolute;
  background-color: rgba(255, 158, 11, 1);
  width: var(--after-width, 50px);
  left: 0;
  height: 2px;
}
</style>
