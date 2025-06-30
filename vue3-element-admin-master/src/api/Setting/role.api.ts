import request from "@/utils/request";

const Role_BASE_URL = "/api/app/role";

export const RoleAPI ={
  getRole (data:any){
    return request({
      url:`${Role_BASE_URL}/role-list`,
      method:'get',
      params:data
    })
  },
  getPermissionByRoleId(data:any){
    return request({
      url:`${Role_BASE_URL}/perm-by-role`,
      method:'get',
      params:data
    })
  }
}

export default RoleAPI;