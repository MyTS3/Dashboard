<template>
  <section
    class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
  >
    <main
      class="text-white min-w-96 bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
    >
      <button
        @click="$emit('close')"
        class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
      >
        X
      </button>
      <h1 class="text-xl my-4 font-bolder">خاموش کردن سرور</h1>
      <p class="font-thin max-w-80 text-center mx-auto mb-4 mx-10">
        <span>daniel.v4.myts3.ir</span>
        شما در حال خاموش کردن سرور هستید ایا اطمینان دارید؟
      </p>
      <div class="grid grid-cols-2 gap-3">
        <button
          @click="$emit('close')"
          class="p-4 text-center rounded-xl border-2 border-blue-700/80 bg-blue-600/20 module-btn"
        >
          لغو
        </button>
        <button
          @click.prevent="turnOffserver()"
          class="p-4 text-center rounded-xl bg-main_red module-btn"
        >
          خاموش
        </button>
      </div>
    </main>
  </section>
</template>
<script setup>
import nuxtStorage from "nuxt-storage";
import { apiStore } from "~/stores/apistore";
import { storeToRefs } from "pinia";
const props = defineProps(["selectedServer"]);
const emit = defineEmits(["close"]);
const store = apiStore();
const { url } = storeToRefs(store);
async function turnOffserver() {
  const response = await $fetch(
    `${url.value}/api/v1/tservers/${props.selectedServer.uuid}/stop`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${nuxtStorage.localStorage.getData("token")}`,
      },
    }
  );
  emit("close");
}
</script>
