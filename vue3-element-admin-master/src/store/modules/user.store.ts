import { store } from "@/store";

import AuthAPI, { type LoginFormData } from "@/api/auth.api";
import UserAPI, { type UserInfo } from "@/api/system/user.api";

import { Auth } from "@/utils/auth";
import { usePermissionStoreHook } from "@/store/modules/permission.store";
import { useDictStoreHook } from "@/store/modules/dict.store";
import { useTagsViewStore } from "@/store";
import { cleanupWebSocket } from "@/plugins/websocket";

export const useUserStore = defineStore("user", () => {
  const userInfo = useStorage<UserInfo>("userInfo", {} as UserInfo);
  // 记住我状态
  const rememberMe = ref(Auth.getRememberMe());

  /**
   * 登录
   *
   * @param {LoginFormData}
   * @returns
   */
  function login(LoginFormData: LoginFormData) {
    return new Promise<void>((resolve, reject) => {
      // 只做登录状态标记，不处理 token
      // AuthAPI.login(LoginFormData)
      //   .then((data) => {
      //     const { accessToken, refreshToken } = data;
      //     // 保存记住我状态和token
      //     rememberMe.value = LoginFormData.rememberMe;
      //     Auth.setTokens(accessToken, refreshToken, rememberMe.value);
      //     resolve();
      //   })
      //   .catch((error) => {
      //     reject(error);
      //   });
      resolve();
    });
  }

  /**
   * 获取用户信息
   *
   * @returns {UserInfo} 用户信息
   */
  function getUserInfo() {
    return new Promise<UserInfo>((resolve, reject) => {
      // 不再请求用户信息，直接返回空对象
      resolve({} as UserInfo);
    });
  }

  /**
   * 登出
   */
  function logout() {
    return new Promise<void>((resolve, reject) => {
      // 不再处理登出逻辑
      // AuthAPI.logout()
      //   .then(() => {
      //     resetAllState();
      //     resolve();
      //   })
      //   .catch((error) => {
      //     reject(error);
      //   });
      resolve();
    });
  }

  /**
   * 重置所有系统状态
   * 统一处理所有清理工作，包括用户凭证、路由、缓存等
   */
  function resetAllState() {
    // 只重置用户信息
    resetUserState();
    return Promise.resolve();
  }

  /**
   * 重置用户状态
   * 仅处理用户模块内的状态
   */
  function resetUserState() {
    // 只重置用户信息，不清理 token
    userInfo.value = {} as UserInfo;
  }

  /**
   * 刷新 token
   */
  function refreshToken() {
    // 不再处理 token 刷新
    return Promise.reject(new Error("没有有效的刷新令牌"));
  }

  return {
    userInfo,
    rememberMe,
    getUserInfo,
    login,
    logout,
    resetAllState,
    resetUserState,
    refreshToken,
  };
});

/**
 * 在组件外部使用UserStore的钩子函数
 * @see https://pinia.vuejs.org/core-concepts/outside-component-usage.html
 */
export function useUserStoreHook() {
  return useUserStore(store);
}
