import request from "@/utils/request";
const customerTypeUrl = "/api/app/customer/custoimer-type-name";
const DEPT_BASE_URL = "/api/v1/dept";

/**
 * 添加客户
 * @param data 客户信息对象
 * @returns 返回一个Promise对象，表示异步操作的最终完成或失败及其结果值。
 */
export function addCustomer(data: any) {
  return request({
    url: "/api/app/customer/customer",
    method: "post",
    data,
  });
}

/**
 * 获取客户列表
 * @param params 查询参数（分页、筛选等）
 * @returns Promise
 */
export function getCustomerList(params: any) {
  return request({
    url: "/api/app/customer/customer-list",
    method: "get",
    params,
  });
}

/**
 * 获取客户类型列表
 * @returns Promise
 */
export function getCustomerTypeList() {
  return request({
    url: "/api/app/customer/custoimer-type-name",
    method: "get",
  });
}

/**
 * 批量修改客户等级/类型
 * @param ids 客户ID数组
 * @param customerType 客户类型ID
 * @returns Promise
 */
export function updateCustomerLevel(ids: string[], customerType: string) {
  return request({
    url: "/api/app/customer/customer",
    method: "put",
    data: {
      ids,
      customerType,
    },
  });
}
