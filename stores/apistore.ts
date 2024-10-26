import { defineStore } from 'pinia';
export const apiStore = defineStore({
  id: 'api',
  state: () => {
    return {
      url: 'http://localhost:5342',
    };
  },
});
