<template>
  <Teleport to="body">
    <section
      class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
    >
      <template v-if="!subPend && !domPend">
        <main
          class="text-white min-w-[30rem] w-2/5 bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
        >
          <button
            :disabled="disable"
            class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
            @click="$emit('close')"
          >
            <img class="w-3 mx-auto" src="/images/X-9.png" alt="" />
          </button>
          <h1 class="my-4 text-3xl font-extrabold">لیست ساب دامنه ها</h1>
          <div class="bg-mainbg_500 rounded-2xl">
            <div
              style="background-color: rgba(39, 43, 77, 1)"
              class="table items items-center text-center rounded-2xl"
            >
              <p>ساب</p>
              <p>دامنه</p>
              <p>اکشن</p>
            </div>
            <div class="overflow-scroll max-h-[16.5rem]">
              <div
                v-for="(subdomain, i) in subs"
                :key="subdomain"
                class="table2 items items-center text-center rounded-lg"
              >
                <p>{{ subdomain.sub }}</p>
                <p>.</p>
                <p>{{ subdomain.domain.domain }}</p>
                <img
                  class="mx-auto cursor-pointer"
                  src="/images/trash.png"
                  alt=""
                  @click="deleteSubDomain(i)"
                />
              </div>
            </div>
            <div
              v-if="!subPend && !domPend"
              class="table2 items relative items-center text-center rounded-lg"
            >
              <input
                v-model="subToAdd"
                :disabled="disable"
                class="w-2/3 mx-auto p-2 rounded-lg bg-transparent border border-indigo-400 text-right"
                type="text"
              />
              <p>.</p>
              <!-- <select
              v-model="domainToAdd"
              :disabled="disable"
              class="w-2/3 mx-auto p-1.5 rounded-lg bg-transparent border text-right"
            >
              <option
                v-for="domain in domainList"
                :key="domain.uuid"
                class="bg-mainbg_500"
                :value="domain"
              >
                {{ domain.domain }}
              </option>
            </select> -->
              <from
                v-if="!pending"
                class="w-2/3 mx-auto p-1.5 rounded-lg bg-transparent text-right"
              >
                <USelectMenu
                  v-model="domainToAdd"
                  size="xl"
                  color="indigo"
                  :options="domainList"
                  option-attribute="domain"
                  :disabled="disableInputs"
                />
              </from>
              <img
                class="mx-auto cursor-pointer"
                src="/images/add-square.png"
                alt=""
                @click="addToList()"
              />
            </div>
            <div v-if="subPend && domPend" class="table my-2">
              <USkeleton
                class="h-10 w-2/3 mx-auto rounded-lg"
                :ui="{ background: 'dark:bg-gray-500' }"
              />
              <USkeleton
                class="h-10 w-2/3 mx-auto rounded-lg"
                :ui="{ background: 'dark:bg-gray-500' }"
              />
              <USkeleton
                class="h-5 w-5 m-auto rounded-lg"
                :ui="{ background: 'dark:bg-gray-500' }"
              />
            </div>
          </div>
          <button
            :class="disable ? 'opacity-45' : ''"
            :disabled="disable"
            class="w-full flex justify-center p-4 bg-main_blue rounded-xl"
            @click="submitSubdomains()"
          >
            <p v-if="!disable">اعمال تغییرات</p>
            <TheLoading v-else />
          </button>
        </main>
      </template>
    </section>
  </Teleport>
</template>
<script setup>
import TheLoading from '~/components/reusable/theLoading.vue';

const store = apiStore();
const { url } = storeToRefs(store);
const emit = defineEmits(['close']);
const domainList = ref();
const domainToAdd = ref();
const subToAdd = ref('');
const disable = ref(false);
const toast = useToast();

const {
  data: domains,
  error: domErr,
  pending: subPend,
} = await useFetch(`${url.value}/api/v4/tdomains`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});
domainList.value = await domains.value;
if (domErr.value) {
  toast.add({
    title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
    timeout: 2000,
    color: 'red',
  });
}

const subDomainList = ref();
const props = defineProps(['selectedServer']);
const {
  data: subs,
  error: subErr,
  pending: domPend,
} = await useFetch(
  `${url.value}/api/v4/tservers/${props.selectedServer.uuid}/subdomains`,
  {
    method: 'GET',
    lazy: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
);
if (subErr.value) {
  toast.add({
    title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
    timeout: 2000,
    color: 'red',
  });
}
subDomainList.value = await subs.value;

function addToList() {
  subDomainList.value.push({
    sub: subToAdd.value,
    domain: domainToAdd.value,
  });
  subToAdd.value = '';
  domainToAdd.value = undefined;
}
function deleteSubDomain(i) {
  const newList = [];
  let index = 0;
  subDomainList.value.forEach((subdomain) => {
    if (index != i) {
      newList.push(subdomain);
    }
    index += 1;
  });
  subDomainList.value = newList;
}
async function submitSubdomains() {
  disable.value = true;
  const { error } = await useFetch(
    `${url.value}/api/v4/tservers/${props.selectedServer.uuid}/subdomains`,
    {
      method: 'PUT',
      lazy: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        subdomains: subDomainList.value,
      }),
    },
  );
  if (error.value) {
    toast.add({
      title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
      timeout: 2000,
      color: 'red',
    });
  }
  disable.value = false;
  emit('close');
}
</script>
<style scoped>
.table {
  display: grid;
  grid-template-columns: 5fr 5fr 2fr;
}
.table2 {
  display: grid;
  grid-template-columns: 5fr 1fr 5fr 2fr;
}
</style>
