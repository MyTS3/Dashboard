<template>
  <section
    class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
  >
    <main
      class="text-white min-w-[30rem] w-2/5 bg-mainbg_600 flex flex-col text-center border border-white border-b-0 p-4 relative rounded-xl font-medium"
    >
      <button
        class="self-end text-center w-7 h-7 bg-main_red absolute top-3 right-3 rounded-full text-mainbg_600 font-medium text-lg"
        @click="$emit('close')"
      >
        X
      </button>
      <h1 class="my-4 text-3xl font-extrabold">لیست ساب دامنه ها</h1>
      <div class="bg-mainbg_500 rounded-2xl">
        <div
          style="background-color: rgba(39, 43, 77, 1)"
          class="table items items-center text-center rounded-2xl"
        >
          <p class="">ساب</p>
          <p class="">دامنه</p>
          <p class="">اکشن</p>
        </div>
        <div class="overflow-scroll">
          <div
            v-for="(subdomain, i) in subDomainList"
            :key="subdomain"
            class="table items items-center text-center rounded-lg"
          >
            <p class="">{{ subdomain.sub }}</p>
            <p class="">{{ subdomain.domain.domain }}</p>
            <img
              class="mx-auto cursor-pointer"
              src="/images/trash.png"
              alt=""
              @click="deleteSubDomain(i)"
            />
          </div>
        </div>
        <div class="table items items-center text-center rounded-lg">
          <input
            v-model="subToAdd"
            class="w-2/3 mx-auto p-1.5 rounded-lg bg-transparent border text-right"
            type="text"
          />
          <select
            v-model="domainToAdd"
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
          </select>
          <img
            class="mx-auto cursor-pointer"
            src="/images/add-square.png"
            alt=""
            @click="addToList()"
          />
        </div>
      </div>
      <button
        :class="submitDisable ? 'opacity-45' : ''"
        :disabled="submitDisable"
        class="w-full p-4 bg-main_blue rounded-xl my-2"
        @click="submitSubdomains()"
      >
        <p>اعمال تغییرات</p>
      </button>
    </main>
  </section>
</template>
<script setup>
const store = apiStore();
const { url } = storeToRefs(store);

const domainList = ref();
const domainToAdd = ref();
const subToAdd = ref('');

async function getDomain() {
  const response = await $fetch(`${url.value}/api/v4/tdomains`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  domainList.value = await response;
}

const subDomainList = ref();
const props = defineProps(['selectedServer']);
async function subDomains() {
  const respone = await $fetch(
    `${url.value}/api/v4/tservers/${props.selectedServer.uuid}/subdomains`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );
  subDomainList.value = await respone;
}
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
}
await subDomains();
await getDomain();
</script>
<style scoped>
.table {
  display: grid;
  grid-template-columns: 5fr 5fr 2fr;
}
</style>
