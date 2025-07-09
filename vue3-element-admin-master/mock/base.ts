import path from "path";
import { createDefineMock } from "vite-plugin-mock-dev-server";

export const defineMock = createDefineMock((mock) => {
  // 拼接url
  mock.url = path.join(import.meta.env.VITE_APP_BASE_API + "/api/v1/", mock.url);
  
  // 添加响应拦截器，确保请求不会因为授权问题被拒绝
  mock.response = (req: any, res: any, next: any) => {
    // 继续处理请求，不检查授权
    next();
  };
});
