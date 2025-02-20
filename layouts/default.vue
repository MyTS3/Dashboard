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
                پلی لیست
              </h1>
              <button
                v-if="
                  $route.name != 'tservers' &&
                  $route.name != 'domains' &&
                  $route.name != 'backups' &&
                  $route.name != 'playlist'
                "
                class="btn h-12 p-3 flex items-center rounded-xl"
                @click="$router.back()"
              >
                <img class="" src="/images/Arrow-Right.png" alt="" >
              </button>
              <div class="flex gap-layout">
                <button
                  class="flex items-center flex-row-reverse gap-1 p-3 rounded-xl btn text-xs"
                >
                  <img class="h-6 w-6" src="/images/group_500.svg" alt="user" >
                  {{ name }}
                </button>
                <button class="flex gap-1 btn p-3 px-4 rounded-xl">
                  تومان ۴۴,۰۰۰
                  <img
                    src="/images/bookmark_duplicate.svg"
                    class="h-6 w-6"
                    alt="bell"
                  >
                </button>
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
            >
            <p class="font-medium text-sm">
              پنل جدید در دست ساخت است، این یک نسخه رایگان برای تست میباشد و هیچ
              گونه مسئولیتی در نگهداری داده های شما ندارد
            </p>
            <button class="absolute left-4" @click.prevent="panelAlert = false">
              <img class="w-3 mx-auto" src="/images/X-9.png" alt="" >
            </button>
          </div>
          <slot />
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
            >
          </header>
          <nav class="list-none flex flex-col pt-4 gap-3 m-5">
            <li
              :class="$route.name == 'tservers' ? 'activePanel' : ''"
              class="flex gap-2 w-full justify-end py-3 px-4 ml-auto cursor-pointer"
              @click="navigateTo('/tservers')"
            >
              <p>سرور ها</p>
              <img
                src="/images/server_green.svg"
                class="w-6 h-6"
                alt="dashboard"
              >
            </li>
            <li
              :class="$route.name == 'playlist' ? 'activePanel' : ''"
              class="flex gap-3 w-full justify-end py-3 px-4 ml-auto cursor-pointer"
              @click="navigateTo('/playlist')"
            >
              <p>پلی لیست</p>
              <img class="w-6 h-6" src="/images/changelog.svg" alt="" >
            </li>
            <li
              :class="$route.name == 'backups' ? 'activePanel' : ''"
              class="flex gap-2 w-full justify-end py-3 px-4 ml-auto cursor-pointer"
              @click="navigateTo('/backups')"
            >
              <p>بکاپ ها</p>
              <img src="/images/sync-icon.svg" class="w-6 h-6" alt="" >
            </li>
            <li
              :class="$route.name == 'domains' ? 'activePanel' : ''"
              class="flex gap-2 w-full justify-end py-3 px-4 ml-auto cursor-pointer"
              @click="navigateTo('/domains')"
            >
              <p>دامنه ها</p>
              <img
                src="/images/browse-addon-online.svg"
                class="w-6 h-6"
                alt=""
              >
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
          <a target="_blank" href="https://mtserver.ir/">
            <img
              class="object-contain p-3"
              src="/images/mtserver-logo.png"
              alt=""
            >
          </a>
        </div>
      </template>
      <template v-else>
        <main
          class="flex flex-col justify-center gap-5 items-center w-full h-full"
        >
          <img src="/images/new/no-server.png" alt="" >
          <div>
            <p class="text-3xl text-center font-bold">پنل در دسترس نیست</p>
            <p>
              یه مشکلی وجود داره یا داریم آپدیتی چیزی میدیم، برو چند دقیقه دیگه
              برگرد
            </p>
          </div>
        </main>
      </template>
    </div>
    <logoutPopup v-if="logoutTab" @close="logoutTab = false" />
  </span>
</template>
<script setup>
import TimeAgo from 'javascript-time-ago';
import fa from 'javascript-time-ago/locale/fa';
import logoutPopup from '@/components/modules/logoutPopup.vue';

const store = apiStore();
const { url } = storeToRefs(store);

const { data: version, error } = await useFetch(`${url.value}/api/v4/version`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

const logoutTab = ref(false);
const panelAlert = ref(true);
const token = localStorage.getItem('token');
const name = ref();
if (!token) {
  navigateTo('https://my.mtserver.ir/index.php?rp=/login', {
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
