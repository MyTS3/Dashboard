<template>
  <Teleport to="body">
    <section
      class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
    >
      <main
        class="text-white w-full max-w-[50rem] bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium min-h-60"
      >
        <button
          class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
          @click="$emit('close')"
        >
          <img class="w-3 mx-auto" src="/images/X-9.png" alt="" />
        </button>
        <h1 class="my-4">لیست بن ها</h1>
        <div>
          <div
            style="gap: 2px; max-height: 20rem"
            class="text-sm ban-list text-right relative overflow-y-scroll"
          >
            <div
              class="flex flex-col text-right bg-mainbg_400 relative max-[585px]:hidden"
            >
              <p class="items text-lg p-4 max-[585px]:hidden">دلیل</p>

              <div
                v-for="ban in banList"
                :key="ban.banid"
                class="items p-4 flex flex-row-reverse items-center max-[585px]:hidden"
              >
                {{ ban.reason }}
                <p class="" v-if="!ban.reason">بدون دلیل</p>
                <img
                  class="w-10 absolute left-8 cursor-pointer max-[585px]:left-1/2 max-[585px]:-translate-x-1/2"
                  src="/images/x-symbpl.png"
                  alt=""
                  @click="openUnBanPopUp(ban)"
                />
              </div>
            </div>

            <div
              class="flex flex-col text-right bg-mainbg_400 max-[630px]:hidden"
            >
              <p class="items text-lg p-4">بن شده توسط</p>
              <p v-for="ban in banList" :key="ban.banid" class="items p-4">
                {{ ban.invokername }}
              </p>
            </div>
            <div class="flex flex-col text-right bg-mainbg_400 relative">
              <p class="items text-lg p-4">نام،آیپی،آیدی</p>
              <div
                v-for="ban in banList"
                :key="ban.banid"
                class="items p-4 relative"
              >
                <span v-if="ban.name">name={{ ban.name }},ip={{ ban.ip }}</span>
                <span v-if="ban.uid">uid={{ ban.uid }} </span>
                <img
                  class="w-10 absolute cursor-pointer min-[585px]:hidden -left-2 top-1/2 -translate-y-1/2"
                  src="/images/x-symbpl.png"
                  alt=""
                  @click="openUnBanPopUp(ban)"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
    <unBan
      v-if="unBanTab"
      :selected-server="selectedServer"
      :un-baning="unBaning"
      @close="getBanList(), (unBanTab = false)"
    />
  </Teleport>
</template>
<script setup>
import { apiStore } from '~/stores/apistore';
import { storeToRefs } from 'pinia';
import unBan from './unban.vue';
defineEmits(['close']);
const props = defineProps(['selectedServer']);
const store = apiStore();
const { url } = storeToRefs(store);
const unBaning = ref();
const unBanTab = ref(false);
const toast = useToast();

const {
  data: banList,
  error,
  refresh: getBanList,
} = await useFetch(
  `${url.value}/api/v4/tservers/${props.selectedServer.uuid}/bans`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
);
if (error.value) {
  toast.add({
    title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
    timeout: 2000,
    color: 'red',
  });
}

function openUnBanPopUp(ban) {
  unBaning.value = ban;
  unBanTab.value = true;
}
//
</script>
<style scoped>
.ban-list {
  display: grid;
  grid-template-columns: 2fr 2fr 4fr;
}
@media screen and (width < 631px) {
  .ban-list {
    grid-template-columns: 1fr 3fr;
  }
}
@media screen and (width < 586px) {
  .ban-list {
    grid-template-columns: 1fr;
  }
}
</style>
