<template>
  <div>
    <div class="tag-edit-container">
      <el-card class="tag-edit-card" shadow="never">
        <div class="tag-header">
          <h2>{{ isViewMode ? "标签详情" : isEditMode ? "编辑标签" : "新增标签" }}</h2>
        </div>
        <div class="tag-form">
          <!-- 标签名称 -->
          <div class="form-item tag-name-item">
            <div class="condition-item-row">
              <span class="condition-label required-label">标签名称</span>
              <el-input
                v-model="tagForm.labelName"
                placeholder="不超过20个字符"
                maxlength="20"
                show-word-limit
                class="tag-name-input"
                :disabled="isViewMode"
              />
            </div>
          </div>

          <!-- 标签类型 -->
          <div class="form-item">
            <div class="condition-item-row">
              <span class="condition-label required-label">标签类型</span>
              <div class="radio-group-container">
                <el-radio
                  v-model="tagForm.tagType"
                  :label="0"
                  :disabled="isViewMode"
                  class="blue-radio"
                >
                  手动标签
                </el-radio>
                <el-radio v-model="tagForm.tagType" :label="1" :disabled="isViewMode">
                  条件标签
                </el-radio>
              </div>
            </div>
          </div>

          <!-- 条件设置 (仅当选择条件标签时显示) -->
          <div v-if="tagForm.tagType === 1" class="condition-section">
            <div class="section-title">条件设置</div>

            <!-- 条件关系 -->
            <div class="form-item">
              <div class="condition-item-row">
                <span class="condition-label">条件关系</span>
                <el-radio
                  v-model="tagForm.mustMeetAllConditions"
                  :label="true"
                  class="condition-radio"
                  :disabled="isViewMode"
                >
                  必须满足条件
                </el-radio>
              </div>
            </div>

            <!-- 时间条件 -->
            <div class="form-item">
              <div class="condition-item-row">
                <span class="condition-label">时间条件</span>
                <div class="condition-content">
                  <el-checkbox v-model="timeConditionEnabled" :disabled="isViewMode">
                    开卡时间
                  </el-checkbox>
                  <el-select
                    v-model="tagForm.startTime"
                    placeholder="请选择开卡的时间"
                    class="condition-select"
                    :disabled="!timeConditionEnabled || isViewMode"
                  >
                    <el-option label="请选择开卡的时间" value="" disabled />
                    <el-option label="今天开卡的会员" value="today" />
                    <el-option label="最近7天开卡的会员" value="last7days" />
                    <el-option label="最近30天开卡的会员" value="last30days" />
                  </el-select>
                </div>
              </div>
            </div>

            <!-- 交易时间 -->
            <div class="form-item">
              <div class="condition-item-row">
                <span class="condition-label"></span>
                <div class="condition-content">
                  <el-checkbox v-model="tradeTimeEnabled" :disabled="isViewMode">
                    交易时间
                  </el-checkbox>
                  <el-select
                    v-model="tagForm.tradeTime"
                    placeholder="请选择交易时间"
                    class="condition-select"
                    :disabled="!tradeTimeEnabled || isViewMode"
                  >
                    <el-option label="请选择交易时间" value="" disabled />
                    <el-option label="今天交易的会员" value="today" />
                    <el-option label="最近7天交易的会员" value="last7days" />
                    <el-option label="最近30天交易的会员" value="last30days" />
                  </el-select>
                </div>
              </div>
            </div>

            <!-- 会员条件 -->
            <div class="form-item">
              <div class="condition-item-row">
                <span class="condition-label">会员条件</span>
                <div class="condition-content">
                  <el-checkbox v-model="memberLevelEnabled" :disabled="isViewMode">
                    会员等级
                  </el-checkbox>
                  <el-select
                    v-model="tagForm.memberLevel"
                    placeholder="请选择会员等级"
                    class="condition-select"
                    :disabled="!memberLevelEnabled || isViewMode"
                  >
                    <el-option label="请选择会员等级" value="" disabled />
                    <el-option label="普通会员" value="normal" />
                    <el-option label="超级会员" value="super" />
                  </el-select>
                </div>
              </div>
            </div>

            <!-- 会员性别 -->
            <div class="form-item">
              <div class="condition-item-row">
                <span class="condition-label"></span>
                <div class="condition-content">
                  <el-checkbox v-model="genderEnabled" :disabled="isViewMode">会员性别</el-checkbox>
                  <el-select
                    v-model="tagForm.memberGender"
                    placeholder="请选择性别"
                    class="condition-select"
                    :disabled="!genderEnabled || isViewMode"
                  >
                    <el-option label="请选择性别" value="" disabled />
                    <el-option label="男" :value="0" />
                    <el-option label="女" :value="1" />
                  </el-select>
                </div>
              </div>
            </div>

            <!-- 交易条件 -->
            <div class="form-item condition-item">
              <span class="condition-label">交易条件</span>
              <div class="condition-content">
                <el-checkbox v-model="tradeCountEnabled" :disabled="isViewMode">
                  交易笔数
                </el-checkbox>
                <div class="range-input">
                  <el-input
                    v-model="tagForm.tradeCountMin"
                    placeholder="笔"
                    class="range-input-field"
                    :disabled="!tradeCountEnabled || isViewMode"
                  />
                  <span class="range-separator">-</span>
                  <el-input
                    v-model="tagForm.tradeCountMax"
                    placeholder="笔"
                    class="range-input-field"
                    :disabled="!tradeCountEnabled || isViewMode"
                  />
                  <span class="hint-text">请填写0~12亿的整数</span>
                </div>
              </div>
            </div>

            <!-- 客单价 -->
            <div class="form-item condition-item">
              <span class="condition-label"></span>
              <div class="condition-content">
                <el-checkbox v-model="avgOrderValueEnabled" :disabled="isViewMode">
                  客单价
                </el-checkbox>
                <div class="range-input">
                  <el-input
                    v-model="tagForm.avgOrderValueMin"
                    placeholder="元"
                    class="range-input-field"
                    :disabled="!avgOrderValueEnabled || isViewMode"
                  />
                  <span class="range-separator">-</span>
                  <el-input
                    v-model="tagForm.avgOrderValueMax"
                    placeholder="元"
                    class="range-input-field"
                    :disabled="!avgOrderValueEnabled || isViewMode"
                  />
                  <span class="hint-text">请填写0~99万的小数</span>
                </div>
              </div>
            </div>

            <!-- 累计消费 -->
            <div class="form-item condition-item">
              <span class="condition-label"></span>
              <div class="condition-content">
                <el-checkbox v-model="totalSpentEnabled" :disabled="isViewMode">
                  累计消费
                </el-checkbox>
                <div class="range-input">
                  <el-input
                    v-model="tagForm.totalSpentMin"
                    placeholder="元"
                    class="range-input-field"
                    :disabled="!totalSpentEnabled || isViewMode"
                  />
                  <span class="range-separator">-</span>
                  <el-input
                    v-model="tagForm.totalSpentMax"
                    placeholder="元"
                    class="range-input-field"
                    :disabled="!totalSpentEnabled || isViewMode"
                  />
                  <span class="hint-text">请填写0~99万的小数</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 按钮区 -->
      <div class="form-actions">
        <template v-if="isViewMode">
          <el-button @click="cancel">返回</el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="saveTag">{{ isEditMode ? "修改" : "新增" }}</el-button>
          <el-button @click="cancel">取消</el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch } from "vue";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { createTag, updateTag, getTagById } from "@/api/system/customer.api";

const router = useRouter();
const route = useRoute();
// 标签表单
const tagForm = reactive({
  id: "",
  labelName: "",
  tagType: 0, // 0: 手动标签, 1: 条件标签
  mustMeetAllConditions: true,
  startTime: "",
  tradeTime: "",
  memberLevel: "",
  memberGender: "",
  tradeCountMin: "",
  tradeCountMax: "",
  avgOrderValueMin: "",
  avgOrderValueMax: "",
  totalSpentMin: "",
  totalSpentMax: "",
});

// 页面模式：编辑或查看
const isEditMode = ref(false);
const isViewMode = ref(false);
const tagId = ref("");

// 条件启用状态
const timeConditionEnabled = ref(false);
const tradeTimeEnabled = ref(false);
const memberLevelEnabled = ref(false);
const genderEnabled = ref(false);
const tradeCountEnabled = ref(false);
const avgOrderValueEnabled = ref(false);
const totalSpentEnabled = ref(false);

// 监听条件启用状态变化
watch(timeConditionEnabled, (val) => {
  if (!val) tagForm.startTime = "";
});

watch(tradeTimeEnabled, (val) => {
  if (!val) tagForm.tradeTime = "";
});

watch(memberLevelEnabled, (val) => {
  if (!val) tagForm.memberLevel = "";
});

watch(genderEnabled, (val) => {
  if (!val) tagForm.memberGender = "";
});

watch(tradeCountEnabled, (val) => {
  if (!val) {
    tagForm.tradeCountMin = "";
    tagForm.tradeCountMax = "";
  }
});

watch(avgOrderValueEnabled, (val) => {
  if (!val) {
    tagForm.avgOrderValueMin = "";
    tagForm.avgOrderValueMax = "";
  }
});

watch(totalSpentEnabled, (val) => {
  if (!val) {
    tagForm.totalSpentMin = "";
    tagForm.totalSpentMax = "";
  }
});

// 根据表单值更新条件启用状态
const updateConditionStatus = () => {
  timeConditionEnabled.value = !!tagForm.startTime;
  tradeTimeEnabled.value = !!tagForm.tradeTime;
  memberLevelEnabled.value = !!tagForm.memberLevel;
  genderEnabled.value = tagForm.memberGender !== "" && tagForm.memberGender !== undefined;
  tradeCountEnabled.value = !!tagForm.tradeCountMin || !!tagForm.tradeCountMax;
  avgOrderValueEnabled.value = !!tagForm.avgOrderValueMin || !!tagForm.avgOrderValueMax;
  totalSpentEnabled.value = !!tagForm.totalSpentMin || !!tagForm.totalSpentMax;
};

// 获取标签详情
const fetchTagDetail = async (id: string) => {
  try {
    const response = await getTagById(id);
    console.log("标签详情接口返回：", response);

    // 处理嵌套的数据结构
    const tagData = response?.data || response;
    if (tagData) {
      console.log("标签数据：", tagData);

      // 基础信息
      tagForm.id = tagData.id;
      tagForm.labelName = tagData.labelName;
      tagForm.tagType = Number(tagData.tagType);
      tagForm.mustMeetAllConditions = tagData.mustMeetAllConditions;

      // 条件
      tagForm.startTime = tagData.startTime || "";
      tagForm.tradeTime = tagData.tradeTime || "";
      tagForm.memberLevel = tagData.memberLevel || "";
      tagForm.memberGender = tagData.memberGender;

      // 数值范围
      tagForm.tradeCountMin = tagData.tradeCountMin?.toString() || "";
      tagForm.tradeCountMax = tagData.tradeCountMax?.toString() || "";
      tagForm.avgOrderValueMin = tagData.avgOrderValueMin?.toString() || "";
      tagForm.avgOrderValueMax = tagData.avgOrderValueMax?.toString() || "";
      tagForm.totalSpentMin = tagData.totalSpentMin?.toString() || "";
      tagForm.totalSpentMax = tagData.totalSpentMax?.toString() || "";

      // 更新条件启用状态
      updateConditionStatus();
      console.log("表单数据：", tagForm);
    }
  } catch (error) {
    console.error("获取标签详情失败", error);
    ElMessage.error("获取标签详情失败");
  }
};

// 保存标签
const saveTag = async () => {
  if (!tagForm.labelName) {
    ElMessage.error("请输入标签名称");
    return;
  }

  try {
    // 构建API所需的请求数据
    const requestData = {
      id: isEditMode.value ? tagForm.id : undefined,
      labelName: tagForm.labelName,
      tagType: Number(tagForm.tagType),
      mustMeetAllConditions: Boolean(tagForm.mustMeetAllConditions),
      startTime: timeConditionEnabled.value ? tagForm.startTime : undefined,
      tradeTime: tradeTimeEnabled.value ? tagForm.tradeTime : undefined,
      memberLevel: memberLevelEnabled.value ? tagForm.memberLevel : undefined,
      memberGender: genderEnabled.value ? Number(tagForm.memberGender) : undefined,
      tradeCountMin: tradeCountEnabled.value
        ? Number(tagForm.tradeCountMin) || undefined
        : undefined,
      tradeCountMax: tradeCountEnabled.value
        ? Number(tagForm.tradeCountMax) || undefined
        : undefined,
      avgOrderValueMin: avgOrderValueEnabled.value
        ? Number(tagForm.avgOrderValueMin) || undefined
        : undefined,
      avgOrderValueMax: avgOrderValueEnabled.value
        ? Number(tagForm.avgOrderValueMax) || undefined
        : undefined,
      totalSpentMin: totalSpentEnabled.value
        ? Number(tagForm.totalSpentMin) || undefined
        : undefined,
      totalSpentMax: totalSpentEnabled.value
        ? Number(tagForm.totalSpentMax) || undefined
        : undefined,
    } as Record<string, any>;

    // 移除所有undefined的字段
    Object.keys(requestData).forEach((key) => {
      if (requestData[key] === undefined) {
        delete requestData[key];
      }
    });

    console.log("更新标签数据：", requestData);

    if (isEditMode.value) {
      // 编辑模式
      await updateTag(requestData);
      ElMessage.success("标签更新成功");
    } else {
      // 新增模式
      await createTag(requestData);
      ElMessage.success("标签创建成功");
    }
    router.push("/customers/tags-management");
  } catch (error) {
    console.error("保存标签失败", error);
    ElMessage.error("标签保存失败，请重试");
  }
};

const cancel = () => {
  router.push("/customers/tags-management");
};

const initialize = () => {
  // 检查路由名称决定页面模式
  isViewMode.value = route.name === "CustomerTagDetail";

  // 检查是否是编辑模式
  if (route.query.id) {
    isEditMode.value = !isViewMode.value;
    tagId.value = route.query.id as string;
    fetchTagDetail(tagId.value);
  } else {
    // 非编辑模式（新增），重置表单
    isEditMode.value = false;
    tagId.value = "";
    Object.assign(tagForm, {
      id: "",
      labelName: "",
      tagType: 0,
      mustMeetAllConditions: true,
      startTime: "",
      tradeTime: "",
      memberLevel: "",
      memberGender: "",
      tradeCountMin: "",
      tradeCountMax: "",
      avgOrderValueMin: "",
      avgOrderValueMax: "",
      totalSpentMin: "",
      totalSpentMax: "",
    });
    updateConditionStatus();
  }

  // 自动选中"条件标签" - 仅在新增时
  if (route.query.type === "1" && !isEditMode.value && !isViewMode.value) {
    tagForm.tagType = 1;
  }
};

onMounted(() => {
  initialize();
});

// 监听路由变化，以便在组件复用时也能正确更新
watch(
  () => route.fullPath,
  () => {
    initialize();
  }
);
</script>

<style>
/* 全局样式，确保能覆盖 Element Plus 的样式 */
.blue-radio.el-radio.is-checked .el-radio__label {
  color: #409eff !important;
}

.blue-radio.el-radio.is-checked .el-radio__inner {
  background-color: #409eff !important;
  border-color: #409eff !important;
}

.blue-radio.el-radio:hover:not(.is-disabled) .el-radio__inner {
  border-color: #409eff;
}
</style>

<style scoped>
.tag-edit-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 100px);
}

.tag-edit-card {
  background: #f5f7fa;
  border-radius: 12px;
  border: none;
  padding: 20px;
  margin-bottom: 20px;
  flex: 1;
}

.tag-header {
  text-align: center;
  margin-bottom: 20px;
}

.tag-header h2 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
}

.tag-form {
  max-width: 900px;
  margin: 0 auto;
}

.form-item {
  margin-bottom: 15px;
}

.tag-name-item {
  max-width: 600px;
}

.tag-name-input {
  width: 500px;
}

.condition-label.required-label {
  position: relative;
}

.condition-label.required-label::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}

.radio-group-container {
  display: flex;
  align-items: center;
}

:deep(.el-radio) {
  margin-right: 30px;
  height: 45px;
  line-height: 45px;

  &.is-checked {
    .el-radio__label {
      color: var(--el-color-primary);
    }
  }
}

/* 手动标签的蓝色样式 */
:deep(.manual-tag-radio.el-radio) {
  &.is-checked {
    .el-radio__label {
      color: #409eff;
    }
    .el-radio__inner {
      border-color: #409eff;
      background: #409eff;
    }
  }
}

.label-row {
  display: none;
}

.hint-text {
  font-size: 14px;
  color: #909399;
  margin-left: 8px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin: 24px 0;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 12px;
}

.condition-section {
  margin-top: 24px;
}

.condition-item {
  display: flex;
  margin-bottom: 20px;
}

.condition-item-row {
  display: flex;
  align-items: center;
}

.condition-label {
  width: 100px;
  text-align: right;
  margin-right: 20px;
  font-size: 14px;
  color: #606266;
  flex-shrink: 0;
}

.condition-content {
  display: flex;
  align-items: center;
}

.condition-radio {
  margin-right: 0;
  height: 45px;
  line-height: 45px;
}

.condition-select {
  margin-left: 20px;
  width: 300px;
}

.range-input {
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.range-input-field {
  width: 120px;
}

.range-separator {
  margin: 0 10px;
}

.form-actions {
  display: flex;
  justify-content: center;
  padding: 24px 0;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
}

:deep(.el-input__wrapper) {
  background-color: #fff;
  min-height: 45px;
  padding: 0 15px;
}

:deep(.el-input__inner) {
  height: 45px;
  line-height: 45px;
  font-size: 16px;
}

:deep(.el-checkbox) {
  height: 45px;
  line-height: 45px;
}

:deep(.el-select) {
  width: 300px;
}

:deep(.el-select-dropdown__item) {
  height: 45px;
  line-height: 45px;
  font-size: 16px;
  padding: 0 20px;
}

:deep(.el-select .el-input__wrapper) {
  height: 45px !important;
  line-height: 45px !important;
}

:deep(.el-select .el-input__inner) {
  height: 45px;
  line-height: 45px;
}

:deep(.el-button) {
  padding: 12px 24px;
  font-size: 16px;
  height: 45px;
  min-width: 100px;
}

.radio-group-container :deep(.el-radio.is-checked) {
  --el-radio-text-color: #409eff;
  --el-radio-checked-text-color: #409eff;
  --el-radio-checked-bg-color: #409eff;
  --el-radio-checked-border-color: #409eff;
}

/* 确保手动标签选中时显示蓝色 */
.radio-group-container :deep(.el-radio:first-child.is-checked) {
  .el-radio__label {
    color: #409eff !important;
  }
  .el-radio__inner {
    border-color: #409eff !important;
    background: #409eff !important;
  }
}
</style>
