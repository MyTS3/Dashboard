<template>
  <Teleport to="body">
    <section
      class="h-full absolute z-50 min-w-full backdrop-blur-md flex flex-col justify-center top-0 left-0 items-center"
    >
      <main
        class="relative text-white min-w-[50rem] flex flex-col text-center p-4 rounded-xl font-medium"
      >
        <button
          class="text-center w-7 h-7 flex justify-center items-center bg-main_red absolute top-7 right-7 rounded-full text-mainbg_600 font-medium text-lg"
          @click="$emit('close')"
        >
          <img class="w-3" src="/images/X-9.png" alt="" />
        </button>

        <div
          class="absolute parent items-center border-black border-[1px] cursor-pointer left-[122px] top-[146px] bg-white text-black w-[10.4rem] h-5 flex justify-around text-xs"
          @click="copyToClipboard(selectedServer.name)"
        >
          <p class="text-black">{{ selectedServer.name }}</p>
          <button>
            <img class="w-4 child" src="/images/copy.svg" alt="" />
          </button>
        </div>
        <div
          class="absolute parent items-center border-black border-[1px] cursor-pointer left-[122px] top-[174px] bg-white text-black w-[10.4rem] h-6 flex justify-around text-xs"
          @click="copyToClipboard(domainIp.ipv4)"
        >
          <p class="text-black">{{ domainIp.ipv4 }}</p>
          <button>
            <img class="w-4 child" src="/images/copy.svg" alt="" />
          </button>
          <!-- <p class="absolute right-0 -bottom-4 font-semibold">آدرس متغیر</p> -->
        </div>
        <div
          class="absolute parent items-center border-black border-[1px] cursor-pointer left-[300px] top-[146px] bg-white text-black w-[4.6rem] h-5 flex justify-around text-xs"
          @click="copyToClipboard(selectedServer.queryPort)"
        >
          <p>{{ selectedServer.queryPort }}</p>
          <button>
            <img class="w-4 child" src="/images/copy.svg" alt="" />
          </button>
        </div>
        <div
          class="absolute parent items-center border-black border-[1px] cursor-pointer left-[385px] top-[146px] bg-white text-black w-[4.6rem] h-5 flex justify-around text-xs"
          @click="copyToClipboard(selectedServer.queryPort)"
        >
          <p>{{ selectedServer.queryPort }}</p>
          <button>
            <img class="w-4 child" src="/images/copy.svg" alt="" />
          </button>
        </div>
        <div
          class="absolute parent items-center border-black border-[1px] cursor-pointer left-[470px] top-[146px] bg-white text-black w-[7.2rem] h-5 flex justify-around text-xs"
          @click="copyToClipboard('serveradmin')"
        >
          <p>serveradmin</p>
          <button>
            <img class="w-4 child" src="/images/copy.svg" alt="" />
          </button>
        </div>
        <div
          class="absolute items-center border-black border-[1px] cursor-pointer left-[590px] top-[146px] bg-white text-black w-[9rem] h-5 flex justify-around text-xs"
        >
          <div class="flex gap-1 parent">
            <p @click="copyToClipboard(password)">
              {{ password }}
            </p>
            <button class="w" @click="copyToClipboard(password)">
              <img class="w-4 child" src="/images/copy.svg" alt="" />
            </button>
          </div>

          <button @click.prevent="changeYatqaPass()">
            <img
              class="w-4 hover:opacity-50"
              src="/images/change_nickname.svg"
              alt=""
            />
          </button>
        </div>
        <img
          class="w-full h-full rounded-3xl pic"
          src="/images/yatqa-example3.png"
          alt=""
        />
      </main>
    </section>
  </Teleport>
</template>
<script setup>
const props = defineProps(['selectedServer']);
const password = ref(props.selectedServer.queryPassword);
const toast = useToast();
const store = apiStore();
const { url } = storeToRefs(store);
defineEmits(['close']);
const { data: queryPass, refresh: changeYatqaPass } = await useFetch(
  `${url.value}/api/v4/tservers/${props.selectedServer.uuid}/reset-password`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    immediate: false,
  },
);
const { data: domainIp } = await useFetch(
  `${url.value}/api/v4/tservers/${props.selectedServer.uuid}/location`,
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
);
watch(queryPass, (prev) => {
  if (prev != queryPass) password.value = queryPass.value.queryPassword;
});
function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  toast.add({
    title: 'کپی شد',
    timeout: 2000,
    color: 'violet',
  });
}
</script>
<style scoped>
.parent:hover .child {
  opacity: 0.5;
}
</style>
