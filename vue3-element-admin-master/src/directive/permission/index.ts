import type { Directive, DirectiveBinding } from "vue";

import { useUserStore } from "@/store";
import { ROLE_ROOT } from "@/constants";

/**
 * 按钮权限
 */
export const hasPerm: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 直接不做任何权限判断
  },
};

/**
 * 角色权限指令
 */
export const hasRole: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 直接不做任何角色判断
  },
};
