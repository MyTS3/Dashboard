<template>
  <section
    class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex
      justify-center top-0 left-0 items-center
      "
  >
    <main
      class="text-white min-w-96 bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative
        rounded-xl font-medium
        "
    >
      <button
        @click="$emit('close')"
        class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
      >
        X
      </button>
      <h1 class="text-xl my-4 font-bolder">آن بن</h1>
      <h2 v-if="unBaning.name"><span>name={{ unBaning.name }}, ip={{unBaning.ip}}</span></h2>
      <h2 v-if="unBaning.uid"><span>uid = {{ unBaning.uid }}</span></h2>
      <p class="font-medium max-w-80 text-center mx-auto mb-4">
        شما در حال حذف بن هستید
      </p>
      <div class="grid grid-cols-2 gap-3">
        <button
        @click="$emit('close')"
          class="p-4 text-center rounded-xl border-2 border-blue-700/80 bg-blue-600/20 module-btn"
        >
          لغو
        </button>
        <button @click.prevent="deleteBan()" class="p-4 text-center rounded-xl bg-main_red module-btn">
          حذف
        </button>
      </div>
    </main>
  </section>
</template>
<script setup>
import nuxtStorage from 'nuxt-storage';
import { apiStore } from "~/stores/apistore";
import { storeToRefs } from "pinia";
//variables
const store = apiStore()
const {url} = storeToRefs(store)
const props = defineProps(["unBaning","selectedServer"])
const emit = defineEmits(["close"])
async function deleteBan(){
  const respone = await $fetch(`${url.value}/api/v1/tservers/${props.selectedServer.uuid}/bans/${props.unBaning.banid}`,{
    method:"DELETE",
    headers:{
          'Authorization': `Bearer ${nuxtStorage.localStorage.getData('token')}`
        }
  })
  emit("close")
}
</script>
