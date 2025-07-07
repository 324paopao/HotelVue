import request from "@/utils/request";

const MENU_BASE_URL = "/api/app/menu";

const MenuAPI = {
  /**
   * 根据用户ID获取菜单列表
   * @param userId 用户ID
   * @returns Promise
   */
  getMenuListByUserId(userId: number) {
    return request({
      url: `${MENU_BASE_URL}/menu-list/${userId}`,
      method: "get",
    });
  },
};

export default MenuAPI;