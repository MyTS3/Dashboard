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
      <h1 class="my-4">کیک از چنل</h1>
      <label class="text-right">:دلیل</label>
      <input
        v-model="reason"
        class="my-4 bg-transparent border p-3 rounded-xl text-right"
        type="text"
      />
      <div class="grid grid-cols-2 gap-3">
        <button
          @click="$emit('close')"
          class="p-4 text-center rounded-xl border-2 border-blue-700/80 bg-blue-600/20 module-btn"
        >
          لغو
        </button>
        <button
          @click.prevent="kickUser()"
          class="p-4 text-center rounded-xl bg-main_red module-btn"
        >
          تایید
        </button>
      </div>
    </main>
  </section>
</template>
<script setup>
import nuxtStorage from "nuxt-storage";
const store = apiStore();
const { url } = storeToRefs(store);
const props = defineProps(["serverInfo", "user"]);
const emit = defineEmits("close");
const reason = ref("");
async function kickUser() {
  const response = await $fetch(
    `${url.value}/api/v1/tservers/${props.serverInfo.uuid}/users/${props.user}/kick-from-channel`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${nuxtStorage.localStorage.getData("token")}`,
      },
      body: JSON.stringify({
        reason: reason.value,
      }),
    },
  );
  emit("close");
}
</script>
