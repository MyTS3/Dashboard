<template>
  <teleport to="body">
    <section
      class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
    >
      <main
        class="text-white w-full max-w-[30rem] bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
      >
        <button
          :disabled="disableInputs"
          class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
          @click="$emit('close')"
        >
          <img class="w-3 mx-auto" src="/images/X-9.png" alt="" />
        </button>
        <header>
          <h1 class="text-lg font-bold">ساخت موزیک بات</h1>
          <p class="text-x mt-3 mb-6 font-light">
            برای ساخت پلی لیست موزیک بات خودرا اتتخاب کنید
          </p>
        </header>
        <div>
          <p class="font-bold w-full text-right">پلی لیست</p>

          <!-- <select
    v-model="selectedPlaylist"
    class="text-white bg-transparent my-4 border w-full text-right min-h-16 rounded-2xl"
    name="music"
    >
    <option
    v-for="playlist in playlists"
    :key="playlist.uuid"
    :value="playlist"
    >
    {{ playlist.name }}
  </option>
</select> -->
          <input
            min="3"
            max="30"
            v-model="customName"
            :disabled="disableInputs"
            @input="checkValidInput()"
            class="custom_input rounded-lg outline-none w-full mt-4 h-12 p-4"
            type="text"
          />
          <USelectMenu
            v-if="playlistPending === 'success'"
            v-model="selectedPlaylist"
            class="w-full my-4"
            size="xl"
            color="indigo"
            :options="playlists"
            @change="
              (customName = selectedPlaylist.label),
                checkValidInput(),
                checkEmpty()
            "
          />
          <USkeleton
            v-if="playlistPending === 'pending'"
            class="h-10 w-full my-4 rounded-lg"
            :ui="{ background: 'dark:bg-gray-500' }"
          />
          <!-- ///////////////////price///////////// -->
          <template v-if="priceStatus === 'success'">
            <div id="price" class="w-full">
              <div class="flex justify-between flex-row-reverse text-white/40">
                <h1>:قیمت ساعتی</h1>
                <div class="flex flex-row-reverse gap-1 text-white/40">
                  <span>{{
                    Math.abs(
                      Math.floor(
                        (botPrice.price / botPrice.secondsForPrice) * 3600,
                      ),
                    ) ?? 0
                  }}</span>
                  <p>تومان</p>
                </div>
              </div>
              <div
                class="flex justify-between flex-row-reverse mt-3 text-white/40"
              >
                <h1>:قیمت روزانه</h1>
                <div class="flex flex-row-reverse gap-1 text-white/40">
                  <span>{{
                    Math.abs(
                      Math.floor(
                        (botPrice.price / botPrice.secondsForPrice) * 86400,
                      ),
                    ) ?? 0
                  }}</span>
                  <p>تومان</p>
                </div>
              </div>
              <div class="flex justify-between flex-row-reverse mt-3">
                <h1>:قیمت ماهانه</h1>
                <div class="flex flex-row-reverse gap-1">
                  <span>{{
                    Math.abs(
                      Math.floor(
                        (botPrice.price / botPrice.secondsForPrice) * 2629800,
                      ),
                    ) ?? 0
                  }}</span>
                  <p>تومان</p>
                </div>
              </div>
            </div>
          </template>
          <template v-if="priceStatus === 'pending'">
            <main class="flex justify-between">
              <div class="flex flex-col">
                <USkeleton
                  class="h-4 w-16 my-2 rounded-lg"
                  :ui="{ background: 'dark:bg-gray-500' }"
                />
                <USkeleton
                  class="h-4 w-16 my-2 rounded-lg"
                  :ui="{ background: 'dark:bg-gray-500' }"
                />
                <USkeleton
                  class="h-4 w-16 my-2 rounded-lg"
                  :ui="{ background: 'dark:bg-gray-500' }"
                />
              </div>
              <div class="flex flex-col">
                <USkeleton
                  class="h-4 w-16 my-2 rounded-lg"
                  :ui="{ background: 'dark:bg-gray-500' }"
                />
                <USkeleton
                  class="h-4 w-16 my-2 rounded-lg"
                  :ui="{ background: 'dark:bg-gray-500' }"
                />
                <USkeleton
                  class="h-4 w-16 my-2 rounded-lg"
                  :ui="{ background: 'dark:bg-gray-500' }"
                />
              </div>
            </main>
          </template>
          <!-- ////////////////////////////////// -->
        </div>
        <button
          :disabled="dontAllowSubmit"
          :class="{
            'cursor-not-allowed opacity-30': disableInputs || dontAllowSubmit,
          }"
          class="flex w-full items-center justify-center make-server font-medium gap-2 mt-4"
          @click="makeMusicBot()"
        >
          <div
            v-if="!disableInputs"
            class="w-full flex justify-center gap-2 items-center"
          >
            <span><img src="/images/plus.png" alt="" /></span>
            <p>ساخت</p>
          </div>
          <TheLoading v-if="disableInputs" />
        </button>
      </main>
    </section>
  </teleport>
</template>
<script setup>
import TheLoading from '~/components/reusable/theLoading.vue';

const store = apiStore();
const { url } = storeToRefs(store);
const selectedServer = useRoute().params.id;
const disableInputs = ref(false);
const props = defineProps(['selectedChannel']);
const emit = defineEmits(['close', 'refresh']);
const selectedPlaylist = ref();
const playlists = ref([]);
const toast = useToast();
const customName = ref();
const dontAllowSubmit = ref(true);

const { data, status: playlistPending } = useFetch(
  `${url.value}/api/v4/playlists`,
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
);
watch(data, (newData) => {
  if (data != newData) {
    playlists.value.push({
      label: 'خالی',
    });
    data.value.map((d) => {
      playlists.value.push({
        label: d.name,
        value: d.uuid,
      });
    });
  }
});

const { data: botPrice, status: priceStatus } = useFetch(
  `${url.value}/api/v4/prices/bot`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
);
function checkEmpty() {
  if (customName.value == 'خالی') {
    customName.value = '';
    selectedPlaylist.value = null;
    dontAllowSubmit.value = true;
  }
}
function checkValidInput() {
  if (customName.value.length < 3) {
    dontAllowSubmit.value = true;
    return;
  }
  if (customName.value.length > 30) {
    dontAllowSubmit.value = true;
    return;
  }
  dontAllowSubmit.value = false;
}
async function makeMusicBot() {
  disableInputs.value = true;
  const body = () => {
    if (selectedPlaylist.value) {
      return {
        cid: props.selectedChannel.cid,
        name: customName.value,
        playlist: selectedPlaylist.value.value,
      };
    } else {
      return {
        cid: props.selectedChannel.cid,
        name: customName.value,
      };
    }
  };
  try {
    await $fetch(`${url.value}/api/v4/tservers/${selectedServer}/bots`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(body()),
    });
  } catch (err) {
    const errMsg = (err.data?.message ?? '').slice(-15);
    if (errMsg === 'already exists.') {
      toast.add({
        title: 'بات تکراری است',
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
  disableInputs.value = false;
  emit('close');
}
</script>
