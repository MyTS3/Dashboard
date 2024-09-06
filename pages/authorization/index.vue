<template>
  <section
    class="h-screen bg-mainbg_600 overflow-hidden relative flex items-center"
  >
    <img
      class="object-cover h-full w-full my-auto absolute top-0 left-0 pointer-events-none"
      src="/images/wave Lines.png"
      alt=""
    />

    <main
      style="width: 30rem; z-index: 100;"
      class="border-t border-l border-r mx-auto rounded-2xl bg-mainbg_600 text-white p-4 relative"
    >
      <header class="flex justify-center items-center flex-col mb-4">
        <img
          class="w-16 pointer-events-none"
          src="/images/Button none.png"
          alt=""
        />
        <h1 class="text-2xl font font-extrabold">!به پنل کاربری خوش اومدی</h1>
        <p class="font-extralight text-white/80 text-md">
          اطلاعاتی که در فرم ثبت نام وارد کردید را اینجا وارد کنید
        </p>
      </header>
      <div class="flex flex-col">
        <div class="flex flex-col">
          <label class="text-right font-bold">نام کاربری یا ایمیل</label>
          <div class="w-full h-full relative">
            <input
              v-model="inputGmail"
              class="p-4 pl-10 w-full h-full border my-4 rounded-xl bg-transparent"
              placeholder="@example@gmail.com"
              type="text"
            />
            <img
              class="w-6 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none"
              src="/images/gmail-icon.png"
              alt=""
            />
          </div>
        </div>
        <div class="flex flex-col">
          <label class="text-right font-bold">رمز عبور</label>
          <div class="w-full h-full relative">
            <input
              v-model="inputPass"
              class="
              p-4 pl-10 w-full h-full border my-4 rounded-xl bg-transparent"
              placeholder="---"
              :type="password"
            />
            <img
              class="w-6 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none"
              src="/images/Lock-icon.png"
            />
            <img
              @click.prevent="showPass()"
              class="w-6 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
              src="/images/Eye.png"
            />
          </div>
        </div>
      </div>
      <p class="text-right cursor-pointer text-main_orange mb-4">
        بازیابی رمز عبور
      </p>
      <button
        @click="signIn()"
        class="bg-main_blue w-full p-4 flex items-center justify-center gap-2 rounded-xl"
      >
        <img src="/images/arrow-left-icon.png" alt="" />
        <p>ورود به پنل</p>
      </button>
      <img
        style="z-index: -1;"
        class="absolute top-1/4 -translate-y-full  left-1/3 -translate-x-full pointer-events-none "
        src="/images/boxes.png"
      />
      <img
        style="z-index: -1;"
        class="absolute bottom-1/4 translate-y-full  right-1/3 translate-x-full pointer-events-none rotate-180 opacity-85"
        src="/images/boxes.png"
      />
    </main>
  </section>
</template>
<script setup>

definePageMeta({
  layout: false,
});

import nuxtStorage from 'nuxt-storage';
import { apiStore } from '#imports';
import { storeToRefs } from '#imports';
const store = apiStore()
const { url } = storeToRefs(store)
//variables
const password  = ref("password")
const inputGmail = ref()
const inputPass = ref()
const route = useRoute()
//function
function showPass(){
  if (password.value == 'password') password.value = 'text'
  else password.value = 'password'
}
if(route.query.token){
  nuxtStorage.localStorage.setData('token',route.query.token,7,'d')
  navigateTo('/main')
}
async function signIn(){
      const response = await $fetch(`${url.value}/api/v1/token`,{
        method:"POST",
        body:JSON.stringify({
          "grant_type": "password",
          "username": `${inputGmail.value}`,
          "password": `${inputPass.value}`
        })
      })
      nuxtStorage.localStorage.setData('token',response.access_token,7,'d')

    }
</script>
