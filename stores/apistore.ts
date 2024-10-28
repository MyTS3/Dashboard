import { defineStore } from 'pinia';
export const apiStore = defineStore({
  id: 'api',
  state: () => {
    return {
      url: 'https://v4.api.myts3.ir',
    };
  },
});
