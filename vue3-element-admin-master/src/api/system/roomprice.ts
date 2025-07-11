import request from "@/utils/request";
const RoomPriceUrl = "/api/app";

export function getRoomPrice(data: any) {
  return request.httpRequest({
    url: `${RoomPriceUrl}/room-price-calendar`,
    method: "get",
    params: data,
  });
}

export function getRoomPriceCalendars(data: any) {
  return request.httpRequest({
    url: `${RoomPriceUrl}/room-price-calendar/room-price-calendars`,
    method: "get",
    params: data,
  });
}
