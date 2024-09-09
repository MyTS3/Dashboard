<template>
  <section
    class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
  >
    <main
      class="text-white min-w-[28rem] bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
    >
      <button
        @click="$emit('close')"
        class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
      >
        X
      </button>
      <h1 class="my-4 font-bold text-xl">افزودن دامنه</h1>
      <p class="text-center text-main_red max-w-96 text-md mx-auto  mx-6">
        !تغییر دهید ns.myts3.ir مهم: نیم سرور های خودرا به
      </p>
      <h2 class="text-right w-full mt-3 mb-1">دامنه</h2>
      <input
        v-model="domainName"
        class="bg-transparent my-4 p-3 w-full border rounded-xl text-left relative placeholder:text-right"
        type="text"
        placeholder="vipts.ir"
      />
      <div class="grid gap-3">
        <button
          @click="AddDomain()"
          class="p-4 text-center rounded-xl bg-main_blue module-btn"
        >
          تایید
        </button>
      </div>
    </main>
  </section>
</template>
<script setup>
import nuxtStorage from "nuxt-storage";
const store = apiStore()
const {url} = storeToRefs(store)
const emit = defineEmits(["close"])
const domainList = ref()
const addDomainTab = ref(false)
const domainName = ref()


async function AddDomain(){
  const response = await $fetch(`${url.value}/api/v1/tdomains`,{
    method:"POST",
    headers: {
      Authorization: `Bearer ${nuxtStorage.localStorage.getData("token")}`,
    },
    body:JSON.stringify({
      "domain": domainName.value
    })
  })
  emit("close")
}
</script>
<style></style>
