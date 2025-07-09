import request from "@/utils/request";
const RoomTypeUrl = "/api/app/room-type";
const RoomNumUrl = "/api/app/room-numm-services";
const RoomNumServicesUrl = "/api/app/reserve-room-server";
const RoomTypeAPI = {
  /** 获取房型列表加分页条件 */
  GetRoomTypeAxios(Query: any) {
    return request.httpRequest<any, RoomTypeSeach>({
      url: `${RoomTypeUrl}/show`,
      method: "get",
      params: Query,
    });
  },
  /** 获取房型列表 */
  GetRoomTypeListAxios(Query: any) {
    return request.httpRequest<any, RoomTypeSeach>({
      url: `${RoomNumServicesUrl}/room-types-list`,
      method: "get",
      params: Query,
    });
  },
  /** 删除房型 */
  DeleteRoomTypeAxios(Query: any) {
    return request.httpRequest<any>({
      url: `${RoomTypeUrl}/${Query}/room-type-del`,
      method: "delete",
    });
  },
  /** 新增房型 */
  AddRoomTypeAxios(data: any) {
    return request.httpRequest<any>({
      url: `${RoomTypeUrl}/add`,
      method: "post",
      data,
      headers: { "Content-Type": "application/json" },
    });
  },
  /** 批量删除房型 */
  BatchDeleteRoomTypeAxios(ids: string[]) {
    const params = ids.map((id) => `ids=${id}`).join("&");
    return request.httpRequest<any>({
      url: `${RoomTypeUrl}/batch-room-type?${params}`,
      method: "delete",
    });
  },
  /** 修改房型 */
  UpdataRoomTypeAxios(id: string, data: RoomTypeUpdate) {
    return request.httpRequest<any>({
      url: `${RoomTypeUrl}/${id}/room-type`,
      method: "put",
      data,
    });
  },
  UpdataRoomTypeOrder(data: any) {
    return request.httpRequest<any>({
      url: `${RoomTypeUrl}/room-type-order`,
      method: "put",
      data,
    });
  },
  // 获取房号列表根据房型id
  GetRoomNumListAxios(Query: any) {
    return request.httpRequest<any, RoomNumToRoomTypeId>({
      url: `${RoomNumUrl}/to-room-type-id`,
      method: "get",
      params: Query,
    });
  },
  // 获取房号列表
  GetRoomNumAxios(data: any) {
    return request.httpRequest<any>({
      url: `${RoomNumUrl}/room-num-list`,
      method: "get",
      params: data,
    });
  },

  // 添加房号
  AddRoomNumAxios(data: any) {
    return request.httpRequest<any>({
      url: `${RoomNumUrl}/room-num-add`,
      method: "post",
      data,
    });
  },
  // 修改房号
  UpdataRoomNumAxios(Id: string, data: any) {
    return request.httpRequest<any>({
      url: `${RoomNumUrl}/room-numm/${Id}`,
      method: "put",
      data,
    });
  },
  // 删除房号
  DeleteRoomNumAxios(Id: string) {
    return request.httpRequest<any>({
      url: `${RoomNumUrl}/room-num/${Id}`,
      method: "delete",
    });
  },
  // 修改房号状态(上架下架)
  UpdataRoomNumStateAxios(Id: string, data: any) {
    return request.httpRequest<any>({
      url: `${RoomNumUrl}/${Id}/state-to-room-num`,
      method: "put",
      params: data,
    });
  },
  // 批量删除房号
  BatchDeleteRoomNumAxios(ids: string[]) {
    const paramas = ids.map((id) => `ids=${id}`).join("&");
    return request.httpRequest<any>({
      url: `${RoomNumUrl}/room-num-batch?${paramas}`,
      method: "delete",
      params: ids,
    });
  },
  // 批量上下架房号
  BatchUpdateRoomNumStateAxios(ids: string[], state: boolean) {
    return request.httpRequest<any>({
      url: `${RoomNumUrl}/state-to-room-num-batch?state=${state}`,
      method: "put",
      data: ids,
      headers: { "Content-Type": "application/json" },
    });
  },
};

export default RoomTypeAPI;
export interface RoomTypeSeach {
  totleCount: number;
  totlePage: number;
  data: [];
}
export interface RoomNumToRoomTypeId {
  totleCount: number;
  totlePage: number;
  data: [];
}
export interface RoomTypeUpdate {
  data: {
    name: string;
    state: number;
    price: number;
    depositRequired: boolean;
    depositAmount: number;
    area: number;
    maxOccupancy: number;
    obligate: boolean;
    extraBedPolicy: string;
    imageUrl: string;
    videoUrl: string;
    roomTypeCount: number;
    order: number;
    description: string;
    displayChannels: string;
    facilities: string;
    lastModificationTime: string;
    lastModifierId: null;
    creationTime: string;
    creatorId: null;
    id: string;
  };
}
/* export interface RoomNumUpdate {
  id: "";
  roomTypeId: "";
  roomNum: 0;
  state: true;
  order: 0;
  description: "";
}
 */
