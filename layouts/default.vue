<template>
  <span>
    <div
      class="flex flex-row items-start justify-between bg-mainbg_600 text-white h-screen overflow-hidden"
    >
      <div class="flex-1 h-screen flex flex-col items-stretch px-32 pb-5">
        <div class="py-3">
          <header class="w-full flex justify-between flex-row-reverse">
            <h1 v-if="$route.name == 'tservers'" class="font-medium text-xl">
              داشبورد
            </h1>
            <h1 v-if="$route.name == 'domains'" class="font-medium text-xl">
              دامین ها
            </h1>
            <h1 v-if="$route.name == 'backups'" class="font-medium text-xl">
              بک اپ ها
            </h1>
            <button
              v-if="
                $route.name != 'tservers' &&
                $route.name != 'domains' &&
                $route.name != 'backups'
              "
              class="btn h-12 p-3 flex items-center rounded-xl"
              @click="$router.back()"
            >
              <img class="" src="/images/Arrow-Right.png" alt="" />
            </button>
            <div class="flex gap-4">
              <button
                class="flex items-center flex-row-reverse gap-1 p-1.5 rounded-lg btn"
              >
                <img src="/images/User.png" alt="user" />
                <p class="text-xs">ماکان</p>
              </button>
              <button class="btn p-3 px-4 rounded-lg">
                <img src="/images/bell.png" alt="bell" />
              </button>
            </div>
          </header>
        </div>
        <div
          v-if="panelAlert"
          class="flex my-2 w-full relative flex-row-reverse bg-main_red p-5 gap-4 rounded-xl items-center"
        >
          <img
            class="bg-white p-1.5 rounded-lg"
            src="/images/bell-alarm.png"
            alt="bell-alarm"
          />
          <p class="font-medium text-sm">
            پنل جدید در دست ساخت است، این یک نسخه رایگان برای تست میباشد و هیچ
            گونه مسئولیتی در نگهداری داده های شما ندارد
          </p>
          <button class="absolute left-4" @click.prevent="panelAlert = false">
            x
          </button>
        </div>
        <slot />
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
        <nav class="list-none flex flex-col gap-4 mt-7">
          <li
            :class="$route.name == 'tservers' ? 'activePanel' : ''"
            class="flex gap-3 w-full justify-end p-3 ml-auto cursor-pointer"
            @click="navigateTo('/tservers')"
          >
            <img
              v-if="$route.name != 'tservers'"
              class="mr-auto"
              src="/images/Arrow - Left.png"
              alt=""
            />
            <p>سرور ها</p>
            <img src="/images/dash.png" alt="dashboard" />
          </li>
          <!-- <li
            :class="$route.name == 'playlist' ? 'activePanel' : ''"
            class="flex gap-3 w-full justify-end p-3 ml-auto cursor-pointer"
          >
            <img
              v-if="$route.name != 'playlist'"
              class="mr-auto"
              src="/images/Arrow - Left.png"
              alt=""
            />
            <p>پلی لیست</p>
            <img src="/images/Folder.png" alt="" />
          </li> -->
          <li
            :class="$route.name == 'backups' ? 'activePanel' : ''"
            class="flex gap-3 w-full justify-end p-3 ml-auto cursor-pointer"
            @click="navigateTo('/backups')"
          >
            <img
              v-if="$route.name != 'backups'"
              class="mr-auto"
              src="/images/Arrow - Left.png"
              alt=""
            />
            <p>بکاپ ها</p>
            <img src="/images/backups.png" alt="" />
          </li>
          <li
            :class="$route.name == 'domains' ? 'activePanel' : ''"
            class="flex gap-3 w-full justify-end p-3 ml-auto cursor-pointer"
            @click="navigateTo('/domains')"
          >
            <img
              v-if="$route.name != 'domains'"
              class="mr-auto"
              src="/images/Arrow - Left.png"
              alt=""
            />
            <p>دامین ها</p>
            <img src="/images/domain.png" alt="" />
          </li>
          <!-- <li
            :class="$route.name == 'poshtibani' ? 'activePanel' : ''"
            class="flex gap-3 w-full justify-end p-3 ml-auto cursor-pointer"
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
        <div class="flex-1"></div>
        <button
          class="bg-main_red rounded-2xl py-3 text-center m-2"
          @click="logoutTab = true"
        >
          <p>خروج از حساب کاربری</p>
        </button>
      </div>
    </div>
    <logoutPopup v-if="logoutTab" @close="logoutTab = false" />
  </span>
</template>
<script setup>
import TimeAgo from 'javascript-time-ago';
import fa from 'javascript-time-ago/locale/fa';
import logoutPopup from '@/components/modules/logoutPopup.vue';

const logoutTab = ref(false);
const panelAlert = ref(true);
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
