<template>
  <button
    :disabled="disableInputs"
    :class="{ 'bg-main_red/30': disableInputs }"
    class="self-end text-center flex justify-center items-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
    @click="$emit('close')"
  >
    <img class="w-3" src="/images/X-9.png" alt="" />
  </button>
</template>
