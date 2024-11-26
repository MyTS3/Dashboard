<template>
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
      <h1 class="my-4">کیک از سرور</h1>
      <label class="text-right">:دلیل</label>
      <input
        v-model="reason"
        :disabled="disable"
        class="my-4 bg-transparent border p-3 rounded-xl text-right"
        type="text"
      />
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
          class="p-4 text-center rounded-xl bg-main_red module-btn"
          @click="kickUser()"
        >
          <p v-if="!disable">تایید</p>
          <TheLoading v-else />
        </button>
      </div>
    </main>
  </section>
</template>
<script setup>
import TheLoading from '~/components/reusable/theLoading.vue';

const disable = ref(false);
const store = apiStore();
const { url } = storeToRefs(store);
const props = defineProps(['serverInfo', 'user']);
const emit = defineEmits('close');
const reason = ref('');
const toast = useToast();
async function kickUser() {
  disable.value = true;
  const { error } = await useFetch(
    `${url.value}/api/v4/tservers/${props.serverInfo.uuid}/users/${props.user}/kick-from-server`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        reason: reason.value,
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
