<template>
  <teleport to="body">
    <section
      class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
    >
      <main
        class="text-white w-full max-w-[30rem] bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl"
      >
        <button
          :disabled="disableBtn"
          class="self-end text-center flex justify-center items-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
          @click="$emit('close')"
        >
          <img class="w-3" src="/images/X-9.png" alt="" />
        </button>
        <header class="my-4 grid gap-2">
          <p class="text-xl font-bold">ویرایش موزیک بات</p>
          <p class="opacity-70 text-sm">پلی لیست یا اسم بات خودرا عوض کنید</p>
        </header>
        <div class="grid gap-5">
          <div class="grid gap-1">
            <p class="text-right">پلی لیست</p>
            <USelectMenu
              v-if="playlistsStatus == 'success'"
              @change="
                botName = selectedPlaylist.label;
                checkname();
              "
              v-model="selectedPlaylist"
              class="w-full"
              size="xl"
              color="indigo"
              :options="playlists"
            />
            <USkeleton
              v-if="playlistsStatus == 'pending'"
              class="h-11 w-full"
              :ui="{ background: 'dark:bg-gray-500' }"
            />
          </div>
          <div class="grid gap-1">
            <p class="text-right">نام</p>
            <input
              @input="checkname()"
              min="3"
              max="30"
              v-model="botName"
              class="w-full bg-transparent text-right appearance-none border rounded-xl p-3"
              type="text"
            />
          </div>
        </div>
        <button
          :disabled="disableBtn || regexDisable"
          :class="[
            disableBtn || regexDisable ? 'cursor-not-allowed opacity-55' : '',
          ]"
          @click="editMusicBot()"
          class="flex w-full items-center justify-center bg-main_blue p-4 mt-5 rounded-xl font-medium gap-2"
        >
          <div
            v-if="!disableBtn"
            class="flex w-full items-center justify-center font-medium gap-2"
          >
            <span><img src="/images/plus.png" alt="" /></span>ساخت
          </div>
          <theLoading v-else />
        </button>
      </main>
    </section>
  </teleport>
</template>
<script setup lang="ts">
import theLoading from '~/components/reusable/theLoading.vue';
type playlist = {
  uuid: string;
  name: string;
  public: boolean;
};
//
const regexDisable = ref(false);
const store = apiStore();
const { url } = storeToRefs(store);
const route = useRoute();
const toast = useToast();
const emit = defineEmits(['close', 'refresh']);
const selectedPlaylist = ref();
const disableBtn = ref(false);
const botName = ref();
const playlists = ref<{ label: string; value: string }[]>([]);
const props = defineProps(['bot']);
const { data: fetchedPlaylists, status: playlistsStatus } = useFetch<
  playlist[]
>(`${url.value}/api/v4/playlists`, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});
watch(fetchedPlaylists, (newPlaylists) => {
  if (newPlaylists) {
    playlists.value = newPlaylists.map((playlist) => ({
      label: playlist.name,
      value: playlist.uuid,
    }));
  }
  if (!selectedPlaylist.value || !botName.value) regexDisable.value = true;
});
function checkname() {
  if (botName.value.length < 3) {
    regexDisable.value = true;
    return;
  }
  if (botName.value.length > 30) {
    regexDisable.value = true;
    return;
  }
  regexDisable.value = false;
}
async function editMusicBot() {
  const body = () => {
    if (!selectedPlaylist.value) {
      return {
        name: botName.value,
      };
    } else {
      return {
        playlist: selectedPlaylist.value.value,
        name: botName.value,
      };
    }
  };
  disableBtn.value = true;
  try {
    await $fetch(
      `${url.value}/api/v4/tservers/${route.params.id}/bots/${props.bot.musicBot.uuid}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(body()),
      },
    );
  } catch (err) {
    toast.add({
      title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
      timeout: 2000,
      color: 'red',
    });
  }
  disableBtn.value = false;
  emit('close');
  emit('refresh');
}
</script>
