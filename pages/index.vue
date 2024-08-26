<template>
  <div class="bg-mainbg_400 w-full rounded-xl p-5">
    <header class="flex flex-row-reverse justify-between items-center mb-4">
      <h1 class="font-medium">کیف پول</h1>
      <div class="flex gap-4">
        <button class="btn py-1 px-3 rounded-xl">
          <P class="text-2xl text-center">+</P>
        </button>
        <button class="btn flex items-center px-2 py-2 rounded-xl gap-2">
          <div class="flex  text-sm">
            <p>هزار تومان</p>
            <span>120</span>
          </div>

          <img src="/images/Wallet.png" alt="wallet" />
        </button>
      </div>
    </header>
    <div class="flex flex-col list-none gap-5">
      <li
        class="flex p-2 border-2  justify-center rounded-2xl
      border-main_orange bg-main_orange/10
      "
      >
        <p><span>1402/2/9</span>تومان + ازتاریخ</p>
        <span> 5000</span>
      </li>
      <li
        class="flex p-2 border-2  justify-center rounded-2xl
      border-main_green bg-main_green/10
      "
      >
        <p><span>1402/2/9</span>تومان + ازتاریخ</p>
        <span> 5000</span>
      </li>
      <li
        class="flex p-2 border-2  justify-center rounded-2xl
      border-main_red bg-main_red/10
      "
      >
        <p><span>1402/1/9</span>تومان + ازتاریخ</p>
        <span> 5000</span>
      </li>
    </div>
  </div>
  <!-- //////////////////////////// -->
  <div class="bg-mainbg_400 w-full rounded-xl p-5">
    <header
      class="flex flex-row-reverse justify-between items-center mb-4 text-center"
    >
      <h1 class="font-medium">سرورها</h1>
      <div class="flex gap-4">
        <button
          @click.prevent="makeServerTab=true"
          class="btn py-1 px-3 rounded-xl"
        >
          <P class="text-2xl text-center">+</P>
        </button>
        <button class="btn flex items-center px-2 py-2 rounded-xl gap-2">
          <div class="flex text-sm gap-2">
            <p>عدد</p>
            <span>3</span>
          </div>
        </button>
      </div>
    </header>
    <div class="flex flex-col gap-5 list-none text-center">
      <li class="p-2 border-2 bg-white/10 rounded-2xl active-server">
        daniel.v4.myts3.ir
      </li>
      <li class="p-2 border-2 bg-white/10 rounded-2xl">vipts.ir</li>
      <li class="p-2 border-2 bg-white/10 rounded-2xl">test.v4.myts3.ir</li>
    </div>
  </div>
  <makeServer v-if="makeServerTab" @close="makeServerTab=false" />
</template>
<script setup>
import makeServer from "/components/modules/makeServer.vue"
const route = useRoute()
const makeServerTab = ref(false)
</script>
