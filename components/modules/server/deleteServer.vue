<template>
  <div>
    <section
      class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
    >
      <main
        class="text-white min-w-96 bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
      >
        <button
          @click="$emit('close')"
          class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
        >
          X
        </button>
        <h1 class="text-xl my-4 font-bolder">حذف سرور</h1>
        <p class="font-thin max-w-80 text-center mx-auto mb-4 mx-10">
          این عمل قابل بازگردانی نیست و تمامی اطلاعات سرور را حذف میکند، اطمینان
          <span class="font-bold">{{ selectedServer.name }}</span>
          دارید؟
        </p>
        <div class="grid grid-cols-2 gap-3">
          <button
            @click="$emit('close')"
            class="p-4 text-center rounded-xl border-2 border-blue-700/80 bg-blue-600/20 module-btn"
          >
            لغو
          </button>
          <button
            @click.prevent="deleteTheServer()"
            class="p-4 text-center rounded-xl bg-main_red module-btn"
          >
            حذف سرور
          </button>
        </div>
      </main>
    </section>
  </div>
</template>
<script setup>
const emit = defineEmits(['close']);
const props = defineProps(['selectedServer']);
const route = useRoute();
const router = useRouter();
const store = apiStore();
const { url } = storeToRefs(store);
async function deleteTheServer() {
  await $fetch(`${url.value}/api/v4/tservers/${props.selectedServer.uuid}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  emit('close');
  if (route.path != '/tservers') router.back();
}
</script>
