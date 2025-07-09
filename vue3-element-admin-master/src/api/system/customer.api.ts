import request from "@/utils/request";
const customerTypeUrl = "/api/app/customer/custoimer-type-name";
const DEPT_BASE_URL = "/api/v1/dept";

/**
 * 添加客户
 * @param data 客户信息对象
 * @returns 返回一个Promise对象，表示异步操作的最终完成或失败及其结果值。
 */
export function addCustomer(data: any) {
  return request.httpRequest({
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
  return request.httpRequest({
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
  return request.httpRequest({
    url: "/api/app/customer/customer-type-name",
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
  return request.httpRequest({
    url: "/api/app/customer/customer",
    method: "put",
    data: {
      ids,
      customerType,
    },
  });
}

/**
 * 导出客户数据
 * @param params 查询参数（筛选条件等）
 * @returns Promise 文件下载流
 */
export function exportCustomerData(params?: any) {
  return request.httpRequest({
    url: "/api/app/customer/export-all-customers",
    method: "post",
    data: params,
    responseType: "blob",
  });
}

/**
 * 创建标签
 * @param data 标签数据对象（如 { labelName: string, tagType: 0|1, description?: string, ... }）
 * @returns Promise
 */
export function createTag(data: any) {
  return request.httpRequest({
    url: "/api/app/label/label",
    method: "post",
    data,
  });
}

/**
 * 获取标签列表
 * @param params 查询参数（如 { PageIndex: number, PageSize: number, LabelName?: string, TagType?: 0|1 }）
 * @returns Promise
 */
export function getTagList(params?: any) {
  return request.httpRequest({
    url: "/api/app/label/customer-list",
    method: "get",
    params,
  });
}

/**
 * 获取标签列表
 * @param params 查询参数（如 { PageIndex, PageSize, LabelId }）
 * @returns Promise
 */
export function getLabelCustomerList(params: any) {
  return request.httpRequest({
    url: "/api/app/label/customer-list",
    method: "get",
    params,
  });
}

/**
 * 客户充值
 * @param data 充值数据
 * @returns Promise
 */
export function rechargeCustomerBalance(data: {
  id: string;
  availableBalance: number;
  rechargeamount: number;
  customerDesc: string;
}) {
  return request.httpRequest({
    url: "/api/app/customer/up-available-balance",
    method: "post",
    data,
  });
}

/**
 * 客户消费
 * @param data 消费数据
 * @returns Promise
 */
export function customerConsume(data: {
  id: string;
  availableBalance: number;
  availableGiftBalance: number;
  sumofconsumption: number;
  consumerNumber: number;
  consumerDesc: string;
  accumulativeconsumption: number;
}) {
  return request.httpRequest({
    url: "/api/app/customer/up-sumofconsumption",
    method: "post",
    data,
  });
}

/**
 * 批量冻结/解冻客户
 * @param ids 客户ID数组
 * @param status false=冻结 true=解冻
 * @returns Promise
 */
export function updateCustomerStatus(ids: string[], status: boolean) {
  return request.httpRequest    ({
    url: "/api/app/customer/customer-status",
    method: "put",
    data: { ids, status },
  });
}

/**
 * 送积分
 * @param data 送积分数据
 * @returns Promise
 */
export function giveCustomerPoints(data: {
  id: string;
  availablePoints: number;
  accumulativeintegral: number;
  pointsmodifydesc: string;
}) {
  return request.httpRequest({
    url: "/api/app/customer/available-points",
    method: "put",
    data,
  });
}

/**
 * 获取客户详情
 * @param id 客户ID
 * @returns Promise
 */
export function getCustomerDetailById(id: string) {
  return request.httpRequest({
    url: `/api/app/customer/${id}/customer-by-id`,
    method: "get",
  });
}

/**
 * 删除标签
 * @param id 标签ID
 * @returns Promise
 */
export function deleteTag(id: any) {
  return request.httpRequest({
    url: `/api/app/label/del-label`,
    method: "delete",
    params:id
  });
}
