<template>
  <Teleport to="body">
    <section
      class="h-full absolute z-50 w-full backdrop-blur-md bg-mainbg_500/20 flex justify-center top-0 left-0 items-center"
    >
      <div
        v-if="clsoeList"
        @click="closeAllList()"
        class="absolute w-full h-full top-0 left-0 z-40"
      ></div>
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
        <div class="bg-mainbg_500 rounded-2xl relative">
          <div
            class="h-[30vh] overflow-y-auto rounded-2xl overflow-x-hidden scroll-bar"
          >
            <template
              v-if="listStatus === 'pending' || domainStatus === 'pending'"
            >
              <div
                v-for="_ in 4"
                :key="_"
                class="px-5 table-row rounded-lg items"
              >
                <USkeleton
                  class="h-8 w-2/3 rounded-lg ml-auto mr-8"
                  :ui="{ background: 'dark:bg-gray-500' }"
                />
                <div class="flex justify-center">
                  <div
                    class="w-3 h-3 rounded-full bg-gray-200 animate-pulse"
                  ></div>
                </div>
                <USkeleton
                  class="h-8 w-2/3 rounded-lg ml-8"
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
              class="sticky top-0 table-row rounded-lg items text-center bg-mainbg_400 z-20"
            >
              <p class="text-right">{{ serverName.split('.')[0] }}</p>
              <p class="text-center">.</p>
              <p
                class="w-full mx-auto rounded-lg bg-transparent text-left relative"
              >
                {{ serverName.slice(serverName.indexOf('.') + 1) }}
              </p>
              <UTooltip
                v-if="
                  limits &&
                  subDomainList.length &&
                  subDomainList.length >= limits.value.maxSubdomainPerTServer
                "
                :text="'شما به حداکثر تعداد ساب دامین های خود رسیده اید'"
              >
                <img
                  class="opacity-50 mr-5"
                  src="/images/add-square.png"
                  alt=""
                />
              </UTooltip>
              <img
                v-if="
                  limits &&
                  subDomainList.length < limits.value.maxSubdomainPerTServer
                "
                class="cursor-pointer mr-5"
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
                :class="subdomain.errorMessage ? 'pb-[4.2rem] pt-2' : ''"
                class="px-5 table-row rounded-lg items relative"
              >
                <input
                  maxlength="64"
                  @input="checkIfValid()"
                  :disabled="disable"
                  :class="
                    subDomainList[i].errorMessage ? 'border-main_red' : ''
                  "
                  class="w-full mx-auto h-[2.8rem] rounded-lg bg-transparent border border-indigo-400 text-right px-2"
                  type="text"
                  v-model="subDomainList[i].sub"
                />
                <p class="text-center">.</p>
                <form
                  class="w-full mx-auto rounded-lg bg-transparent text-right relative"
                >
                  <!-- <USelectMenu
                    @change="checkIfValid()"
                    size="xl"
                    color="indigo"
                    :options="domainListForDropDown"
                    :disabled="disable || domainStatus !== 'success'"
                    v-model="subDomainList[i].domain"
                  /> -->
                  <div class="relative">
                    <input
                      maxlength="64"
                      @input="checkIfValid()"
                      :disabled="disable"
                      class="w-full mx-auto h-[2.8rem] rounded-lg bg-transparent border border-indigo-400 text-left px-2 pl-8"
                      type="text"
                      v-model="subDomainList[i].domain.label"
                    />
                    <img
                      @click="
                        (subDomainList[i].list = true), (clsoeList = true)
                      "
                      class="w-5 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                      src="/images/down.png"
                      alt="menue"
                    />

                    <div
                      v-if="subDomainList[i].list"
                      style="background-color: rgb(15, 23, 43)"
                      class="absolute h-32 overflow-auto w-40 flex flex-col right-0 text-left rounded-md z-50 p-1"
                    >
                      <p
                        @click="
                          (subDomainList[i].domain = { ...domain }),
                            (subDomainList[i].list = false),
                            (clsoeList = false),
                            checkIfValid()
                        "
                        v-for="domain in domainListForDropDown"
                        :key="domain.uuid"
                        class="w-full p-2 cursor-pointer hover:bg-white/20 rounded-lg"
                      >
                        {{ domain.label }}
                      </p>
                    </div>
                  </div>
                </form>
                <img
                  class="cursor-pointer ml-5"
                  src="/images/trash.png"
                  alt=""
                  @click="deleteSubDomain(i)"
                />
                <p
                  v-if="subdomain.errorMessage"
                  class="absolute -bottom-1 left-1/2 -translate-x-1/2 text-sm text-white/60"
                >
                  {{ subdomain.errorMessage }}
                </p>
              </div>
            </template>
          </div>
        </div>

        <button
          :class="disable || regexDisablingSubmit ? 'opacity-45' : ''"
          :disabled="disable || regexDisablingSubmit"
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
import { _backgroundColor } from '#tailwind-config/theme';
import TheLoading from '~/components/reusable/theLoading.vue';
import { limits } from '~/stores/limits';

const store = apiStore();
const { url } = storeToRefs(store);
const regex = RegExp('^[a-zA-Z0-9]+$');
const domainRegex = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
const regexDisablingSubmit = ref(true);
const disablngReasson = ref('');
const emit = defineEmits(['close']);
const domainListForDropDown = ref([]);
const clsoeList = ref(false);
const disable = ref(false);
const toast = useToast();
let abortController;
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
const subDomainList = ref([]);
const props = defineProps(['selectedServer', 'serverName']);
const { data: subDomainListFetch, status: listStatus } = useFetch(
  `${url.value}/api/v4/tservers/${props.selectedServer.uuid}/subdomains`,
  {
    method: 'GET',
    lazy: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
);
watch(subDomainListFetch, () => {
  subDomainList.value.push({
    sub: '',
    domain: { uuid: '', label: '' },
    error: true,
    list: false,
    errorMessage: '',
  });
  subDomainListFetch.value.map((subdomain) => {
    subDomainList.value.push({
      ...subdomain,
      errorMessage: '',
      error: false,
      list: false,
    });
  });
});
function addToList() {
  disablngReasson.value = 'لطفا یک نام برای ساب دامین انتخاب کنید';
  subDomainList.value.push({
    sub: '',
    domain: { uuid: '', label: '' },
    error: true,
    list: false,
    errorMessage: '',
  });
  checkIfValid();
}
function closeAllList() {
  subDomainList.value.map((sd) => {
    if (sd.list == true) return (sd.list = false);
  });
  clsoeList.value = false;
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
  checkIfValid();
}
let waitForTyping;
async function checkIfSubdomainAvailable(subdomain) {
  regexDisablingSubmit.value = true;
  clearTimeout(waitForTyping);

  let alreadyExist = false;
  subDomainListFetch.value.find((s) =>
    s.sub == subdomain.sub ? (alreadyExist = true) : null,
  );
  if (alreadyExist) return true;

  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();

  return new Promise((resolve) => {
    waitForTyping = setTimeout(async () => {
      try {
        await $fetch(
          `${url.value}/api/v4/tservers/${props.selectedServer.uuid}/subdomains/check`,
          {
            method: 'post',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              subdomains: [
                { domain: subdomain.domain, sub: subdomain.sub.toLowerCase() },
              ],
            }),
            signal: abortController.signal,
          },
        );
        resolve(true);
      } catch {
        resolve(false);
      } finally {
        regexDisablingSubmit.value = false;
      }
    }, 500);
  });
}
async function AddDomain(domain) {
  await $fetch(`${url.value}/api/v4/tdomains`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      domain: domain,
    }),
  });
}

async function checkIfValid() {
  clearTimeout(waitForTyping);
  regexDisablingSubmit.value = false;

  if (subDomainListFetch.value.length < 1 && subDomainList.value.length < 1) {
    regexDisablingSubmit.value = true;
    return;
  }

  let hasErrors = false;

  // Use for...of loop instead of map for async operations
  for (const subdomain of subDomainList.value) {
    const domain = domainList.value.find(
      (domain) =>
        domain.uuid == subdomain.domain.uuid &&
        domain.domain == subdomain.domain.label,
    );
    if (!domain) subdomain.domain.uuid = null;
    else subdomain.domain.uuid = domain.uuid;
    //
    subdomain.errorMessage = '';
    //
    if (subdomain.sub.length && subdomain.sub.length < 3) {
      subdomain.errorMessage = 'حداقل 3 کاراکتر باید بنویسید';
      hasErrors = true;
      continue;
    }
    //
    if (subdomain.sub.length && !regex.test(subdomain.sub)) {
      subdomain.errorMessage = 'نام سرور باید از حروف اگلیسی و اعداد باشد';
      hasErrors = true;
      continue;
    }
    if (!domainRegex.test(subdomain.domain.label)) {
      subdomain.errorMessage = 'نام دامین استاندارد نیست';
      hasErrors = true;
      continue;
    }
    if (subdomain.sub.length > 2 || subdomain.sub.length < 1) {
      const isAvailable = await checkIfSubdomainAvailable(subdomain);
      if (domain) {
        if (!isAvailable) {
          subdomain.errorMessage = 'ساب دامین تکراری است';
          hasErrors = true;
          continue;
        }
      }
      if (domain && !domain.active) {
        subdomain.errorMessage = 'نیم سرور های دامین ست نشده';
      }
    }
  }

  regexDisablingSubmit.value = hasErrors;
}

async function submitSubdomains() {
  const newList = [];
  disable.value = true;
  await Promise.all(
    subDomainList.value.map(async (sd) => {
      if (!sd.domain.uuid) {
        try {
          await AddDomain(sd.domain.label);
          const newDomains = await $fetch(`${url.value}/api/v4/tdomains`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          console.log(newDomains);
          console.log(sd);
          await newDomains.map((domain) => {
            if (domain.domain == sd.domain.label) {
              newList.push({
                domain: {
                  uuid: domain.uuid,
                  domain: domain.domain,
                  public: domain.active,
                  createdAt: domain.createdAt,
                },
                sub: sd.sub.toLowerCase(),
              });
            }
          });
        } catch (err) {
          console.log(err);

          toast.add({
            title: 'خطایی رخ داد لطفا مجددا تلاش کنید',
            timeout: 2000,
            color: 'red',
          });
        }
      } else newList.push({ domain: sd.domain, sub: sd.sub.toLowerCase() });
    }),
  );
  console.log(newList);
  try {
    await $fetch(
      `${url.value}/api/v4/tservers/${props.selectedServer.uuid}/subdomains`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          subdomains: newList,
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
  // emit('close');
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
.table-row {
  display: grid;
  grid-template-columns: 2fr auto 2fr auto;
  align-items: center;
  gap: 0.5rem;
}
</style>
