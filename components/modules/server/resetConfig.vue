<template>
  <Teleport to="body">
    <section
      class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
    >
      <main
        class="text-white min-w-[25rem] bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
      >
        <button
          :disabled="disable"
          class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
          @click="$emit('close')"
        >
          <img class="w-3 mx-auto" src="/images/X-9.png" alt="" />
        </button>
        <h1 class="text-2xl my-4 font-extrabold">ریسیت/کانفیگ</h1>
        <p class="text-sm text-main_red mb-2">
          این عمل باعث پاک شدن تمامی اطلاعات فعلی سرور شما میشود، آیا اطمینان
          دارید؟
        </p>
        <p class="font-bold max-w-80 text-center ml-auto">: کانفیگ</p>

        <from v-if="status == 'success'" class="w-full my-4">
          <USelectMenu
            v-model="selectedConfigue"
            class="w-full"
            size="xl"
            color="indigo"
            :options="availables"
            option-attribute="domain"
          />
          <!-- <select
          v-if="!pending"
          v-model="selectedConfigue"
          :disabled="disable"
          class="w-full bg-transparent text-right appearance-none border rounded-xl p-3"
          name="locations"
        >
          <option
            v-for="available in availables"
            :key="available"
            :value="available"
            class="dropdown"
          >
            {{ available }}
          </option>
        </select> -->
        </from>
        <USkeleton
          v-else
          class="h-11 w-full rounded-lg my-4"
          :ui="{ background: 'dark:bg-gray-500' }"
        />
        <div class="grid">
          <button
            :class="disable || pending ? 'disable' : ''"
            :disabled="disable || pending"
            class="p-4 text-center flex justify-center rounded-xl bg-main_red module-btn"
            @click.prevent="changeConfigue()"
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
const disable = ref(false);
const toast = useToast();
// const availables = ref({});
const selectedConfigue = ref();

const {
  data: availables,
  error,
  status,
} = useFetch(
  `${url.value}/api/v4/tservers/${props.selectedServer.uuid}/reset-config/available`,
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
}

async function changeConfigue() {
  disable.value = true;
  const { error } = await useFetch(
    `${url.value}/api/v4/tservers/${props.selectedServer.uuid}/reset-config`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        config: `${selectedConfigue.value}`,
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
</script>
