<template>
  <section class="h-full w-full font-medium relative">
    <h1 class="text-center my-4">چنل</h1>
    <img src="/images/seprator-line.png" alt="" />
    <main class="text-right flex flex-col gap-3 px-4">
      <p><span>MusicChannel </span>:نام</p>
      <p><span>1 </span>:تعدادکاربران</p>
    </main>
    <footer
      class="w-full absolute bottom-10 px-4 grid  gap-4
    
    "
    >
      <button class="flex items-center py-3 justify-center btn rounded-l-lg">
        <p>ساخت موزیک بات جدید</p>
        <img src="/images/addon.png" alt="" />
      </button>
    </footer>
  </section>
  <MakeMusicbot />
</template>
<script setup>
import MakeMusicbot from './modules/musicbot/makeMusicbot.vue';
</script>
