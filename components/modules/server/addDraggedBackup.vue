<template>
  <Teleport to="body">
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
        <h1 class="my-4">اعمال بکاپ</h1>
        <p class="mb-4">شما درحال اعمال بکاپ هستید.آیا اطمینان دارید؟</p>
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
            class="p-4 flex justify-center items-center text-center rounded-xl bg-main_blue module-btn"
            @click.prevent="assignBackup()"
          >
            <p v-if="!disable">تایید</p>
            <TheLoading v-else />
          </button>
        </div>
      </main>
    </section>
  </Teleport>
</template>
<script setup lang="ts">
import TheLoading from '~/components/reusable/theLoading.vue';

const props = defineProps(['backup', 'serverinfo']);
const splited = props.backup.split(' ');
const version = splited[0].split('=')[1];
const dataValue = splited[1].split('=')[1];
const store = apiStore();
const { url } = storeToRefs(store);
const emit = defineEmits(['close']);
const toast = useToast();
const disable = ref(false);
async function assignBackup() {
  disable.value = true;
  if (version && dataValue) {
    try {
      await $fetch(`${url.value}/api/v4/snapshots/deploy`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: `{
          "tServerUUID": "${props.serverinfo.uuid}",
          "version": "${version}",
          "data": "${dataValue}"
        }`,
      });
    } catch {
      toast.add({
        title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
        timeout: 2000,
        color: 'red',
      });
    }
  }
  disable.value = false;
  emit('close');
}
</script>
