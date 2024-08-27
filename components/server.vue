<template>
  <section class="h-full relative">
    <header>
      <h1 class="text-center my-4">سرور</h1>
      <img src="/images/seprator-line.png" alt="" />
    </header>
    <main class="list-none">
      <li class="grid gridList p-2 ">
        <p>daniel.v4.mts.ir</p>
        <p>:نام</p>
      </li>
      <li class="grid gridList p-2  relative">
        <p>8</p>
        <p>:تعداد اسلات</p>
        <button class="absolute left-4">
          <img src="/images/edit.png" alt="" />
        </button>
      </li>
      <li class="grid gridList p-2 relative">
        <p>DJJADKLKLDDKKDKLSOP</p>
        <p>:رمز یاتکا</p>
        <div class="absolute left-4">
          <button><img src="/images/edit.png" alt="" /></button>
          <button><img src="/images/copy.png" alt="" /></button>
          <button><img src="/images/hide.png" alt="" /></button>
        </div>
      </li>
      <li class="grid gridList p-2 ">
        <p>2216</p>
        <p>پورت</p>
      </li>
      <li class="grid gridList p-2 ">
        <p>077ad0d8_2069_55445488mkjkjjjfjek5f55ee5f4e</p>
        <p>آیدی</p>
      </li>
      <li class="grid gridList p-2 ">
        <p>1.5.6</p>
        <p>:ورژن</p>
      </li>
      <li class="grid gridList p-2 relative">
        <p>5.57.33.184</p>
        <p>:موقعیت مکانی</p>
        <button class="absolute left-4">
          <img src="/images/location.png" alt="" />
        </button>
      </li>
      <li class="grid gridList p-2 relative">
        <p class="text-main_green">روشن</p>
        <p>:وضعیت</p>
        <div class="absolute left-4 top-1/3">
          <input class="hidden" type="checkbox" id="server-status" />
          <label class="button" for="server-status"></label>
        </div>
      </li>
    </main>
    <footer class="flex mt-auto gap-1 justify-around w-full absolute bottom-10">
      <button
        class="border py-4  w-full rounded-l-lg
        bg-white/10 max-w-48 flex justify-center items-center gap-1 hover:border-main_orange hover:bg-main_orange/10
      "
      >
        <p>ری استارت</p>
        <img src="/images/restart.png" alt="" />
      </button>
      <button
        class="border py-4  w-full rounded-r-lg
        bg-white/10
        hover:border-main_orange hover:bg-main_orange/10 max-w-48
        flex justify-center items-center gap-1
      "
      >
        <p>لیست بن ها</p>
        <img src="/images/ban_list.png" alt="" />
      </button>
    </footer>
  </section>
  <changeSlot class="hidden" />
  <yatqaPassChange class="hidden" />
  <moveLocation class="hidden" />
  <restartServer class="hidden" />
  <turnoffServer class="hidden" />
  <deleteServer class="hidden" />
  <banList class="hidden" />
  <unban class="hidden" />
</template>
<script setup>
import changeSlot from './modules/server/changeSlot.vue'
import yatqaPassChange from './modules/server/yatqaPassChange.vue'
import moveLocation from './modules/server/moveLocation.vue'
import restartServer from './modules/server/restartServer.vue'
import turnoffServer from './modules/server/turnoffServer.vue'
import deleteServer from './modules/server/deleteServer.vue'
import banList from './modules/server/banList.vue'
import unban from './modules/server/unban.vue'
</script>
