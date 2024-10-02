<template>
  <section class="h-full relative">
    <header class="relative">
      <h1 class="text-center my-4">سرور</h1>
      <img
        class="w-ful mx-auto mt-6 mb-3"
        src="/images/seprator-line.png"
        alt=""
      />
    </header>
    <main class="list-none">
      <li class="grid gridList p-2">
        <USkeleton class="h-5 w-20" :ui="{ background: 'dark:bg-gray-500' }" />
        <p>:نام</p>
      </li>
      <li class="grid gridList p-2 relative">
        <USkeleton class="h-5 w-7" :ui="{ background: 'dark:bg-gray-500' }" />
        <p>:تعداد اسلات</p>
      </li>
      <li class="grid gridList p-2 relative">
        <USkeleton class="h-5 w-20" :ui="{ background: 'dark:bg-gray-500' }" />
        <p>:موقعیت مکانی</p>
      </li>
      <li class="grid gridList p-2 relative">
        <USkeleton class="h-5 w-11" :ui="{ background: 'dark:bg-gray-500' }" />
        <p>:وضعیت</p>
      </li>
    </main>
  </section>
</template>
<script setup lang="ts"></script>
