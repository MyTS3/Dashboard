<template>
  <Teleport to="body">
    <section
      class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
    >
      <main
        class="text-white max-w-[30rem] bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
      >
        <button
          :disabled="disable"
          class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
          @click="$emit('close')"
        >
          <img class="w-3 mx-auto" src="/images/X-9.png" alt="" />
        </button>
        <h1 class="text-2xl my-4 font-extrabold">ریستور بک آپ</h1>
        <p class="text-sm text-main_red mb-2">
          این عمل باعث میشود تمامی اطلاعات جدید سرور شما پاک شود و سرور شما به
          زمانی که بکاپ را گرفته اید برگرداند، آیا اطمینان دارید؟
        </p>
        <p class="font-bold max-w-80 text-center ml-auto">
          سرور خود را انتخاب کنید
        </p>
        <!-- <from class="w-full my-4">
          <select
            v-model="tserverUUid"
            class="w-full bg-transparent text-right appearance-none border rounded-xl p-3"
            name="locations"
          >
            <option
              v-for="server in servers"
              :key="server"
              :value="server.uuid"
            >
              {{ server.name }}
            </option>
          </select>
        </from> -->
        <USelectMenu
          v-model="tserverUUid"
          class="w-full my-4"
          size="xl"
          color="indigo"
          :options="servers"
        />
        <div class="grid">
          <button
            :disabled="disable"
            class="p-4 text-center rounded-xl flex justify-center bg-main_red module-btn"
            @click="deployBackup()"
          >
            <p v-if="!disable">تایید</p>
            <theLoading v-else />
          </button>
        </div>
      </main>
    </section>
  </Teleport>
</template>
<script setup>
import theLoading from '~/components/reusable/theLoading.vue';
const store = apiStore();
const { url } = storeToRefs(store);

const disable = ref(false);
const props = defineProps(['selecteduuid']);
const emit = defineEmits(['close']);
const tserverUUid = ref();
const servers = ref([]);
const toast = useToast();
async function getServers() {
  const { data: response, error } = await useFetch(
    `${url.value}/api/v4/tservers/`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
  if (error.value) {
    toast.add({
      title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
      timeout: 2000,
      color: 'red',
    });
  } else {
    response.value.map((server) => {
      servers.value.push({
        label: server.name,
        value: server.uuid,
      });
    });
  }
}
async function deployBackup() {
  disable.value = true;
  const { error } = await useFetch(
    `${url.value}/api/v4/snapshots/${props.selecteduuid}/deploy`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        tServerUUID: tserverUUid.value.value,
      }),
    },
  );
  if (error.value) {
    toast.add({
      title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
      timeout: 2000,
      color: 'red',
    });
  }
  disable.value = false;
  emit('close');
}
await getServers();
</script>
