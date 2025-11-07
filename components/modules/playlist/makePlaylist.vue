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
        <h1 class="text-2xl my-4 font-extrabold">ساخت پلی لیست</h1>
        <p class="text-sm text-white/80 mb-1">نام پلی لیست را وارد کنید</p>
        <p class="font-bold max-w-80 text-center ml-auto">: نام</p>

        <form class="w-full my-4">
          <input
            v-model="playlistName"
            maxlength="20"
            :disabled="disable"
            type="text"
            class="p-3 w-full bg-transparent border-white flex justify-center rounded-xl border"
          />
        </form>
        <div class="grid">
          <button
            :class="disable ? 'disable' : ''"
            :disabled="disable"
            class="p-4 text-center flex justify-center rounded-xl bg-main_blue module-btn"
            @click="makePlaylist"
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
import TheLoading from '@/components/reusable/theLoading.vue';
import { useToast } from '#imports';
const store = apiStore();
const { url } = storeToRefs(store);
const playlistName = ref();
const disable = ref(false);
const toast = useToast();
const emit = defineEmits(['close']);
async function makePlaylist() {
  disable.value = true;
  try {
    await $fetch(`${url.value}/api/v4/playlists`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        name: `${playlistName.value}`,
      }),
    });
  } catch {
    toast.add({
      title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
      timeout: 2000,
      color: 'red',
    });
  }

  disable.value = false;
  emit('close');
}
</script>
