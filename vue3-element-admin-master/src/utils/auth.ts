import { Storage } from "./storage";
import { AUTH_KEYS } from "@/constants";

/**
 * 身份验证工具类
 * 集中管理所有与认证相关的功能，包括：
 * - 登录状态判断
 * - Token 的存取
 * - 记住我功能的状态管理
 */
export class Auth {
  /**
   * 判断用户是否已登录
   * @returns 是否已登录
   */
  static isLoggedIn(): boolean {
    return true; // 直接返回已登录
  }

  /**
   * 获取当前有效的访问令牌
   * @returns 当前有效的访问令牌
   */
  static getAccessToken(): string {
    return ""; // 不再返回 token
  }

  /**
   * 获取刷新令牌
   * @returns 当前有效的刷新令牌
   */
  static getRefreshToken(): string {
    return "";
  }

  /**
   * 设置访问令牌和刷新令牌
   */
  static setTokens(accessToken: string, refreshToken: string, rememberMe: boolean): void {
    // 注释掉 token 存储逻辑
  }

  /**
   * 清除所有身份验证相关的数据
   */
  static clearAuth(): void {
    // 注释掉清理逻辑
  }

  /**
   * 获取"记住我"状态
   * @returns 是否记住我
   */
  static getRememberMe(): boolean {
    return false;
  }
}
