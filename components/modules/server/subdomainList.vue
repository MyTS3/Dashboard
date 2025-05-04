<template>
  <Teleport to="body">
    <section
      class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
    >
      <template v-if="listStatus === 'success'">
        <main
          class="text-white min-w-[30rem] bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
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
            <div>
              <div
                v-for="(subdomain, i) in subDomainList"
                :key="subdomain"
                class="table2 items relative items-center text-center rounded-lg"
              >
                <input
                  :disabled="disable"
                  class="w-2/3 mx-auto p-2 rounded-lg bg-transparent border border-indigo-400 text-center"
                  type="text"
                  v-model="subDomainList[i].sub"
                />
                <p>.</p>
                <from
                  class="w-2/3 mx-auto p-1.5 rounded-lg bg-transparent text-right"
                >
                  <USelectMenu
                    size="xl"
                    color="indigo"
                    :options="domainListForDropDown"
                    :disabled="disable || domStatus !== 'success'"
                    v-model="subDomainList[i].domain"
                  />
                </from>
                <img
                  class="mx-auto cursor-pointer"
                  src="/images/trash.png"
                  alt=""
                  @click="deleteSubDomain(i)"
                />
              </div>
            </div>
            <div class="w-full py-3">
              <img
                class="ml-auto cursor-pointer mr-6"
                src="/images/add-square.png"
                alt=""
                @click="addToList()"
              />
            </div>
            <div v-if="listStatus === 'pending'" class="table my-2">
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
const domainListForDropDown = ref([]);
const disable = ref(false);
const toast = useToast();
const { data: domainList, status: domStatus } = await useFetch(
  `${url.value}/api/v4/tdomains`,
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
);

domainList.value.forEach((domain) => {
  domainListForDropDown.value.push({ uuid: domain.uuid, label: domain.domain });
});

const props = defineProps(['selectedServer']);
const { data: subDomainList, status: listStatus } = await useFetch(
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
  grid-template-columns: 5fr 5fr 2fr;
}

.table2 {
  display: grid;
  grid-template-columns: 5fr 1fr 5fr 2fr;
}
</style>
