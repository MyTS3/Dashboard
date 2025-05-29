import { defineStore } from 'pinia';
export const apiStore = defineStore({
  id: 'api',
  state: () => {
    return {
      // url: 'http://localhost:5342',
      url: 'https://v4.api.myts3.ir',
    };
  },
});
