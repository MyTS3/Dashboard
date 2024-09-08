<template>
  <section class="h-full relative">
    <header class="flex w-full p-4">
      <h1 class="mx-auto font-bold">موزیک بات</h1>
      <button>
        <img src="/images/edit.png" alt="" />
      </button>
    </header>
    <img class="mx-auto" src="/images/seprator-line.png" alt="" />
    <main
      class="w-4/5 bg-white/10 mx-auto rounded-lg my-6 p-2 overflow-y-auto max-h-96"
    >
      <!-- //////////////////////////////////playlist -->
      <li class="list-none my-1 p-3 rounded-xl relative btn-active">
        <h2 class="text-lg font-bold">Khabam Nemibare</h2>
        <p class="text-sm mt-1 text-white/50">Amir Tataloo</p>
        <button class="absolute bottom-1/2 translate-y-1/2 right-4">
          <img src="/images/pause.png" />
        </button>
      </li>
      <!-- //////////////////////////////////////////// -->
      <li
        class="list-none my-1 p-3 hover:hover:bg-main_orange/20 rounded-xl relative"
      >
        <h2 class="text-lg font-bold">Khabam Miad</h2>
        <p class="text-sm mt-1 text-white/50">Amir Tataloo</p>
        <button class="absolute bottom-1/2 translate-y-1/2 right-4">
          <img src="/images/play.png" />
        </button>
      </li>
      <li
        class="list-none my-1 p-3 hover:hover:bg-main_orange/20 rounded-xl relative"
      >
        <h2 class="text-lg font-bold">bia bekhabim</h2>
        <p class="text-sm mt-1 text-white/50">Amir Tataloo</p>
        <button class="absolute bottom-1/2 translate-y-1/2 right-4">
          <img src="/images/play.png" />
        </button>
      </li>
      <li
        class="list-none my-1 p-3 hover:hover:bg-main_orange/20 rounded-xl relative"
      >
        <h2 class="text-lg font-bold">bia bekhabim</h2>
        <p class="text-sm mt-1 text-white/50">Amir Tataloo</p>
        <button class="absolute bottom-1/2 translate-y-1/2 right-4">
          <img src="/images/play.png" />
        </button>
      </li>
      <li
        class="list-none my-1 p-3 hover:hover:bg-main_orange/20 rounded-xl relative"
      >
        <h2 class="text-lg font-bold">khabidim</h2>
        <p class="text-sm mt-1 text-white/50">Amir Tataloo</p>
        <button class="absolute bottom-1/2 translate-y-1/2 right-4">
          <img src="/images/play.png" />
        </button>
      </li>
    </main>
    <footer class="mx-auto flex flex-col justify-center pb-4">
      <div class="flex flex-col text-center">
        <h2 class="font-bold">Khabam Nemibare</h2>
        <p class="text-sm text-white/50">Amir Tataloo</p>
      </div>
      <div class="flex my-2 items-center w-full justify-around">
        <p>02:36</p>
        <div class="audio-progress"></div>
        <p>3:56</p>
      </div>
      <div class="flex w-full justify-between px-4 mt-2">
        <button>
          <img src="/images/repeate-one.png" alt="" />
        </button>
        <div class="flex w-1/3 justify-around">
          <button>
            <img src="/images/previous.png" alt="" />
          </button>
          <button class="bg-main_orange rounded-full p-4">
            <img src="/images/pause.png" alt="" />
          </button>
          <button>
            <img src="/images/next.png" alt="" />
          </button>
        </div>
        <button>
          <img src="/images/shuffle.png" alt="" />
        </button>
      </div>
    </footer>
  </section>
</template>
