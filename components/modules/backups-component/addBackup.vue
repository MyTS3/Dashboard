<template>
  <section
    class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
  >
    <main
      class="text-white max-w-[30rem] w-full bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
    >
      <template v-if="!pending">
        <button
          :disabled="disable"
          class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
          @click="$emit('close')"
        >
          <img class="w-3 mx-auto" src="/images/X-9.png" alt="" />
        </button>
        <header class="mb-4 mt-2">
          <h1>ساخت بکاپ</h1>
          <p class="mt-2 text-sm opacity-35">
            سرور و دوره مدنظر خودرا انتخاب کنید
          </p>
        </header>
        <p class="text-right my-3">سرور</p>
        <select
          v-if="!pending"
          v-model="serverUuid"
          class="p-2 appearance-none rounded-xl bg-transparent border text-right"
        >
          <option
            v-for="server in servers"
            :key="server.uuid"
            :value="server.uuid"
          >
            {{ server.name }}
          </option>
        </select>
        <USkeleton
          v-if="pending"
          class="h-10 w-full rounded-xl mx-auto"
          :ui="{ background: 'dark:bg-gray-500' }"
        />
        <p class="text-right my-3">دوره</p>
        <select
          v-if="!pending"
          v-model="interval"
          class="p-2 appearance-none rounded-xl bg-transparent border text-right"
        >
          <option :value="undefined">یک بار</option>
          <option :value="'hourly'">ساعتی</option>
          <option :value="'daily'">روزانه</option>
          <option :value="'weekly'">هفتگی</option>
        </select>
        <USkeleton
          v-if="pending"
          class="h-10 w-full rounded-xl mx-auto"
          :ui="{ background: 'dark:bg-gray-500' }"
        />
        <button
          :class="disable || pending ? 'opacity-45' : ''"
          class="w-full flex p-4 bg-main_blue rounded-xl mt-8 mb-2 justify-center"
          @click="create()"
        >
          <p v-if="!disable">افزودن</p>
          <TheLoading v-else />
        </button>
      </template>
    </main>
  </section>
</template>
<script setup>
import TheLoading from '~/components/reusable/theLoading.vue';

const disable = ref(false);
const store = apiStore();
const { url } = storeToRefs(store);
const emit = defineEmits(['close']);
const toast = useToast();
const interval = ref();
const serverUuid = ref();
const servers = ref();

const { data: response, error } = useFetch(`${url.value}/api/v4/tservers/`, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});
watch(response, () => (servers.value = response.value));

if (error.value) {
  toast.add({
    title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
    timeout: 2000,
    color: 'red',
  });
}

async function create() {
  disable.value = true;
  const { error } = await useFetch(`${url.value}/api/v4/snapshots`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      tServerUUID: serverUuid.value,
      interval: interval.value,
    }),
  });
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
</script>
