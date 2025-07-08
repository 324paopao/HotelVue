import type { App } from "vue";
import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

export const Layout = () => import("@/layouts/index.vue");

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },

  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },

  {
    path: "/",
    name: "/",
    component: Layout,
    redirect: "/login",
    children: [
      {
        path: "login",
        component: () => import("@/views/login/index.vue"),
        // 用于 keep-alive 功能，需要与 SFC 中自动推导或显式声明的组件名称一致
        // 参考文档: https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
        name: "login",
        meta: {
          title: "login",
          icon: "homepage",
          affix: true,
          keepAlive: true,
        },
      },
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        // 用于 keep-alive 功能，需要与 SFC 中自动推导或显式声明的组件名称一致
        // 参考文档: https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
        name: "dashboard",
        meta: {
          title: "dashboard",
          icon: "homepage",
          affix: true,
          keepAlive: true,
        },
      },
      {
        path: "401",
        component: () => import("@/views/error/401.vue"),
        meta: { hidden: true },
      },
      {
        path: "404",
        component: () => import("@/views/error/404.vue"),
        meta: { hidden: true },
      },
      {
        path: "profile",
        name: "Profile",
        component: () => import("@/views/profile/index.vue"),
        meta: { title: "个人中心", icon: "user", hidden: true },
      },
      {
        path: "my-notice",
        name: "MyNotice",
        component: () => import("@/views/system/notice/components/MyNotice.vue"),
        meta: { title: "我的通知", icon: "user", hidden: true },
      },
      {
        path: "static-page",
        component: () => import("@/views/static-page.vue"),
        meta: { title: "静态页面" },
      },
      {
        path: "listroomtype",
        name: "listroomtype",
        component: () => import("@/views/RoomType/ListRoomType.vue"),
        meta: { title: "房号管理", icon: "user", hidden: true },
      },
      {
        path: "getcustomerlist",
        name: "getcustomerlist",
        component: () => import("@/views/Customers/GetCustomerListView.vue"),
        meta: { title: "客户列表", icon: "user", hidden: true },
      },
      {
        path: "customers/tags-management",
        name: "CustomerTagsManagement",
        component: () => import("@/views/Customers/CustomerTagsManagement.vue"),
        meta: { title: "标签管理", icon: "user", hidden: true },
      },
      {
        path: "customers/tag-edit",
        name: "CustomerTagEdit",
        component: () => import("@/views/Customers/CustomerTag.vue"),
        meta: { title: "创建标签", icon: "user", hidden: true },
      },
      {
        path: "businessRoomtype",
        name: "businessRoomtype",
        component: () => import("@/views/RoomType/ListBusinessRoomType.vue"),
        meta: { title: "业务-房型管理-房型设置", icon: "user", hidden: true },
      },
      {
        path: "listRoomState",
        name: "listRoomState",
        component: () => import("@/views/RoomType/ListRoomState.vue"),
        meta: { title: "房态", icon: "user", hidden: true },
      },
      {
        path: "ReserveRoomList",
        name: "ReserveRoomList",
        component: () => import("@/views/ResrveRoom/ReserveRoomAdd.vue"),
        meta: { title: "办理预订", icon: "user", hidden: true },
      },
      {
        path: "ReserverGetlist",
        name: "ReserverGetlist",
        component: () => import("@/views/ResrveRoom/ReserverGetlist.vue"),
        meta: { title: "预订订单", keepAlive: true, icon: "user", hidden: true },
      },
      {
        path: "Orderlist",
        name: "Orderlist",
        component: () => import("@/views/ResrveRoom/Orderlist.vue"),
        meta: { title: "订房订单", keepAlive: true, icon: "user", hidden: true },
      },
      {
        path: "ReserverDetails",
        name: "ReserverDetails",
        component: () => import("@/views/ResrveRoom/ReserverDetails.vue"),
        meta: { title: "订单详情", keepAlive: true, icon: "user", hidden: true },
      },
      {
        path: "accountview",
        name: "accountview",
        component: () => import("@/views/Setting/AccountView.vue"),
        meta: { title: "账号管理", icon: "user", hidden: true },
      },
      {
        path: "roleview",
        name: "roleview",
        component: () => import("@/views/Setting/RoleView.vue"),
        meta: { title: "角色管理", icon: "user", hidden: true },
      },
      {
        path: "operationlog",
        name: "operationlog",
        component: () => import("@/views/Setting/OperationLog.vue"),
        meta: { title: "操作日志管理", icon: "user", hidden: true },
      },
    ],
  },
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// 全局注册 router
export function setupRouter(app: App<Element>) {
  app.use(router);
}

export default router;
