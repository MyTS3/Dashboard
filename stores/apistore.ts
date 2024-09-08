import { defineStore } from "pinia";
export const apiStore = defineStore({
  id: "api",
  state: () => {
    return {
      url: "http://10.8.0.2:5342",
    };
  },
});
