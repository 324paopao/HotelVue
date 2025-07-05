<template>
  <div>
    <h3 text-center m-0 mb-20px>{{ t("login.login") }}</h3>
    <el-form 
    ref="loginFormRef" :model="loginFormData" :rules="loginRules" size="large"
      :validate-on-rule-change="false">
      <!-- 用户名 -->
      <el-form-item prop="username">
        <div style="display: flex; align-items: center;">
          <el-input v-model.trim="loginFormData.username" :placeholder="t('login.username')" style="flex: 1;">
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
          <el-dropdown style="margin-left: 8px;" @command="handleSelectUser" >
            <el-button link style="padding: 0 6px; min-width: unset;">
              <el-icon><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="user in userList"
                  :key="user.username + user.label"
                  :command="user"
                >
                  {{ user.label }}：{{ user.username }}/{{ user.password }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-form-item>

      <!-- 密码 -->
      <el-tooltip :visible="isCapsLock" :content="t('login.capsLock')" placement="right">
        <el-form-item prop="password">
          <el-input 
          v-model.trim="loginFormData.password" :placeholder="t('login.password')" type="password"
            show-password @keyup="checkCapsLock" @keyup.enter="handleLoginSubmit">
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-tooltip>

      <!-- 验证码 -->
      <el-form-item prop="captchaCode">
        <div flex>
          <el-input
           v-model.trim="loginFormData.captchaCode" :placeholder="t('login.captchaCode')"
            @keyup.enter="handleLoginSubmit">
            <template #prefix>
              <div class="i-svg:captcha" />
            </template>
          </el-input>
          <div cursor-pointer h="[40px]" w="[120px]" flex-center ml-10px @click="getCaptcha">
            <el-icon v-if="codeLoading" class="is-loading">
              <Loading />
            </el-icon>

            <img 
            v-else object-cover border-rd-4px p-1px shadow="[0_0_0_1px_var(--el-border-color)_inset]"
              :src="captchaBase64" alt="code" />
          </div>
        </div>
      </el-form-item>

      <div class="flex-x-between w-full">
        <el-checkbox v-model="loginFormData.rememberMe">{{ t("login.rememberMe") }}</el-checkbox>
        <el-link type="primary" underline="never" @click="toOtherForm('resetPwd')">
          {{ t("login.forgetPassword") }}
        </el-link>
      </div>

      <!-- 登录按钮 -->
      <el-form-item>
        <el-button :loading="loading" type="primary" class="w-full" @click="handleLoginSubmit">
          {{ t("login.login") }}
        </el-button>
      </el-form-item>
    </el-form>

    <div flex-center gap-10px>
      <el-text size="default">{{ t("login.noAccount") }}</el-text>
      <el-link type="primary" underline="never" @click="toOtherForm('register')">
        {{ t("login.reg") }}
      </el-link>
    </div>

    <!-- 第三方登录 -->
    <div class="third-party-login">
      <div class="divider-container">
        <div class="divider-line"></div>
        <span class="divider-text">{{ t("login.otherLoginMethods") }}</span>
        <div class="divider-line"></div>
      </div>
      <div class="flex-center gap-x-5 w-full text-[var(--el-text-color-secondary)]">
        <CommonWrapper>
          <div text-20px class="i-svg:wechat" />
        </CommonWrapper>
        <CommonWrapper>
          <div text-20px cursor-pointer class="i-svg:qq" />
        </CommonWrapper>
        <CommonWrapper>
          <div text-20px cursor-pointer class="i-svg:github" />
        </CommonWrapper>
        <CommonWrapper>
          <div text-20px cursor-pointer class="i-svg:gitee" />
        </CommonWrapper>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { FormInstance } from "element-plus";
import {  useRouter } from "vue-router";
//import { LocationQuery, RouteLocationRaw, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import AuthAPI, { type LoginFormData } from "@/api/auth.api";
//import { useCounterStore } from "@/store";
import { useMenuStore } from "@/store";
import MenuAPI from "@/api/Setting/menu.api";
//const counterStore = useCounterStore();
const menuStore = useMenuStore();
const router = useRouter();
//const route = useRoute();

//import { useUserStore } from "@/store";
const route = useRoute();
import { useStore } from "@/store/Usertinfo";
const store = useStore();
//import { useUserStore } from "@/store";
import CommonWrapper from "@/components/CommonWrapper/index.vue";
import { Auth } from "@/utils/auth";
import { ArrowDown } from '@element-plus/icons-vue';

const { t } = useI18n();
//const userStore = useUserStore();

// 账号列表
const userList = [
  { label: "超级管理员", username: "admin", password: "123456" },
  { label: "经理", username: "wangwu", password: "105866" },
  { label: "员工", username: "lisi", password: "202657" },
  { label: "前台接待", username: "lisi", password: "202657" }
];

onMounted(() => getCaptcha());

const loginFormRef = ref<FormInstance>();
const loading = ref(false);
// 是否大写锁定
const isCapsLock = ref(false);
// 验证码图片Base64字符串
const captchaBase64 = ref();
// 记住我
const rememberMe = Auth.getRememberMe();

const loginFormData = ref<LoginFormData>({
  username: "",
  password: "",
  captchaKey: "",
  captchaCode: "",
  rememberMe,
});

const loginRules = computed(() => {
  return {
    username: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.username.required"),
      },
    ],
    password: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.password.required"),
      },
      {
        min: 6,
        message: t("login.message.password.min"),
        trigger: "blur",
      },
    ],
    captchaCode: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.captchaCode.required"),
      },
    ],
  };
});

// 获取验证码
const codeLoading = ref(false);
async function getCaptcha() {
  codeLoading.value = true; // 开始加载动画
  const id = new Date().getTime().toString(); // 生成唯一验证码 key
  try {
    // 调用后端接口获取验证码图片（Blob 格式）
    const response = await AuthAPI.getCaptcha(id);
    let blob: Blob; // 用于存放图片二进制数据
    // 兼容不同 axios 封装返回格式
    if (response instanceof Blob) {
      // 如果直接返回的是 Blob
      blob = response;
    } else if (response && response.data instanceof Blob) {
      // 如果 axios 封装，图片在 data 字段里
      blob = response.data;
    } else {
      // 返回值不是 Blob，报错并退出
      console.error("返回值不是Blob类型,实际类型:", typeof response);
      return;
    }
    // 创建 FileReader 实例，将 Blob 转为 base64
    const reader = new FileReader();
    reader.readAsDataURL(blob); // 异步读取
    reader.onload = () => {
      // 读取完成后，将 base64 赋值给 captchaBase64，img 会自动刷新
      captchaBase64.value = reader.result as string;
      loginFormData.value.captchaKey = id; // 保存验证码 key，后端校验用
      loginFormData.value.captchaCode = ""; // 清空输入框
    };
  } finally {
    codeLoading.value = false; // 关闭加载动画
  }
}

/**
 * 登录提交
 */
async function handleLoginSubmit() {
  try {
    // 1. 表单验证
    const valid = await loginFormRef.value?.validate();
    if (!valid) return;

    loading.value = true;

    // 2. 执行登录
    const params: any = {
      username: loginFormData.value.username,
      password: loginFormData.value.password,
      captchaKey: loginFormData.value.captchaKey,
      captchaCode: loginFormData.value.captchaCode
    }
    const res = await AuthAPI.login(params);
    // counterStore.userInfo.id = res.id;
    // counterStore.userInfo.userName = res.userName;
    // counterStore.userInfo.accessToken = res.accessToken;
    // counterStore.userInfo.refreshToken = res.refreshToken;
    // counterStore.userInfo.nickName = res.nickName;
    store.accessToken = res.accessToken;
    store.expiresIn = res.expiresIn;
    store.id = res.id;
    store.nickName = res.nickName;
    store.refreshToken = res.refreshToken;
    store.tokenType = res.tokenType;
    store.userName = res.userName;
    console.log("登录成功:", res);
    ElMessage.success("登录成功");

    //await userStore.login(loginFormData.value);
    localStorage.setItem('id', res.accessToken)
    


    // 菜单数据格式转换函数
    function convertMenuData(data: any[]): any[] {
      return data
        .filter((item: any) => item.isVisible)
        .map((item: any) => ({
          path: item.path,
          name: item.name,
          meta: {
            icon: item.icon,
            title: item.name
          },
          actions: item.actions || [], // 加上这一行！
          children: item.children && item.children.length > 0 ? convertMenuData(item.children) : []
        }));
    }
    // 拉取菜单并格式转换
    const menuRes = await MenuAPI.getMenuListByUserId(store.id);
    const menuList = convertMenuData(menuRes);
    menuStore.setMenuList(menuList);
    //await userStore.login(loginFormData.value);

    // 3. 获取用户信息（包含用户角色，用于路由生成）
    //await userStore.getUserInfo();

    // 4. 登录成功后直接跳转到静态页面
    //await router.replace("/static-page");
    await router.replace("/dashboard");
    // 5. 记住我功能已实现，根据用户选择决定token的存储方式:
    // - 选中"记住我": token存储在localStorage中，浏览器关闭后仍然有效
    // - 未选中"记住我": token存储在sessionStorage中，浏览器关闭后失效
  } catch (error) {
    // 6. 统一错误处理
    getCaptcha(); // 刷新验证码
    console.error("登录失败:", error);
  } finally {
    loading.value = false;
  }
}

/**
 * 解析重定向目标
 *
 * @param query 路由查询参数
 * @returns 标准化后的路由地址
 */
// function resolveRedirectTarget(query: LocationQuery): RouteLocationRaw {
//   // 默认跳转路径
//   const defaultPath = "/";

//   // 获取原始重定向路径
//   const rawRedirect = (query.redirect as string) || defaultPath;

//   try {
//     // 6. 使用Vue Router解析路径
//     const resolved = router.resolve(rawRedirect);
//     return {
//       path: resolved.path,
//       query: resolved.query,
//     };
//   } catch {
//     // 7. 异常处理：返回安全路径
//     return { path: defaultPath };
//   }
// }

// 检查输入大小写
function checkCapsLock(event: KeyboardEvent) {
  // 防止浏览器密码自动填充时报错
  if (event instanceof KeyboardEvent) {
    isCapsLock.value = event.getModifierState("CapsLock");
  }
}

const emit = defineEmits(["update:modelValue"]);
function toOtherForm(type: "register" | "resetPwd") {
  emit("update:modelValue", type);
}

// 选择账号后自动填充
function handleSelectUser(user: { label: string; username: string; password: string }) {
  loginFormData.value.username = user.username;
  loginFormData.value.password = user.password;
}
</script>

<style lang="scss" scoped>
.third-party-login {
  .divider-container {
    display: flex;
    align-items: center;
    margin: 20px 0;

    .divider-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(to right, transparent, var(--el-border-color-light), transparent);
    }

    .divider-text {
      padding: 0 16px;
      font-size: 12px;
      color: var(--el-text-color-regular);
      white-space: nowrap;
    }
  }
}
</style>
