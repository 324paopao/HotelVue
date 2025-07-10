import request from "@/utils/request";

const AUTH_BASE_URL = "/api/app/reserve-room-server";

const AuthAPI = {

  /**
  * 房型
  * @returns 
  */
  getCaptcha() {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/room-types-list`,
      method: "get",
    });
  },
  /**
   * 房间号
   * @param data 
   * @returns 
   */
  getRoomNum(data:any) {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/room-nmlist`,
      method: "get",
      params:data
    });
  },
  /**
   * 房间预定添加
   * @param data 
   * @returns 
   */
  RoomAdd(data:any) {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/reserve-room`,
      method: "post",
      data
    });
  },
  /**
   * 取消房间预定
   * @param data 
   * @returns 
   */
  NotReserveRoom(data:any) {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/not-reserc`,
      method: "put",
      data
    });
  },
  /**
   * 排房
   * @param data 
   * @returns 
   */
  RoomOrderby(data:any) {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/terraces`,
      method: "put",
      data
    });
  },
  /**
   * 取消排房
   * @param id 
   * @returns 
   */
  RoomNoOrderby(id:any) {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/${id}/no-terraces`,
      method: "put",
    });
  },
  /**
   * 入住
   * @param data 
   * @returns 
   */
  ZhuRoom(data:any) {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/checkin`,
      method: "put",
      data
    });
  },
  /**
   * 预定显示
   * @param data 
   * @returns 
   */
  RoomShow(data:any) {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/show-reserve-room`,
      method: "post",
      params:data
    });
  },

   /**
    * 
    * @param data 
    * @returns 
    */
  RoomJiesuan(data:any) {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/settlement`,
      method: "put",
      data
    });
  },
  /**
   * 反填房
   * @param id 
   * @returns 
   */
  FanRoom(id:any) {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/${id}/show-fan-reserve-room`,
      method: "get"
    });
  },

  /**
   * 退房
   * @param id 
   * @returns 
   */
  NoRoom(id:any) {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/${id}/no-room`,
      method: "put"
    });
  },

  /**
   * 导出
   * @param params 
   * @returns 
   */
  Export(params?: any) {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/export-all-reserver`,
      method: "post",
      data: params,
      responseType: "blob",
    });
  },
};




export default AuthAPI;

/** 登录表单数据 */

