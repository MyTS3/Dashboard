<template>
  <Teleport to="body">
    <section
      class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
    >
      <main
        class="text-white w-full max-w-[30rem] bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
      >
        <button
          :disabled="disable"
          class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
          @click="$emit('close')"
        >
          <img class="w-3 mx-auto" src="/images/X-9.png" alt="" />
        </button>
        <h1 class="text-2xl my-4 font-extrabold">افزودن موزیک</h1>
        <div class="flex w-full justify-center"></div>
        <main class="p-4">
          <p class="mb-2 text-white/60 text-right">موزیک خودرا آپلود کنید</p>
          <UInput
            :disabled="disable"
            @change="handleUpload"
            accept="audio/*"
            v-model="uploadedMusic"
            type="file"
            size="xl"
            icon="i-heroicons-folder"
          />
        </main>

        <div class="grid">
          <button
            :class="disable ? 'disable' : ''"
            :disabled="disable"
            class="p-4 text-center flex justify-center rounded-xl bg-main_blue module-btn"
            @click="uploadMusic()"
          >
            <p v-if="!disable">تایید</p>
            <TheLoading v-else />
          </button>
        </div>
      </main>
    </section>
  </Teleport>
</template>
<script setup>
import { apiStore } from '~/stores/apistore';
import { storeToRefs } from 'pinia';
import TheLoading from '~/components/reusable/theLoading.vue';
//variables
const tab = ref(1);
const store = apiStore();
const selectedServer = useRoute().params.id;
const uploadedMusic = ref();
const { url } = storeToRefs(store);
const props = defineProps(['selectedPlaylist', 'row']);
const disable = ref(false);
const emit = defineEmits(['close', 'pause', 'resume']);
const musicURL = ref();
const stream = ref();
const toast = useToast();
function handleUpload(e) {
  const supportedFormats = [
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/flac',
  ];
  const file = e[0];

  if (!file) return;
  if (!supportedFormats.includes(file.type)) {
    toast.add({
      title: 'این فایل پشتیبانی نمیشود',
      timeout: 2000,
      color: 'red',
    });
    return;
  }
  // Optional: validate extension too
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!['mp3', 'wav', 'ogg', 'flac'].includes(ext || '')) {
    return;
  }
  const myData = new FormData();
  myData.append('file', file);
  stream.value = myData;
}
async function uploadMusic() {
  emit('pause');
  disable.value = true;
  try {
    await fetch(
      `${url.value}/api/v4/tservers/${selectedServer}/bots/${props.row.musicBot.uuid}/musics/file`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: stream.value,
      },
    );
    disable.value = false;
  } catch {
    toast.add({
      title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
      timeout: 2000,
      color: 'red',
    });
  }
  emit('resume');
  emit('close');
}
//
</script>
