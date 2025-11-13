<template>
  <Teleport to="body">
    <section
      class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
    >
      <main
        class="text-white w-full max-w-[30rem] bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
      >
        <button
          :disabled="disable"
          class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
          @click="$emit('close')"
        >
          <img class="w-3 mx-auto" src="/images/X-9.png" alt="" />
        </button>
        <h1 class="text-xl my-4 font-bolder">حذف دامین</h1>
        <p class="font-thin max-w-80 text-center mx-auto mb-4 truncate w-full">
          هستید اطمینان دارید؟
          <span class="font-bold w-full">{{ selectedDomain.domain }}</span>
          شما در حال حذف
        </p>
        <div class="grid grid-cols-2 gap-3">
          <button
            :disabled="disable"
            class="p-4 text-center rounded-xl border-2 border-blue-700/80 bg-blue-600/20 module-btn"
            @click="$emit('close')"
          >
            لغو
          </button>
          <button
            :disabled="disable"
            class="p-4 flex justify-center text-center rounded-xl bg-main_red module-btn"
            @click.prevent="deleteDomain()"
          >
            <p v-if="!disable">حذف</p>
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
const props = defineProps(['selectedDomain']);
const toast = useToast();
const emit = defineEmits(['close']);
const disable = ref(false);
const store = apiStore();
const { url } = storeToRefs(store);
async function deleteDomain() {
  disable.value = true;
  try {
    await $fetch(`${url.value}/api/v4/tdomains/${props.selectedDomain.uuid}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  } catch (error) {
    const errorCode = error.data.code ?? '';
    if (errorCode == 'DOMAIN_IN_USE') {
      toast.add({
        title: 'دامنه در حال استفاده است',
        timeout: 2000,
        color: 'red',
      });
    } else
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
