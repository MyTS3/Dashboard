<template>
  <section
    class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex
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
      <h1 class="my-4 mx-24">
        <span>( Daniel )</span> تغییر رنک سرور گروه های
      </h1>
      <div class="flex flex-col gap-4">
        <!-- //////////////////////////////lists -->
        <div class="flex flex-col gap-3 bg-blue-600/5 p-3 rounded-xl ">
          <li class="flex gap-2">
            <button class="checkbox"></button>
            <p>Admin Server Query</p>
          </li>
          <li class="flex gap-2">
            <button class="checkbox-active"></button>
            <p>Guest Server Query</p>
          </li>
        </div>
        <!-- //////////////////////////////////list -->
        <div class="flex flex-col gap-3 bg-blue-600/5 p-3 rounded-xl ">
          <li class="flex gap-2">
            <button class="checkbox"></button>
            <p>owner</p>
          </li>
          <li class="flex gap-2">
            <button class="checkbox-active"></button>
            <p>admin</p>
          </li>
          <li class="flex gap-2">
            <button class="checkbox"></button>
            <p>vip</p>
          </li>
        </div>
      </div>
      <button class="w-full p-4 bg-main_blue rounded-xl my-2">
        اعمال تغییرات
      </button>
    </main>
  </section>
</template>
