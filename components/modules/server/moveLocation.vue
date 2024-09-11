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
      <h1 class="text-xl my-4 font-bolder">انتقال سرور به مکانی دیگر</h1>
      <p class="font-bold max-w-80 text-center ml-auto">:لوکیشن مد نظر</p>
      <from class="w-full my-4">
        <select
          class="w-full bg-transparent text-right appearance-none border rounded-xl p-3"
          v-model="selectedLocation"
          name="locations"
        >
          <option
            v-for="available in availables"
            :value="available.node"
            class="dropdown"
          >
            {{ available.node }}
          </option>
        </select>
      </from>
      <div class="grid grid-cols-2 gap-3">
        <button
          @click="$emit('close')"
          class="p-4 text-center rounded-xl border-2 border-blue-700/80 bg-blue-600/20 module-btn"
        >
          لغو
        </button>
        <button
          :class="disable?'disable':'' "
          :disabled="disable"
          @click.prevent="moveServer()"
          class="p-4 text-center rounded-xl bg-main_blue module-btn"
        >
          تایید
        </button>
      </div>
    </main>
  </section>
</template>
<script setup>
import { apiStore } from "~/stores/apistore";
import { storeToRefs } from "pinia";
const emit = defineEmits(["close"]);
const props = defineProps(["selectedServer"]);
const store = apiStore();
const { url } = storeToRefs(store);
const disable = ref(false)
////////
const availables = ref({});
const selectedLocation = ref();
async function getAvailble() {
  disable.value = true
  const respone = $fetch(
    `${url.value}/api/v1/tservers/${props.selectedServer.uuid}/move/available`,
  );
  availables.value = await respone;
}
async function moveServer() {
  const respone = $fetch(
    `${url.value}/api/v1/tservers/${props.selectedServer.uuid}/move`,
    {
      method: "POST",
      body: JSON.stringify({
        node: `${selectedLocation.value}`,
      }),
    },
  );
  emit("close");
}
await getAvailble();
</script>
