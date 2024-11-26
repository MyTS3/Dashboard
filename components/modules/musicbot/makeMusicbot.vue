<template>
  <section
    class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
  >
    <main
      class="text-white min-w-96 bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
    >
      <button
        class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
        @click="$emit('close')"
      >
        <img class="w-3 mx-auto" src="/images/X-9.png" alt="" />
      </button>
      <header>
        <h1 class="text-lg font-bold">ساخت موزیک بات</h1>
        <p class="text-x mt-3 mb-6 mx-20 font-light">
          برای ساخت پلی لیست موزیک بات خودرا اتتخاب کنید
        </p>
      </header>
      <div>
        <p class="font-bold w-full text-right">پلی لیست</p>

        <select
          class="text-white bg-transparent my-4 border w-full text-right min-h-16 rounded-2xl"
          name="music"
        >
          <option value="none">هیچکدام</option>
        </select>
        <!-- ///////////////////price///////////// -->
        <div id="price" class="w-full">
          <div class="flex justify-between flex-row-reverse mt-3 text-white/40">
            <h1>:قیمت ساعتی</h1>
            <div class="flex flex-row-reverse gap-1 text-white/40">
              <span>14</span>
              <p>تومان</p>
            </div>
          </div>
          <div class="flex justify-between flex-row-reverse mt-3 text-white/40">
            <h1>:قیمت روزانه</h1>
            <div class="flex flex-row-reverse gap-1 text-white/40">
              <span>333</span>
              <p>تومان</p>
            </div>
          </div>
          <div class="flex justify-between flex-row-reverse mt-3">
            <h1>:قیمت ماهانه</h1>
            <div class="flex flex-row-reverse gap-1">
              <span>10,000</span>
              <p>تومان</p>
            </div>
          </div>
        </div>
        <!-- ////////////////////////////////// -->
      </div>
      <button
        class="flex w-full items-center justify-center make-server font-medium gap-2"
      >
        <span><img src="/images/plus.png" alt="" /></span>ساخت
      </button>
    </main>
  </section>
</template>
