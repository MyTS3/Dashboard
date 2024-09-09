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
      <h1 class="my-4 mx-24">
        <span>( {{ props.user }} )</span> تغییر رنک سرور گروه های
      </h1>
      <div class="flex flex-col gap-4">
        <!-- //////////////////////////////lists -->
        <div class="flex flex-col gap-3 bg-blue-600/5 p-3 rounded-xl">
          <li v-for="servergroup in queryServerGroups" class="flex gap-2">
            <button class="checkbox"></button>
            <button class="checkbox-active"></button>
            <p>{{ servergroup.name }}</p>
          </li>
        </div>
        <!-- //////////////////////////////////list -->
        <div class="flex flex-col gap-3 bg-blue-600/5 p-3 rounded-xl">
          <li v-for="serverGroup in serverGroups" class="flex gap-2">
            <button
              v-if="!isAssigned(serverGroup)"
              @click="
                toApply[serverGroup.sgid] = { serverGroup, action: 'add' }
              "
              class="checkbox"
            ></button>
            <button
              v-if="isAssigned(serverGroup)"
              @click="
                toApply[serverGroup.sgid] = { serverGroup, action: 'remove' }
              "
              class="checkbox-active"
            ></button>
            <p>{{ serverGroup.name }}</p>
          </li>
        </div>
      </div>
      <button
        @click="applyServerGroups()"
        class="w-full p-4 bg-main_blue rounded-xl my-2"
      >
        اعمال تغییرات
      </button>
    </main>
  </section>
</template>
<script setup lang="ts">
import nuxtStorage from "nuxt-storage";
const store = apiStore();
const { url } = storeToRefs(store);
const props = defineProps(["user", "serverInfo"]);
const ServerGroupsWeHave = ref<serverGroup[]>([]);
const serverGroups = ref<serverGroup[]>([]);
const queryServerGroups = ref<serverGroup[]>([]);
const toApply = ref<{[key: string]: { serverGroup: serverGroup; action: "add" | "remove" };}>({});

type serverGroup = {
  sgid: string;
  name: string;
  type: number;
  iconid: string;
  sortid: number;
};

async function getUserServerGroups() {
  const response: serverGroup[] = await $fetch(
    `${url.value}/api/v1/tservers/${props.serverInfo.uuid}/users/${props.user}/servergroups`,
    {
      headers: {
        Authorization: `Bearer ${nuxtStorage.localStorage.getData("token")}`,
      },
    },
  );
  ServerGroupsWeHave.value = response;
}
async function getAllServerGroups() {
  const response: serverGroup[] = await $fetch(
    `${url.value}/api/v1/tservers/${props.serverInfo.uuid}/servergroups`,
    {
      headers: {
        Authorization: `Bearer ${nuxtStorage.localStorage.getData("token")}`,
      },
    },
  );
  const allServerGroups = response;
  allServerGroups.forEach((serverGroup) => {
    if (serverGroup.type == 2) queryServerGroups.value.push(serverGroup);
    if (serverGroup.type == 1) serverGroups.value.push(serverGroup);
  });
}

function isAssigned(serverGroup: serverGroup) {
  if (serverGroup.sgid in toApply.value)
    return toApply.value[serverGroup.sgid].action == "add";
  return !!ServerGroupsWeHave.value.find((s) => s.sgid == serverGroup.sgid);
}

async function addServerGroup(sgid: string) {
  const response = await $fetch(
    `${url.value}/api/v1/tservers/${props.serverInfo.uuid}/users/${props.user}/servergroups/${sgid}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${nuxtStorage.localStorage.getData("token")}`,
      },
    },
  );
}
async function removeServerGroup(sgid: string) {
  const response = await $fetch(
    `${url.value}/api/v1/tservers/${props.serverInfo.uuid}/users/${props.user}/servergroups/${sgid}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${nuxtStorage.localStorage.getData("token")}`,
      },
    },
  );
}

async function applyServerGroups() {
  console.log(toApply.value)
  // for (const sgid in toApply.value) {
  //   const { action, serverGroup } = toApply.value[sgid];
  //   switch (action) {
  //     case "add": {
  //       await addServerGroup(serverGroup.sgid);
  //       break;
  //     }
  //     case "remove": {
  //       await removeServerGroup(serverGroup.sgid);
  //       break;
  //     }
  //   }
  // }
}

await getUserServerGroups();
await getAllServerGroups();
</script>
