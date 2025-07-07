import request from '@/utils/request'

const AUTH_BASE_URL = "/api/app/account";

const AccountAPI ={
  /**
   * 
   * @param data 添加用户信息对象
   * @returns 返回一个Promise对象，表示异步操作的最终完成或失败及其结果值。
   */
  addAccount (data: any) {
    return request({
      url: `${AUTH_BASE_URL}/account`,
      method: "post",
      data
    });
  },
  /**
   * 
   * @param id 修改用户的编号
   * @param data 修改用户数据的对象
   * @returns 返回一个Promise对象，表示异步操作的最终完成或失败及其结果值。
   */
  updateAccount(id: string, data: any){
    return request({
      url: `${AUTH_BASE_URL}/${id}/account`,
      method: "put",
      data
    });
  },
  /**
   * 
   * @param data 获取用户列表的参数对象
   * @returns 获取用户列表的返回值对象
   */
  getAccountList(data: any){
    return request({
      url: `${AUTH_BASE_URL}/account-list`,
      method: "get",
      params: data
    });
  },
  /**
   * 
   * @param data 删除用户的参数对象
   * @returns 删除用户的返回值对象
   */
  deleteAccount (data: any){
    return request({
      url: `${AUTH_BASE_URL}/del-account/${data}`,
      method: "delete",
    });
  }
}
export default AccountAPI;