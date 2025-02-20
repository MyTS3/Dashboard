<template>
  <section class="h-full relative overflow-clip flex flex-col gap-2">
    <header class="flex w-full">
      <h1 class="mx-auto font-bold my-auto">موزیک بات</h1>
      <img
        class="cursor-pointer"
        src="/images/trash.png"
        alt=""
        @click="deleteMusicBotTab = true"
      />
    </header>
    <img class="mx-auto" src="/images/seprator-line.png" alt="" />
    <template v-if="'connected' in selectedRow.musicBot">
      <div class="h-full flex justify-between flex-col gap-5">
        <main
          class="w-4/5 h-full grow row-span-2 bg-white/10 mx-auto rounded-lg p-2 overflow-y-auto"
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
        <footer class="mx-auto py-4 grow-0 shrink-0 w-full gap-2 flex flex-col">
          <div class="flex flex-col text-center">
            <h2 class="font-bold">{{ playingMusic?.Title }}</h2>
          </div>
          <div
            class="flex items-center w-full justify-around"
            v-if="playingMusic?.Length && playingMusic?.Position"
          >
            <p>
              {{ Math.trunc(playingMusic.Position / 60) }}:{{
                Math.trunc(playingMusic.Position % 60)
              }}
            </p>
            <div class="audio-progress" />
            <p>
              {{ Math.trunc(playingMusic.Length / 60) }}:{{
                Math.trunc(playingMusic.Length % 60)
              }}
            </p>
          </div>
          <div class="flex w-full justify-center px-4">
            <div class="flex w-2/4 justify-around">
              <button @click="previous()">
                <img src="/images/previous.png" alt="" />
              </button>
              <button
                class="bg-main_orange rounded-full p-4"
                @click="playpause()"
              >
                <img src="/images/pause.png" alt="" />
              </button>
              <button @click="next()">
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
  </section>
</template>
<script setup lang="ts">
import DeleteMusicBot from './deleteMusicBot.vue';

const deleteMusicBotTab = ref(false);
const store = apiStore();
const { url } = storeToRefs(store);
const toast = useToast();
const route = useRoute();
const props = defineProps(['selectedRow']);
const disableRestart = ref(false);

const { data: musics, execute: getMusics } = await useFetch<{
  musics: { Link: string; Title: string }[];
}>(
  `${url.value}/api/v4/tservers/${route.params.id}/bots/${props.selectedRow.musicBot.uuid}/musics`,
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
);

const { data: playingMusic, execute: getPlayingMusic } = await useFetch<{
  Link: string;
  Title: string;
  Paused: boolean;
  Position: number;
  Length: number;
}>(
  `${url.value}/api/v4/tservers/${route.params.id}/bots/${props.selectedRow.musicBot.uuid}/music`,
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
);

async function getMusicsAndPlayingMusic() {
  return Promise.all([getMusics(), getPlayingMusic()]);
}

callOnce(() => {
  setInterval(async () => {
    if (
      playingMusic.value &&
      playingMusic.value.Position &&
      !playingMusic.value.Paused
    ) {
      playingMusic.value.Position += 1;
      if (playingMusic.value.Position > playingMusic.value.Length) {
        await getMusicsAndPlayingMusic();
      }
    }
  }, 1000);
});

callOnce(() => {
  setInterval(() => {
    getMusicsAndPlayingMusic();
  }, 5000);
});

async function next() {
  await useFetch(
    `${url.value}/api/v4/tservers/${route.params.id}/bots/${props.selectedRow.musicBot.uuid}/next`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
  await getMusicsAndPlayingMusic();
}

async function playpause() {
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

  await getMusicsAndPlayingMusic();
}

async function previous() {
  await useFetch(
    `${url.value}/api/v4/tservers/${route.params.id}/bots/${props.selectedRow.musicBot.uuid}/previous`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
  await getMusicsAndPlayingMusic();
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
  left: 30%;
}

.audio-progress::after {
  content: '';
  position: absolute;
  background-color: rgba(255, 158, 11, 1);
  width: 30%;
  left: 0;
  height: 2px;
}
</style>
