import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from "axios";
import qs from "qs";
import { useUserStoreHook } from "@/store/modules/user.store";
import { ResultEnum } from "@/enums/api/result.enum";
import { Auth } from "@/utils/auth";
import router from "@/router";
import { number } from "echarts";

/**
 * 创建 HTTP 请求实例
 */
const httpRequest = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 50000,
  withCredentials: true,
  headers: { "Content-Type": "application/json;charset=utf-8" },
  paramsSerializer: (params) => qs.stringify(params),
});

/**
 * 请求拦截器 - 不再添加 Authorization 头
 */
httpRequest.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加处理token
    const accessToken = Auth.getAccessToken();
    if (config.headers.Authorization !== "no-auth" && accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器 - 统一处理响应和错误
 */
httpRequest.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    debugger
    // 如果响应是二进制流，则直接返回（用于文件下载、Excel 导出等）
    if (response.config.responseType === "blob") {
      return response;
    }

    const { code, data, msg } = response.data;

    // 请求成功
    if (Number(code) === 1) {
      return data;
    }

    // 业务错误
    const errorMessage = msg || "系统出错";
    if (errorMessage && errorMessage.includes("Unrecognized Guid format")) {
      // 不弹窗，直接返回错误
      return Promise.reject(new Error(msg || "Business Error"));
    }
    ElMessage.error(errorMessage);
    return Promise.reject(new Error(msg || "Business Error"));
  },
  async (error) => {
    debugger
    console.error("Response interceptor error:", error);

    const { config, response } = error;

    // 网络错误或服务器无响应
    if (!response) {
      ElMessage.error("网络连接失败，请检查网络设置");
      return Promise.reject(error);
    }

    const { code, msg } = response.data as ApiResponse;

    switch (code) {
      case ResultEnum.ACCESS_TOKEN_INVALID:
        // Access Token 过期，尝试刷新
        // return refreshTokenAndRetry(config);
        break;
      case ResultEnum.REFRESH_TOKEN_INVALID:
        // Refresh Token 过期，跳转登录页
        // await redirectToLogin("登录已过期，请重新登录");
        return Promise.reject(new Error(msg || "Refresh Token Invalid"));
      default:
        ElMessage.error(msg || "请求失败");
        return Promise.reject(new Error(msg || "Request Error"));
    }
  }
);

/**
 * 重试请求的回调函数类型
 */
type RetryCallback = () => void;

// Token 刷新相关状态
// let isRefreshingToken = false;
// const pendingRequests: RetryCallback[] = [];

/**
 * 刷新 Token 并重试请求
 */
// async function refreshTokenAndRetry(config: InternalAxiosRequestConfig): Promise<any> { ... }

/**
 * 重定向到登录页面
 */
// async function redirectToLogin(message: string = "请重新登录"): Promise<void> { ... }

const httpRequest1 = axios.create({
  baseURL: "/dev-api", // 使用代理前缀，这样请求会被Vite开发服务器拦截并处理
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
  paramsSerializer: (params) => qs.stringify(params),
});

/**
 * 为httpRequest1添加请求拦截器
 */
httpRequest1.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加token到请求头
    const accessToken = Auth.getAccessToken();
    if (config.headers.Authorization !== "no-auth" && accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器 - 统一处理响应和错误
 */
httpRequest1.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 如果响应是二进制流，则直接返回（用于文件下载、Excel 导出等）
    if (response.config.responseType === "blob") {
      return response;
    }

    const { code, data, msg } = response.data;

    // 请求成功
    if (Number(code) === 1) {
      return data;
    }

    // 业务错误
    const errorMessage = msg || "系统出错";
    if (errorMessage && errorMessage.includes("Unrecognized Guid format")) {
      // 不弹窗，直接返回错误
      return Promise.reject(new Error(msg || "Business Error"));
    }
    ElMessage.error(errorMessage);
    return Promise.reject(new Error(msg || "Business Error"));
  },
  async (error) => {
    console.error("Response interceptor error:", error);

    const { config, response } = error;

    // 网络错误或服务器无响应
    if (!response) {
      ElMessage.error("网络连接失败，请检查网络设置");
      return Promise.reject(error);
    }

    const { code, msg } = response.data as ApiResponse;

    switch (code) {
      case ResultEnum.ACCESS_TOKEN_INVALID:
        // Access Token 过期，尝试刷新
        // return refreshTokenAndRetry(config);
        break;
      case ResultEnum.REFRESH_TOKEN_INVALID:
        // Refresh Token 过期，跳转登录页
        // await redirectToLogin("登录已过期，请重新登录");
        return Promise.reject(new Error(msg || "Refresh Token Invalid"));
      default:
        ElMessage.error(msg || "请求失败");
        return Promise.reject(new Error(msg || "Request Error"));
    }
  }
);

export default { httpRequest, httpRequest1 };
