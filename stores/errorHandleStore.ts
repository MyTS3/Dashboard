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
  NEED_MORE_BALANCE: () => {
    toast.add({
      title: 'اعتبارت کافی نیست،اول برو شارژ کن',
      timeout: 2000,
      color: 'red',
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
