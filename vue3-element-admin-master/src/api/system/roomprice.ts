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

export function updateRoomPriceStatus(id: string, calendarStatus: boolean) {
  return request.httpRequest({
    url: `${RoomPriceUrl}/room-price-calendar/${id}/room-price-state`,
    method: "put",
    params: { CalendarStatus: calendarStatus },
  });
}

export function updateRoomPriceCalendar(data: any) {
  return request.httpRequest({
    url: `${RoomPriceUrl}/room-price-calendar/room-price-calendars`,
    method: "put",
    data,
  });
}

export function deleteRoomPriceCalendar(id: any) {
  return request.httpRequest({
    url: `${RoomPriceUrl}/room-price-calendar/${id}/room-price`,
    method: "delete",
    params: id,
  });
}
