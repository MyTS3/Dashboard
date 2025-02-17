<template>
  <Teleport to="body">
    <section
      class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
    >
      <main
        class="text-white min-w-[25rem] bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
      >
        <button
          :disabled="disable"
          class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
          @click="$emit('close')"
        >
          <img class="w-3 mx-auto" src="/images/X-9.png" alt="" />
        </button>
        <h1 class="text-2xl my-4 font-extrabold">افزودن موزیک</h1>
        <p class="text-sm text-white/80 mb-1">
          روش افزودن موزیک خود را انتخاب کنید
        </p>
        <div class="flex w-full justify-center my-3">
          <button
            class="w-1/3 p-3 bg-mainbg_400 rounded-l-xl cursor-not-allowed"
          >
            آپلود فایل
          </button>
          <button class="w-1/3 p-3 bg-main_orange rounded-r-xl">
            دانلود با لینک
          </button>
        </div>

        <p class="font-bold max-w-80 text-center ml-auto">: دریافت لینک</p>
        <from class="w-full my-4">
          <input
            v-model="musicURL"
            placeholder="لینک موزیک خودرا وارد کنید"
            :disabled="disable"
            type="text"
            class="p-3 w-full bg-transparent border-white flex justify-center rounded-xl border text-right text-sm"
          />
          <USkeleton
            v-if="pending"
            class="h-11 w-full rounded-lg"
            :ui="{ background: 'dark:bg-gray-500' }"
          />
        </from>
        <div class="grid">
          <button
            :class="disable || pending ? 'disable' : ''"
            :disabled="disable || pending"
            class="p-4 text-center flex justify-center rounded-xl bg-main_blue module-btn"
            @click="makePlaylist"
            @click.prevent="addMusic"
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
const store = apiStore();
const { url } = storeToRefs(store);
const props = defineProps(['selectedPlaylist']);
const disable = ref(false);
const emit = defineEmits(['close']);
const musicURL = ref();
const toast = useToast();
async function addMusic() {
  disable.value = true;
  const { error } = await useFetch(
    `${url.value}/api/v4/playlists/${props.selectedPlaylist}/musics`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        url: musicURL.value,
      }),
    },
  );
  disable.value = false;
  if (error.value) {
    toast.add({
      title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
      timeout: 2000,
      color: 'red',
    });
  }
  emit('close');
}
</script>
