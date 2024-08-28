<template>
  <div class="bg-mainbg_400 w-full rounded-xl text-center">
    <header class="w-full relative my-4 px-4">
      <h1
        class=" p-1 border-2 bg-white/10 rounded-2xl btn
      "
      >
        daniel.v4.myts.ir
      </h1>
      <img class="mt-3" src="/images/seprator-line.png" alt="" />
    </header>
    <main class="list-none teamspeak text-xs px-4">
      <div>
        <div class="rounded-lg p-1 px-3 hover:bg-main_orange/20">
          <p>Music Channels</p>
        </div>
      </div>
      <div>
        <div class="flex p-1 px-3 rounded-lg hover:bg-main_orange/20 gap-1">
          <img src="/images/channel-icon.png" alt="" />
          <p>Music Channels 1</p>
        </div>

        <li
          class="flex pl-6 gap-1 my-1
          p-1 px-3 rounded-lg hover:bg-main_orange/20
        "
        >
          <img src="/images/normal-user.png" alt="" />
          <p>daniel</p>
        </li>
        <li
          class="flex pl-6 gap-1 my-1
          p-1 px-3 rounded-lg hover:bg-main_orange/20
        "
        >
          <img src="/images/bot-icon.png" alt="" />
          <p>RadioJavan</p>
        </li>
      </div>
      <div>
        <div class="flex p-1 px-3 rounded-lg hover:bg-main_orange/20 gap-1">
          <img src="/images/channel-icon.png" alt="" />
          <p>Music Channels 2</p>
        </div>

        <li
          class="flex pl-6 gap-1 my-1
          p-1 px-3 rounded-lg hover:bg-main_orange/20
        "
        >
          <img src="/images/output_muted.png" alt="" />
          <p>toz</p>
        </li>
      </div>
      <div>
        <div class="flex p-1 px-3 rounded-lg hover:bg-main_orange/20 gap-1">
          <img src="/images/channel-icon.png" alt="" />
          <p>Music Channels 3</p>
        </div>

        <li
          class="flex pl-6 gap-1 my-1
          p-1 px-3 rounded-lg hover:bg-main_orange/20
        "
        >
          <img src="/images/input_muted.png" alt="" />
          <p>oblack</p>
        </li>
      </div>
      <div>
        <div class="flex p-1 px-3 rounded-lg hover:bg-main_orange/20 gap-1">
          <img src="/images/channel-icon.png" alt="" />
          <p>Music Channels 4</p>
        </div>

        <li
          class="flex pl-6 gap-1 my-1
          p-1 px-3 rounded-lg hover:bg-main_orange/20 
        "
        >
          <img src="/images/away.png" alt="" />
          <p>fier</p>
        </li>
      </div>
    </main>
  </div>
  <div class="bg-mainbg_400 w-full rounded-xl">
    <server v-if="activeTab=='server' " />
    <user v-if="activeTab=='user' " />
    <channel v-if="activeTab=='channel' " />
    <musicbot v-if="activeTab=='musicbot' " />
  </div>
</template>
<script setup lang="ts">
import musicbot from '~/components/musicbot.vue';

const route = useRoute()
const activeTab = ref("musicbot")
</script>
