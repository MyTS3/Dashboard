<template>
  <Teleport to="body">
    <section
      class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
    >
      <main
        class="text-white min-w-96 bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
      >
        <button
          :disabled="disable"
          class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
          @click="$emit('close')"
        >
          <img class="w-3 mx-auto" src="/images/X-9.png" alt="" />
        </button>
        <h1 class="text-xl my-4 font-bolder">خاموش کردن سرور</h1>
        <p class="font-thin max-w-80 text-center mx-auto mb-4 mx-10">
          <span>daniel.v4.myts3.ir</span>
          شما در حال خاموش کردن سرور هستید ایا اطمینان دارید؟
        </p>
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
            class="p-4 text-center rounded-xl flex justify-center bg-main_red module-btn"
            @click.prevent="turnOffserver()"
          >
            <p v-if="!disable">خاموش</p>
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
import { pauseRequests } from '#imports';
const props = defineProps(['selectedServer']);
const emit = defineEmits(['close']);
const disable = ref(false);
const store = apiStore();
const { url } = storeToRefs(store);
const toast = useToast();
async function turnOffserver() {
  disable.value = true;
  const { error } = await useFetch(
    `${url.value}/api/v4/tservers/${props.selectedServer.uuid}/stop`,
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
  } else pauseRequests.value = true;
  disable.value = false;
  emit('close');
}
</script>
