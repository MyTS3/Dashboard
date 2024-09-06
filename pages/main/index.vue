<template>
  <section
    style="max-width: 69rem;"
    class=" mt-6 grid w-full h-[40rem] mx-auto text-white  "
  >
    <main class="w-full flex flex-col bg-mainbg_500 rounded-2xl text">
      <div
        class=" bg-mainbg_300 rounded-t-2xl h-14 flex justify-around text-center"
      >
        <div class="w-1/5">
          <p>نام</p>
        </div>
        <div class="flex w-2/3 justify-around text-center">
          <p>تعداد اسلات</p>
          <p>تاریخ ساخت</p>
          <p>عمل</p>
        </div>
      </div>
      <div
        class="flex justify-around items py-7 text-center"
        v-for="server in servers"
      >
        <div class="w-1/5">
          <p>{{server.name}}</p>
        </div>
        <div class="flex w-2/3 justify-around text-center">
          <p>{{server.slots}}</p>
          <p>{{server.createdAt}}</p>
          <img src="/images/trash.png" alt="" />
        </div>
      </div>
      <button
        @click.prevent="makeServerTab=true"
        class="flex w-full items-center justify-center btn rounded-xl mt-auto py-3"
      >
        ساخت سرور
        <img src="/images/addon.png" alt="" />
      </button>
    </main>
  </section>
  <makeServer
    v-if="makeServerTab"
    @close="makeServerTab=false,reloadNuxtApp()"
  />
</template>
<script setup>
  import nuxtStorage from 'nuxt-storage';

import makeServer from "/components/modules/makeServer.vue"
const router = useRouter()
////
import { apiStore } from "~/stores/apistore";
import { storeToRefs } from "pinia";
//////
////variables
const store = apiStore()
const {url} = storeToRefs(store)

/////

/////
const route = useRoute()
const makeServerTab = ref(false)
const servers = ref()
// functions
async function getServers() {
  const response = await $fetch(`${url.value}/api/v1/tservers/`,{
        method:"GET",
        headers:{
          'Authorization': `Bearer ${nuxtStorage.localStorage.getData('token')}`
        }
      })

 servers.value = response
}


function serverClicked(server){
  router.push(`/main/teamspeak/${server.uuid}`)
}
///////////////////////////calling functions
await getServers()
</script>
