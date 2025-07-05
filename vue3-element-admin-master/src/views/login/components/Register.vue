<template>
  <div>
    <h3 text-center m-0 mb-20px>{{ t("login.reg") }}</h3>
    <el-form ref="formRef" :model="model" :rules="rules" size="large">
      <!-- 用户名 -->
      <el-form-item prop="username">
        <el-input v-model.trim="model.username" :placeholder="t('login.username')">
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 密码 -->
      <el-tooltip :visible="isCapsLock" :content="t('login.capsLock')" placement="right">
        <el-form-item prop="password">
          <el-input
            v-model.trim="model.password"
            :placeholder="t('login.password')"
            type="password"
            show-password
            @keyup="checkCapsLock"
            @keyup.enter="submit"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-tooltip>

      <el-tooltip :visible="isCapsLock" :content="t('login.capsLock')" placement="right">
        <el-form-item prop="confirmPassword">
          <el-input
            v-model.trim="model.confirmPassword"
            :placeholder="t('login.message.password.confirm')"
            type="password"
            show-password
            @keyup="checkCapsLock"
            @keyup.enter="submit"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-tooltip>

      <!-- 验证码 -->
      <el-form-item prop="captchaCode">
        <div flex>
          <el-input
            v-model.trim="model.captchaCode"
            :placeholder="t('login.captchaCode')"
            @keyup.enter="submit"
          >
            <template #prefix>
              <div class="i-svg:captcha" />
            </template>
          </el-input>
          <div cursor-pointer h="[40px]" w="[120px]" flex-center ml-10px @click="getCaptcha">
            <el-icon v-if="codeLoading" class="is-loading"><Loading /></el-icon>

            <img
              v-else
              object-cover
              border-rd-4px
              p-1px
              shadow="[0_0_0_1px_var(--el-border-color)_inset]"
              :src="captchaBase64"
              alt="code"
            />
          </div>
        </div>
      </el-form-item>

      <el-form-item>
        <div class="flex-y-center w-full gap-10px">
          <el-checkbox v-model="isRead">{{ t("login.agree") }}</el-checkbox>
          <el-link type="primary" underline="never">{{ t("login.userAgreement") }}</el-link>
        </div>
      </el-form-item>

      <!-- 注册按钮 -->
      <el-form-item>
        <el-button :loading="loading" type="success" class="w-full" @click="submit">
          {{ t("login.register") }}
        </el-button>
      </el-form-item>
    </el-form>
    <div flex-center gap-10px>
      <el-text size="default">{{ t("login.haveAccount") }}</el-text>
      <el-link type="primary" underline="never" @click="toLogin">{{ t("login.login") }}</el-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { FormInstance } from "element-plus";
import { Lock } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import AuthAPI, { type LoginFormData } from "@/api/auth.api";

const { t } = useI18n();

const emit = defineEmits(["update:modelValue"]);
const toLogin = () => emit("update:modelValue", "login");

onMounted(() => getCaptcha());

const formRef = ref<FormInstance>();
const loading = ref(false); // 按钮 loading 状态
const isCapsLock = ref(false); // 是否大写锁定
const captchaBase64 = ref(); // 验证码图片Base64字符串
const isRead = ref(false);

interface Model extends LoginFormData {
  confirmPassword: string;
}

const model = ref<Model>({
  username: "",
  password: "",
  confirmPassword: "",
  captchaKey: "",
  captchaCode: "",
  rememberMe: false,
});

const rules = computed(() => {
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
    confirmPassword: [
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
      {
        validator: (_: any, value: string) => {
          return value === model.value.password;
        },
        trigger: "blur",
        message: t("login.message.password.inconformity"),
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

// 检查输入大小写
function checkCapsLock(event: KeyboardEvent) {
  // 防止浏览器密码自动填充时报错
  if (event instanceof KeyboardEvent) {
    isCapsLock.value = event.getModifierState("CapsLock");
  }
}

const submit = async () => {
  await formRef.value?.validate();
  ElMessage.warning("开发中 ...");
};
</script>
