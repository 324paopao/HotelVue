import request from "@/utils/request";

const AUTH_BASE_URL = "/api/app/user";

const AuthAPI = {
  /** 登录接口*/
  login(data: LoginFormData) {
    const params = {
      username: data.username,
      password: data.password,
      captchaKey: data.captchaKey,
      captchaCode: data.captchaCode,
    };
    return request.httpRequest<any, LoginResult>({
      url: `${AUTH_BASE_URL}/Login`,
      method: "get",
      // eslint-disable-next-line object-shorthand
      params: params,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /** 刷新 token 接口*/
  refreshToken(refreshToken: string) {
    // 注释掉实现
    // return request<any, LoginResult>({
    //   url: `${AUTH_BASE_URL}/refresh-token`,
    //   method: "post",
    //   params: { refreshToken },
    //   headers: {
    //     Authorization: "no-auth",
    //   },
    // });
  },

  /** 退出登录接口 */
  logout() {
    // 注释掉实现
    // return request({
    //   url: `${AUTH_BASE_URL}/logout`,
    //   method: "delete",
    // });
  },

  /** 获取验证码接口*/
  async getCaptcha (id:any) {
    return request.httpRequest<any, Blob>({
      url: `${AUTH_BASE_URL}/${id}/captcha`,
      method: "get",
      responseType: "blob" // 关键点：加上这一行
    });
  },
};

export default AuthAPI;

/** 登录表单数据 */
export interface LoginFormData {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 验证码缓存key */
  captchaKey: string;
  /** 验证码 */
  captchaCode: string;
  /** 记住我 */
  rememberMe: boolean;
}

/** 登录响应 */
export interface LoginResult {
  /** 访问令牌 */
  accessToken: string;
  /** 刷新令牌 */
  refreshToken: string;
  /** 令牌类型 */
  tokenType: string;
  /** 过期时间(秒) */
  expiresIn: number;
  /** 用户名 */
  userName: string;
  /** 用户ID */
  id: number;
  /** 昵称 */
  nickName: string;
}

/** 验证码信息 */
export interface CaptchaInfo {
  /** 验证码缓存key */
  captchaKey: string;
  /** 验证码图片Base64字符串 */
  captchaBase64: string;
}
