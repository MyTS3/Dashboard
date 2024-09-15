<template>
  <div>
    <Table>
      <div class="h-full overflow-y-scroll">
        <div class="table bg-mainbg_300 rounded-t-2xl">
          <p>نام</p>
          <p>تعداد اسلات</p>
          <p>تاریخ ساخت</p>
          <p>عمل</p>
        </div>
        <div v-for="server in servers" :key="server.uuid" class="table items">
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
      </div>
      <button
        @click.prevent="makeServerTab = true"
        class="flex w-full items-center justify-center btn rounded-xl mt-auto py-3"
      >
        ساخت سرور
        <img src="/images/addon.png" alt="" />
      </button>
    </Table>
    <makeServer
      :selectedServer="selectedServer"
      v-if="makeServerTab"
      @close="getServers(), (makeServerTab = false)"
    />
    <DeleteServer
      :selectedServer="selectedServer"
      @close="getServers(), (ServerDeleteTab = false)"
      v-if="ServerDeleteTab"
    />
  </div>
</template>
<script setup>
import TimeAgo from 'javascript-time-ago';
import fa from 'javascript-time-ago/locale/fa';
import Table from '~/components/reusable/table.vue';
import makeServer from '/components/modules/makeServer.vue';
import { apiStore } from '~/stores/apistore';
import { storeToRefs } from 'pinia';
import DeleteServer from '~/components/modules/server/deleteServer.vue';

const store = apiStore();
const { url } = storeToRefs(store);
const makeServerTab = ref(false);
const servers = ref();
const ServerDeleteTab = ref(false);
const selectedServer = ref();
const router = useRouter();
TimeAgo.addLocale(fa);
const timeAgo = new TimeAgo('fa');

async function getServers() {
  const response = await $fetch(`${url.value}/api/v4/tservers/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
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
