import request from "@/utils/request";

const AUTH_BASE_URL = "/api/app/reserve-room-server";

const AuthAPI = {

 ///房型
  getCaptcha() {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/room-types-list`,
      method: "get",
    });
  },
  ///房间号
  getRoomNum(data:any) {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/room-nmlist`,
      method: "get",
      params:data
    });
  },
  ///房间预定添加
  RoomAdd(data:any) {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/reserve-room`,
      method: "post",
      data
    });
  },
  ///取消房间预定
  NotReserveRoom(data:any) {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/not-reserc`,
      method: "put",
      data
    });
  },
  ///排房
  RoomOrderby(data:any) {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/terraces`,
      method: "put",
      data
    });
  },
  ///取消排房
  RoomNoOrderby(id:any) {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/${id}/no-terraces`,
      method: "put",
    });
  },
  ///入住
  ZhuRoom(data:any) {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/checkin`,
      method: "put",
      data
    });
  },
  ///预定显示
  RoomShow(data:any) {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/show-reserve-room`,
      method: "post",
      params:data
    });
  },

   ///结算
  RoomJiesuan(data:any) {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/settlement`,
      method: "put",
      data
    });
  },
  ///反填房
  FanRoom(id:any) {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/${id}/show-fan-reserve-room`,
      method: "get"
    });
  },

  ///退房
  NoRoom(id:any) {
    return request.httpRequest({
      url: `${AUTH_BASE_URL}/${id}/no-room`,
      method: "put"
    });
  },
};




export default AuthAPI;

/** 登录表单数据 */

