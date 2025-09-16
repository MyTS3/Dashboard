<template>
  <section
    class="flex-1 grid grid-cols-2 w-full mx-auto items-stretch text-white text-center gap-layout min-h-0 max-[768px]:grid-cols-1"
  >
    <main
      :class="selectedPlaylistUuid != undefined ? 'max-[768px]:hidden' : ''"
      class="bg-mainbg_500 p-5 min-h-0 h-full rounded-xl flex flex-col"
    >
      <header>
        <p>پلی لیست ها</p>
        <img class="w-full mt-3" src="/images/seprator-line.png" alt="" />
      </header>
      <div
        class="bg-white/10 h-full mt-4 px-1 rounded-lg overflow-y-auto scroll-bar"
      >
        <template v-if="playlistsStatus === 'error'">
          <main
            class="w-full h-full flex justify-center items-center flex-col gap-5"
          >
            <p>خطایی رخ داد لطفا دوباره امتحان کنید</p>
            <button
              class="bg-main_green/80 p-4 rounded-xl"
              @click="getPlaylist()"
            >
              امتحان مجدد
            </button>
          </main>
        </template>
        <template v-if="playlistsStatus === 'pending'">
          <main class="flex flex-col gap-2 py-1">
            <USkeleton
              v-for="_ in 20"
              :key="_"
              :ui="{ background: 'dark:bg-gray-500' }"
              class="w-full p-7 rounded-xl"
            />
          </main>
        </template>
        <template v-if="playlistsStatus === 'success'">
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
                @click="
                  (removingPlaylist = playlist), (DeletePlaylistTab = true)
                "
              />
            </div>
          </li>
        </template>
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
    <main
      :class="!selectedPlaylistUuid ? 'max-[768px]:hidden' : ''"
      class="bg-mainbg_500 min-h-0 h-full p-5 rounded-xl flex flex-col relative"
    >
      <header>
        <img
          @click="selectedPlaylistUuid = undefined"
          src="/images/Arrow - Left.png"
          class="w-7 absolute top-4 min-[769px]:hidden"
          alt=""
        />
        <p>آهنگ های پلی لیست</p>
        <img class="w-full mt-3" src="/images/seprator-line.png" alt="" />
      </header>
      <div
        class="bg-white/10 h-full mt-4 px-1 rounded-lg overflow-y-auto scroll-bar"
      >
        <p v-if="selectedPlaylistUuid == undefined" class="mt-5">
          لطفا یک پلی لیست را انتخاب کنید
        </p>
        <div
          v-if="
            selectedPlaylistUuid &&
            musics &&
            musics.length < 1 &&
            musicsStatuss == 'success'
          "
          class="h-full w-full flex flex-col gap-8 justify-center items-center"
        >
          <img src="/images/noMusic-addedYet.svg" alt="no-music-has-added" />
          <p class="text-lg text-white/80 font-bold">
            هیچ موزیکی نداری، با کلیک روی دکمه زیر اضافه کن
          </p>
        </div>
        <template v-if="musicsStatuss === 'error'">
          <main
            class="w-full h-full flex justify-center items-center flex-col gap-5"
          >
            <p>خطایی رخ داد لطفا دوباره امتحان کنید</p>
            <button class="bg-main_green/80 p-4 rounded-xl" @click="getMusic()">
              امتحان مجدد
            </button>
          </main>
        </template>
        <template v-if="musicsStatuss === 'pending'">
          <main class="flex flex-col gap-2 py-1">
            <USkeleton
              v-for="_ in 20"
              :key="_"
              :ui="{ background: 'dark:bg-gray-500' }"
              class="w-full p-7 rounded-xl"
            />
          </main>
        </template>
        <template v-if="musicsStatuss === 'success'">
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

            <div
              v-if="!publicPlaylist"
              class="flex absolute bottom-1/2 translate-y-1/2 right-4"
            >
              <img
                src="/images/trash.png"
                @click="(removingMusic = music), (deleteMusicTab = true)"
              />
            </div>
          </li>
        </template>
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
const {
  data: playlists,
  execute: getPlaylist,
  status: playlistsStatus,
} = useFetch<{ uuid: string; name: string; public: boolean }[]>(
  `${url.value}/api/v4/playlists`,
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
);

const {
  data: musics,
  execute: getMusic,
  status: musicsStatuss,
} = useFetch<{ uuid: string; name: string }[]>(
  () => `${url.value}/api/v4/playlists/${selectedPlaylistUuid.value}/musics`,
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    immediate: false,
  },
);
</script>
