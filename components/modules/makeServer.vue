<template>
  <!-- <Teleport to=""> -->
  <section
    class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
  >
    <main
      :class="{ hidden: serverTokenTab }"
      class="text-white min-w-96 bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl"
    >
      <button
        :disabled="disableInputs"
        @click="$emit('close')"
        :class="{ 'bg-main_red/30': disableInputs }"
        class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
      >
        X
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
          :disabled="disableInputs"
          v-model="serverName"
          class="bg-transparent border rounded-lg p-4"
          type="text"
        />
        <p class="absolute right-8 bottom-4 text-blue-300/60">.v4.myts3.ir</p>
      </div>
      <P class="text-right font-medium mt-3"
        >لطفا کانفیگ سرور خودرا انتخاب کنید</P
      >
      <from class="w-full my-4">
        <select
          :disabled="disableInputs"
          class="w-full bg-transparent text-right appearance-none border rounded-xl p-3"
          v-model="selectedConfig"
          name="locations"
        >
          <option
            v-for="available in availables"
            :key="available"
            :value="available"
            class="dropdown"
          >
            {{ available }}
          </option>
        </select>
      </from>
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
          :disabled="disableInputs"
          v-model="slot"
          class="w-full"
          type="range"
          min="1"
          max="7"
        />
      </div>
      <!-- /////////////////price started//////// -->
      <div id="price" class="w-full">
        <div class="flex justify-between flex-row-reverse mt-3 text-white/40">
          <h1>:قیمت ساعتی</h1>
          <div class="flex flex-row-reverse gap-1 text-white/40">
            <span>54</span>
            <p>تومان</p>
          </div>
        </div>
        <div class="flex justify-between flex-row-reverse mt-3 text-white/40">
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

      <button
        :class="{ 'btn-disable, opacity-55': disableInputs }"
        :disabled="disableInputs"
        @click.prevent="makeServer()"
        class="flex w-full items-center justify-center make-server font-medium gap-2"
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
      :tsURL="tsURL"
      :token="token"
      :tsuuid="tsuuid"
      v-if="serverTokenTab"
      @close="(serverTokenTab = false), $emit('close')"
    />
  </section>
  <!-- </Teleport> -->
</template>
<script setup>
import serverToken from './serverToken.vue';
import loading from '@/components/reusable/theLoading.vue';

const serverTokenTab = ref(false);

const store = apiStore();
const { url } = storeToRefs(store);

const slot = ref(1);
const serverName = ref();
const selectedConfig = ref('CONFIG_DEFAULT');
const disableInputs = ref(false);
const availables = ref();
let token = ref();
let tsURL = ref();
let tsuuid = ref();

async function makeServer() {
  disableInputs.value = true;
  const slots = 2 ** (Number(slot.value) + 3);

  const server = await $fetch(`${url.value}/api/v4/tservers/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      name: `${serverName.value}.v4.myts3.ir`,
      config: selectedConfig.value,
      slots: slots,
    }),
  });
  token = ref(server.privilegeKey);
  tsuuid = ref(server.uuid);
  tsURL = ref(`ts3server://${server.name}`);
  serverTokenTab.value = true;
}

async function getAvailble() {
  const respone = $fetch(
    `${url.value}/api/v4/tservers/16412dab-991c-4919-b1c8-13927ced37d7/reset-config/available`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
  availables.value = await respone;
}
await getAvailble();
</script>
<style scoped></style>
