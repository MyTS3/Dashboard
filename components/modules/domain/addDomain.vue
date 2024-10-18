<template>
  <div>
    <section
      class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
    >
      <main
        class="text-white min-w-[28rem] bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
      >
        <button
          :disabled="disable"
          class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
          @click="$emit('close')"
        >
          X
        </button>
        <h1 class="my-4 font-bold text-xl">افزودن دامنه</h1>
        <p class="text-center text-main_red max-w-96 text-md mx-auto mx-6">
          !تغییر دهید ns.myts3.ir مهم: نیم سرور های خودرا به
        </p>
        <h2 class="text-right w-full mt-3 mb-1">دامنه</h2>
        <input
          v-model="domainName"
          class="bg-transparent my-4 p-3 w-full border rounded-xl text-left relative placeholder:text-right"
          type="text"
          placeholder="vipts.ir"
        />
        <div class="grid gap-3">
          <button
            :disabled="disable"
            class="p-4 flex justify-center text-center rounded-xl bg-main_blue module-btn"
            @click="AddDomain()"
          >
            <p v-if="!disable">تایید</p>
            <TheLoading v-else />
          </button>
        </div>
      </main>
    </section>
  </div>
</template>
<script setup>
import TheLoading from '~/components/reusable/theLoading.vue';

const store = apiStore();
const { url } = storeToRefs(store);
const emit = defineEmits(['close']);
const toast = useToast();
const disable = ref(false);
const domainName = ref();

async function AddDomain() {
  disable.value = true;
  const { error } = await useFetch(`${url.value}/api/v4/tdomains`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      domain: domainName.value,
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
<style></style>
