<template>
  <Teleport to="body">
    <section
      class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
    >
      <main
        :class="{ hidden: serverTokenTab }"
        class="text-white min-w-96 bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl"
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
          <p class="text-xs text-white/65 mt-4 mx-40">
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
        <P class="text-right font-medium mt-3"
          >لطفا کانفیگ سرور خودرا انتخاب کنید</P
        >
        <from v-if="!pending" class="w-full my-4">
          <USelectMenu
            v-model="selectedConfig"
            size="xl"
            color="indigo"
            :options="availables"
            :disabled="disableInputs"
          />
        </from>

        <USkeleton
          v-else
          :ui="{ background: 'dark:bg-gray-500' }"
          class="w-full p-6 rounded-xl"
        />
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
            'cursor-not-allowed opacity-55': submitDisable || pending,
          }"
          :disabled="submitDisable || pending"
          class="flex w-full items-center justify-center bg-main_blue p-4 mt-2 rounded-xl font-medium gap-2"
          @click.prevent="makeServer()"
        >
          <div
            v-if="!disableInputs"
            class="flex w-full items-center justify-center font-medium gap-2"
          >
            <span><img src="/images/plus.png" alt="" /></span>ساخت
          </div>
          <loading v-if="disableInputs" />
        </button>
      </main>
      <serverToken
        v-if="serverTokenTab"
        :ts-u-r-l="tsURL"
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

const serverTokenTab = ref(false);

const errors = errorHandle();
const store = apiStore();
const { url } = storeToRefs(store);
const regex = RegExp('^[a-zA-Z0-9]+$');
const slot = ref(1);
const { data: prices } = await useFetch(`${url.value}/api/v4/prices/tserver`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});
const { data: configPrice } = await useFetch(
  `${url.value}/api/v4/prices/config`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
);
const serverName = ref();
const selectedConfig = ref('CONFIG_DEFAULT');
const disableInputs = ref(false);
const submitDisable = ref(true);
// const availables = ref();
const disableReasson = ref('');
let token = ref();
let tsURL = ref();
let tsuuid = ref();
const toast = useToast();
async function makeServer() {
  disableInputs.value = true;
  submitDisable.value = true;
  const slots = 2 ** (Number(slot.value) + 3);
  const { data: server, error } = await useFetch(
    `${url.value}/api/v4/tservers/`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        name: serverName.value.toLowerCase(),
        config: selectedConfig.value,
        slots: slots,
      }),
    },
  );
  if (error.value) {
    errors.handle(error.value.data.code);
    disableInputs.value = false;
    submitDisable.value = false;
    return;
  }
  getBalance();
  token = ref(server.value.privilegeKey);
  tsuuid = ref(server.value.uuid);
  tsURL = ref(`ts3server://${server.value.name}`);
  serverTokenTab.value = true;
}

const {
  data: availables,
  pending,
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

watch(serverName, () => {
  submitDisable.value = false;
  disableReasson.value = '';
  if (serverName.value.length < 3) {
    submitDisable.value = true;
    disableReasson.value = 'لطفا نام را وارد کنید';
  }
  if (serverName.value.length < 3) {
    submitDisable.value = true;
    disableReasson.value = 'نام سرور باید حداقل 3 کاراکتر داشته باشد';
  }
  if (!regex.test(serverName.value)) {
    submitDisable.value = true;
    disableReasson.value = 'نام سرور باید از حروف اگلیسی و اعداد باشد';
  }

  if (serverName.value.length >= 128) {
    submitDisable.value = true;
    disableReasson.value = 'نام سرور باید حدکثر 128 کاراکتر داشته باشد';
  }
});
</script>
<style scoped></style>
