<template>
  <section
    class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
  >
    <main
      class="text-white min-w-[25rem] bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
    >
      <button
        @click="$emit('close')"
        class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
      >
        X
      </button>
      <h1 class="text-2xl my-4 font-extrabold">ریسیت/کانفیگ</h1>
      <p class="text-sm text-main_red mb-2">
        این عمل باعث پاک شدن تمامی اطلاعات فعلی سرور شما میشود، آیا اطمینان
        دارید؟
      </p>
      <p class="font-bold max-w-80 text-center ml-auto">: کانفیگ</p>
      <from class="w-full my-4">
        <select
          class="w-full bg-transparent text-right appearance-none border rounded-xl p-3"
          v-model="selectedConfigue"
          name="locations"
        >
          <option
            v-for="available in availables"
            :value="available"
            class="dropdown"
          >
            {{ available }}
          </option>
        </select>
      </from>
      <div class="grid">
        <button
          :class="disable ? 'disable' : ''"
          :disabled="disable"
          @click.prevent="changeConfigue()"
          class="p-4 text-center rounded-xl bg-main_red module-btn"
        >
          تایید
        </button>
      </div>
    </main>
  </section>
</template>
<script setup>
import nuxtStorage from 'nuxt-storage';
import { apiStore } from '~/stores/apistore';
import { storeToRefs } from 'pinia';
const emit = defineEmits(['close']);
const props = defineProps(['selectedServer']);
const store = apiStore();
const { url } = storeToRefs(store);
const disable = ref(false);

const availables = ref({});
const selectedConfigue = ref();

async function getAvailble() {
  const respone = $fetch(
    `${url.value}/api/v1/tservers/${props.selectedServer.uuid}/reset-config/available`,
    {
      headers: {
        Authorization: `Bearer ${nuxtStorage.localStorage.getData('token')}`,
      },
    },
  );
  availables.value = await respone;
  console.log(availables);
}
async function changeConfigue() {
  disable.value = true;
  const respone = $fetch(
    `${url.value}/api/v1/tservers/${props.selectedServer.uuid}/reset-config`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${nuxtStorage.localStorage.getData('token')}`,
      },
      body: JSON.stringify({
        config: `${selectedConfigue.value}`,
      }),
    },
  );
  emit('close');
}

await getAvailble();
</script>
