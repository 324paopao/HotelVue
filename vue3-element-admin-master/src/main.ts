import { createApp } from "vue";
import App from "./App.vue";
import setupPlugins from "@/plugins";
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 应用安全数据处理垫片
import { applyPolyfills } from "@/utils/polyfill";
applyPolyfills();

// 暗黑主题样式
import "element-plus/theme-chalk/dark/css-vars.css";
import "vxe-table/lib/style.css";
// 暗黑模式自定义变量
import "@/styles/dark/css-vars.css";
import "@/styles/index.scss";
import "uno.css";

// 过渡动画
import "animate.css";

// 自动为某些默认事件（如 touchstart、wheel 等）添加 { passive: true },提升滚动性能并消除控制台的非被动事件监听警告
import "default-passive-events";

// 全局防错机制：防止对undefined/null进行map操作
const originalArrayPrototypeMap = Array.prototype.map;
Array.prototype.map = function(...args) {
  if (this === undefined || this === null) {
    console.warn('防止对undefined/null调用map方法');
    return [];
  }
  return originalArrayPrototypeMap.apply(this, args);
};

// 同样保护其他常用数组方法
const arrayMethods = ['forEach', 'filter', 'reduce', 'some', 'every', 'find', 'findIndex'];
arrayMethods.forEach(method => {
  const original = Array.prototype[method];
  if (original) {
    Array.prototype[method] = function(...args) {
      if (this === undefined || this === null) {
        console.warn(`防止对undefined/null调用${method}方法`);
        return method === 'reduce' ? args[1] || [] : [];
      }
      return original.apply(this, args);
    };
  }
});

const app = createApp(App);
// 注册插件
app.use(setupPlugins);

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.mount("#app");
