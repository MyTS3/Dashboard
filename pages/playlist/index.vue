<script setup lang="ts">
const store = apiStore();
const { url } = storeToRefs(store);
const selectedPlaylistUuid = ref();

const { data: playlists, status: playlistsStatus } = await useFetch<
  { uuid: string; name: string }[]
>(`${url.value}/api/v4/playlists`, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

const { data: musics, status: musicsStatus } = await useFetch<
  { uuid: string; name: string }[]
>(() => `${url.value}/api/v4/playlists/${selectedPlaylistUuid.value}/musics`, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});
</script>

<template>
  <section
    class="flex-1 w-full mx-auto flex flex-row items-stretch text-white text-center gap-layout min-h-0"
  >
    <main class="w-1/2 bg-mainbg_500 p-5 rounded-xl flex flex-col">
      <header>
        <p>پلی لیست ها</p>
        <img class="w-full mt-3" src="/images/seprator-line.png" alt="" />
      </header>
      <div class="bg-white/10 h-full mt-4 px-1 rounded-lg overflow-scroll">
        <li
          v-for="playlist in playlists"
          :key="playlist.uuid"
          @click="selectedPlaylistUuid = playlist.uuid"
          :class="selectedPlaylistUuid == playlist.uuid ? 'btn-active' : ''"
          class="list-none flex my-1 p-3 hover:hover:bg-main_orange/20 rounded-xl relative"
        >
          <div class="flex gap-layout">
            <img class="w-5" src="/images/Folder.png" alt="" />
            <h2 class="text-lg font-bold">{{ playlist.name }}</h2>
          </div>
          <div class="flex absolute bottom-1/2 translate-y-1/2 right-4">
            <p class="font-sans text-xs my-auto font-bold">2GB</p>
            <img src="/images/trash.png" />
          </div>
        </li>
      </div>
      <button
        class="flex gap-btn w-full items-center justify-center btn rounded-xl py-3"
      >
        ساخت پلی لیست
        <img src="/images/addon.png" alt="" />
      </button>
    </main>
    <main class="w-1/2 bg-mainbg_500 p-5 rounded-xl flex flex-col">
      <header>
        <p>آهنگ های پلی لیست</p>
        <img class="w-full mt-3" src="/images/seprator-line.png" alt="" />
      </header>
      <div class="bg-white/10 h-full mt-4 px-1 rounded-lg overflow-scroll">
        <li
          v-for="music in musics"
          :key="music.uuid"
          class="list-none flex my-1 p-3 hover:hover:bg-main_orange/20 rounded-xl relative"
        >
          <div class="flex gap-layout">
            <img class="w-5" src="/images/music.png" alt="" />
            <h2 class="text-lg font-bold">{{ music.name }}</h2>
          </div>
          <div class="flex absolute bottom-1/2 translate-y-1/2 right-4">
            <p class="font-sans text-xs my-auto font-bold">20MB</p>
            <img src="/images/trash.png" />
          </div>
        </li>
      </div>
      <button
        class="flex gap-btn w-full items-center justify-center btn rounded-xl py-3"
      >
        افزودن موزیک
        <img src="/images/addon.png" alt="" />
      </button>
    </main>
  </section>
</template>

<script setup></script>
