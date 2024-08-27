<template>
  <section class="list-none w-full h-full text-center relative">
    <h1 class="font-medium my-3">کاربر</h1>
    <img src="/images/seprator-line.png" alt="" />
    <header class="grid  text-right user-grid my-4 px-4">
      <p>Daniel</p>
      <p>:نام</p>
      <p>3.5.6 [Beta_linux_x86] Windows</p>
      <p>:ورژن</p>
      <p>یک روز و دو ساعت و پنجاه دقیقه</p>
      <p>:اپتایم</p>
    </header>
    <img src="/images/seprator-line.png" alt="" />
    <main>
      <div class="text-left mt-3 mb-6 px-4">
        <p>ServerGroups:</p>
        <li>-Configure</li>
        <li>Admin Server Query</li>
        <li>-Manager</li>
      </div>
      <div class="px-4 text-left ">
        <p>Channel Groups:</p>
        <li>-Guest</li>
      </div>
    </main>
    <footer class="grid grid-cols-2 absolute w-full bottom-8 gap-4 px-4">
      <button
        class="flex justify-center items-center gap-3  user-sec-btn rounded-tl-lg"
      >
        <p>بن از سرور</p>
        <img src="/images/ban_client.png" alt="" />
      </button>
      <button
        class="flex justify-center items-center gap-3  user-sec-btn rounded-tr-lg"
      >
        <p>کیک از سرور</p>
        <img src="/images/kick_server.png" alt="" />
      </button>
      <button
        class="flex justify-center items-center gap-3  user-sec-btn rounded-bl-lg"
      >
        <p>رنک ها</p>
        <img src="/images/ranks.png" alt="" />
      </button>
      <button
        class="flex justify-center items-center gap-3  user-sec-btn rounded-br-lg"
      >
        <p>کیک از چنل</p>
        <img src="/images/kick_channel.png" alt="" />
      </button>
    </footer>
  </section>
  <banFromServer class="hidden" />
  <kickFromChannel class="hidden" />
  <kickFromServer class="hidden" />
  <changeServerGroups class="hidden" />
</template>
<script setup>
import banFromServer from './modules/user/banFromServer.vue'
import kickFromChannel from './modules/user/kickFromChannel.vue'
import kickFromServer from './modules/user/kickFromServer.vue'
import changeServerGroups from './modules/user/changeServerGroups.vue'
</script>
