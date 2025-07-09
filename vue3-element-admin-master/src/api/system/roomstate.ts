import request from "@/utils/request";

const RoomStateUrl = "/api/app/room-state-services";

export function updateRoomState(id: string, state: number) {
  return request.httpRequest({
    url: `${RoomStateUrl}/${id}/room-type-state?state=${state}`,
    method: "put",
  });
}

export function getRoomStateList(params: { TypeName?: string; State?: number }) {
  return request.httpRequest({
    url: `${RoomStateUrl}/room-type-list`,
    method: "get",
    params,
  });
}
