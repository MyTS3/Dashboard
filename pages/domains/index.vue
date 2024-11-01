<template>
  <div class="min-h-0 flex-1 mb-28 relative">
    <div
      v-if="status == 'error'"
      class="w-full text-center p-5 bg-main_orange rounded-xl"
    >
      <p class="font-bold">
        پنل از دسترس خارج شده و به زودی در دسترس قرار میگیرد
      </p>
    </div>
    <template v-if="status == 'success'">
      <div dir="rtl" class="table bg-mainbg_300 rounded-t-2xl">
        <p>دامنه</p>
        <p>وضعیت</p>
        <p>تاریخ ثبت</p>
        <p>عمل</p>
      </div>
      <Table>
        <div>
          <template v-if="status != 'success'">
            <div v-for="_ in 5" :key="_" class="table items">
              <USkeleton
                class="h-5 w-40"
                :ui="{ background: 'dark:bg-gray-500' }"
              />
              <USkeleton
                class="h-5 w-20"
                :ui="{ background: 'dark:bg-gray-500' }"
              />
              <USkeleton
                class="h-5 w-20"
                :ui="{ background: 'dark:bg-gray-500' }"
              />
              <USkeleton
                class="h-5 w-10"
                :ui="{ background: 'dark:bg-gray-500' }"
              />
            </div>
          </template>
          <template v-if="status == 'success'">
            <div v-for="domain in domainList" :key="domain" class="table items">
              <p class="font-semibold">{{ domain.domain }}</p>
              <div
                v-if="domain.active"
                class="flex w-20 justify-center items-center rounded-3xl h-8 bg-main_green/15"
              >
                <img class="w-5" src="/images/check.png" alt="" />
                <p class="font-bold text-sm text-main_green">فعال</p>
              </div>
              <div
                v-else
                class="flex w-20 justify-center items-center rounded-3xl h-8 bg-main_orange/15"
              >
                <img class="w-5" src="/images/waiting.png" alt="" />
                <p class="font-bold text-sm text-main_orange">در انتظار</p>
              </div>
              <p>{{ timeAgo.format(new Date(domain.createdAt)) }}</p>
              <img
                v-if="!domain.public"
                class="cursor-pointer"
                src="/images/trash.png"
                alt=""
                @click="(deleteDomainTab = true), (selectedDomain = domain)"
              />
            </div>
          </template>
        </div>
      </Table>
      <button
        v-if="status != 'error'"
        class="flex w-full items-center justify-center gap-1 btn rounded-xl py-3"
        @click="addDomainTab = true"
      >
        <img src="/images/addon.png" alt="" />
        افزودن دامنه
      </button>
      <div
        v-if="domainList.length < 1"
        class="w-full absolute top-1/4 flex flex-col justify-center gap-4 items-center"
      >
        <img src="/images/new/no-domain.png" alt="" />
        <div class="grid text-center">
          <p class="font-bold text-white">هیچ دامینی وجود ندارد</p>
          <p>با کلیک برروی دکمه زیر اولین دامین خودرا بسازید</p>
        </div>
      </div>
    </template>
    <AddDomain
      v-if="addDomainTab"
      @close="getDomain(), (addDomainTab = false)"
    />
    <deleteDomain
      v-if="deleteDomainTab"
      :selected-domain="selectedDomain"
      @close="(deleteDomainTab = false), getDomain()"
    />
  </div>
</template>
<script setup>
import deleteDomain from '~/components/modules/domain/deleteDomain.vue';
import Table from '~/components/reusable/table.vue';
import TimeAgo from 'javascript-time-ago';
import AddDomain from '~/components/modules/domain/addDomain.vue';

const timeAgo = new TimeAgo('fa');
const store = apiStore();
const { url } = storeToRefs(store);
const addDomainTab = ref(false);
const deleteDomainTab = ref(false);
const selectedDomain = ref();

const {
  data: domainList,
  status: status,
  execute: getDomain,
} = await useLazyFetch(`${url.value}/api/v4/tdomains`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});
</script>
<style scoped>
.table {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  text-align: center;
  justify-items: center;
  padding: 1rem;
}
</style>
