<template>
  <Table>
    <div class="h-full overflow-y-scroll">
      <div class="table bg-mainbg_300 rounded-t-2xl ">
        <p>دامنه</p>
        <p>وضغیت</p>
        <p>تاریخ ثبت</p>
        <p>عمل</p>
      </div>
      <div v-for="domain in domainList" class="table items">
        <p class="font-semibold">{{domain.domain}}</p>
        <div
          class="flex w-28 justify-center items-center rounded-3xl h-10 bg-main_green/15"
          v-if="true"
        >
          <img class="w-6" src="/images/check.png" alt="" />
          <p class="font-bold text-main_green">فعال</p>
        </div>
        <div
          class="flex w-28 justify-center items-center rounded-3xl h-10 bg-main_orange/15"
          v-if="false"
        >
          <img class="w-6" src="/images/waiting.png" alt="" />
          <p class="font-bold text-main_orange">در انتظار</p>
        </div>
        <p>{{ timeAgo.format(new Date(domain.createdAt)) }}</p>
        <img class="cursor-pointer" src="/images/trash.png" alt="" />
      </div>
    </div>
    <button
      @click.prevent="makeServerTab = true"
      class="flex w-full items-center justify-center btn rounded-xl py-3"
    >
      ساخت سرور
      <img src="/images/addon.png" alt="" />
    </button>
  </Table>
</template>
<script setup>
import Table from '~/components/reusable/table.vue';
import nuxtStorage from "nuxt-storage";

import TimeAgo from "javascript-time-ago";
import fa from "javascript-time-ago/locale/fa";
TimeAgo.addDefaultLocale(fa);
const timeAgo = new TimeAgo("fa");

const store = apiStore()
const {url} = storeToRefs(store)
const domainList = ref()

async function getDomain(){
  const response = await $fetch(`${url.value}/api/v1/tdomains`,{
    headers: {
      Authorization: `Bearer ${nuxtStorage.localStorage.getData("token")}`,
    },
  })
  domainList.value = await response
}

await getDomain()
</script>
<style scoped>
.table{
  display: grid;
  grid-template-columns: repeat(4,1fr);
  text-align: center;
  justify-items: center;
  padding: 1rem;
}
</style>
