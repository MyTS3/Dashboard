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
      <h1 class="my-4">کیک از چنل</h1>
      <label class="text-right">:دلیل</label>
      <input
        class="my-4 bg-transparent border p-3 rounded-xl text-right"
        type="text"
      />
      <div class="grid grid-cols-2 gap-3">
        <button
          class="p-4 text-center rounded-xl border-2 border-blue-700/80 bg-blue-600/20 module-btn"
        >
          لغو
        </button>
        <button class="p-4 text-center rounded-xl bg-main_red module-btn">
          تایید
        </button>
      </div>
    </main>
  </section>
</template>
