<template>
  <section
    class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex
  justify-center top-0 left-0 items-center
  "
  >
    <main
      class="text-white bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative
    rounded-xl font-medium w-4/5 max-h-screen
    "
    >
      <button
        @click="$emit('close')"
        class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
      >
        X
      </button>
      <h1 class="my-4">لیست بن ها</h1>
      <div class="text-sm gap-1 ban-list text-right relative">
        <div class="bg-mainbg_400 rounded-lg">
          <p class="text-lg text-right p-4">دلیل</p>
          <div class="items p-4 flex flex-row-reverse justify-between">
            <p class="">نا مشخص</p>
            <button class="text-main_red font-bold ">X</button>
          </div>
          <div class="items p-4 flex flex-row-reverse justify-between">
            <p class="">نا مشخص</p>
            <button class="text-main_red font-bold ">X</button>
          </div>
          <div class="items p-4 flex flex-row-reverse justify-between">
            <p class="">نا مشخص</p>
            <button class="text-main_red font-bold ">X</button>
          </div>
        </div>
        <div class="flex flex-col text-right  bg-mainbg_400 rounded-lg">
          <p class="items text-lg p-4">انقضا</p>
          <p class="items p-4">قیامت</p>
          <p class="items p-4">قیامت</p>
          <p class="items p-4">قیامت</p>
        </div>
        <div class="flex flex-col text-right  bg-mainbg_400 rounded-lg">
          <p class="items text-lg p-4">نام،آیپی،آیدی</p>
          <p class="items p-4">uid=q4+fkC6VwO/UdpTaRQxLFdF0U+Q=</p>
          <p class="items p-4">uid=q4+fkC6VwO/UdpTaRQxLFdF0U+Q=</p>
          <p class="items p-4">name=Daniel, ip=hidden</p>
        </div>
      </div>
    </main>
  </section>
</template>
