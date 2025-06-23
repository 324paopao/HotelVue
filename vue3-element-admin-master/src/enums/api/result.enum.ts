/**
 * 响应码枚举
 */
export const enum ResultEnum {
  /**
   * 成功
   */
  SUCCESS = 1,
  /**
   * 错误
   */
  ERROR = 2,

  /**
   * 访问令牌无效或过期
   */
  ACCESS_TOKEN_INVALID = "A0230",

  /**
   * 刷新令牌无效或过期
   */
  REFRESH_TOKEN_INVALID = "A0231",
}
