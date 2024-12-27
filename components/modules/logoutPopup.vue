<template>
  <section
    class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
  >
    <main
      class="text-white min-w-96 bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
    >
      <button
        class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
        @click="$emit('close')"
      >
        <img class="w-3" src="/images/X-9.png" alt="" />
      </button>
      <h1 class="text-xl my-4 font-bolder">خروج از حساب کاربری</h1>
      <p class="font-thin max-w-80 text-center mx-auto mb-4">
        آیا از این عمل مطمئن هستید؟
      </p>
      <div class="grid grid-cols-2 gap-btn">
        <button
          class="p-4 text-center rounded-xl border-2 border-blue-700/80 bg-blue-600/20 module-btn"
          @click="$emit('close')"
        >
          لغو
        </button>
        <button
          :class="disable ? 'disable' : ''"
          :disabled="disable"
          class="p-4 text-center rounded-xl bg-main_red module-btn"
          @click="logOut()"
        >
          <p v-if="!disable">تایید</p>
          <TheLoading v-else />
        </button>
      </div>
    </main>
  </section>
</template>
<script setup>
import TheLoading from '../reusable/theLoading.vue';

// const props = defineProps(['selectedServer']);
const emit = defineEmits(['close']);
const store = apiStore();
const { url } = storeToRefs(store);
const toast = useToast();
const disable = ref(false);
async function logOut() {
  disable.value = true;
  const { error } = await useFetch(`${url.value}/api/v4/logout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (error.value) {
    toast.add({
      title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
      timeout: 2000,
      color: 'red',
    });
  }
  navigateTo('/authorization');
  localStorage.removeItem('token');
  emit('close');
}
</script>
