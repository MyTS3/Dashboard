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
        <h1 class="my-4 font-bold text-xl">ری استارت کردن سرور</h1>
        <p class="text-center max-w-96 text-xs mx-auto text-white/70 mx-6">
          <span class="text-white text-sm">{{ selectedServer.name }}</span>
          این عمل باعث ری استارت شدن میشود و ممکن است کمی طول بکشد
        </p>
        <h2 class="text-right mt-3 mb-1">:دلیل</h2>
        <input
          v-model="reasson"
          :disabled="disable"
          class="my-4 bg-transparent border p-3 rounded-xl text-right"
          type="text"
        />
        <div class="grid grid-cols-2 gap-3">
          <button
            :disabled="disable"
            class="p-4 text-center rounded-xl border-2 border-blue-700/80 bg-blue-600/20 module-btn"
            @click="$emit('close')"
          >
            لغو
          </button>
          <button
            :disabled="disable"
            class="p-4 flex justify-center text-center rounded-xl bg-main_red module-btn"
            @click="restartServer()"
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
import { apiStore, storeToRefs } from '#imports';
import TheLoading from '~/components/reusable/theLoading.vue';
const props = defineProps(['selectedServer']);
const emit = defineEmits(['close', 'restart']);
const store = apiStore();
const { url } = storeToRefs(store);
const disable = ref(false);
const reasson = ref();
const toast = useToast();
async function restartServer() {
  pauseRequests.value = true;
  disable.value = true;
  try {
    await $fetch(
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
  } catch {
    toast.add({
      title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
      timeout: 2000,
      color: 'red',
    });
  }
  pauseRequests.value = false;
  emit('restart');
  emit('close');

  disable.value = false;
}
</script>
