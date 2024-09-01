<template>
  <section class="h-full relative">
    <header class="relative">
      <h1 class="text-center my-4">سرور</h1>
      <img
        @click.prevent="deleteServerTab=true"
        class="absolute right-4 top-0 cursor-pointer "
        src="/images/trash.png"
        alt=""
      />
      <img src="/images/seprator-line.png" alt="" />
    </header>
    <main class="list-none">
      <li class="grid gridList p-2 ">
        <p>{{ selectedServer.name }}</p>
        <p>:نام</p>
      </li>
      <li class="grid gridList p-2  relative">
        <p>{{selectedServer.slots}}</p>
        <p>:تعداد اسلات</p>
        <button class="absolute left-4" @click="changeSlotTab=true">
          <img src="/images/edit.png" alt="" />
        </button>
      </li>
      <li class="grid gridList p-2 relative">
        <p :style="{'-webkit-text-security':showYatqaPass}">
          {{selectedServer.queryPassword}}
        </p>
        <p>:رمز یاتکا</p>
        <div class="absolute left-4">
          <button @click.prevent="yatqaPassReset=true">
            <img src="/images/edit.png" alt="" />
          </button>
          <button @click="copyYatqaPass()">
            <img src="/images/copy.png" alt="" />
          </button>
          <button @click.prevent="showYatqaPass='none'  ">
            <img src="/images/hide.png" alt="" />
          </button>
        </div>
      </li>
      <li class="grid gridList p-2 ">
        <p>
          {{selectedServer.queryPort}}
        </p>
        <p>پورت</p>
      </li>
      <li class="grid gridList p-2 ">
        <p>{{selectedServer.uuid}}</p>
        <p>آیدی</p>
      </li>
      <li class="grid gridList p-2 ">
        <p>{{selectedServer.version}}</p>
        <p>:ورژن</p>
      </li>
      <li v-if="selectedServer.mustRunning" class="grid gridList p-2 relative">
        <p>
          {{selectedServer.deployedOn}}
        </p>
        <p>:موقعیت مکانی</p>
        <button @click.prevent="serverLocationTab=true" class="absolute left-4">
          <img src="/images/location.png" alt="" />
        </button>
      </li>
      <li class="grid gridList p-2 relative">
        <p v-if="!selectedServer.mustRunning" class="text-main_red">خاموش</p>
        <p v-if="selectedServer.mustRunning" class="text-main_green">روشن</p>
        <p>:وضعیت</p>
        <div class="absolute left-4 top-1/3">
          <input
            :checked="selectedServer.mustRunning"
            class="hidden"
            type="checkbox"
            id="server-status"
            @click.prevent="turnServerOffOrOn()"
          />
          <label class="button" for="server-status"></label>
        </div>
      </li>
    </main>
    <footer
      class="grid grid-cols-2 gap-5 w-full absolute bottom-10 p-4
      
    "
    >
      <button
        class="flex border w-full gap-3 justify-center h-20 items-center  rounded-l-xl btn"
      >
        <p>ری استارت</p>
        <img src="/images/restart.png" alt="" />
      </button>
      <button
        class="flex border w-full gap-3 justify-center h-20 items-center  rounded-r-xl btn"
      >
        <p>لیست بن ها</p>
        <img src="/images/ban_list.png" alt="" />
      </button>
      <button
        class="flex border w-full gap-3 justify-center h-20 items-center  rounded-l-xl btn"
      >
        <p>ریسیت کانفگ</p>
        <img src="/images/ban_list.png" alt="" />
      </button>
      <button
        class="flex border w-full gap-3 justify-center h-20 items-center  rounded-r-xl btn"
      >
        <p>ساب دامنه ها</p>
        <img src="/images/ban_list.png" alt="" />
      </button>
    </footer>
  </section>
  <changeSlot
    :selectedServer="selectedServer"
    @close="getServerDeatails(),changeSlotTab=false"
    v-if="changeSlotTab"
  />
  <yatqaPassChange
    :selectedServer="selectedServer"
    @close="yatqaPassReset=false"
    v-if="yatqaPassReset"
  />
  <moveLocation
    :selectedServer="selectedServer"
    v-if="serverLocationTab"
    @close="serverLocationTab=false "
  />
  <restartServer class="hidden" />
  <turnoffServer
    :selectedServer="selectedServer"
    @close="turnOffServerTab = false,getServerDeatails()"
    v-if="turnOffServerTab"
  />
  <deleteServer @close="deleteServerTab=false" v-if="deleteServerTab" />
  <banList class="hidden" />
  <unban class="hidden" />
</template>
<script setup>
import changeSlot from './modules/server/changeSlot.vue'
import yatqaPassChange from './modules/server/yatqaPassChange.vue'
import moveLocation from './modules/server/moveLocation.vue'
import restartServer from './modules/server/restartServer.vue'
import turnoffServer from './modules/server/turnoffServer.vue'
import deleteServer from './modules/server/deleteServer.vue'
import banList from './modules/server/banList.vue'
import unban from './modules/server/unban.vue'
/////
import { apiStore } from "~/stores/apistore";
import { storeToRefs } from "pinia";
////
const deleteServerTab = ref(false)
const changeSlotTab = ref(false)
const showYatqaPass = ref('disc')
const yatqaPassReset = ref(false)
const turnOffServerTab = ref(false)
const serverLocationTab =ref(false)
///
const route = useRoute()
const store = apiStore()
const {url} = storeToRefs(store)
//////
const selectedServer = ref()
async function getServerDeatails(){
  // `${url.value}/api/v1/tservers/{uuid}`
  const serverDetails = await $fetch(`${url.value}/api/v1/tservers/${route.params.id}`)
  selectedServer.value =  await serverDetails
}
function copyYatqaPass(){
  navigator.clipboard.writeText(selectedServer.queryPassword)
}
async function turnServerOffOrOn(){
  if (selectedServer.value.mustRunning == true) {
    turnOffServerTab.value = true
  }
  else {
    const respone = await $fetch(`${url.value}/api/v1/tservers/${selectedServer.value.uuid}/start`,{method:"POST"})
    await getServerDeatails()
  }
}
await getServerDeatails()
</script>
