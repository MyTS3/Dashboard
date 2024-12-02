<template>
  <section class="h-full relative overflow-clip flex flex-col gap-2">
    <header class="flex w-full">
      <img
        class="cursor-pointer"
        src="/images/trash.png"
        alt=""
        @click="deleteMusicBotTab = true"
      />
      <h1 class="mx-auto font-bold my-auto">موزیک بات</h1>
      <button class="my-auto">
        <img src="/images/edit.png" alt="" />
      </button>
    </header>
    <img class="mx-auto" src="/images/seprator-line.png" alt="" />
    <div class="h-full flex flex-col gap-5">
      <main
        class="w-4/5 min-h-24 grow row-span-2 bg-white/10 mx-auto rounded-lg p-2 overflow-y-scroll"
      >
        <!-- //////////////////////////////////playlist -->
        <li class="list-none my-1 p-3 rounded-xl relative btn-active">
          <h2 class="text-lg font-bold">Khabam Nemibare</h2>
          <p class="text-sm mt-1 text-white/50">Amir Tataloo</p>
          <button class="absolute bottom-1/2 translate-y-1/2 right-4">
            <img src="/images/pause.png" />
          </button>
        </li>
        <!-- //////////////////////////////////////////// -->
        <li
          class="list-none my-1 p-3 hover:hover:bg-main_orange/20 rounded-xl relative"
        >
          <h2 class="text-lg font-bold">Khabam Miad</h2>
          <p class="text-sm mt-1 text-white/50">Amir Tataloo</p>
          <button class="absolute bottom-1/2 translate-y-1/2 right-4">
            <img src="/images/play.png" />
          </button>
        </li>
        <li
          class="list-none my-1 p-3 hover:hover:bg-main_orange/20 rounded-xl relative"
        >
          <h2 class="text-lg font-bold">bia bekhabim</h2>
          <p class="text-sm mt-1 text-white/50">Amir Tataloo</p>
          <button class="absolute bottom-1/2 translate-y-1/2 right-4">
            <img src="/images/play.png" />
          </button>
        </li>
        <li
          class="list-none my-1 p-3 hover:hover:bg-main_orange/20 rounded-xl relative"
        >
          <h2 class="text-lg font-bold">bia bekhabim</h2>
          <p class="text-sm mt-1 text-white/50">Amir Tataloo</p>
          <button class="absolute bottom-1/2 translate-y-1/2 right-4">
            <img src="/images/play.png" />
          </button>
        </li>
        <li
          class="list-none my-1 p-3 hover:hover:bg-main_orange/20 rounded-xl relative"
        >
          <h2 class="text-lg font-bold">khabidim</h2>
          <p class="text-sm mt-1 text-white/50">Amir Tataloo</p>
          <button class="absolute bottom-1/2 translate-y-1/2 right-4">
            <img src="/images/play.png" />
          </button>
        </li>
      </main>
      <footer
        class="mx-auto basis-52 grow-0 shrink-0 w-full gap-2 flex flex-col"
      >
        <div class="flex flex-col text-center">
          <h2 class="font-bold">Khabam Nemibare</h2>
          <p class="text-sm text-white/50">Amir Tataloo</p>
        </div>
        <div class="flex items-center w-full justify-around">
          <p>02:36</p>
          <div class="audio-progress" />
          <p>3:56</p>
        </div>
        <div class="flex w-full justify-between px-4">
          <button>
            <img src="/images/repeate-one.png" alt="" />
          </button>
          <div class="flex w-2/4 justify-around">
            <button>
              <img src="/images/previous.png" alt="" />
            </button>
            <button class="bg-main_orange rounded-full p-4">
              <img src="/images/pause.png" alt="" />
            </button>
            <button>
              <img src="/images/next.png" alt="" />
            </button>
          </div>
          <button>
            <img src="/images/shuffle.png" alt="" />
          </button>
        </div>
      </footer>
    </div>
    <DeleteMusicBot
      v-if="deleteMusicBotTab"
      :selected-bot="selectedBot"
      @close="deleteMusicBotTab = false"
    />
  </section>
</template>
<script setup lang="ts">
import DeleteMusicBot from './deleteMusicBot.vue';
const deleteMusicBotTab = ref(false);
const props = defineProps(['selectedBot']);
console.log(props);
</script>
<style scoped>
.audio-progress {
  position: relative;
  width: 70%;
  height: 2px;
  background-color: white;
}
.audio-progress::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background-color: rgba(255, 158, 11, 1);
  top: 50%;
  transform: translateY(-50%);
  left: 30%;
}
.audio-progress::after {
  content: '';
  position: absolute;
  background-color: rgba(255, 158, 11, 1);
  width: 30%;
  left: 0;
  height: 2px;
}
</style>
