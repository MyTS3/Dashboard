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
        X
      </button>
      <h1 class="my-4">حذف دوره</h1>
      <p class="mb-4">شما در حال پاک کردن دوره هستید ایا اطمینان دارید؟</p>
      <div class="grid grid-cols-2 gap-3">
        <button
          :class="disable ? 'disable' : ''"
          :disabled="disable"
          class="p-4 text-center rounded-xl border-2 border-blue-700/80 bg-blue-600/20 module-btn"
          @click="$emit('close')"
        >
          لغو
        </button>
        <button
          :class="disable ? 'disable' : ''"
          :disabled="disable"
          class="p-4 flex justify-center items-center text-center rounded-xl bg-main_red module-btn"
          @click.prevent="removeInterval()"
        >
          <p v-if="!disable">تایید</p>
          <ReusableTheLoading v-else />
        </button>
      </div>
    </main>
  </section>
</template>
<script setup>
const store = apiStore();
const disable = ref(false);
const toast = useToast();
const { url } = storeToRefs(store);
const props = defineProps(['selectedInterval']);
const emit = defineEmits('close');
async function removeInterval() {
  const { error } = await useFetch(
    `${url.value}/api/v4/snapshots/intervals/${props.selectedInterval}`,
    {
      method: 'DELETE',
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
  emit('close');
}
</script>
