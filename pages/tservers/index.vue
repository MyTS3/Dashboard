<template>
  <section
    style="max-width: 69rem"
    class="mt-6 grid w-full h-[40rem] mx-auto text-white"
  >
    <main class="w-full flex flex-col bg-mainbg_500 rounded-2xl text">
      <div class="table bg-mainbg_300 rounded-t-2xl">
        <p>نام</p>
        <p>تعداد اسلات</p>
        <p>تاریخ ساخت</p>
        <p>عمل</p>
      </div>
      <div v-for="server in servers" class="table items">
        <p class="cursor-pointer" @click="serverClicked(server)">
          {{ server.name }}
        </p>
        <p>{{ server.slots }}</p>
        <p>{{ timeAgo.format(new Date(server.createdAt)) }}</p>
        <img
          @click="removeServer(server.name, server.uuid)"
          class="cursor-pointer"
          src="/images/trash.png"
          alt=""
        />
      </div>
      <button
        @click.prevent="makeServerTab = true"
        class="flex w-full items-center justify-center btn rounded-xl mt-auto py-3"
      >
        ساخت سرور
        <img src="/images/addon.png" alt="" />
      </button>
    </main>
  </section>
  <makeServer
    v-if="makeServerTab"
    @close="getServers(), (makeServerTab = false)"
  />
  <DeleteServer
    :selectedServer="selectedServer"
    @close="getServers(), (ServerDeleteTab = false)"
    v-if="ServerDeleteTab"
  />
</template>
<script setup>
import nuxtStorage from "nuxt-storage";
import TimeAgo from "javascript-time-ago";
import fa from "javascript-time-ago/locale/fa";
TimeAgo.addDefaultLocale(fa);
const timeAgo = new TimeAgo("fa");

import makeServer from "/components/modules/makeServer.vue";
const router = useRouter();
////
import { apiStore } from "~/stores/apistore";
import { storeToRefs } from "pinia";
import DeleteServer from "~/components/modules/server/deleteServer.vue";
//////
////variables
const store = apiStore();
const { url } = storeToRefs(store);
const route = useRoute();
const makeServerTab = ref(false);
const servers = ref();
const ServerDeleteTab = ref(false);
const selectedServer = ref();
// functions
async function getServers() {
  const response = await $fetch(`${url.value}/api/v1/tservers/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${nuxtStorage.localStorage.getData("token")}`,
    },
  });
  servers.value = response;
}
function removeServer(name, uuid) {
  ServerDeleteTab.value = true;
  selectedServer.value = { name: name, uuid: uuid };
}
function serverClicked(server) {
  router.push(`/tservers/${server.uuid}`);
}
///////////////////////////calling functions
await getServers();
</script>
<style scoped>
.table {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr;
  text-align: center;
  justify-items: center;
  padding: 1rem;
}
</style>
