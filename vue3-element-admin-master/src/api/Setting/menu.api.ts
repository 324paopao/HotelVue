import request from "@/utils/request";

const MENU_BASE_URL = "/api/app/menu";

const MenuAPI = {
  getMenuListByUserId(userId: number) {
    return request({
      url: `${MENU_BASE_URL}/menu-list/${userId}`,
      method: "get",
    });
  },
};

export default MenuAPI;