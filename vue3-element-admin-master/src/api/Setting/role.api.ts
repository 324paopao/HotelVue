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
  },
  getPermissionTree(){
    return request({
      url:`${Role_BASE_URL}/permission-tree`,
      method:'get'
    })
  },
  addRole(data:any){
    return request({
      url:`${Role_BASE_URL}/role`,
      method:'post',
      data
    })
  },
  deleteRole(data:any){
    return request({
      url:`${Role_BASE_URL}/del-role/${data}`,
      method:'delete',
    })
  },
  updateRole(id:string,data:any){
    return request({
      url:`${Role_BASE_URL}/role/${id}`,
      method:'put',
      data
    })
  },
  deleteRange(ids:any){
    return request({
      url:`${Role_BASE_URL}/range`,
      method:'delete',
      params:ids
    })
  }
}

export default RoleAPI;