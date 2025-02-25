<template>
  <teleport to="body">
    <section
      class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
    >
      <main
        class="text-white min-w-[28rem] bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
      >
        <button
          :disabled="disable"
          class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
          @click="$emit('close')"
        >
          <img class="w-3 mx-auto" src="/images/X-9.png" alt="" />
        </button>
        <h1 class="my-4 font-bold text-xl">شارژ کیف پول</h1>
        <p class="text-center text-white/80 max-w-96 text-md mx-auto mx-6">
          مبلغ مورد نظر باید بین 50،000 تا 2،000،000 تومان باشد
        </p>
        <h2 class="text-right w-full mt-3 mb-1">مبلغ</h2>
        <input
          class="bg-transparent my-4 p-3 w-full border rounded-xl text-left relative placeholder:text-right"
          type="text"
          placeholder="تومان"
        />
        <div class="grid gap-3">
          <button
            :disabled="disable"
            class="p-4 flex justify-center text-center rounded-xl bg-main_blue module-btn"
          >
            <p v-if="!disable">شارژ</p>
            <TheLoading v-else />
          </button>
        </div>
      </main>
    </section>
  </teleport>
</template>
<script setup>
const disable = ref(false);
</script>
