<template>
  <Teleport to="body">
    <section
      class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
    >
      <main
        class="text-white w-full max-w-[30rem] bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium gap-3"
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
          <div class="h-[30vh] overflow-y-auto">
            <template
              v-if="listStatus === 'pending' || domainStatus === 'pending'"
            >
              <div v-for="_ in 4" :key="_" class="table my-4">
                <USkeleton
                  class="h-8 w-2/3 rounded-lg"
                  :ui="{ background: 'dark:bg-gray-500' }"
                />
                <USkeleton
                  class="h-8 w-2/3 rounded-lg"
                  :ui="{ background: 'dark:bg-gray-500' }"
                />
                <USkeleton
                  class="h-8 w-8 rounded-lg ml-auto"
                  :ui="{ background: 'dark:bg-gray-500' }"
                />
              </div>
            </template>
            <div
              v-show="listStatus === 'success' && domainStatus === 'success'"
              class="flex justify-between ml-12 px-5 items relative items-center text-right rounded-lg"
            >
              <div></div>
              <div class="flex justify-center gap-2">
                <p>{{ serverName.split('.')[0] }}</p>
                <p>.</p>
                <p>{{ serverName.slice(serverName.indexOf('.') + 1) }}</p>
              </div>
              <UTooltip
                v-if="
                  limits &&
                  subDomainList.length &&
                  subDomainList.length >= limits.value.maxSubdomainPerTServer
                "
                :text="'شما به حداکثر تعداد ساب دامین های خود رسیده اید'"
              >
                <img class="opacity-50" src="/images/add-square.png" alt="" />
              </UTooltip>
              <img
                v-else
                class="cursor-pointer"
                src="/images/add-square.png"
                alt=""
                @click="addToList()"
              />
            </div>
            <template
              v-if="listStatus === 'success' && domainStatus === 'success'"
            >
              <div
                v-for="(subdomain, i) in subDomainList"
                :key="subdomain"
                class="flex px-5 items relative items-center text-right rounded-lg"
              >
                <input
                  :disabled="disable"
                  class="w-2/3 mx-auto h-[2.8rem] rounded-lg bg-transparent border border-indigo-400 text-right px-2"
                  type="text"
                  v-model="subDomainList[i].sub"
                />
                <p class="text-center">.</p>
                <from
                  class="w-2/3 mx-auto rounded-lg bg-transparent text-right"
                >
                  <USelectMenu
                    size="xl"
                    color="indigo"
                    :options="domainListForDropDown"
                    :disabled="disable || domainStatus !== 'success'"
                    v-model="subDomainList[i].domain"
                  />
                </from>
                <img
                  class="cursor-pointer ml-5"
                  src="/images/trash.png"
                  alt=""
                  @click="deleteSubDomain(i)"
                />
              </div>
            </template>
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
    </section>
  </Teleport>
</template>
<script setup>
import TheLoading from '~/components/reusable/theLoading.vue';
import { limits } from '~/stores/limits';

const store = apiStore();
const { url } = storeToRefs(store);
const emit = defineEmits(['close']);
const domainListForDropDown = ref([]);
const disable = ref(false);
const toast = useToast();
const { data: domainList, status: domainStatus } = useFetch(
  `${url.value}/api/v4/tdomains`,
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
);
watch(domainList, (oldVal) => {
  if (oldVal != domainList) {
    domainList.value.forEach((domain) => {
      domainListForDropDown.value.push({
        uuid: domain.uuid,
        label: domain.domain,
      });
    });
  }
});

const props = defineProps(['selectedServer', 'serverName']);
const { data: subDomainList, status: listStatus } = useFetch(
  `${url.value}/api/v4/tservers/${props.selectedServer.uuid}/subdomains`,
  {
    method: 'GET',
    lazy: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
);

function addToList() {
  subDomainList.value.push({
    sub: '',
    domain: {
      uuid: '',
      label: '',
    },
  });
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
  subDomainList.value = subDomainList.value.map((sd) => {
    return { ...sd, sub: sd.sub.toLowerCase() };
  });
  try {
    await $fetch(
      `${url.value}/api/v4/tservers/${props.selectedServer.uuid}/subdomains`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          subdomains: subDomainList.value,
        }),
      },
    );
  } catch {
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
  max-width: 60%;
  margin-left: auto;
  margin-right: 1rem;
  grid-template-columns: 1fr 1fr 1fr;
}

.table2 {
  display: grid;
  grid-template-columns: 5fr 1fr 5fr 2fr;
}
</style>
