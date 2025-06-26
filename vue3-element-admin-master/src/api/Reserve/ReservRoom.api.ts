import request from "@/utils/request";

const AUTH_BASE_URL = "/api/app/reserve-room-server";

const AuthAPI = {

 ///房型
  getCaptcha() {
    return request({
      url: `${AUTH_BASE_URL}/room-types-list`,
      method: "get",
    });
  },
  ///房间号
  getRoomNum(data:any) {
    return request({
      url: `${AUTH_BASE_URL}/room-nmlist`,
      method: "get",
      params:data
    });
  },
  ///房间预定添加
  RoomAdd(data:any) {
    return request({
      url: `${AUTH_BASE_URL}/reserve-room`,
      method: "post",
      data
    });
  },
  ///取消房间预定
  NotReserveRoom(data:any) {
    return request({
      url: `${AUTH_BASE_URL}/not-reserc`,
      method: "put",
      data
    });
  },
  ///排房
  RoomOrderby(data:any) {
    return request({
      url: `${AUTH_BASE_URL}/terraces`,
      method: "put",
      data
    });
  },
  ///取消排房
  RoomNoOrderby(id:any) {
    return request({
      url: `${AUTH_BASE_URL}/${id}/no-terraces`,
      method: "put",
    });
  },

  ///预定显示
  RoomShow(data:any) {
    return request({
      url: `${AUTH_BASE_URL}/show-reserve-room`,
      method: "post",
      params:data
    });
  },
};




export default AuthAPI;

/** 登录表单数据 */

