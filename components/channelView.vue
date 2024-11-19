<template>
  <section
    class="flex flex-col justify-between h-full w-full font-medium relative"
  >
    <div>
      <h1 class="text-center">چنل</h1>
      <img class="my-6 w-full" src="/images/seprator-line.png" alt="" />
      <main class="text-right flex flex-col gap-5">
        <li class="grid gridList">
          <p>{{ selectedChannel.channelName }}</p>
          <p>: نام</p>
        </li>
        <li class="grid gridList">
          <p>{{ selectedChannel.numberOfUsers }}</p>
          <p>:تعدادکاربران</p>
        </li>
      </main>
    </div>
    <footer class="w-full grid gap-4">
      <UTooltip class="flex h-full w-full" text="در حال توسعه">
        <button
          class="flex w-full items-center py-3 justify-center btn-disable rounded-lg"
        >
          <p>ساخت موزیک بات جدید</p>
          <img src="/images/addon.png" alt="" />
        </button>
      </UTooltip>
    </footer>
  </section>
  <MakeMusicbot class="hidden" />
</template>
<script setup>
import MakeMusicbot from './modules/musicbot/makeMusicbot.vue';
const { selectedChannel } = defineProps(['selectedChannel']);
</script>
