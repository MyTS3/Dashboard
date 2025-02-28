<template>
  <div class="min-h-0 flex-1 mb-16 relative">
    <div dir="rtl" class="table bg-mainbg_300 text-nowrap rounded-t-2xl">
      <p>مبلغ</p>
      <p>تاریخ ثبت</p>
      <p>تاریخ پایان</p>
    </div>
    <Table>
      <div class="h-full relative">
        <div class="h-full">
          <template v-if="false">
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
                class="h-5 w-60"
                :ui="{ background: 'dark:bg-gray-500' }"
              />
            </div>
          </template>
          <template v-else>
            <div class="w-full h-full justify-center gap-4 items-center">
              <li v-for="log in logs" :key="log.uuid" class="table">
                <p :class="handleAmountColor(log)">
                  {{ handleAmountText(log.amount) }}
                </p>
                <p>{{ (log.created_at || log.start)?.split('T')[0] }}</p>
                <p>{{ log.end?.split('T')[0] || '.......' }}</p>
                <div class="flex gap-1" :class="handleStatusColor(log)">
                  <p>
                    {{ handleTheStatus(log) }}
                  </p>
                  <img
                    v-if="handleStatusColor(log) == 'charge-status'"
                    class="w-5"
                    src="/images/add-square.png"
                    alt=""
                  />
                  <img
                    v-if="handleStatusColor(log) == 'loading-status'"
                    class="w-5"
                    src="/images/waiting.png"
                    alt=""
                  />
                  <img
                    v-if="handleStatusColor(log) == 'reduce-status'"
                    class="w-3"
                    src="/images/minus.png"
                    alt=""
                  />
                </div>
              </li>
            </div>
          </template>
        </div>
      </div>
    </Table>
    <button
      class="flex absolute gap-btn -bottom-16 w-full items-center justify-center btn rounded-xl mt-auto py-3"
      @click="changeWalletTab = true"
    >
      شارژ کیف پول
      <img src="/images/addon.png" alt="" />
    </button>
    <ChargeWallet v-if="changeWalletTab" @close="changeWalletTab = false" />
  </div>
</template>
<script setup lang="ts">
import ChargeWallet from '~/components/modules/wallet/chargeWallet.vue';
import Table from '~/components/reusable/table.vue';
//
type walletRows =
  | {
      uuid: string;
      reason: string;
      userid: number;
      amount: string;
      start: null;
      end: null;
      price: null;
      seconds_for_price: null;
      created_at: string;
    }
  | {
      uuid: string;
      reason: string;
      userid: number;
      amount: string;
      start: string;
      end: string | null;
      price: number;
      seconds_for_price: number;
      created_at: null;
    };
//
const changeWalletTab = ref(false);
//
const store = apiStore();
const { url } = storeToRefs(store);
const errors = errorHandle();
//
function handleAmountColor(log: walletRows) {
  if (!log.created_at && !log.end) return 'orange-text';
  else {
    if (log.amount.startsWith('-')) return 'red-text';
    else return 'green-text';
  }
}
function handleAmountText(amount: string) {
  if (!amount.startsWith('-')) return Math.trunc(Number(amount));
  else return Math.trunc(Number(amount.substring(1)));
}
function handleTheStatus(log: walletRows) {
  if (!log.created_at && !log.end) return 'درحال پردازش';
  else {
    if (log.amount.startsWith('-')) return 'کم شد';
    else return 'شارژ شد';
  }
}
function handleStatusColor(log: walletRows) {
  if (!log.created_at && !log.end) return 'loading-status';
  else {
    if (log.amount.startsWith('-')) return 'reduce-status';
    else return 'charge-status';
  }
}
const { data: logs, error } = await useFetch<walletRows[]>(
  `${url.value}/api/v4/wallet`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
);
if (error.value) {
  errors.handle(error.value.data.code);
}
</script>
<style scoped>
.table {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  text-align: right;
  justify-items: center;
  height: 4rem;
  justify-content: center;
  align-items: center;
}
.loading-status {
  background-color: rgb(236, 102, 0, 0.25);
  padding-block: 5px;
  padding-inline: 8px;
  border-radius: 25px;
}
.reduce-status {
  background-color: rgba(58, 43, 65, 1);
  color: rgba(255, 69, 58, 1);
  padding-block: 5px;
  padding-inline: 15px;
  border-radius: 25px;
}
.charge-status {
  background-color: rgba(198, 255, 144, 0.12);
  color: rgba(145, 197, 97, 1);
  padding-block: 5px;
  padding-inline: 15px;
  border-radius: 25px;
}
.orange-text {
  color: rgba(214, 162, 67, 1);
}
.green-text {
  color: rgba(145, 197, 97, 1);
}
.red-text {
  color: rgba(255, 69, 58, 1);
}
</style>
