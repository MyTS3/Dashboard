<template>
  <section
    class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
  >
    <main
      class="text-white min-w-96 bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
    >
      <button
        :class="disable ? 'disable' : ''"
        :disabled="disable"
        class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
        @click="$emit('close')"
      >
        X
      </button>
      <h1 class="text-xl my-4 font-bolder">تغییر رمز یاتکا</h1>
      <p class="font-thin max-w-80 text-center mx-auto mb-4">
        این عمل باعث تغییر رمز یاتکا میشود، آیا از این کار مطمئن هستی؟
      </p>
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
          class="p-4 text-center rounded-xl bg-main_red module-btn"
          @click="changeYatqaPass()"
        >
          تایید
        </button>
      </div>
    </main>
  </section>
</template>
<script setup>
const props = defineProps(['selectedServer']);
const emit = defineEmits(['close']);
const store = apiStore();
const { url } = storeToRefs(store);
const disable = ref(false);
async function changeYatqaPass() {
  disable.value = true;
  await $fetch(
    `${url.value}/api/v4/tservers/${props.selectedServer.uuid}/reset-password`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
  emit('close');
}
</script>
