<template>
  <div>
    <el-card>
      <div class="header-row">
        <el-avatar :size="100" :src="customer.avatar || defaultAvatar" class="avatar" />
      <div class="header-info">
        <div class="info-row">
          <div class="header-top">
            <div class="header-item">
              <div>微信昵称：{{ customer.customerNickName || "--" }}</div>
              <div>卡号：{{ customer.id || "--" }}</div>
            </div>
            <div class="header-item">
              <div>等级：{{ customer.customerTypeName || "--" }}</div>
              <div>
                成为会员时间：{{ customer.birthday ? customer.birthday.slice(0, 10) : "--" }}
              </div>
            </div>
            <div class="header-item">
              <div>会员状态：{{ customer.status === false ? "冻结" : "正常" }}</div>
              <div>成长值：{{ customer.growthValue || 0 }}</div>
            </div>
          </div>
        </div>
        <div class="header-bottom">
          <div class="balance-info">
            <div>剩余积分：{{ Math.floor(Number(customer.availablePoints || 0)) }}</div>
            <div>可用余额：{{ Math.floor(Number(customer.availableBalance || 0)) }}</div>
          </div>
        </div>
        <div class="action-row">
          <el-button
            size="small"
            :disabled="customer.status === false"
            :title="customer.status === false ? '会员已冻结' : ''"
            @click="openGivePointsDialog"
          >
            送积分
          </el-button>
          <el-button
            size="small"
            :disabled="customer.status === false"
            :title="customer.status === false ? '会员已冻结' : ''"
            @click="openEditLevelDialog"
          >
            修改等级
          </el-button>
          <el-button
            size="small"
            :disabled="customer.status === false"
            :title="customer.status === false ? '会员已冻结' : ''"
            @click="openRechargeDialog"
          >
            充值
          </el-button>
          <el-button
            size="small"
            :disabled="customer.status === false"
            :title="customer.status === false ? '会员已冻结' : ''"
            @click="openConsumeDialog"
          >
            消费
          </el-button>
          <el-button
            size="small"
            :disabled="customer.status === false"
            :title="customer.status === false ? '会员已冻结' : ''"
          >
            修改余额
          </el-button>
        </div>
      </div>
    </div>
    <el-divider />

    <!-- 个人信息部分，类似截图中的布局 -->
    <div class="info-section">
      <h3 class="info-title">个人信息</h3>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">姓名：</span>
          <span class="info-value">{{ customer.customerName || "--" }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">手机号：</span>
          <span class="info-value">{{ customer.phoneNumber || "--" }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">性别：</span>
          <span class="info-value">
            {{
              customer.gender === 0
                ? "未知"
                : customer.gender === 1
                  ? "男"
                  : customer.gender === 2
                    ? "女"
                    : "--"
            }}
          </span>
        </div>
        <div class="info-item">
          <span class="info-label">生日：</span>
          <span class="info-value">
            {{ customer.birthday ? (customer.birthday + "").slice(0, 10) : "--" }}
          </span>
        </div>
        <div class="info-item address-item">
          <span class="info-label">详细地址：</span>
          <span class="info-value">{{ customer.address || "--" }}</span>
        </div>
      </div>
    </div>

    <el-divider />
    <div class="info-blocks">
      <div>
        <h4>消费信息</h4>
        <div>消费次数：{{ customer.comsumerNumber || 0 }}</div>
        <div>累计消费金额：{{ Math.floor(Number(customer.accumulativeconsumption || 0)) }}</div>
        <div>
          平均消费金额：{{
            customer.comsumerNumber
              ? Math.floor(
                  Number(customer.accumulativeconsumption) / Number(customer.comsumerNumber)
                )
              : 0
          }}
        </div>
        <!--  <div>上次消费时间：{{ customer.lastConsumerTime || '--' }}</div> -->
      </div>
      <div>
        <h4>储值账户</h4>
        <div>账户余额：￥{{ Math.floor(Number(customer.availableBalance || 0)) }}</div>
        <div>累计充值次数：{{ customer.comsumerNumber || 0 }}</div>
        <div>累计充值金额：￥{{ Math.floor(Number(customer.accumulativeconsumption || 0)) }}</div>
      </div>
      <div>
        <h4>积分</h4>
        <div>剩余积分：{{ Math.floor(Number(customer.availablePoints || 0)) }}</div>
        <div>累计积分：{{ Math.floor(Number(customer.accumulativeintegral || 0)) }}</div>
      </div>
    </div>
  </el-card>

  <!-- 送积分弹窗 -->
  <el-dialog
    v-model="showGivePointsDialog"
    title="手动修改积分"
    width="700px"
    :close-on-click-modal="false"
    align-center
  >
    <div style="margin-bottom: 16px">
      <div style="padding-left: 65px; font-size: 14px; color: #606266; margin-bottom: 8px">
        客户信息： 客户：{{ givePointsForm.customerName }}，等级：{{ givePointsForm.level }}
      </div>

      <div
        style="
          padding-left: 140px;
          font-size: 12px;
          color: #606266;
          line-height: 22px;
          margin-top: 4px;
        "
      >
        余额：{{ Math.floor(Number(givePointsForm.balance || 0)) }}，积分：{{
          Math.floor(Number(givePointsForm.availablePoints || 0))
        }}
      </div>
    </div>
    <el-form :model="givePointsForm" label-width="140px">
      <!-- 调整 label-width -->
      <el-form-item label="修改积分(增减)" required>
        <!-- 确保 required 存在以显示红星 -->
        <el-input
          v-model="givePointsForm.accumulativeintegral"
          type="number"
          style="width: 200px"
        />
      </el-form-item>
      <div style="color: #909399; margin-bottom: 12px; padding-left: 160px">
        <!-- 调整 margin-left -->
        可用积分{{ givePointsForm.availablePoints }},输入500，表示增加500，输入-500，表示减少500
      </div>
      <el-form-item label="操作员">
        <span>{{ givePointsForm.operator }}</span>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          v-model="givePointsForm.pointsmodifydesc"
          type="textarea"
          maxlength="100"
          show-word-limit
          style="width: 200px"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showGivePointsDialog = false">取消</el-button>
      <el-button type="primary" :loading="givePointsLoading" @click="handleGivePoints">
        确定
      </el-button>
    </template>
  </el-dialog>

  <!-- 修改等级弹窗 -->
  <el-dialog
    v-model="showEditLevelDialog"
    title="会员等级"
    width="600px"
    :close-on-click-modal="false"
    :show-close="true"
    align-center
  >
    <el-form
      ref="editLevelFormRef"
      :model="editLevelForm"
      :rules="editLevelRules"
      label-width="160px"
      style="margin: 40px 0 20px 0; display: flex; flex-direction: column; align-items: center"
    >
      <el-form-item
        label="请选择会员等级："
        prop="customerType"
        required
        style="width: 100%; justify-content: center"
      >
        <el-select
          v-model="editLevelForm.customerType"
          placeholder="请选择"
          style="width: 300px"
          filterable
          clearable
        >
          <el-option
            v-for="item in customerTypeOptions"
            :key="item.id"
            :label="item.customerTypeName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer center-footer">
        <el-button @click="showEditLevelDialog = false">取消</el-button>
        <el-button type="primary" @click="submitEditLevel()">确定</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 充值弹窗 -->
  <el-dialog
    v-model="showRechargeDialog"
    title="充值"
    width="750px"
    :close-on-click-modal="false"
    align-center
  >
    <div class="simple-form-item">
      <div class="simple-form-label">客户信息：</div>
      <div class="simple-form-content customer-info">{{ rechargeForm.customerName }}</div>
    </div>

    <div class="simple-form-item">
      <div class="simple-form-label required">充值金额：</div>
      <div class="simple-form-content">
        <div class="input-wrapper">
          <el-input v-model="rechargeForm.amount" placeholder="0" class="amount-input">
            <template #suffix>元</template>
          </el-input>
          <div v-show="invalidRechargeAmount" class="validation-message">
            请输入0.01-950000之间的数，最多两位小数
          </div>
        </div>
      </div>
    </div>

    <div class="simple-form-item">
      <div class="simple-form-label">备注：</div>
      <div class="simple-form-content">
        <el-input
          v-model="rechargeForm.remark"
          type="textarea"
          :maxlength="30"
          show-word-limit
          placeholder="最多30个字"
          class="remark-textarea"
        />
      </div>
    </div>

    <div class="simple-form-item">
      <div class="simple-form-label">操作员：</div>
      <div class="simple-form-content operator-info">{{ rechargeForm.operatorId }}</div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showRechargeDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitRecharge">确 定</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 消费弹窗 -->
  <el-dialog
    v-model="showConsumeDialog"
    title="客户消费"
    width="750px"
    :close-on-click-modal="false"
    align-center
  >
    <div class="simple-form-item">
      <div class="simple-form-label">客户信息：</div>
      <div class="simple-form-content customer-info">
        {{ consumeForm.customerName }}
        <span class="balance-info">
          （可用实充金额{{
            Math.floor(Number(consumeForm.availableBalance || 0))
          }}
          元，可用赠送余额{{ Math.floor(Number(consumeForm.giftBalance || 0)) }}
          元）
        </span>
      </div>
    </div>
    <div class="simple-form-item">
      <div class="simple-form-label required">消费金额：</div>
      <div class="simple-form-content">
        <div class="input-wrapper">
          <el-input v-model="consumeForm.sumofconsume" placeholder="0" class="amount-input">
            <template #suffix>元</template>
          </el-input>
          <div v-show="invalidAmount" class="validation-message">
            请输入0.01-950000之间的数，最多两位小数
          </div>
          <div v-show="insufficientBalance" class="insufficient-balance">会员余额不足</div>
        </div>
      </div>
    </div>
    <div class="simple-form-item">
      <div class="simple-form-label">备注：</div>
      <div class="simple-form-content">
        <el-input
          v-model="consumeForm.consumerDesc"
          type="textarea"
          :maxlength="30"
          show-word-limit
          placeholder="最多30个字"
          class="remark-textarea"
        />
      </div>
    </div>
    <div class="simple-form-item">
      <div class="simple-form-label">操作员：</div>
      <div class="simple-form-content operator-info">
        {{ consumeForm.operatorId || "17376144917" }}
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showConsumeDialog = false">取消</el-button>
        <el-button type="primary" @click="submitConsume">确定</el-button>
      </div>
    </template>
  </el-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import {
  getCustomerDetailById,
  giveCustomerPoints,
  updateCustomerLevel,
  rechargeCustomerBalance,
  customerConsume,
  getCustomerTypeList,
} from "@/api/system/customer.api";

const route = useRoute();
const customer = ref<any>({});
const defaultAvatar = "/default-avatar.png"; // 可替换为你的默认头像

// 客户类型选项
const customerTypeOptions = ref<any[]>([]);

// 对话框显示状态
const showGivePointsDialog = ref(false);
const showEditLevelDialog = ref(false);
const showRechargeDialog = ref(false);
const showConsumeDialog = ref(false);

// 各种表单数据
const givePointsForm = ref({
  id: "",
  customerName: "",
  level: "",
  balance: 0,
  availablePoints: 0,
  accumulativeintegral: 0,
  operator: "管理员",
  pointsmodifydesc: "",
});

const editLevelFormRef = ref();
const editLevelForm = ref({ customerType: "" });
const editLevelRules = {
  customerType: [{ required: true, message: "请选择会员等级", trigger: "change" }],
};

const rechargeForm = ref({
  customerId: "",
  customerName: "",
  amount: "",
  remark: "",
  operatorId: "17376144917", // 统一改为与列表页相同的操作员
  balance: 0, // 添加余额属性
});

// 监听充值金额变化，检查金额是否有效
watch(
  () => rechargeForm.value.amount,
  (newValue) => {
    if (showRechargeDialog.value) {
      const amount = parseFloat(newValue || "0");
      invalidRechargeAmount.value = !!(
        newValue &&
        (isNaN(amount) || amount < 0.01 || amount > 950000 || !/^\d+(\.\d{1,2})?$/.test(newValue))
      );
    }
  }
);

const consumeForm = ref({
  customerId: "",
  customerName: "",
  sumofconsume: "",
  consumerDesc: "",
  availableBalance: undefined,
  giftBalance: undefined,
  operatorId: "17376144917",
});

// 监听消费金额变化，检查余额是否足够和金额是否有效
watch(
  () => consumeForm.value.sumofconsume,
  (newValue) => {
    if (showConsumeDialog.value) {
      const amount = parseFloat(newValue || "0");
      const availableBalance = parseFloat(consumeForm.value.availableBalance || "0");
      const giftBalance = parseFloat(consumeForm.value.giftBalance || "0");
      invalidAmount.value = !!(
        newValue &&
        (isNaN(amount) || amount < 0.01 || amount > 950000 || !/^\d+(\.\d{1,2})?$/.test(newValue))
      );
      if (!invalidAmount.value) {
        insufficientBalance.value =
          !isNaN(amount) && amount > 0 && amount > availableBalance + giftBalance;
      } else {
        insufficientBalance.value = false;
      }
    }
  }
);

// 校验状态
const invalidRechargeAmount = ref(false);
const invalidAmount = ref(false);
const insufficientBalance = ref(false);
const givePointsLoading = ref(false);

// 打开送积分弹窗
const openGivePointsDialog = () => {
  givePointsForm.value = {
    id: customer.value.id,
    customerName: customer.value.customerName || customer.value.customerNickName || "",
    level: customer.value.customerTypeName || "",
    balance: customer.value.availableBalance || 0,
    availablePoints: customer.value.availablePoints || 0,
    accumulativeintegral: 0,
    operator: "管理员",
    pointsmodifydesc: "",
  };
  showGivePointsDialog.value = true;
};

// 打开修改等级弹窗
const openEditLevelDialog = () => {
  editLevelForm.value.customerType = "";
  showEditLevelDialog.value = true;
};

// 打开充值弹窗
const openRechargeDialog = () => {
  rechargeForm.value = {
    customerId: customer.value.id,
    customerName: customer.value.customerName || customer.value.customerNickName || "未知客户",
    amount: "",
    remark: "",
    operatorId: "17376144917",
    balance: customer.value.availableBalance || 0, // 设置余额
  };
  invalidRechargeAmount.value = false;
  showRechargeDialog.value = true;
};

// 打开消费弹窗
const openConsumeDialog = () => {
  consumeForm.value = {
    customerId: customer.value.id,
    customerName: customer.value.customerName || customer.value.customerNickName || "未知客户",
    sumofconsume: "",
    consumerDesc: "",
    availableBalance: customer.value.availableBalance,
    giftBalance: customer.value.availableGiftBalance,
    operatorId: "17376144917",
  };
  insufficientBalance.value = false;
  invalidAmount.value = false;
  showConsumeDialog.value = true;
};

// 处理送积分
const handleGivePoints = async () => {
  givePointsLoading.value = true;
  try {
    const pointsToAccumulate = Number(givePointsForm.value.accumulativeintegral);
    if (isNaN(pointsToAccumulate)) {
      ElMessage.warning("请输入有效的积分增减数量");
      givePointsLoading.value = false;
      return;
    }
    const paramsToSend = {
      id: String(givePointsForm.value.id),
      availablePoints: Number(givePointsForm.value.availablePoints) + pointsToAccumulate,
      accumulativeintegral: pointsToAccumulate,
      pointsmodifydesc: String(givePointsForm.value.pointsmodifydesc),
    };
    console.log("发送给 giveCustomerPoints 的参数:", paramsToSend);
    await giveCustomerPoints(paramsToSend);
    if (pointsToAccumulate < 0) {
      ElMessage.success("积分消费成功");
    } else {
      ElMessage.success("送积分成功");
    }
    showGivePointsDialog.value = false;
    loadCustomerData(); // 重新加载客户数据
  } catch (error) {
    console.error("送积分失败", error);
    ElMessage.error("送积分失败");
  } finally {
    givePointsLoading.value = false;
  }
};

// 提交等级修改
const submitEditLevel = async () => {
  editLevelFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      ElMessage.warning("请完整选择等级后再提交！");
      return;
    }
    try {
      await updateCustomerLevel([customer.value.id], editLevelForm.value.customerType);
      ElMessage.success("修改成功！");
      showEditLevelDialog.value = false;
      loadCustomerData(); // 重新加载客户数据
    } catch (err) {
      console.error("修改等级失败:", err);
      ElMessage.error("修改失败");
    }
  });
};

// 提交充值
const submitRecharge = async () => {
  if (!rechargeForm.value.amount) {
    ElMessage.warning("请输入充值金额");
    return;
  }
  const amount = parseFloat(rechargeForm.value.amount);
  if (isNaN(amount) || amount < 0.01 || amount > 950000) {
    ElMessage.warning("请输入0.01-950000之间的数");
    return;
  }
  if (!/^\d+(\.\d{1,2})?$/.test(rechargeForm.value.amount)) {
    ElMessage.warning("金额最多支持两位小数");
    return;
  }
  try {
    await rechargeCustomerBalance({
      id: rechargeForm.value.customerId,
      availableBalance: amount,
      rechargeamount: amount,
      customerDesc: rechargeForm.value.remark || "",
    });
    ElMessage.success("充值成功");
    showRechargeDialog.value = false;
    loadCustomerData(); // 重新加载客户数据
  } catch (error) {
    console.error("充值失败", error);
    ElMessage.error("充值失败，请重试");
  }
};

// 提交消费
const submitConsume = async () => {
  if (!consumeForm.value.sumofconsume) {
    ElMessage.warning("请输入消费金额");
    return;
  }
  const amount = parseFloat(consumeForm.value.sumofconsume);
  if (isNaN(amount) || amount < 0.01 || amount > 950000) {
    ElMessage.warning("请输入0.01-950000之间的数");
    return;
  }
  if (!/^\d+(\.\d{1,2})?$/.test(consumeForm.value.sumofconsume)) {
    ElMessage.warning("金额最多支持两位小数");
    return;
  }
  const availableBalance = parseFloat(consumeForm.value.availableBalance || "0");
  const giftBalance = parseFloat(consumeForm.value.giftBalance || "0");
  if (amount > availableBalance + giftBalance) {
    ElMessage.warning("会员余额不足");
    return;
  }
  try {
    await customerConsume({
      id: consumeForm.value.customerId,
      availableBalance,
      availableGiftBalance: giftBalance,
      sumofconsumption: amount,
      consumerNumber: 0,
      consumerDesc: consumeForm.value.consumerDesc || "",
      accumulativeconsumption: 0, // 或实际累计金额
    });
    ElMessage.success("消费成功");
    showConsumeDialog.value = false;
    loadCustomerData(); // 重新加载客户数据
  } catch (error) {
    console.error("消费失败", error);
    ElMessage.error("消费失败，请重试");
  }
};

// 获取客户类型列表
const fetchCustomerTypeOptions = async () => {
  try {
    const res = await getCustomerTypeList();
    if (res && res.data) {
      customerTypeOptions.value = res.data;
    } else if (res) {
      customerTypeOptions.value = Array.isArray(res) ? res : [];
    }
  } catch (error) {
    console.error("获取客户类型列表失败", error);
  }
};

const loadCustomerData = async () => {
  const id = route.params.id as string;
  if (!id) return;

  try {
    console.log("Loading customer data for ID:", id);
    const res = await getCustomerDetailById(id);
    console.log("API response:", res);

    // If the API returns data wrapped in a data property, unwrap it
    if (res && res.data) {
      customer.value = res.data;
    } else {
      // Otherwise use the response directly
      customer.value = res;
    }

    console.log("Customer data loaded:", customer.value);
  } catch (error) {
    console.error("Failed to load customer data:", error);
    ElMessage.error("获取客户详情失败");
  }
};

onMounted(() => {
  loadCustomerData();
  fetchCustomerTypeOptions();
});

// 监听路由变化，当路由参数改变时重新加载数据
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadCustomerData();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.header-row {
  display: flex;
  align-items: flex-start;
  gap: 32px;
  padding: 20px 0;
}
.avatar {
  flex-shrink: 0;
  border: 1px solid #eee;
}
.header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.header-top {
  display: flex;
  gap: 48px;
  margin-bottom: 16px;
}
.header-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 200px;
}
.header-bottom {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 16px;
}
.balance-info {
  display: flex;
  gap: 48px;
}
.action-row {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}
.action-row .el-button {
  min-width: 90px;
}
.action-row .el-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

/* 个人信息区块样式 */
.info-section {
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 16px;
}

.info-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px 80px; /* 增加列间距 */
  padding: 0 10px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-label {
  color: #606266;
  margin-right: 8px;
  min-width: 70px;
  text-align: right;
  font-size: 14px;
}

.info-value {
  color: #333;
  font-weight: normal;
  font-size: 14px;
}

/* 详细地址样式，占据整行 */
.address-item {
  grid-column: span 3;
  margin-top: 10px;
}

/* 原有的info-blocks样式 */
.info-blocks {
  display: flex;
  gap: 32px;
  margin-top: 24px;
}
.info-blocks > div {
  flex: 1;
  background: #fafbfc;
  padding: 16px;
  border-radius: 8px;
}

/* 对话框居中样式 */
:deep(.el-dialog) {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}

:deep(.el-dialog .el-dialog__body) {
  overflow-y: auto;
}

/* 添加居中样式 */
.center-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
}

/* 充值和消费弹窗样式 */
.simple-form-item {
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  padding: 0 30px;
}

.simple-form-label {
  width: 100px;
  text-align: right;
  font-size: 14px;
  color: #606266;
  line-height: 32px;
  padding-right: 12px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.simple-form-label.required::before {
  content: "*";
  color: #f56c6c;
  margin-right: 1px;
}

.simple-form-content {
  flex: 1;
  font-size: 14px;
  color: #606266;
  display: flex;
  align-items: center;
}

.input-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
}

.amount-input {
  width: 170px !important;
  display: inline-block;
  vertical-align: middle;
}

:deep(.amount-input .el-input__wrapper) {
  padding-right: 0;
  height: 32px !important;
}

:deep(.amount-input .el-input__inner) {
  text-align: left;
  padding-right: 8px;
  font-size: 14px;
}

:deep(.amount-input .el-input__suffix) {
  color: #909399;
  font-size: 14px;
  background: transparent;
  margin-right: 8px;
}

.remark-textarea {
  width: 100%;
}

:deep(.remark-textarea .el-textarea__inner) {
  resize: none;
  height: 80px;
  min-height: 80px;
  font-size: 14px;
}

.validation-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
}

.insufficient-balance {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
}

.dialog-footer {
  text-align: right;
  padding: 0 20px;
}

.customer-info {
  display: flex;
  align-items: center;
  line-height: 32px;
  height: 32px;
}

.balance-info {
  color: #999;
  font-size: 14px;
  margin-left: 8px;
}
</style>
