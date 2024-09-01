<template>
  <section
    class="h-full absolute z-50 w-full flex
        justify-center top-0 left-0 items-center
        "
  >
    <main
      class="text-white min-w-96 bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative
          rounded-xl font-medium
          "
    >
      <button
        @click="$emit('close')"
        class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
      >
        X
      </button>
      <h1 class="text-xl my-4 font-bolder">سرور با موفقیت ساخته شد</h1>
      <div
        class="flex flex-row-reverse justify-center items-center mb-2 font-light"
      >
        <p>:توکن شما</p>
        <p>{{ token }}</p>
        <button @click="copyToClipboard()" class="mr-3">
          <img src="/images/copy.png" alt="" />
        </button>
      </div>
      <p :class="{'opacity-0':!copy}" class="mb-6 text-main_green ">
        !توکن کپی شد
      </p>
      <a
        @click="goToServer()"
        class="p-4 py-5 text-center rounded-xl module-btn bg-main_blue"
        :href="tsURL"
      >
        <button>اوکی</button>
      </a>
    </main>
  </section>
</template>
<script setup>
const props = defineProps(["token","tsURL","tsuuid"])
const emit = defineEmits(["close"])

/////
const {tsURL} = props
const copy = ref(false)
function copyToClipboard(){
  navigator.clipboard.writeText(props.token);
  copy.value = true
}
function goToServer(){
  // router.push(`/teamspeak/${props.tsuuid}`)
  emit('close')

}
</script>
