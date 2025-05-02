<template>
  <Teleport to="body">
    <section
      class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
    >
      <main
        class="text-white min-w-96 bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
      >
        <button
          :disabled="disable"
          class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
          @click="$emit('close')"
        >
          <img class="w-3 mx-auto" src="/images/X-9.png" alt="" />
        </button>
        <h1 class="text-xl my-4 font-bolder">انتقال سرور به مکانی دیگر</h1>
        <p class="font-bold max-w-80 text-center ml-auto">:لوکیشن مد نظر</p>
        <USkeleton
          v-if="status != 'success'"
          class="h-12 w-full my-4 rounded-lg"
          :ui="{ background: 'dark:bg-gray-500' }"
        />
        <from v-else class="w-full my-4">
          <USelectMenu
            v-model="selectedLocation"
            class="w-full"
            size="xl"
            color="indigo"
            :options="availableLocations"
            option-attribute="domain"
          />
          <!-- <select
            v-model="selectedLocation"
            :disabled="disable"
            class="w-full bg-transparent text-right appearance-none border rounded-xl p-3"
            name="locations"
          >
            <option
              v-for="available in availables"
              :key="available.node"
              :value="available.node"
              class="dropdown"
            >
              {{ available.node }}
            </option>
          </select> -->
        </from>
        <div class="grid grid-cols-2 gap-3">
          <button
            :disabled="disable"
            class="p-4 text-center rounded-xl border-2 border-blue-700/80 bg-blue-600/20 module-btn"
            @click="$emit('close')"
          >
            لغو
          </button>
          <button
            :class="disable ? 'disable' : ''"
            :disabled="disable"
            class="p-4 text-center rounded-xl bg-main_blue module-btn flex justify-center"
            @click.prevent="moveServer()"
          >
            <p v-if="!disable">تایید</p>
            <TheLoading v-else />
          </button>
        </div>
      </main>
    </section>
  </Teleport>
</template>
<script setup>
import { apiStore } from '~/stores/apistore';
import { storeToRefs } from 'pinia';
import TheLoading from '~/components/reusable/theLoading.vue';
const emit = defineEmits(['close']);
const props = defineProps(['selectedServer']);
const store = apiStore();
const { url } = storeToRefs(store);
const toast = useToast();
const disable = ref(false);
////////
const selectedLocation = ref();
const availableLocations = ref([]);
const {
  data: availables,
  error,
  status,
} = await useFetch(
  `${url.value}/api/v4/tservers/${props.selectedServer.uuid}/move/available`,
  {
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
} else
  availables.value.map((loc) => {
    availableLocations.value.push(loc.node);
  });

async function moveServer() {
  disable.value = true;
  try {
    await $fetch(
      `${url.value}/api/v4/tservers/${props.selectedServer.uuid}/move`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          node: `${selectedLocation.value}`,
        }),
      },
    );
  } catch {
    toast.add({
      title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
      timeout: 2000,
      color: 'red',
    });
  }
  emit('close');
}
</script>
