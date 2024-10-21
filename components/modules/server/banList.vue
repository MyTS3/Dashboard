<template>
  <section
    class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
  >
    <main
      class="text-white bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium w-4/5"
    >
      <button
        class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
        @click="$emit('close')"
      >
        X
      </button>
      <h1 class="my-4">لیست بن ها</h1>
      <table>
        <div
          style="gap: 2px; max-height: 20rem"
          class="text-sm ban-list text-right relative overflow-y-scroll"
        >
          <div class="flex flex-col text-right bg-mainbg_400">
            <p class="items text-lg p-4">دلیل</p>
            <div
              v-for="ban in banList"
              :key="ban.banid"
              class="items p-4 flex flex-row-reverse items-center"
            >
              {{ ban.reason }}
              <p v-if="!ban.reason">بدون دلیل</p>
              <img
                class="w-10 absolute left-8 cursor-pointer"
                src="/images/x-symbpl.png"
                alt=""
                @click="openUnBanPopUp(ban)"
              />
            </div>
          </div>

          <div class="flex flex-col text-right bg-mainbg_400">
            <p class="items text-lg p-4">بن شده توسط</p>
            <p v-for="ban in banList" :key="ban.banid" class="items p-4">
              {{ ban.invokername }}
            </p>
          </div>
          <div class="flex flex-col text-right bg-mainbg_400">
            <p class="items text-lg p-4">نام،آیپی،آیدی</p>
            <p v-for="ban in banList" :key="ban.banid" class="items p-4">
              <span v-if="ban.name">name={{ ban.name }},ip={{ ban.ip }}</span>
              <span v-if="ban.uid">uid={{ ban.uid }}</span>
            </p>
          </div>
        </div>
      </table>
    </main>
  </section>
  <unBan
    v-if="unBanTab"
    :selected-server="selectedServer"
    :un-baning="unBaning"
    @close="getBanList(), (unBanTab = false)"
  />
</template>
<script setup>
import { apiStore } from '~/stores/apistore';
import { storeToRefs } from 'pinia';
import unBan from './unban.vue';

const props = defineProps(['selectedServer']);
const store = apiStore();
const { url } = storeToRefs(store);
const banList = ref();
const unBaning = ref();
const unBanTab = ref(false);
const toast = useToast();

async function getBanList() {
  const { data: respone, error } = await useFetch(
    `${url.value}/api/v4/tservers/${props.selectedServer.uuid}/bans`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
  banList.value = await respone.value;

  if (error.value) {
    toast.add({
      title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
      timeout: 2000,
      color: 'red',
    });
  }
}
function openUnBanPopUp(ban) {
  unBaning.value = ban;
  unBanTab.value = true;
}
//
await getBanList();
</script>
