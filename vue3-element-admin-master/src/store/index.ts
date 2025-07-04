import type { App } from "vue";
import { createPinia } from "pinia";

const store = createPinia();
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
// 全局注册 store
export function setupStore(app: App<Element>) {
  app.use(store)
  app.use(pinia)
}

export * from "./modules/app.store";
export * from "./modules/permission.store";
export * from "./modules/settings.store";
export * from "./modules/tags-view.store";
export * from "./modules/user.store";
export * from "./modules/dict.store";
export * from "./modules/account.store"
export * from "./modules/menu.store"
export { store };
