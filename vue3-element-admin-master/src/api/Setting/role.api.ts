import request from "@/utils/request";

const Role_BASE_URL = "/api/app/role";

export const RoleAPI ={
  /**
   * 获取角色列表
   * @param data 查询参数
   * @returns Promise
   */
  getRole (data:any){
    return request.httpRequest({
      url:`${Role_BASE_URL}/role-list`,
      method:'get',
      params:data
    })
  },
  /**
   * 获取角色权限
   * @param data 角色id
   * @returns Promise
   */
  getPermissionByRoleId(data:any){
    return request.httpRequest({
      url:`${Role_BASE_URL}/perm-by-role`,
      method:'get',
      params:data
    })
  },
  /**
   * 获取权限树
   * @returns Promise
   */
  getPermissionTree(){
    return request.httpRequest({
      url:`${Role_BASE_URL}/permission-tree`,
      method:'get'
    })
  },
  /**
   * 新增角色
   * @param data 角色信息
   * @returns Promise
   */
  addRole(data:any){
    return request.httpRequest({
      url:`${Role_BASE_URL}/role`,
      method:'post',
      data
    })
  },
  /**
   * 删除角色
   * @param data 角色ID
   * @returns Promise
   */
  deleteRole(data:any){
    return request.httpRequest({
      url:`${Role_BASE_URL}/del-role/${data}`,
      method:'delete',
    })
  },
  /**
   * 修改角色
   * @param id 角色ID
   * @param data 角色信息
   * @returns Promise
   */
  updateRole(id:string,data:any){
    return request.httpRequest({
      url:`${Role_BASE_URL}/role/${id}`,
      method:'put',
      data
    })
  },
  /**
   * 批量删除角色
   * @param ids 角色ID
   * @returns Promise
   */
  deleteRange(ids:any){
    return request.httpRequest({
      url:`${Role_BASE_URL}/range`,
      method:'delete',
      params:ids
    })
  }
}

export default RoleAPI;