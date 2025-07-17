<template>
  <section
    class="flex-1 grid grid-cols-2 w-full mx-auto items-stretch text-white text-center gap-layout min-h-0"
  >
    <main class="bg-mainbg_500 p-5 min-h-0 h-full rounded-xl flex flex-col">
      <header>
        <p>پلی لیست ها</p>
        <img class="w-full mt-3" src="/images/seprator-line.png" alt="" />
      </header>
      <div class="bg-white/10 h-full mt-4 px-1 rounded-lg overflow-scroll">
        <li
          v-for="playlist in playlists"
          :key="playlist.uuid"
          :class="
            selectedPlaylistUuid == playlist.uuid
              ? 'btn-active'
              : 'hover:hover:bg-main_orange/20'
          "
          class="list-none flex my-1 p-3 rounded-xl relative h-14"
          @click="
            (selectedPlaylistUuid = playlist.uuid),
              (publicPlaylist = playlist.public)
          "
        >
          <div class="flex gap-layout">
            <img class="w-5" src="/images/Folder.png" alt="" />
            <h2 class="text-lg text-left font-bold text-nowrap w-32">
              {{ playlist.name }}
            </h2>
          </div>
          <div class="flex absolute bottom-1/2 translate-y-1/2 right-4">
            <img
              v-if="!playlist.public"
              class="cursor-pointer"
              src="/images/trash.png"
              @click="(removingPlaylist = playlist), (DeletePlaylistTab = true)"
            />
          </div>
        </li>
      </div>
      <UTooltip
        v-if="
          limits &&
          playlists &&
          playlists.filter((p) => !p.public).length >= limits.value.maxPlaylists
        "
        :text="'شما به حداکثر تعداد پلی لیست های خود رسیده اید'"
      >
        <button
          disabled
          class="flex gap-btn w-full items-center justify-center btn-disable rounded-xl py-3"
          @click="makePlaylistTab = true"
        >
          ساخت پلی لیست
          <img src="/images/addon.png" alt="" />
        </button>
      </UTooltip>
      <button
        v-else
        class="flex gap-btn w-full items-center justify-center btn rounded-xl py-3"
        @click="makePlaylistTab = true"
      >
        ساخت پلی لیست
        <img src="/images/addon.png" alt="" />
      </button>
    </main>
    <main class="bg-mainbg_500 p-5 rounded-xl flex flex-col">
      <header>
        <p>آهنگ های پلی لیست</p>
        <img class="w-full mt-3" src="/images/seprator-line.png" alt="" />
      </header>
      <div class="bg-white/10 h-full mt-4 px-1 rounded-lg overflow-scroll">
        <p v-if="selectedPlaylistUuid == undefined" class="mt-5">
          لطفا یک پلی لیست را انتخاب کنید
        </p>
        <li
          v-for="music in musics"
          :key="music.uuid"
          class="list-none flex my-1 p-3 hover:hover:bg-main_orange/20 rounded-xl relative h-14"
        >
          <div class="flex gap-layout w-full">
            <img class="w-5" src="/images/music.png" alt="" />
            <h2 class="text-lg font-bold text-nowrap w-2/3 overflow-hidden">
              {{ music.name }}
            </h2>
          </div>
          <div class="flex absolute bottom-1/2 translate-y-1/2 right-4">
            <img
              src="/images/trash.png"
              @click="(removingMusic = music), (deleteMusicTab = true)"
            />
          </div>
        </li>
      </div>
      <template v-if="selectedPlaylistUuid">
        <UTooltip
          v-if="
            limits &&
            musics &&
            musics.length >= limits.value.maxMusicsPerPlaylist
          "
          :text="'شما به حداکثر تعداد موزیک های خود رسیده اید'"
        >
          <button
            :disabled="true"
            class="flex gap-btn w-full items-center justify-center btn-disable rounded-xl py-3"
            @click="addMusicTab = true"
          >
            افزودن موزیک

            <img src="/images/addon.png" alt="" />
          </button>
        </UTooltip>
        <button
          v-if="
            limits &&
            musics &&
            musics.length <= limits.value.maxMusicsPerPlaylist &&
            !publicPlaylist
          "
          class="flex gap-btn w-full items-center justify-center btn rounded-xl py-3"
          @click="addMusicTab = true"
        >
          افزودن موزیک

          <img src="/images/addon.png" alt="" />
        </button>
      </template>
    </main>
    <MakePlaylist
      v-if="makePlaylistTab"
      @close="(makePlaylistTab = false), getPlaylist()"
    />
    <DeletePlaylist
      v-if="DeletePlaylistTab"
      :removing-playlist="removingPlaylist"
      @close="(DeletePlaylistTab = false), getPlaylist()"
    />
    <AddMusic
      v-if="addMusicTab"
      :selected-playlist="selectedPlaylistUuid"
      @close="(addMusicTab = false), getMusic()"
    />
    <deleteMusic
      v-if="deleteMusicTab"
      :removing-music="removingMusic"
      :selected-playlist-uuid="selectedPlaylistUuid"
      @close="(deleteMusicTab = false), getMusic()"
    />
  </section>
</template>

<script setup lang="ts">
import DeletePlaylist from '~/components/modules/playlist/deletePlaylist.vue';
import MakePlaylist from '~/components/modules/playlist/makePlaylist.vue';
import AddMusic from '~/components/modules/playlist/addMusic.vue';
import deleteMusic from '~/components/modules/playlist/deleteMusic.vue';
import { limits } from '~/stores/limits';

const store = apiStore();
const { url } = storeToRefs(store);
const selectedPlaylistUuid = ref<undefined | string>(undefined);
const publicPlaylist = ref();
const DeletePlaylistTab = ref(false);
const deleteMusicTab = ref(false);
const makePlaylistTab = ref(false);
const addMusicTab = ref(false);
const removingPlaylist = ref();
const removingMusic = ref();
const { data: playlists, execute: getPlaylist } = await useFetch<
  { uuid: string; name: string; public: boolean }[]
>(`${url.value}/api/v4/playlists`, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

const { data: musics, execute: getMusic } = await useFetch<
  { uuid: string; name: string }[]
>(() => `${url.value}/api/v4/playlists/${selectedPlaylistUuid.value}/musics`, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});
</script>
