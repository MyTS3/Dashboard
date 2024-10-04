<template>
  <section
    class="h-full absolute z-50 min-w-full backdrop-blur-md bg-mainbg_600 flex flex-col justify-center top-0 left-0 items-center"
  >
    <div class="bg-mainbg_500 w-[40rem] h-14 rounded-lg">
      <p>اطلاعات پایین را دقیقا در یاتکای خود وارد کنید</p>
      <p>برای کپی کردن کافیست روی هر فیلد کلیک کنید</p>
    </div>
    <main
      class="relative text-white min-w-[50rem] bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
    >
      <button
        class="text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
        @click="$emit('close')"
      >
        X
      </button>

      <div
        class="absolute left-[7.9rem] top-[9rem] bg-white text-black w-[10.4rem] h-5 flex justify-around text-xs"
      >
        <p>{{ selectedServer.name }}</p>
        <button @click="copyToClipboard(selectedServer.name)">
          <img class="w-4" src="/images/Copy2.png" alt="" />
        </button>
      </div>
      <div
        class="absolute left-[18.96rem] top-[9rem] bg-white text-black w-[4.6rem] h-5 flex justify-around text-xs"
      >
        <p>{{ selectedServer.queryPort }}</p>
        <button @click="copyToClipboard(selectedServer.queryPort)">
          <img class="w-4" src="/images/Copy2.png" alt="" />
        </button>
      </div>
      <div
        class="absolute left-[24.2rem] top-[9rem] bg-white text-black w-[4.6rem] h-5 flex justify-around text-xs"
      >
        <p>{{ selectedServer.queryPort }}</p>
        <button @click="copyToClipboard(selectedServer.queryPort)">
          <img class="w-4" src="/images/Copy2.png" alt="" />
        </button>
      </div>
      <div
        class="absolute left-[29.5rem] top-[9rem] bg-white text-black w-[7.2rem] h-5 flex justify-around text-xs"
      >
        <p>serveradmin</p>
        <button @click="copyToClipboard('serveradmin')">
          <img class="w-4" src="/images/Copy2.png" alt="" />
        </button>
      </div>
      <div
        class="absolute left-[36.9rem] top-[9rem] bg-white text-black w-[8.4rem] h-5 flex justify-around text-xs"
      >
        <p :style="{ '-webkit-text-security': showYatqaPass }">
          {{ selectedServer.queryPassword }}
        </p>
        <button @click.prevent="yatqaPassReset = true">
          <img class="w-4" src="/images/edit.png" alt="" />
        </button>
        <button
          v-if="showYatqaPass == 'none'"
          @click="copyToClipboard(selectedServer.queryPassword)"
        >
          <img class="w-4" src="/images/Copy2.png" alt="" />
        </button>
        <button
          v-if="showYatqaPass == 'disc'"
          @click.prevent="showYatqaPass = 'none'"
        >
          <img class="w-4" src="/images/hide.png" alt="" />
        </button>
      </div>
      <img class="w-full h-full" src="/images/yatqa-example.png" alt="" />
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
const showYatqaPass = ref('disc');
console.log(props);
function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  toast.add({
    title: 'کپی شد',
    timeout: 2000,
    color: 'blue',
  });
}
</script>
