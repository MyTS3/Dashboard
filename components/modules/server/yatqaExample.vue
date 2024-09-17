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
        class="absolute left-[7.9rem] top-[9rem] bg-white text-black w-[10.4rem] h-5 cursor-pointer text-xs"
        @click="copyToClipboard(selectedServer.name)"
      >
        {{ selectedServer.name }}
      </div>
      <div
        class="absolute left-[18.96rem] top-[9rem] bg-white text-black w-[4.6rem] h-5 cursor-pointer text-xs"
        @click="copyToClipboard(selectedServer.queryPort)"
      >
        {{ selectedServer.queryPort }}
      </div>
      <div
        class="absolute left-[24.2rem] top-[9rem] bg-white text-black w-[4.6rem] h-5 cursor-pointer text-xs"
        @click="copyToClipboard(selectedServer.queryPort)"
      >
        {{ selectedServer.queryPort }}
      </div>
      <div
        class="absolute left-[29.5rem] top-[9rem] bg-white text-black w-[7.2rem] h-5 cursor-pointer text-xs"
        @click="copyToClipboard('serveradmin')"
      >
        serveradmin
      </div>
      <div
        class="absolute left-[37.4rem] top-[9rem] bg-white text-black w-[7.2rem] h-5 cursor-pointer text-xs"
        @click="copyToClipboard(selectedServer.queryPassword)"
      >
        {{ selectedServer.queryPassword }}
      </div>
      <img class="w-full h-full" src="/images/yatqa-example.png" alt="" />
    </main>
  </section>
</template>
<script setup>
const props = defineProps(['selectedServer']);
console.log(props);
function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
}
</script>
