<template>
  <section
    class=" bg-mainbg_600 text-white
    h-dvh flex flex-row-reverse w-full  relative
  "
  >
    <div id="modules" class="absolute top-0 left-0"></div>
    <div
      class="bg-mainbg_400
       max-w-64 p-8 justify-center rounded-tl-2xl rounded-bl-2xl h-full"
    >
      <header><img src="./images/User info.png" alt="logo" /></header>
      <nav class="list-none flex flex-col gap-4 mt-7 ">
        <li class="flex gap-3 w-full justify-end p-3 ml-auto activePanel">
          <p>داشبورد</p>
          <img src="./images/dash.png" alt="dashboard" />
        </li>
        <li class="flex gap-3 w-full justify-end p-3 ml-auto">
          <p>ای پی ای</p>
          <img src="./images/ip.png" alt="" />
        </li>
        <li class="flex gap-3 w-full justify-end p-3 ml-auto">
          <p>پشتیبانی</p>
          <img src="./images/poshtibani.png" alt="" />
        </li>
      </nav>
      <button class="bg-main_red  rounded-2xl py-2 px-8 absolute bottom-5">
        <p>خروج از حساب کاربری</p>
      </button>
    </div>
    <div class="w-4/5 p-5 mx-auto">
      <header
        class="flex justify-between flex-row-reverse min-[1280px]:w-3/4 mx-auto"
      >
        <h1 class="font-medium text-xl">داشبورد</h1>
        <div class="flex gap-4 ">
          <button
            class="flex items-center flex-row-reverse gap-1 p-1.5 rounded-lg btn"
          >
            <img src="./images/User.png" alt="user" />
            <p class="text-xs">ماکان</p>
          </button>
          <button class="btn p-3 rounded-lg">
            <img src="./images/bell.png" alt="bell" />
          </button>
        </div>
      </header>
      <div
        class="flex my-6 w-full relative flex-row-reverse bg-main_red p-5 gap-4 rounded-xl
        items-center min-[1280px]:w-3/4 mx-auto
        "
      >
        <img
          class="bg-white p-1.5 rounded-lg"
          src="./images/bell-alarm.png"
          alt="bell-alarm"
        />
        <p class="font-medium text-sm">
          پنل جدید در دست ساخت است و این یک نسخه بتا از آن میباشد
        </p>
        <button class="absolute left-4">x</button>
      </div>
      <main
        class="w-full min-[1280px]:w-3/4 grid grid-cols-2 h-3/4 gap-8 mx-auto"
      >
        <NuxtPage />
      </main>
    </div>
  </section>
</template>
<script setup lang="ts"></script>
