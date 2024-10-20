<template>
  <section
    class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
  >
    <main
      class="text-white min-w-96 bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
    >
      <button
        :disabled="disable"
        @click="$emit('close')"
        class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
      >
        X
      </button>
      <h1 class="my-4 font-bold text-xl">ری استارت کردن سرور</h1>
      <p class="text-center max-w-96 text-xs mx-auto text-white/70 mx-6">
        <span class="text-white text-sm">{{ selectedServer.name }}</span>
        این عمل باعث ری استارت شدن میشود و ممکن است کمی طول بکشد
      </p>
      <h2 class="text-right mt-3 mb-1">:دلیل</h2>
      <input
        :disabled="disable"
        v-model="reasson"
        class="my-4 bg-transparent border p-3 rounded-xl text-right"
        type="text"
      />
      <div class="grid grid-cols-2 gap-3">
        <button
          :disabled="disable"
          @click="$emit('close')"
          class="p-4 text-center rounded-xl border-2 border-blue-700/80 bg-blue-600/20 module-btn"
        >
          لغو
        </button>
        <button
          :disabled="disable"
          @click="restartServer()"
          class="p-4 flex justify-center text-center rounded-xl bg-main_red module-btn"
        >
          <p v-if="disable">تایید</p>
          <TheLoading v-else />
        </button>
      </div>
    </main>
  </section>
</template>
<script setup>
import { apiStore, storeToRefs } from '#imports';
import TheLoading from '~/components/reusable/theLoading.vue';
const props = defineProps(['selectedServer']);
const emit = defineEmits(['emit']);
const store = apiStore();
const { url } = storeToRefs(store);
const disable = ref(false);
const reasson = ref();
async function restartServer() {
  disable.value = true;
  const { error } = await useFetch(
    `${url.value}/api/v4/tservers/${props.selectedServer.uuid}/restart`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        reason: `${reasson.value}`,
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
