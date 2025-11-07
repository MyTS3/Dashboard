<template>
  <teleport to="body">
    <section
      class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
    >
      <main
        class="text-white max-w-[28rem] w-full bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
      >
        <button
          :disabled="disable"
          class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
          @click="$emit('close')"
        >
          <img class="w-3 mx-auto" src="/images/X-9.png" alt="" />
        </button>
        <h1 class="my-4 font-bold text-xl">شارژ کیف پول</h1>
        <p class="text-center text-white/80 max-w-96 text-md mx-auto mx-6">
          مبلغ مورد نظر باید بین 20،000 تا 2،000،000 تومان باشد
        </p>
        <h2 class="text-right w-full mt-3 mb-1">مبلغ</h2>
        <div class="relative">
          <input
            v-model="chargeAmount"
            class="bg-transparent my-4 p-3 w-full border rounded-xl text-left relative placeholder:text-right wallet-input"
            type="number"
          />
          <p class="absolute top-1/2 -translate-y-1/2 right-5 opacity-65">
            تومان
          </p>
        </div>
        <div class="grid gap-3">
          <button
            class="p-4 flex justify-center text-center rounded-xl bg-main_blue module-btn"
            @click="chargeWallet()"
          >
            <p v-if="!disable">شارژ</p>
            <theLoading v-else />
          </button>
        </div>
      </main>
    </section>
  </teleport>
</template>
<script setup lang="ts">
import theLoading from '~/components/reusable/theLoading.vue';
const disable = ref(false);
const store = apiStore();
const toast = useToast();
defineEmits(['close']);
const chargeAmount = ref();
const { url } = storeToRefs(store);
async function chargeWallet() {
  const { data, error } = await useFetch<{ url: string }>(
    `${url.value}/api/v4/charge`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        amount: chargeAmount.value,
      }),
    },
  );
  if (error.value) {
    toast.add({
      title: 'خطا در درخواست شارژ',
      timeout: 2000,
      color: 'red',
    });
  } else {
    navigateTo(data.value?.url, {
      external: true,
    });
  }
}
</script>
