<template>
    <div>
  <div class="tag-edit-container">
    <el-card class="tag-edit-card" shadow="never">
      <div class="tag-form">
        <!-- 标签名称 -->
        <div class="form-item tag-name-item">
          <div class="condition-item-row">
            <span class="condition-label required-label">标签名称</span>
            <el-input
              v-model="tagForm.name"
              placeholder="不超过20个字符"
              maxlength="20"
              show-word-limit
              class="tag-name-input"
            />
          </div>
        </div>

        <!-- 标签类型 -->
        <div class="form-item">
          <div class="condition-item-row">
            <span class="condition-label required-label">标签类型</span>
            <div class="radio-group-container">
              <el-radio v-model="tagForm.type" label="manual">手动标签</el-radio>
              <el-radio v-model="tagForm.type" label="condition">条件标签</el-radio>
            </div>
          </div>
        </div>

        <!-- 条件设置 (仅当选择条件标签时显示) -->
        <div v-if="tagForm.type === 'condition'" class="condition-section">
          <div class="section-title">条件设置</div>

          <!-- 条件关系 -->
          <div class="form-item">
            <div class="condition-item-row">
              <span class="condition-label">条件关系</span>
              <el-radio v-model="tagForm.conditionRelation" label="all" class="condition-radio">
                必须满足条件
              </el-radio>
            </div>
          </div>

          <!-- 时间条件 -->
          <div class="form-item">
            <div class="condition-item-row">
              <span class="condition-label">时间条件</span>
              <div class="condition-content">
                <el-checkbox v-model="tagForm.timeCondition.enabled">开卡时间</el-checkbox>
                <el-select
                  v-model="tagForm.timeCondition.value"
                  placeholder="请选择开卡的时间"
                  class="condition-select"
                  :disabled="!tagForm.timeCondition.enabled"
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
                <el-checkbox v-model="tagForm.tradeTimeCondition.enabled">交易时间</el-checkbox>
                <el-select
                  v-model="tagForm.tradeTimeCondition.value"
                  placeholder="请选择交易时间"
                  class="condition-select"
                  :disabled="!tagForm.tradeTimeCondition.enabled"
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
                <el-checkbox v-model="tagForm.memberLevelCondition.enabled">会员等级</el-checkbox>
                <el-select
                  v-model="tagForm.memberLevelCondition.value"
                  placeholder="请选择会员等级"
                  class="condition-select"
                  :disabled="!tagForm.memberLevelCondition.enabled"
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
                <el-checkbox v-model="tagForm.genderCondition.enabled">会员性别</el-checkbox>
                <el-select
                  v-model="tagForm.genderCondition.value"
                  placeholder="请选择性别"
                  class="condition-select"
                  :disabled="!tagForm.genderCondition.enabled"
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
              <el-checkbox v-model="tagForm.tradeCountCondition.enabled">交易笔数</el-checkbox>
              <div class="range-input">
                <el-input
                  v-model="tagForm.tradeCountCondition.min"
                  placeholder="笔"
                  class="range-input-field"
                  :disabled="!tagForm.tradeCountCondition.enabled"
                />
                <span class="range-separator">-</span>
                <el-input
                  v-model="tagForm.tradeCountCondition.max"
                  placeholder="笔"
                  class="range-input-field"
                  :disabled="!tagForm.tradeCountCondition.enabled"
                />
                <span class="hint-text">请填写0~12亿的整数</span>
              </div>
            </div>
          </div>

          <!-- 客单价 -->
          <div class="form-item condition-item">
            <span class="condition-label"></span>
            <div class="condition-content">
              <el-checkbox v-model="tagForm.avgPriceCondition.enabled">客单价</el-checkbox>
              <div class="range-input">
                <el-input
                  v-model="tagForm.avgPriceCondition.min"
                  placeholder="元"
                  class="range-input-field"
                  :disabled="!tagForm.avgPriceCondition.enabled"
                />
                <span class="range-separator">-</span>
                <el-input
                  v-model="tagForm.avgPriceCondition.max"
                  placeholder="元"
                  class="range-input-field"
                  :disabled="!tagForm.avgPriceCondition.enabled"
                />
                <span class="hint-text">请填写0~99万的小数</span>
              </div>
            </div>
          </div>

          <!-- 累计消费 -->
          <div class="form-item condition-item">
            <span class="condition-label"></span>
            <div class="condition-content">
              <el-checkbox v-model="tagForm.totalSpendCondition.enabled">累计消费</el-checkbox>
              <div class="range-input">
                <el-input
                  v-model="tagForm.totalSpendCondition.min"
                  placeholder="元"
                  class="range-input-field"
                  :disabled="!tagForm.totalSpendCondition.enabled"
                />
                <span class="range-separator">-</span>
                <el-input
                  v-model="tagForm.totalSpendCondition.max"
                  placeholder="元"
                  class="range-input-field"
                  :disabled="!tagForm.totalSpendCondition.enabled"
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
      <el-button type="primary" @click="saveTag">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>

  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { createTag } from "@/api/system/customer.api";

const router = useRouter();
const route = useRoute();

const tagForm = reactive({
  name: "",
  type: "manual", // 默认手动标签
  conditionRelation: "all",
  timeCondition: {
    enabled: false,
    value: "",
  },
  tradeTimeCondition: {
    enabled: false,
    value: "",
  },
  memberLevelCondition: {
    enabled: false,
    value: "",
  },
  genderCondition: {
    enabled: false,
    value: "",
  },
  tradeCountCondition: {
    enabled: false,
    min: "",
    max: "",
  },
  avgPriceCondition: {
    enabled: false,
    min: "",
    max: "",
  },
  totalSpendCondition: {
    enabled: false,
    min: "",
    max: "",
  },
});

// 自动选中“条件标签”
if (route.query.type === "1") {
  tagForm.type = "condition";
}

const saveTag = async () => {
  if (!tagForm.name) {
    ElMessage.error("请输入标签名称");
    return;
  }

  try {
    // 构建API所需的请求数据
    const requestData = {
      labelName: tagForm.name,
      tagType: tagForm.type === "manual" ? 0 : 1,
      mustMeetAllConditions: tagForm.conditionRelation === "all",
      startTime: tagForm.timeCondition.enabled ? tagForm.timeCondition.value : "",
      tradeTime: tagForm.tradeTimeCondition.enabled ? tagForm.tradeTimeCondition.value : "",
      memberLevel: tagForm.memberLevelCondition.enabled ? tagForm.memberLevelCondition.value : "",
      memberGender: tagForm.genderCondition.enabled
        ? Number(tagForm.genderCondition.value)
        : undefined,
      tradeCountMin: tagForm.tradeCountCondition.enabled
        ? Number(tagForm.tradeCountCondition.min) || 0
        : undefined,
      tradeCountMax: tagForm.tradeCountCondition.enabled
        ? Number(tagForm.tradeCountCondition.max) || 0
        : undefined,
      avgOrderValueMin: tagForm.avgPriceCondition.enabled
        ? Number(tagForm.avgPriceCondition.min) || 0
        : undefined,
      avgOrderValueMax: tagForm.avgPriceCondition.enabled
        ? Number(tagForm.avgPriceCondition.max) || 0
        : undefined,
      totalSpentMin: tagForm.totalSpendCondition.enabled
        ? Number(tagForm.totalSpendCondition.min) || 0
        : undefined,
      totalSpentMax: tagForm.totalSpendCondition.enabled
        ? Number(tagForm.totalSpendCondition.max) || 0
        : undefined,
    };

    await createTag(requestData);
    ElMessage.success("标签保存成功");
    router.push("/customers/tags-management");
  } catch (error) {
    console.error("保存标签失败", error);
    ElMessage.error("标签保存失败，请重试");
  }
};

const cancel = () => {
  router.push("/customers/tags-management");
};
</script>

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
</style>
