import request from '@/utils/request'

const Store_Base_URL = "/api/app/store";

const StoreManageAPI = {
  /**
   * 
   * @param data 添加门店信息对象
   * @returns 返回一个Promise对象，表示异步操作的最终完成或失败及其结果值。
   */
  addStore(data: any) {
    return request.httpRequest({
      url: `${Store_Base_URL}/store`,
      method: "post",
      data
    });
  },
  getStoreList(data: any) {
    // 简化请求，只传递必要的分页参数
    const params: Record<string, any> = {
      PageIndex: data.PageIndex || 1,
      PageSize: data.PageSize || 3
    };
    
    // 只有当提供了非空值时才添加筛选条件
    if (data.StoreName && data.StoreName.trim() !== '') {
      params.StoreName = data.StoreName;
    }
    
    if (data.Address && data.Address.trim() !== '') {
      params.Address = data.Address;
    }
    
    // 只有当Status明确为true或false时才添加
    if (data.Status === true) {
      params.Status = "true";
    } else if (data.Status === false) {
      params.Status = "false";
    }
    
    console.log("发送请求参数:", params);
    
    return request.httpRequest({
      url: `${Store_Base_URL}/storelist`,
      method: "get",
      params: params
    });
  },
  updateStore(id: string, data: any) {
    return request.httpRequest({
      url: `${Store_Base_URL}/${id}/storeinfo`,
      method: "put",
      data
    });
  },
  updateStoreStatus(id: any) {
    return request.httpRequest({
      url: `${Store_Base_URL}/${id}/status`,
      method: "put",
    });
  }
}

export default StoreManageAPI;