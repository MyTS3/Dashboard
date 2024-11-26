<template>
  <section
    class="h-screen absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
  >
    <main
      class="text-white h-2/3 min-w-96 bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
    >
      <button
        :class="disable ? 'disable' : ''"
        :disabled="disable"
        class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
        @click="$emit('close')"
      >
      <img class="w-3 mx-auto" src="/images/X-9.png" alt="" >
      </button>
      <h1 class="my-4 mx-24">
        <span>( {{ props.user }} )</span> تغییر رنک سرور گروه های
      </h1>
      <div class="flex flex-col gap-4 overflow-y-scroll">
        <!-- //////////////////////////////lists -->
        <div class="flex flex-col gap-3 bg-blue-600/5 p-3 rounded-xl">
          <li
            v-for="serverGroup in queryServerGroups"
            :key="serverGroup.sgid"
            class="flex gap-2"
          >
            <button
              v-if="!isAssigned(serverGroup)"
              class="checkbox"
              @click="
                toApply[serverGroup.sgid] = { serverGroup, action: 'add' }
              "
            />
            <button
              v-if="isAssigned(serverGroup)"
              class="checkbox-active"
              @click="
                toApply[serverGroup.sgid] = {
                  serverGroup,
                  action: 'remove',
                }
              "
            />
            <p>{{ serverGroup.name }}</p>
          </li>
        </div>
        <!-- //////////////////////////////////list -->
        <div class="flex flex-col gap-3 bg-blue-600/5 p-3 rounded-xl">
          <li
            v-for="serverGroup in serverGroups"
            :key="serverGroup.sgid"
            class="flex gap-2"
          >
            <button
              v-if="!isAssigned(serverGroup)"
              class="checkbox"
              @click="
                toApply[serverGroup.sgid] = { serverGroup, action: 'add' }
              "
            />
            <button
              v-if="isAssigned(serverGroup)"
              class="checkbox-active"
              @click="
                toApply[serverGroup.sgid] = { serverGroup, action: 'remove' }
              "
            />
            <p>{{ serverGroup.name }}</p>
          </li>
        </div>
      </div>
      <button
        :class="submitDisable ? 'opacity-45' : ''"
        :disabled="submitDisable"
        class="w-full mt-auto p-4 bg-main_blue rounded-xl my-2"
        @click="applyServerGroups()"
      >
        <p>اعمال تغییرات</p>
      </button>
      <p
        :class="submitDisable ? 'opacity-100' : 'opacity-0'"
        class="bg-mainbg_600 rounded-lg p-2 absolute left-1/2 -translate-x-1/2 bottom-[-3rem] transition-all"
      >
        {{ disableReasson }}
      </p>
    </main>
  </section>
</template>
<script setup lang="ts">
const store = apiStore();
const emit = defineEmits(['close']);
const { url } = storeToRefs(store);
const props = defineProps(['user', 'serverInfo']);
const ServerGroupsWeHave = ref<serverGroup[]>([]);
const serverGroups = ref<serverGroup[]>([]);
const queryServerGroups = ref<serverGroup[]>([]);
const disableReasson = ref('حداقل یک رنک باید انتخاب شود');
const toApply = ref<{
  [key: string]: { serverGroup: serverGroup; action: 'add' | 'remove' };
}>({});
const disable = ref(false);
const submitDisable = ref(false);
type serverGroup = {
  sgid: string;
  name: string;
  type: number;
  iconid: string;
  sortid: number;
};

async function getUserServerGroups() {
  const response: serverGroup[] = await $fetch(
    `${url.value}/api/v4/tservers/${props.serverInfo.uuid}/users/${props.user}/servergroups`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
  ServerGroupsWeHave.value = response;
}
async function getAllServerGroups() {
  const allServerGroups: serverGroup[] = await $fetch(
    `${url.value}/api/v4/tservers/${props.serverInfo.uuid}/servergroups`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
  allServerGroups.forEach((serverGroup) => {
    if (serverGroup.type == 2) queryServerGroups.value.push(serverGroup);
    if (serverGroup.type == 1) serverGroups.value.push(serverGroup);
  });
}

function isAssigned(serverGroup: serverGroup) {
  if (serverGroup.sgid in toApply.value)
    return toApply.value[serverGroup.sgid].action == 'add';
  return !!ServerGroupsWeHave.value.find((s) => s.sgid == serverGroup.sgid);
}

async function addServerGroup(sgid: string) {
  await $fetch(
    `${url.value}/api/v4/tservers/${props.serverInfo.uuid}/users/${props.user}/servergroups/${sgid}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
}
async function removeServerGroup(sgid: string) {
  await $fetch(
    `${url.value}/api/v4/tservers/${props.serverInfo.uuid}/users/${props.user}/servergroups/${sgid}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
}

async function applyServerGroups() {
  if (toApply.value) {
    disable.value = true;
    for (const sgid in toApply.value) {
      const { action, serverGroup } = toApply.value[sgid];
      switch (action) {
        case 'add': {
          if (!ServerGroupsWeHave.value.find((s) => s.sgid == sgid)) {
            await addServerGroup(serverGroup.sgid);
          }

          break;
        }
        case 'remove': {
          if (
            ServerGroupsWeHave.value.find((s) => s.sgid == sgid) &&
            ServerGroupsWeHave.value.length > 1
          ) {
            await removeServerGroup(serverGroup.sgid);
          }
          break;
        }
      }
    }
    disable.value = false;
  }

  emit('close');
}
function checkForDisAbling() {
  submitDisable.value = false;
  let removes = 0;
  for (const id in toApply.value) {
    if (
      toApply.value[id].action == 'remove' &&
      ServerGroupsWeHave.value.find(
        (server) => server.sgid == toApply.value[id].serverGroup.sgid,
      )
    )
      removes += 1;
  }
  if (removes >= ServerGroupsWeHave.value.length) submitDisable.value = true;
  for (const id in toApply.value) {
    if (toApply.value[id].action == 'add') submitDisable.value = false;
  }
}
watch(toApply.value, () => {
  checkForDisAbling();
});
await getUserServerGroups();
await getAllServerGroups();
</script>
