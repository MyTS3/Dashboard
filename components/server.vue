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
        <button class="absolute left-4">
          <img src="/images/edit.png" alt="" />
        </button>
      </li>
      <li class="grid gridList p-2 relative">
        <p>{{selectedServer.queryPassword}}</p>
        <p>:رمز یاتکا</p>
        <div class="absolute left-4">
          <button><img src="/images/edit.png" alt="" /></button>
          <button><img src="/images/copy.png" alt="" /></button>
          <button><img src="/images/hide.png" alt="" /></button>
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
      <li class="grid gridList p-2 relative">
        <p>
          {{selectedServer.deployedOn
          }}
        </p>
        <p>:موقعیت مکانی</p>
        <button class="absolute left-4">
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
            @click.prevent="shutDownServer()"
          />
          <label class="button" for="server-status"></label>
        </div>
      </li>
    </main>
    <footer
      class="flex justify-center w-full absolute bottom-10 gap-3
      items-center
    "
    >
      <button
        class="flex border w-full gap-3 justify-center h-16 items-center ml-3 rounded-l-xl btn"
      >
        <p>ری استارت</p>
        <img src="/images/restart.png" alt="" />
      </button>
      <button
        class="flex border w-full gap-3 justify-center h-16 items-center mr-3 rounded-r-xl btn"
      >
        <p>لیست بن ها</p>
        <img src="/images/ban_list.png" alt="" />
      </button>
    </footer>
  </section>
  <changeSlot class="hidden" />
  <yatqaPassChange class="hidden" />
  <moveLocation class="hidden" />
  <restartServer class="hidden" />
  <turnoffServer class="hidden" />
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
///
const route = useRoute()
const store = apiStore()
const {url} = storeToRefs(store)
let selectedServer = {}
async function getServerDeatails(){
  // `${url.value}/api/v1/tservers/{uuid}`
  const serverDetails = await $fetch(`${url.value}/api/v1/tservers/${route.params.id}`)
  selectedServer =  await serverDetails
}

await getServerDeatails()
</script>
