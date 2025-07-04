import request from '@/utils/request'

const AUTH_BASE_URL = "/api/app/account";

const AccountAPI ={
  addAccount (data: any) {
    return request({
      url: `${AUTH_BASE_URL}/account`,
      method: "post",
      data
    });
  },
  updateAccount(id: string, data: any){
    return request({
      url: `${AUTH_BASE_URL}/${id}/account`,
      method: "put",
      data
    });
  },
  getAccountList(data: any){
    return request({
      url: `${AUTH_BASE_URL}/account-list`,
      method: "get",
      params: data
    });
  },
  deleteAccount (data: any){
    return request({
      url: `${AUTH_BASE_URL}/del-account/${data}`,
      method: "delete",
    });
  }
}
export default AccountAPI;