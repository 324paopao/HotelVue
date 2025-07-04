import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuList: [] as any[]
  }),
  actions: {
    setMenuList(list: any[]) {
      this.menuList = list;
    },
    // 根据路由path查找当前菜单的actions
    getActionsByPath(path: string) {
      function findActions(list: any[]): any[] | undefined {
        for (const item of list) {
          if (item.path === path) return item.actions || [];
          if (item.children && item.children.length) {
            const found = findActions(item.children);
            if (found !== undefined) return found;
          }
        }
        return undefined;
      }
      return findActions(this.menuList) || [];
    }
  },
  persist: true
}); 