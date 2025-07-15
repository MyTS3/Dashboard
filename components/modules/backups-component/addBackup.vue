<template>
  <teleport to="body">
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
          <!-- <select
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
        </select> -->
          <USelectMenu
            v-model="serverUuid"
            class="w-full"
            size="xl"
            color="indigo"
            :options="serverDropdown"
          />
          <USkeleton
            v-if="pending"
            class="h-10 w-full rounded-xl mx-auto"
            :ui="{ background: 'dark:bg-gray-500' }"
          />
          <p class="text-right my-3">دوره</p>
          <!-- <select
          v-if="!pending"
          v-model="interval"
          class="p-2 appearance-none rounded-xl bg-transparent border text-right"
        >
          <option :value="undefined">یک بار</option>
          <option :value="'daily'">روزانه</option>
          <option :value="'weekly'">هفتگی</option>
          <option :value="'monthly'">ماهیانه</option>
        </select> -->
          <USelectMenu
            v-model="interval"
            class="w-full"
            size="xl"
            color="indigo"
            :options="intervals"
          />
          <USkeleton
            v-if="pending"
            class="h-10 w-full rounded-xl mx-auto"
            :ui="{ background: 'dark:bg-gray-500' }"
          />
          <div v-if="interval?.value in prices" id="price" class="w-full">
            <div
              class="flex justify-between flex-row-reverse mt-3 text-white/40"
            >
              <h1>:هزینه ساعتی</h1>
              <div class="flex flex-row-reverse gap-1 text-white/40">
                <span>{{
                  prices
                    ? Math.abs(
                        Math.floor(
                          (prices[interval.value].price /
                            prices[interval.value].secondsForPrice) *
                            3600,
                        ),
                      )
                    : '?'
                }}</span>
                <p>تومان</p>
              </div>
            </div>
            <div
              class="flex justify-between flex-row-reverse mt-3 text-white/40"
            >
              <h1>:هزینه روزانه</h1>
              <div class="flex flex-row-reverse gap-1 text-white/40">
                <span>{{
                  prices
                    ? Math.abs(
                        Math.floor(
                          (prices[interval.value].price /
                            prices[interval.value].secondsForPrice) *
                            86400,
                        ),
                      )
                    : '?'
                }}</span>
                <p>تومان</p>
              </div>
            </div>
            <div class="flex justify-between flex-row-reverse mt-3">
              <h1>:هزینه ماهانه</h1>
              <div class="flex flex-row-reverse gap-1">
                <span>{{
                  prices
                    ? Math.abs(
                        Math.floor(
                          (prices[interval.value].price /
                            prices[interval.value].secondsForPrice) *
                            2629800,
                        ),
                      )
                    : '?'
                }}</span>
                <p>تومان</p>
              </div>
            </div>
          </div>
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
  </teleport>
</template>
<script setup>
import TheLoading from '~/components/reusable/theLoading.vue';

const intervals = [
  {
    label: 'یک بار',
    value: 'undefined',
  },
  {
    label: 'روزانه',
    value: 'daily',
  },
  {
    label: 'هفتگی',
    value: 'weekly',
  },
  {
    label: 'ماهیانه',
    value: 'monthly',
  },
];
const disable = ref(false);
const store = apiStore();
const { url } = storeToRefs(store);
const emit = defineEmits(['close']);
const toast = useToast();
const interval = ref();
const serverUuid = ref();
const serverDropdown = ref([]);
const { data: servers, error } = await useFetch(
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
  servers.value.map((server) => {
    serverDropdown.value.push({
      label: server.name,
      value: server.uuid,
    });
  });
}
const { data: prices } = await useFetch(
  `${url.value}/api/v4/prices/snap-interval`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
);

async function create() {
  disable.value = true;
  const { error } = await useFetch(`${url.value}/api/v4/snapshots`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      tServerUUID: serverUuid.value.value,
      interval: interval.value.value,
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
