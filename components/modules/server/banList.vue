<template>
  <section
    class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex
  justify-center top-0 left-0 items-center
  "
  >
    <main
      class="text-white bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative
    rounded-xl font-medium w-4/5 
    "
    >
      <button
        @click="$emit('close')"
        class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
      >
        X
      </button>
      <h1 class="my-4">لیست بن ها</h1>
      <table>
      <div
        style="gap: 2px;max-height: 20rem;"
        class="text-sm ban-list text-right relative overflow-y-scroll"
      >
        <div class="flex flex-col text-right bg-mainbg_400">
          <p class="items text-lg p-4">دلیل</p>
          <p
            class="items p-4 flex flex-row-reverse items-center"
            v-for="bans in banList"
          >
            {{bans.reason}}
            <p v-if="!bans.reason">بدون دلیل</p>
            <img
              @click="openUnBanPopUp(bans,index)"
              class="w-10 absolute left-8 cursor-pointer"
              src="/images/x-symbpl.png"
              alt=""
            />
          </p>
        </div>

        <div class="flex flex-col text-right bg-mainbg_400 ">
          <p class="items text-lg p-4">بن شده توسط</p>
          <p v-for="bans in banList" class="items p-4">
            {{bans.invokername}}
          </p>
        </div>
        <div class="flex flex-col text-right  bg-mainbg_400 ">
          <p class="items text-lg p-4">نام،آیپی،آیدی</p>
          <p v-for="bans in banList" class="items p-4">
            <span v-if="bans.name">name={{bans.name}},ip={{bans.ip}}</span>
            <span v-if="bans.uid">uid={{bans.uid}}</span>
          </p>
        </div>
      </div>
    </table>
    </main>
  </section>
  <unBan @close="getBanList(),unBanTab=false" :selectedServer="selectedServer" :unBaning="unBaning" v-if="unBanTab" />
</template>
<script setup>
import nuxtStorage from 'nuxt-storage';
import { apiStore } from "~/stores/apistore";
import { storeToRefs } from "pinia";
import unBan from './unban.vue'
import Table from '~/components/reusable/table.vue';
// variables
const props = defineProps(["selectedServer"])
const emit = defineEmits(["close"])
const store = apiStore()
const {url} = storeToRefs(store)
const banList = ref()
const unBaning = ref()
const unBanTab = ref(false)
//functions
async function getBanList(){
  const respone = await $fetch(`${url.value}/api/v1/tservers/${props.selectedServer.uuid}/bans`,{
    headers:{
          'Authorization': `Bearer ${nuxtStorage.localStorage.getData('token')}`
        },
  })
  banList.value = await respone
}
 function openUnBanPopUp(ban){
  unBaning.value = ban
  unBanTab.value = true
}
//
await getBanList()
</script>
