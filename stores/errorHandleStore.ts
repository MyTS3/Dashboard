import { defineStore } from 'pinia';
const toast = useToast();
const handlers: { [key: string]: () => unknown } = {
  FST_JWT_AUTHORIZATION_TOKEN_INVALID: () => {
    toast.add({
      title: 'لطفا مجددا لاگین کنید',
      timeout: 2000,
      color: 'red',
    });
    navigateTo('https://my.mtserver.ir/index.php?rp=/login', {
      external: true,
    });
  },
};
export const errorHandle = defineStore({
  id: 'errorHandle',
  actions: {
    handle(code: string) {
      handlers[code]();
    },
  },
});
