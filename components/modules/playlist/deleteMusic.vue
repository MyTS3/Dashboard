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
        <h1 class="text-xl my-2 font-bolder">حذف موزیک</h1>
        <p>
          این عمل قابل بازگردانی نیست و موزیک را حذف میکند، ایا اطمینان دارید؟
        </p>
        <div class="grid grid-cols-2 my-3 gap-3">
          <button
            :disabled="disable"
            class="p-4 text-center rounded-xl border-2 border-blue-700/80 bg-blue-600/20 module-btn"
            @click="$emit('close')"
          >
            لغو
          </button>
          <button
            :disabled="disable"
            class="p-4 text-center flex justify-center rounded-xl bg-main_red module-btn"
            @click.prevent="deleteMusic"
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
//variables
const store = apiStore();
const { url } = storeToRefs(store);
const props = defineProps(['index', 'uuid', 'botUuid']);
const disable = ref(false);
const emit = defineEmits(['close', 'refresh']);
const toast = useToast();

async function deleteMusic() {
  disable.value = true;
  try {
    await $fetch(
      `${url.value}/api/v4/tservers/${props.uuid}/bots/${props.botUuid}/musics/${props.index}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    );
    emit('refresh');
    emit('close');
  } catch {
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
