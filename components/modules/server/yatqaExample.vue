<template>
  <section
    class="h-full absolute z-50 min-w-full backdrop-blur-md flex flex-col justify-center top-0 left-0 items-center"
  >
    <main
      class="relative text-white min-w-[50rem] flex flex-col text-center p-4 relative rounded-xl font-medium"
    >
      <button
        class="text-center w-7 h-7 flex justify-center items-center bg-main_red absolute top-7 right-7 rounded-full text-mainbg_600 font-medium text-lg"
        @click="$emit('close')"
      >
        <img class="w-3" src="/images/X-9.png" alt="" />
      </button>

      <div
        class="absolute parent items-center border-black border-[1px] cursor-pointer left-[122px] top-[146px] bg-white text-black w-[10.4rem] h-5 flex justify-around text-xs"
        @click="copyToClipboard(selectedServer.name)"
      >
        <p class="text-black">{{ selectedServer.name }}</p>
        <button>
          <img class="w-4 child" src="/images/Copy.svg" alt="" />
        </button>
      </div>
      <div
        class="absolute parent items-center border-black border-[1px] cursor-pointer left-[300px] top-[146px] bg-white text-black w-[4.6rem] h-5 flex justify-around text-xs"
        @click="copyToClipboard(selectedServer.queryPort)"
      >
        <p>{{ selectedServer.queryPort }}</p>
        <button>
          <img class="w-4 child" src="/images/Copy.svg" alt="" />
        </button>
      </div>
      <div
        class="absolute parent items-center border-black border-[1px] cursor-pointer left-[385px] top-[146px] bg-white text-black w-[4.6rem] h-5 flex justify-around text-xs"
        @click="copyToClipboard(selectedServer.queryPort)"
      >
        <p>{{ selectedServer.queryPort }}</p>
        <button>
          <img class="w-4 child" src="/images/Copy.svg" alt="" />
        </button>
      </div>
      <div
        class="absolute parent items-center border-black border-[1px] cursor-pointer left-[470px] top-[146px] bg-white text-black w-[7.2rem] h-5 flex justify-around text-xs"
        @click="copyToClipboard('serveradmin')"
      >
        <p>serveradmin</p>
        <button>
          <img class="w-4 child" src="/images/Copy.svg" alt="" />
        </button>
      </div>
      <div
        class="absolute parent items-center border-black border-[1px] cursor-pointer left-[590px] top-[146px] bg-white text-black w-[8.8rem] h-5 flex justify-around text-xs"
      >
        <p
          class=""
          :style="{ '-webkit-text-security': showYatqaPass }"
          @click="copyToClipboard(selectedServer.queryPassword)"
        >
          {{ selectedServer.queryPassword }}
        </p>
        <button @click="copyToClipboard(selectedServer.queryPassword)">
          <img class="w-4 child" src="/images/Copy.svg" alt="" />
        </button>
        <button @click.prevent="yatqaPassReset = true">
          <img
            class="w-4 hover:opacity-50"
            src="/images/change_nickname.svg"
            alt=""
          />
        </button>
      </div>
      <img
        class="w-full h-full rounded-3xl pic"
        src="/images/yatqa-example3.png"
        alt=""
      />
    </main>
    <yatqaPassChange
      v-if="yatqaPassReset"
      :selected-server="selectedServer"
      @close="yatqaPassReset = false"
    />
  </section>
</template>
<script setup>
import yatqaPassChange from '@/components/modules/server/yatqaPassChange.vue';
const toast = useToast();
const props = defineProps(['selectedServer']);
const yatqaPassReset = ref(false);
console.log(props);
function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  toast.add({
    title: 'کپی شد',
    timeout: 2000,
    color: 'violet',
  });
}
</script>
<style scoped>
.parent:hover .child {
  opacity: 0.5;
}
</style>
