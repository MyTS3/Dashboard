import { apiStore } from './apistore';
import { storeToRefs } from 'pinia';

export const pauseRequests = ref(false);
export const balance = ref<null | string>(null);

//
export async function getBalance() {
  const store = apiStore();
  const { url } = storeToRefs(store);
  balance.value = null;
  try {
    const respone: { balance: string } = await $fetch(
      `${url.value}/api/v4/balance`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    );
    balance.value = respone.balance;
  } catch {
    balance.value = 'error';
  }
}
