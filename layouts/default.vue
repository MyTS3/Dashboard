<template>
  <div class="layout bg-mainbg_600 text-white min-h-screen overflow-hidden">
    <div>
      <div style="max-width: 69rem" class="py-3 mx-auto">
        <header class="w-full flex justify-between flex-row-reverse">
          <h1 v-if="$route.name == 'tservers'" class="font-medium text-xl">
            داشبورد
          </h1>
          <h1 class="font-medium text-xl" v-if="$route.name == 'domains' ">
            دامین ها
          </h1>
          <button
            @click="$router.back()"
            v-if="$route.name != 'tservers'&& $route.name != 'domains' "
            class="btn h-12 p-3 flex items-center rounded-xl"
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
        style="max-width: 69rem"
        class="flex my-2 w-full relative flex-row-reverse bg-main_red p-5 gap-4 rounded-xl items-center mx-auto"
      >
        <img
          class="bg-white p-1.5 rounded-lg"
          src="/images/bell-alarm.png"
          alt="bell-alarm"
        />
        <p class="font-medium text-sm">
          پنل جدید در دست ساخت است و این یک نسخه بتا از آن میباشد
        </p>
        <button class="absolute left-4">x</button>
      </div>
      <slot />
    </div>
    <div
      class="relative bg-mainbg_400 rounded-tl-2xl rounded-bl-2xl max-[1346px]:hidden "
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
          @click="navigateTo('/tservers');"
          :class="$route.name=='tservers'?'activePanel':'' "
          class="flex gap-3 w-full justify-end p-3 ml-auto cursor-pointer"
        >
          <img
            v-if="$route.name!='tservers' "
            class="mr-auto"
            src="/images/Arrow - Left.png"
            alt=""
          />
          <p>داشبورد</p>
          <img src="/images/dash.png" alt="dashboard" />
        </li>
        <li
          :class="$route.name=='playlist'?'activePanel':'' "
          class="flex gap-3 w-full justify-end p-3 ml-auto cursor-pointer"
        >
          <img
            v-if="$route.name!='playlist' "
            class="mr-auto"
            src="/images/Arrow - Left.png"
            alt=""
          />
          <p>پلی لیست</p>
          <img src="~/images/Folder.png" alt="" />
        </li>
        <li
          :class="$route.name=='domains'?'activePanel':'' "
          class="flex gap-3 w-full justify-end p-3 ml-auto cursor-pointer"
          @click="navigateTo('/domains');"
        >
          <img
            v-if="$route.name!='domains' "
            class="mr-auto"
            src="/images/Arrow - Left.png"
            alt=""
          />
          <p>دامین ها</p>
          <img src="/images/domain.png" alt="" />
        </li>
        <li
          :class="$route.name=='poshtibani'?'activePanel':'' "
          class="flex gap-3 w-full justify-end p-3 ml-auto cursor-pointer"
        >
          <img
            v-if="$route.name!='poshtibani' "
            class="mr-auto"
            src="/images/Arrow - Left.png"
            alt=""
          />
          <p>پشتیبانی</p>
          <img src="/images/poshtibani.png" alt="" />
        </li>
      </nav>
      <button
        @click="logoutTab = true "
        class="bg-main_red w-3/4 left-1/2 -translate-x-1/2 rounded-2xl py-3 text-center absolute bottom-5"
      >
        <p>خروج از حساب کاربری</p>
      </button>
    </div>
  </div>
  <logoutPopup @close="logoutTab=false" v-if="logoutTab" />
</template>
<script setup>
import logoutPopup from '@/components/modules/logoutPopup.vue'
const logoutTab = ref(false)
</script>
<style scoped>
.layout {
  display: grid;
  grid-template-columns: 6fr 1fr;
}
@media only screen and (max-width: 1346px){
  .layout{
    grid-template-columns: 1fr;
    padding-inline: 1rem;
  }
}
</style>
