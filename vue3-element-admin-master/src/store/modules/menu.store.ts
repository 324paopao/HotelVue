import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuList: [] as any[]
  }),
  actions: {
    setMenuList(list: any[]) {
      this.menuList = list;
    }
  },
  persist: true
}); 