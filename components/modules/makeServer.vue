<template>
  <Teleport to="body">
    <section
      class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
    >
      <main
        :class="{ hidden: serverTokenTab }"
        class="text-white bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl w-full max-w-[30rem]"
      >
        <button
          :disabled="disableInputs"
          :class="{ 'bg-main_red/30': disableInputs }"
          class="self-end text-center flex justify-center items-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
          @click="$emit('close')"
        >
          <img class="w-3" src="/images/X-9.png" alt="" />
        </button>
        <header class="my-5">
          <h1 class="text-xl font-bold">ساخت سرور تیم اسپیک</h1>
          <p class="text-xs text-white/65 mt-4">
            برای ساخت سرور اطلاعات زیر را کامل کنید
          </p>
        </header>

        <div class="flex flex-col relative">
          <label class="text-right font-medium mb-4">نام سرور</label>
          <input
            v-model="serverName"
            :class="!disableReasson == '' ? 'border-main_red' : ''"
            :disabled="disableInputs"
            class="bg-transparent border rounded-lg p-4 outline-none"
            type="text"
          />

          <p class="absolute right-8 bottom-4 text-blue-300/60">.cloudts.ir</p>
        </div>
        <p class="text-xs mt-2 ml-auto text-main_red">{{ disableReasson }}</p>
        <p class="text-right font-medium mt-3">
          لطفا کانفیگ سرور خودرا انتخاب کنید
        </p>
        <form v-if="status === 'success'" class="w-full my-4">
          <USelectMenu
            v-model="selectedConfig"
            size="xl"
            color="indigo"
            :options="availables"
            :disabled="disableInputs"
          />
        </form>
        <USkeleton
          v-if="status === 'pending'"
          :ui="{ background: 'dark:bg-gray-500' }"
          class="w-full p-6 rounded-xl"
        />
        <button
          class="w-full p-3 rounded-xl bg-main_green"
          @click="getAvailableConfigs"
          v-if="status === 'error'"
        >
          تلاش مجدد
        </button>
        <div
          v-if="selectedConfig != 'CONFIG_DEFAULT'"
          class="flex justify-between flex-row-reverse mb-3"
        >
          <h1>:هزینه فعالسازی</h1>
          <div class="flex flex-row-reverse gap-1">
            <span>{{ configPrice ? Math.abs(configPrice.price) : '?' }}</span>
            <p>تومان</p>
          </div>
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
          <input
            v-model="slot"
            :disabled="disableInputs"
            class="w-full"
            type="range"
            min="1"
            max="7"
          />
        </div>
        <!-- /////////////////price started//////// -->
        <div id="price" class="w-full">
          <div class="flex justify-between flex-row-reverse mt-3 text-white/40">
            <h1>:هزینه ساعتی</h1>
            <div class="flex flex-row-reverse gap-1 text-white/40">
              <span>{{
                prices
                  ? Math.abs(
                      Math.floor(
                        (prices[2 ** (Number(slot) + 3)].price /
                          prices[2 ** (Number(slot) + 3)].secondsForPrice) *
                          3600,
                      ),
                    )
                  : '?'
              }}</span>
              <p>تومان</p>
            </div>
          </div>
          <div class="flex justify-between flex-row-reverse mt-3 text-white/40">
            <h1>:هزینه روزانه</h1>
            <div class="flex flex-row-reverse gap-1 text-white/40">
              <span>{{
                prices
                  ? Math.abs(
                      Math.floor(
                        (prices[2 ** (Number(slot) + 3)].price /
                          prices[2 ** (Number(slot) + 3)].secondsForPrice) *
                          86400,
                      ),
                    )
                  : '?'
              }}</span>
              <p>تومان</p>
            </div>
          </div>
          <div class="flex justify-between flex-row-reverse mt-3">
            <h1>:هزینه ماهانه</h1>
            <div class="flex flex-row-reverse gap-1">
              <span>{{
                prices
                  ? Math.abs(
                      Math.floor(
                        (prices[2 ** (Number(slot) + 3)].price /
                          prices[2 ** (Number(slot) + 3)].secondsForPrice) *
                          2629800,
                      ),
                    )
                  : '?'
              }}</span>
              <p>تومان</p>
            </div>
          </div>
        </div>
        <!-- //////////////////price eneded////////////// -->

        <button
          :class="{
            'cursor-not-allowed opacity-55':
              submitDisable || status === 'pending' || status === 'error',
          }"
          :disabled="
            submitDisable ||
            status === 'pending' ||
            status === 'error' ||
            serverCheckingLoading
          "
          class="flex w-full items-center justify-center bg-main_blue p-4 mt-2 rounded-xl font-medium gap-2 relative"
          @click.prevent="makeServer()"
        >
          <div
            v-if="!disableInputs && !serverCheckingLoading"
            class="flex w-20 items-center justify-center font-medium gap-2"
          >
            <span><img src="/images/plus.png" alt="" /></span>ساخت
          </div>
          <loading v-if="disableInputs || serverCheckingLoading" />
        </button>
      </main>
      <serverToken
        v-if="serverTokenTab"
        :tsURL="tsURL"
        :token="token"
        :tsuuid="tsuuid"
        @close="(serverTokenTab = false), $emit('close')"
      />
    </section>
  </Teleport>
</template>
<script setup>
import { apiStore } from '~/stores/apistore';
import { storeToRefs } from 'pinia';
import serverToken from './serverToken.vue';
import loading from '@/components/reusable/theLoading.vue';
import { getBalance } from '../../stores/globalVaribles';
const router = useRouter();
const serverTokenTab = ref(false);
const props = defineProps(['routeSlot']);
defineEmits(['close']);
const slot = ref(1);
if (
  props.routeSlot &&
  Number(props.routeSlot) <= 7 &&
  Number(props.routeSlot) > 0
) {
  slot.value = Number(props.routeSlot);
  router.replace({ query: {} });
}
const store = apiStore();
const { url } = storeToRefs(store);
const regex = RegExp('^[a-zA-Z0-9]+$');

const { data: prices } = useFetch(`${url.value}/api/v4/prices/tserver`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});
const { data: configPrice } = useFetch(`${url.value}/api/v4/prices/config`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});
const serverName = ref();
const selectedConfig = ref('CONFIG_DEFAULT');
const disableInputs = ref(false);
const submitDisable = ref(true);
const serverCheckingLoading = ref(false);

const disableReasson = ref('');
let token = ref();
let tsURL = ref();
let tsuuid = ref();
let abortController;
const toast = useToast();
async function makeServer() {
  disableInputs.value = true;
  submitDisable.value = true;
  const slots = 2 ** (Number(slot.value) + 3);
  let resposne;
  try {
    resposne = await $fetch(`${url.value}/api/v4/tservers/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        name: serverName.value.toLowerCase(),
        config: selectedConfig.value,
        slots: slots,
      }),
    });
  } catch (err) {
    const errorCode = err.data?.code ?? '';
    disableInputs.value = false;
    submitDisable.value = false;
    if (errorCode === 'NEED_MORE_BALANCE') {
      toast.add({
        title: 'قبل از هر کاری از بالای صفحه کیف پولتو شارژ کن',
        timeout: 2000,
        color: 'red',
      });
    } else {
      toast.add({
        title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
        timeout: 2000,
        color: 'red',
      });
    }
  }

  getBalance();
  token = ref(resposne.privilegeKey);
  tsuuid = ref(resposne.uuid);
  tsURL = ref(`ts3server://${resposne.name}`);
  serverTokenTab.value = true;
}

async function checkIfServerAvailable() {
  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();
  await $fetch(`${url.value}/api/v4/tservers/check`, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      name: serverName.value,
    }),
    signal: abortController.signal,
  });
}
const {
  data: availables,
  execute: getAvailableConfigs,
  status,
  error,
} = useFetch(
  `${url.value}/api/v4/tservers/16412dab-991c-4919-b1c8-13927ced37d7/reset-config/available`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
);

if (error.value) {
  toast.add({
    title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
    timeout: 2000,
    color: 'red',
  });
}

let waitIfDoneTyping;
watch(serverName, () => {
  serverName.value = serverName.value.toLowerCase();
  serverCheckingLoading.value = false;
  submitDisable.value = true;
  disableReasson.value = '';
  const nameCharachtersNotEnough = () => {
    if (serverName.value.length < 3) {
      disableReasson.value = 'نام سرور باید حداقل 3 کاراکتر داشته باشد';
      return true;
    }
  };
  nameCharachtersNotEnough();
  //
  const lessThanThree = () => {
    if (serverName.value.length < 3) {
      disableReasson.value = 'نام سرور باید حداقل 3 کاراکتر داشته باشد';
      return true;
    }
  };
  nameCharachtersNotEnough();
  //
  const regexCheck = () => {
    if (!regex.test(serverName.value)) {
      disableReasson.value = 'نام سرور باید از حروف اگلیسی و اعداد باشد';
      return true;
    }
  };
  regexCheck();
  //
  const maxlengthCheck = () => {
    if (serverName.value.length >= 128) {
      disableReasson.value = 'نام سرور باید حدکثر 128 کاراکتر داشته باشد';
    }
  };
  maxlengthCheck();
  if (
    !nameCharachtersNotEnough() &&
    !lessThanThree() &&
    !regexCheck() &&
    !maxlengthCheck()
  )
    serverCheckingLoading.value = true;
  clearTimeout(waitIfDoneTyping);
  waitIfDoneTyping = setTimeout(async () => {
    if (
      !nameCharachtersNotEnough() &&
      !lessThanThree() &&
      !regexCheck() &&
      !maxlengthCheck()
    ) {
      try {
        await checkIfServerAvailable();
        disableReasson.value = '';
        submitDisable.value = false;
        serverCheckingLoading.value = false;
      } catch (err) {
        if (err.name !== 'AbortError') {
          disableReasson.value = 'این اسم قبلا گرفته شده';
          serverCheckingLoading.value = false;
        }
      }
    }
  }, 500);
});
</script>
<style scoped></style>
