import request from "@/utils/request";
const AUTH_BASE_URL = "/api/app/room-type";

const RoomTypeAPI = {
  /** 获取房型列表 */
  GetRoomTypeAxios(Query: any) {
    return request<any, RoomTypeSeach>({
      url: `${AUTH_BASE_URL}/show`,
      method: "get",
      params: Query,
    });
  },
  /** 删除房型 */
  DeleteRoomTypeAxios(Query: any) {
    return request<any>({
      url: `${AUTH_BASE_URL}/${Query}/room-type-del`,
      method: "delete",
    });
  },
  /** 新增房型 */
  AddRoomTypeAxios(data: any) {
    return request<any>({
      url: `${AUTH_BASE_URL}/add`,
      method: "post",
      data,
      headers: { "Content-Type": "application/json" },
    });
  },
  /** 批量删除房型 */
  BatchDeleteRoomTypeAxios(ids: string[]) {
    const params = ids.map((id) => `ids=${id}`).join("&");
    return request<any>({
      url: `${AUTH_BASE_URL}/batch-room-type?${params}`,
      method: "delete",
    });
  },
  /** 修改房型 */
  UpdataRoomTypeAxios(id: string, data: RoomTypeUpdate) {
    return request<any>({
      url: `${AUTH_BASE_URL}/${id}/room-type`,
      method: "put",
      data,
    });
  },
  UpdataRoomTypeOrder(data: any) {
    return request<any>({
      url: `${AUTH_BASE_URL}/room-type-order`,
      method: "put",
      data,
    });
  },
};

export default RoomTypeAPI;
export interface RoomTypeSeach {
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
