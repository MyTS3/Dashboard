<template>
  <section
    class="z-10 bg-mainbg_600 overflow-hidden relative flex items-center min-h-dvh"
  >
    <img
      class="object-cover h-full blur-[2px] w-full my-auto absolute top-0 left-0 pointer-events-none"
      src="/images/wave Lines.png"
      alt=""
    />
    <div
      class="absolute pointer-events-none blur-lg w-screen min-h-screen top-0 left-0 z-60"
    ></div>
    <main
      style="width: 30rem"
      class="border-t isolate border-l border-r mx-auto rounded-2xl z-50 bg-mainbg_600 text-white p-4 relative"
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
              class="p-4 pl-10 w-full h-full border my-4 rounded-xl bg-transparent"
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
        :class="disable ? 'disable' : ''"
        :disabled="disable"
        @click="signIn()"
        class="bg-main_blue w-full p-4 flex items-center justify-center gap-2 rounded-xl"
      >
        <img src="/images/arrow-left-icon.png" alt="" />
        <p v-if="!disable">ورود به پنل</p>
        <TheLoading v-else />
      </button>
      <img
        style="z-index: -1"
        class="absolute top-1/4 -translate-y-full left-1/3 -translate-x-full pointer-events-none"
        src="/images/boxes.png"
      />
      <img
        style="z-index: -1"
        class="absolute bottom-1/4 translate-y-full right-1/3 translate-x-full pointer-events-none rotate-180 opacity-85"
        src="/images/boxes.png"
      />
    </main>
  </section>
</template>
<script setup>
import { apiStore, storeToRefs } from '#imports';
import TheLoading from '~/components/reusable/theLoading.vue';

definePageMeta({
  layout: false,
});

const store = apiStore();
const { url } = storeToRefs(store);
const password = ref('password');
const inputGmail = ref();
const inputPass = ref();
const route = useRoute();
const disable = ref(false);

function showPass() {
  if (password.value == 'password') password.value = 'text';
  else password.value = 'password';
}
if (route.query.token) {
  localStorage.setItem('token', route.query.token);
  navigateTo('/tservers');
}
async function signIn() {
  disable.value = true;
  const { data: response, error } = await useFetch(
    `${url.value}/api/v4/token`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        grant_type: 'password',
        username: `${inputGmail.value}`,
        password: `${inputPass.value}`,
      }),
    },
  );
  disable.value = false;
  if (error.value) {
    toast.add({
      title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
      timeout: 2000,
      color: 'red',
    });
  }
  localStorage.setItem('token', response.access_token);
  navigateTo('/tservers');
}
</script>
