<template>
  <section
    class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
  >
    <main
      class="text-white max-w-[30rem] w-full bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
    >
      <button
        :class="disable ? 'disable' : ''"
        :disabled="disable"
        class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
        @click="$emit('close')"
      >
        X
      </button>
      <header class="mb-4 mt-2">
        <h1>ساخت بکاپ</h1>
        <p class="mt-2 text-sm opacity-35">
          سرور و دوره مدنظر خودرا انتخاب کنید
        </p>
      </header>
      <p class="text-right my-3">سرور</p>
      <select
        class="p-2 appearance-none rounded-xl bg-transparent border text-right"
      >
        <option value="">vipts.ir</option>
      </select>
      <p class="text-right my-3">دوره</p>
      <select
        class="p-2 appearance-none rounded-xl bg-transparent border text-right"
      >
        <option value="">یک بار</option>
      </select>
      <button class="w-full p-4 bg-main_blue rounded-xl mt-8 mb-2">
        افزودن
      </button>
    </main>
  </section>
</template>
