<template>
  <section
    class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
  >
    <main
      class="text-white min-w-[30rem] w-1/2 bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
    >
      <button
        class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
        @click="$emit('close')"
      >
        X
      </button>
      <h1 class="my-4 text-3xl font-extrabold">لیست ساب دامنه ها</h1>
      <div class="bg-mainbg_500 rounded-2xl">
        <div
          style="background-color: rgba(39, 43, 77, 1)"
          class="table items items-center text-center rounded-2xl"
        >
          <p class="">ساب</p>
          <p class="">دامنه</p>
          <p class="">اکشن</p>
        </div>
        <div class="overflow-scroll">
          <div class="table items items-center text-center rounded-lg">
            <p class="">mamad</p>
            <p class="">myts3.ir</p>
            <img
              class="mx-auto cursor-pointer"
              src="/images/trash.png"
              alt=""
            />
          </div>
          <div class="table items items-center text-center rounded-lg">
            <p class="">ali</p>
            <p class="">vipts.ir</p>
            <img
              class="mx-auto cursor-pointer"
              src="/images/trash.png"
              alt=""
            />
          </div>
          <div class="table items items-center text-center rounded-lg">
            <input
              class="w-1/2 mx-auto p-1 rounded-xl bg-transparent border text-right"
              type="text"
            />
            <select
              class="w-1/2 mx-auto p-1 rounded-xl bg-transparent border text-right"
            >
              <option value="ahmad">myts.ir</option>
            </select>
            <img
              class="mx-auto cursor-pointer"
              src="/images/add-square.png"
              alt=""
            />
          </div>
        </div>
      </div>
      <button
        :class="submitDisable ? 'opacity-45' : ''"
        :disabled="submitDisable"
        class="w-full max-w-[15rem] p-4 bg-main_blue rounded-xl my-2"
        @click="applyServerGroups()"
      >
        <p>اعمال تغییرات</p>
      </button>
    </main>
  </section>
</template>
<script setup></script>
<style scoped>
.table {
  display: grid;
  grid-template-columns: 5fr 5fr 2fr;
}
</style>
