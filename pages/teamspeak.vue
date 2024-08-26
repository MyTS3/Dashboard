<template>
  <div class="bg-mainbg_400 w-full rounded-xl p-5 text-center">
    <header class="w-full relative mb-5">
      <h1 class=" bg-main_orange rounded-lg p-1">daniel.v4.mts.ir</h1>
      <img class="absolute -bottom-5" src="/images/seprator-line.png" alt="" />
    </header>
    <main class="list-none teamspeak text-xs">
      <div>
        <div class="rounded-lg hover:bg-main_orange/20">
          <p>Music Channels</p>
        </div>

        <li></li>
      </div>
      <div>
        <div class="flex gap-2 rounded-lg hover:bg-main_orange/20">
          <img src="/images/channel-icon.png" alt="" />
          <p>Music Channels 1</p>
        </div>

        <li class="flex ml-6 gap-1 my-1">
          <img src="/images/normal-user.png" alt="" />
          <p>daniel</p>
        </li>
        <li class="flex ml-6 gap-1 my-1">
          <img src="/images/bot-icon.png" alt="" />
          <p>RadioJavan</p>
        </li>
      </div>
      <div>
        <div class="flex gap-2 rounded-lg hover:bg-main_orange/20">
          <img src="/images/channel-icon.png" alt="" />
          <p>Music Channels 2</p>
        </div>

        <li class="flex ml-6 gap-1 my-1">
          <img src="/images/output_muted.png" alt="" />
          <p>toz</p>
        </li>
      </div>
      <div>
        <div class="flex gap-2 rounded-lg hover:bg-main_orange/20">
          <img src="/images/channel-icon.png" alt="" />
          <p>Music Channels 3</p>
        </div>

        <li class="flex ml-6 gap-1 my-1">
          <img src="/images/input_muted.png" alt="" />
          <p>oblack</p>
        </li>
      </div>
      <div>
        <div class="flex gap-2 rounded-lg hover:bg-main_orange/20">
          <img src="/images/channel-icon.png" alt="" />
          <p>Music Channels 4</p>
        </div>

        <li class="flex ml-6 gap-1 my-1">
          <img src="/images/away.png" alt="" />
          <p>fier</p>
        </li>
      </div>
    </main>
  </div>
  <div class="bg-mainbg_400 w-full rounded-xl">
    <server v-if="activeTab=='server' " />
    <user v-if="activeTab=='user' " />
  </div>
</template>
<script setup lang="ts">
const route = useRoute()
const activeTab = ref("user")
</script>
