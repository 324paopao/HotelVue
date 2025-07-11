import request from "@/utils/request";

const AUTH_BASE_URL = "/api/alipay";

const AuthAPI1 = {

  ///支付
  paymoney(data: any) {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/pay`,
      method: "post",
      params: data
    });
  },

};




export default AuthAPI1;

/** 登录表单数据 */

