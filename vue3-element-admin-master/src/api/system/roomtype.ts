import request from "@/utils/request";
const RoomTypeUrl = "/api/app/room-type";
const RoomNumUrl = "/api/app/room-numm-services";

const RoomTypeAPI = {
  /** 获取房型列表 */
  GetRoomTypeAxios(Query: any) {
    return request<any, RoomTypeSeach>({
      url: `${RoomTypeUrl}/show`,
      method: "get",
      params: Query,
    });
  },
  /** 删除房型 */
  DeleteRoomTypeAxios(Query: any) {
    return request<any>({
      url: `${RoomTypeUrl}/${Query}/room-type-del`,
      method: "delete",
    });
  },
  /** 新增房型 */
  AddRoomTypeAxios(data: any) {
    return request<any>({
      url: `${RoomTypeUrl}/add`,
      method: "post",
      data,
      headers: { "Content-Type": "application/json" },
    });
  },
  /** 批量删除房型 */
  BatchDeleteRoomTypeAxios(ids: string[]) {
    const params = ids.map((id) => `ids=${id}`).join("&");
    return request<any>({
      url: `${RoomTypeUrl}/batch-room-type?${params}`,
      method: "delete",
    });
  },
  /** 修改房型 */
  UpdataRoomTypeAxios(id: string, data: RoomTypeUpdate) {
    return request<any>({
      url: `${RoomTypeUrl}/${id}/room-type`,
      method: "put",
      data,
    });
  },
  UpdataRoomTypeOrder(data: any) {
    return request<any>({
      url: `${RoomTypeUrl}/room-type-order`,
      method: "put",
      data,
    });
  },
  // 获取房号列表根据房型id
  GetRoomNumListAxios(Query: any) {
    return request<any, RoomNumToRoomTypeId>({
      url: `${RoomNumUrl}/to-room-type-id`,
      method: "get",
      params: Query,
    });
  },

  // 添加房号
  AddRoomNumAxios(data: any) {
    return request<any>({
      url: `${RoomNumUrl}/room-num-add`,
      method: "post",
      data,
    });
  },
  // 修改房号
  UpdataRoomNumAxios(Id: string, data: any) {
    return request<any>({
      url: `${RoomNumUrl}/room-numm/${Id}`,
      method: "put",
      data,
    });
  },
  DeleteRoomNumAxios(Id: string) {
    return request<any>({
      url: `${RoomNumUrl}/room-num/${Id}`,
      method: "delete",
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
