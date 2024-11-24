<template>
  <section
    class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
  >
    <main
      class="text-white w-full max-w-[30rem] bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl"
    >
      <button
        class="self-end text-center flex justify-center items-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
        @click="$emit('close')"
      >
        <img class="w-3" src="/images/X-9.png" alt="" />
      </button>
      <header class="my-4 grid gap-2">
        <p class="text-xl font-bold">ویرایش موزیک بات</p>
        <p class="opacity-70 text-sm">پلی لیست یا اسم بات خودرا عوض کنید</p>
      </header>
      <div class="grid gap-5">
        <div class="grid gap-1">
          <p class="text-right">پلی لیست</p>
          <select
            class="w-full bg-transparent text-right appearance-none border rounded-xl p-3"
          >
            <option class="dropdown p-5" value="1">radio tataloo</option>
          </select>
        </div>
        <div class="grid gap-1">
          <p class="text-right">نام</p>
          <input
            class="w-full bg-transparent text-right appearance-none border rounded-xl p-3"
            type="text"
          />
        </div>
      </div>
      <!-- <button
        :class="{
          'cursor-not-allowed opacity-55': submitDisable || pending,
        }"
        :disabled="submitDisable || pending"
        class="flex w-full items-center justify-center bg-main_blue p-4 mt-5 rounded-xl font-medium gap-2"
        @click.prevent="makeServer()"
      >
        <div
          v-if="!disableInputs"
          class="flex w-full items-center justify-center font-medium gap-2"
        >
          <span><img src="/images/plus.png" alt="" /></span>ساخت
        </div>
        <loading v-if="disableInputs" />
      </button> -->
    </main>
  </section>
</template>
