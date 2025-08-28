<template>
  <span>
    <div
      class="flex flex-row items-start justify-between bg-mainbg_600 text-white h-screen overflow-hidden"
    >
      <template v-if="!error">
        <div
          class="flex-1 h-screen relative flex gap-layout flex-col items-stretch max-w-[85rem] mx-auto p-10"
        >
          <div class="">
            <header class="w-full flex justify-between flex-row-reverse">
              <h1 v-if="$route.name == 'tservers'" class="font-medium text-xl">
                سرور ها
              </h1>
              <h1 v-if="$route.name == 'domains'" class="font-medium text-xl">
                دامنه ها
              </h1>
              <h1 v-if="$route.name == 'backups'" class="font-medium text-xl">
                بکاپ ها
              </h1>
              <h1 v-if="$route.name == 'playlist'" class="font-medium text-xl">
                پلی لیست ها
              </h1>
              <h1 v-if="$route.name == 'wallet'" class="font-medium text-xl">
                ترا کنش ها
              </h1>
              <button
                v-if="
                  $route.name != 'tservers' &&
                  $route.name != 'domains' &&
                  $route.name != 'backups' &&
                  $route.name != 'playlist' &&
                  $route.name != 'wallet'
                "
                class="btn h-12 p-3 flex items-center rounded-xl"
                @click="$router.back()"
              >
                <img class="" src="/images/Arrow-Right.png" alt="" />
              </button>
              <div class="grid grid-cols-2 gap-layout">
                <button
                  class="flex items-center justify-center flex-row-reverse gap-1 p-3 rounded-xl btn text-xs"
                >
                  <div class="ml-auto">
                    <img
                      class="h-6 w-6"
                      src="/images/group_500.svg"
                      alt="user"
                    />
                  </div>
                  <div class="w-full">
                    {{ name }}
                  </div>
                </button>
                <button
                  v-if="balance != null && balance != 'error'"
                  class="flex gap-1 btn p-3 px-4 rounded-xl"
                  @click="chargeWalletTab = true"
                >
                  <div class="w-full">
                    <p>تومان {{ Math.trunc(Number(balance)) }}</p>
                  </div>
                  <div class="ml-auto">
                    <img
                      src="/images/bookmark_duplicate.svg"
                      class="h-6 w-6"
                      alt="bell"
                    />
                  </div>
                </button>
                <button
                  v-if="balance === 'error'"
                  class="flex gap-1 btn p-3 px-4 rounded-xl items-center justify-center"
                  @click="getBalance"
                >
                  <p>خطا</p>
                  <div class="">
                    <img src="/images/restart.png" class="h-6 w-6" alt="bell" />
                  </div>
                </button>
                <USkeleton
                  v-if="balance === null"
                  :ui="{ background: 'dark:bg-gray-500' }"
                  class="p-3 px-4 rounded-xl"
                />
              </div>
            </header>
          </div>
          <div
            v-if="panelAlert"
            class="flex w-full relative flex-row-reverse bg-main_red/50 p-5 gap-layout rounded-xl items-center"
          >
            <img
              class="w-10"
              src="/images/send_complaint.svg"
              alt="bell-alarm"
            />
            <p dir="rtl" class="font-medium text-sm">
              این نسخه بتا هست اگه مشکلی دیدی یا کمک خواستی توی گروه تلگرام
              <a
                class="text-green-300"
                target="_blank"
                href="https://t.me/myts3"
              >
                @myts3
              </a>
              بگو
            </p>
            <button class="absolute left-4" @click.prevent="panelAlert = false">
              <img class="w-3 mx-auto" src="/images/X-9.png" alt="" />
            </button>
          </div>
          <div class="min-h-0 overflow-hidden flex flex-col h-full">
            <slot />
          </div>
          <div
            class="flex font-sans opacity-40 gap-1 items-center absolute bottom-3 left-1/2 -translate-x-1/2 text-xs"
          >
            <p>{{ version.version }}</p>
          </div>
        </div>
        <div
          class="basis-40 flex flex-col h-full bg-mainbg_400 rounded-tl-2xl rounded-bl-2xl"
        >
          <header>
            <img
              class="mx-auto mt-5 max-w-80"
              src="/images/User info.png"
              alt="logo"
            />
          </header>
          <nav class="list-none flex flex-col pt-4 gap-3 m-5">
            <li
              :class="
                $route.name == 'tservers' ? 'activePanel' : 'noActivePanel'
              "
              class="flex gap-2 w-full justify-end py-3 px-4 ml-auto cursor-pointer"
              @click="navigateTo('/tservers')"
            >
              <p>سرور ها</p>
              <img
                src="/images/server_green.svg"
                class="w-6 h-6"
                alt="dashboard"
              />
            </li>
            <li
              :class="
                $route.name == 'backups' ? 'activePanel' : 'noActivePanel'
              "
              class="flex gap-2 w-full justify-end py-3 px-4 ml-auto cursor-pointer"
              @click="navigateTo('/backups')"
            >
              <p>بکاپ ها</p>
              <img src="/images/sync-icon.svg" class="w-6 h-6" alt="" />
            </li>
            <li
              :class="
                $route.name == 'domains' ? 'activePanel' : 'noActivePanel'
              "
              class="flex gap-2 w-full justify-end py-3 px-4 ml-auto cursor-pointer"
              @click="navigateTo('/domains')"
            >
              <p>دامنه ها</p>
              <img
                src="/images/browse-addon-online.svg"
                class="w-6 h-6"
                alt=""
              />
            </li>
            <li
              :class="
                $route.name == 'playlist' ? 'activePanel' : 'noActivePanel'
              "
              class="flex gap-3 w-full justify-end py-3 px-4 ml-auto cursor-pointer"
              @click="navigateTo('/playlist')"
            >
              <p>پلی لیست ها</p>
              <img class="w-6 h-6" src="/images/changelog.svg" alt="" />
            </li>
            <li
              :class="$route.name == 'wallet' ? 'activePanel' : 'noActivePanel'"
              class="flex gap-3 w-full justify-end py-3 px-4 ml-auto cursor-pointer"
              @click="navigateTo('/wallet')"
            >
              <p>تراکنش ها</p>
              <img class="w-6 h-6" src="/images/bookmark_manager.svg" alt="" />
            </li>
            <!-- <li
            :class="$route.name == 'poshtibani' ? 'activePanel' : ''"
            class="flex gap-3 w-full justify-end py-3 px-4 ml-auto cursor-pointer"
          >
            <img
              v-if="$route.name != 'poshtibani'"
              class="mr-auto"
              src="/images/Arrow - Left.png"
              alt=""
            />
            <p>پشتیبانی</p>
            <img src="/images/poshtibani.png" alt="" />
          </li> -->
          </nav>
          <div class="flex-1" />
          <a href="https://my.mtserver.ir/">
            <img
              class="object-contain p-3 opacity-70"
              src="/images/logo-white.png"
              alt=""
            />
          </a>
        </div>
      </template>
      <template v-else>
        <main
          class="flex flex-col justify-center gap-5 items-center w-full h-full"
        >
          <img src="/images/new/no-server.png" alt="" />
          <div>
            <p class="text-3xl text-center font-bold">
              خطا در اتصال به وب سرویس
            </p>
            <p class="w-3/4 text-center mx-auto mt-2">
              اگه از وی پی ان یا پروکسی استفاده میکنی خاموشش کن یا حداقل عوضش کن
              اگه این کارو کردی و درست نشد احتمالا وب سرویس پایینه و داریم
              اپدیتی چیزی میدیم
            </p>
          </div>
        </main>
      </template>
    </div>
    <logoutPopup v-if="logoutTab" @close="logoutTab = false" />
    <chargeWallet v-if="chargeWalletTab" @close="chargeWalletTab = false" />
  </span>
</template>
<script setup>
import TimeAgo from 'javascript-time-ago';
import fa from 'javascript-time-ago/locale/fa';
import logoutPopup from '@/components/modules/logoutPopup.vue';
import chargeWallet from '~/components/modules/wallet/chargeWallet.vue';
import { limits } from '~/stores/limits';
import { balance, getBalance } from '~/stores/globalVaribles';
const store = apiStore();
const { url } = storeToRefs(store);
getBalance();
const chargeWalletTab = ref(false);

const { data: version, error } = await useFetch(`${url.value}/api/v4/version`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
  retry: false,
  timeout: 3000,
});

const { data: limitsApi } = await useFetch(`${url.value}/api/v4/limits`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
  lazy: true,
});
limits.value = limitsApi;

const logoutTab = ref(false);
const panelAlert = ref(true);
const token = localStorage.getItem('token');
const name = ref();
if (!token) {
  navigateTo('https://my.mtserver.ir/myts.php', {
    external: true,
  });
} else {
  const bodyToken = JSON.parse(atob(token.split('.')[1]));
  name.value = bodyToken.name;
}

TimeAgo.addLocale(fa);
</script>
<style scoped>
.layout {
  display: grid;
  grid-template-columns: 7fr 1fr;
}
@media only screen and (max-width: 1346px) {
  .layout {
    grid-template-columns: 1fr;
    padding-inline: 1rem;
  }
}
</style>
