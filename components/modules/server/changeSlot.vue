<template>
  <section
    class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
  >
    <main
      class="text-white min-w-96 bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
    >
      <button
        :class="{ 'bg-main_red/50': disable }"
        :disabled="disable"
        @click="$emit('close')"
        class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
      >
        X
      </button>
      <div>
        <h1 class="text-3xl font-extrabold">تغییر اسلات</h1>
        <p class="my-4 mx-12 text-center font-medium text-white/80">
          هستید<span class="mx-1 font-bold text-white">{{
            selectedServer.name
          }}</span
          >شما در حال تغییر اسلات های سرور
        </p>
        <div class="flex justify-between">
          <p>16</p>
          <p>32</p>
          <p>64</p>
          <p>128</p>
          <p>256</p>
          <p>512</p>
          <p>1024</p>
        </div>
        <input
          :disabled="disable"
          v-model="selectedSlot"
          class="w-full"
          type="range"
          min="1"
          max="7"
        />
      </div>
      <!-- /////////////////price started//////// -->
      <div id="price" class="w-full">
        <div class="flex justify-between flex-row-reverse mt-3 text-white/40">
          <h1>:قیمت ساعتی</h1>
          <div class="flex flex-row-reverse gap-1 text-white/40">
            <span>54</span>
            <p>تومان</p>
          </div>
        </div>
        <div class="flex justify-between flex-row-reverse mt-3 text-white/40">
          <h1>:قیمت روزانه</h1>
          <div class="flex flex-row-reverse gap-1 text-white/40">
            <span>1،300</span>
            <p>تومان</p>
          </div>
        </div>
        <div class="flex justify-between flex-row-reverse mt-3">
          <h1>:قیمت ماهانه</h1>
          <div class="flex flex-row-reverse gap-1">
            <span>39،000</span>
            <p>تومان</p>
          </div>
        </div>
      </div>
      <button
        :disabled="disable"
        @click.prevent="chaneSlots()"
        class="w-full p-4 bg-main_blue rounded-xl mt-8 mb-2"
      >
        تایید و تغییر اسلات
      </button>
    </main>
  </section>
  <!-- //////////////////price eneded////////////// -->
</template>
<script setup>
const disable = ref(false);
const props = defineProps(['selectedServer']);
const emit = defineEmits(['close']);
const selectedSlot = ref(16);
const store = apiStore();
const { url } = storeToRefs(store);
async function chaneSlots() {
  disable.value = true;
  const slots = 2 ** (Number(selectedSlot.value) + 3);
  await $fetch(
    `${url.value}/api/v1/tservers/${props.selectedServer.uuid}/change-slots`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        slots: slots,
      }),
    },
  );
  emit('close');
}
</script>
