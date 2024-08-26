<template>
  <!-- <Teleport to=""> -->
  <section
    class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex
      justify-center top-0 left-0 items-center
      "
  >
    <main
      class="text-white min-w-96 bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative
        rounded-xl
        "
    >
      <button
        @click="$emit('close')"
        class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
      >
        X
      </button>
      <header class="my-5  ">
        <h1 class="text-xl font-bold">ساخت سرور تیم اسپیک</h1>
        <p class="text-xs text-white/65 mt-4 mx-40">
          برای ساخت سرور اطلاعات زیر را کامل کنید
        </p>
      </header>
      <div class="flex flex-col">
        <label class="text-right font-medium mb-4">نام سرور</label>
        <input
          class="bg-transparent border rounded-lg p-4 placeholder:text-right
          placeholder:text-white/30
            "
          type="text"
          placeholder=".v4.myts3.ir"
        />
      </div>
      <div>
        <p class="my-4 text-right font-medium">تعداد اسلات</p>
        <div class="flex justify-between">
          <p>16</p>
          <p>32</p>
          <p>64</p>
          <p>128</p>
          <p>256</p>
          <p>512</p>
          <p>1024</p>
        </div>
        <input class="w-full" type="range" min="1" max="7" />
      </div>
      <!-- /////////////////price started//////// -->
      <div id="price" class="w-full">
        <div class="flex justify-between flex-row-reverse mt-3">
          <h1>:قیمت ساعتی</h1>
          <div class="flex flex-row-reverse gap-1 text-white/40">
            <span>54</span>
            <p>تومان</p>
          </div>
        </div>
        <div class="flex justify-between flex-row-reverse mt-3">
          <h1>:قیمت روزانه</h1>
          <div class="flex flex-row-reverse gap-1 text-white/40">
            <span>1،300</span>
            <p>تومان</p>
          </div>
        </div>
        <div class="flex justify-between flex-row-reverse mt-3">
          <h1>:قیمت ماهانه</h1>
          <div class="flex flex-row-reverse gap-1">
            <span>39،000</span>
            <p>تومان</p>
          </div>
        </div>
      </div>
      <!-- //////////////////price eneded////////////// -->
      <div class="flex flex-row-reverse text-center mt-4">
        <p>گزینه های بیشتر</p>
        <div
          @click="moreoptions=!moreoptions"
          class="flex items-center mx-auto gap-2"
        >
          <img
            :class="{'rotate-180':moreoptions}"
            class="cursor-pointer transition-all"
            src="/images/arrow.png"
            alt=""
          />
          <img src="/images/line.png" alt="" />
        </div>
      </div>
      <!-- /////////////////////moreoptions//////// -->
      <div
        class="grid grid-cols-2 w-full justify-around mt-5"
        v-if="moreoptions"
      >
        <div>
          <p class="text-right mb-4">ورژن</p>
          <form class="flex justify-around" action="/action_page.php">
            <div>
              <label>1.5.6</label>
              <input
                class="ml-2 scale-150"
                type="radio"
                name="version"
                value="1.5.6"
              />
            </div>
            <div>
              <label>1.4.22</label>
              <input
                class="ml-2 scale-150"
                type="radio"
                name="version"
                value="1.4.22"
              />
            </div>
          </form>
        </div>

        <div class="flex flex-col items-end">
          <p class="text-right mb-4">پورت</p>
          <input
            class="w-4/5 py-2 bg-transparent border rounded-lg px-4"
            type="number"
          />
        </div>
      </div>
      <!-- /////////////////end of more options/////////// -->
      <button
        class="flex w-full items-center justify-center make-server font-medium gap-2 "
      >
        <span><img src="/images/plus.png" alt="" /></span>ساخت
      </button>
    </main>
  </section>
  <!-- </Teleport> -->
</template>
<script setup>
const moreoptions = ref(false)
</script>
