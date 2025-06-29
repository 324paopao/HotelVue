<template>
  <el-card class="query-card" shadow="never" style="margin-bottom: 24px; width: 100%">
    <div class="filter-card">
      <el-form :inline="true" class="filter-form" label-width="100px">
        <template v-if="isExpand">
          <!-- 第一行label -->
          <div class="filter-row label-row">
            <div class="filter-row label-row">客户信息(姓名、会员卡号、手机号)</div>
            <div class="filter-label"></div>
            <div class="filter-label">客户类型</div>
          </div>
          <!-- 第一行输入框 -->
          <div class="filter-row input-row">
            <el-select v-model="filters.infoType" style="width: 110px; height: 45px">
              <el-option label="手机号" value="phone" />
              <el-option label="微信昵称" value="nickname" />
              <el-option label="姓名" value="name" />
              <el-option label="会员卡号" value="cardNo" />
            </el-select>
            <el-input
              v-model="filters.infoValue"
              placeholder="请输入"
              style="width: 140px; margin-left: 22px; height: 45px"
            />

            <el-select
              v-model="filters.CustomerType"
              placeholder="请选择客户类型"
              style="width: 180px; margin-left: 16px; height: 45px"
            >
              <el-option label="不限" value="" />
              <el-option
                v-for="item in customerTypeOptions"
                :key="item.id"
                :label="item.customerTypeName"
                :value="item.id"
              />
            </el-select>
          </div>
          <!-- 第二行label -->
          <div class="filter-row label-row">
            <div class="filter-label">性别</div>
            <div class="filter-label">&nbsp;开卡时间</div>
          </div>
          <!-- 第二行输入框 -->
          <div class="filter-row input-row">
            <el-select
              v-model="filters.Gender"
              placeholder="不限"
              style="width: 120px; height: 45px"
            >
              <el-option label="不限" value="" />
              <el-option label="男" :value="0" />
              <el-option label="女" :value="1" />
            </el-select>
            <el-date-picker
              v-model="filters.openCardTime"
              type="daterange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              class="open-card-date"
              style="width: 120px; margin-left: 20px; height: 45px"
              :clearable="true"
              :editable="false"
              range-separator="~"
            />
          </div>
          <!-- 按钮区 -->
          <div class="filter-row flex-row" style="margin-top: 8px">
            <div>
              <el-button>导出会员数据</el-button>
              <el-button>打标签</el-button>
              <el-button @click="openEditLevelDialog">修改等级</el-button>
              <el-button>冻结</el-button>
              <el-button>解冻</el-button>
              <el-button type="primary" @click="showAddDialog = true">添加客户</el-button>
              <el-button>导入客户</el-button>
            </div>
            <div class="flex-row-right">
              <el-button>标签管理</el-button>
              <el-button>同步粉丝</el-button>
              <el-button @click="toggleExpand">收起</el-button>
              <el-button @click="onSearch">搜索</el-button>
              <el-button @click="resetFilters">清空</el-button>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="filter-row flex-row">
            <div class="flex-row-left">
              <el-select v-model="filters.infoType">
                <el-option label="手机号" value="phone" />
                <el-option label="微信昵称" value="nickname" />
                <el-option label="姓名" value="name" />
                <el-option label="会员卡号" value="cardNo" />
              </el-select>
              <el-input
                v-model="filters.infoValue"
                placeholder="请输入关键词"
                style="width: 150px; margin: 0 8px"
              />
              <el-button
                icon="el-icon-search"
                circle
                class="search-btn"
                @click="onSearch"
              ></el-button>
              <el-button class="expand-btn" @click="toggleExpand">展开</el-button>
            </div>
            <div class="flex-row-right">
              <el-button>标签管理</el-button>
              <el-button>同步粉丝</el-button>
            </div>
          </div>
          <div class="filter-row ops-row">
            <el-button>导出会员数据</el-button>
            <el-button>打标签</el-button>
            <el-button @click="openEditLevelDialog">修改等级</el-button>
            <el-button>冻结</el-button>
            <el-button>解冻</el-button>
            <el-button type="primary" @click="showAddDialog = true">添加客户</el-button>
            <el-button>导入客户</el-button>
          </div>
        </template>
      </el-form>
    </div>
  </el-card>

  <el-card class="table-card" shadow="never">
    <!-- 客户信息表格 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column label="客户信息" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-avatar :size="40" :src="scope.row.avatar" />
            <div style="margin-left: 8px">
              <div>昵称：{{ scope.row.CustomerNickName || "--" }}</div>
              <div>
                姓名：
                <b>{{ scope.row.customerName }}</b>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="身份等级" width="120">
        <template #default="scope">
          {{ scope.row.customerTypeName }}
        </template>
      </el-table-column>
      <el-table-column label="标签" width="120">
        <template #default="">
          <el-link type="primary">添加标签</el-link>
        </template>
      </el-table-column>
      <el-table-column label="卡号" prop="id" align="center" />
      <el-table-column label="手机" prop="phoneNumber" align="center" />
      <el-table-column label="可用余额" prop="availableGiftBalance" align="center">
        <template #default="scope">
          <span>￥{{ scope.row.availableGiftBalance }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可用积分" prop="availablePoints" align="center" />
      <el-table-column label="累计消费金额" prop="totalConsume" align="center" />
      <el-table-column label="累计消费次数" prop="totalTimes" align="center" />
      <el-table-column label="累计退款金额" prop="totalRefund" align="center" />
      <el-table-column label="累计维权次数" prop="totalRights" align="center" />
      <el-table-column label="操作" width="260">
        <template #default="">
          <el-link type="primary">详情</el-link>
          <el-divider direction="vertical" />
          <el-link type="danger">冻结</el-link>
          <el-divider direction="vertical" />
          <el-link>送积分</el-link>
          <el-divider direction="vertical" />
          <el-link>送优惠券</el-link>
          <el-divider direction="vertical" />
          <el-link>充值</el-link>
          <el-divider direction="vertical" />
          <el-link>消费</el-link>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-model:page="pageIndex"
      v-model:limit="pageSize"
      :total="total"
      @pagination="handlePagination"
    />
  </el-card>

  <!-- 添加客户弹窗 -->
  <el-dialog v-model="showAddDialog" title="添加客户" width="620px" :close-on-click-modal="false">
    <el-form
      ref="addFormRef"
      :model="addForm"
      :rules="addRules"
      label-width="120px"
      class="add-customer-form"
    >
      <el-form-item label="客户类型" prop="customerType" required>
        <el-radio-group v-model="addForm.customerType">
          <el-radio :label="customerKindGuid.member">会员</el-radio>
          <el-radio :label="customerKindGuid.normal">普通客户</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="客户姓名" prop="customerName" required>
        <el-input v-model="addForm.customerName" maxlength="16" placeholder="不超过16个字符" />
      </el-form-item>
      <el-form-item label="手机号" prop="phoneNumber" required>
        <el-input v-model="addForm.phoneNumber" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item
        v-if="addForm.customerType === customerKindGuid.member"
        label="成长值"
        prop="growthValue"
      >
        <el-input v-model="addForm.growthValue" placeholder="不填为零，上限10亿" maxlength="10" />
      </el-form-item>
      <el-form-item
        v-if="addForm.customerType === customerKindGuid.member"
        label="可用实充余额"
        prop="availableBalance"
      >
        <el-input
          v-model="addForm.availableBalance"
          placeholder="不填为零，上限95万"
          maxlength="8"
        />
      </el-form-item>
      <el-form-item
        v-if="addForm.customerType === customerKindGuid.member"
        label="可用赠送余额"
        prop="availableGiftBalance"
      >
        <el-input
          v-model="addForm.availableGiftBalance"
          placeholder="不填为零，上限95万"
          maxlength="8"
        />
      </el-form-item>
      <el-form-item
        v-if="addForm.customerType === customerKindGuid.member"
        label="可用积分"
        prop="availablePoints"
      >
        <el-input
          v-model="addForm.availablePoints"
          placeholder="不填为零，上限10亿"
          maxlength="10"
        />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="addForm.gender" placeholder="请选择">
          <el-option label="男" :value="0" />
          <el-option label="女" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker
          v-model="addForm.birthday"
          type="date"
          placeholder="请选择日期"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="地址" prop="region">
        <el-cascader
          v-model="addForm.region"
          :options="regionOptions"
          :props="{ value: 'label', label: 'label', children: 'children' }"
          placeholder="请选择省市区"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label=" " prop="address">
        <el-input
          v-model="addForm.address"
          type="textarea"
          :maxlength="20"
          show-word-limit
          placeholder="请输入详细地址"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showAddDialog = false">取消</el-button>
      <el-button type="primary" @click="submitAddForm">确定</el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="showEditLevelDialog"
    title="会员等级"
    width="600px"
    :close-on-click-modal="false"
    :show-close="true"
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
        <el-button type="primary" @click="submitEditLevel(editLevelFormRef)">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  addCustomer,
  getCustomerList,
  getCustomerTypeList,
  updateCustomerLevel,
} from "@/api/system/customer.api";
import { regionData } from "element-china-area-data";
import Pagination from "@/components/Pagination/index.vue";
import { ElMessage } from "element-plus";

const customerKindGuid = {
  member: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  normal: "3fa85f64-5717-4562-b3fc-2c963f66afa7",
};

const isExpand = ref(false);
const toggleExpand = () => {
  isExpand.value = !isExpand.value;
};

const pageIndex = ref(1);
const pageSize = ref(10);

const filters = ref({
  CustomerNickName: "",
  CustomerType: "",
  CustomerName: "",
  PhoneNumber: "",
  Gender: "",
  openCardTime: [],
  infoType: "phone",
  infoValue: "",
});

const tableData = ref([]);
const total = ref(0);

const customerTypeOptions = ref();
const selectedCustomerIds = ref<string[]>([]);

const fetchCustomerTypeOptions = async () => {
  const res = await getCustomerTypeList();
  if (res) {
    customerTypeOptions.value = res;
  }
};

const fetchCustomerList = async () => {
  const params = buildQueryParams();
  const res = await getCustomerList(params);
  console.log(res);
  if (res) {
    tableData.value = res.data;
  }
};

function buildQueryParams() {
  const params = { ...filters.value };
  params.CustomerNickName = "";
  params.CustomerName = "";
  params.PhoneNumber = "";
  if (params.infoType && params.infoValue) {
    if (params.infoType === "phone") params.PhoneNumber = params.infoValue;
    if (params.infoType === "nickname") params.CustomerNickName = params.infoValue;
    if (params.infoType === "name") params.CustomerName = params.infoValue;
  }
  const query: Record<string, any> = {
    PageIndex: pageIndex.value,
    PageSize: pageSize.value,
  };
  if (params.CustomerNickName) query["CustomerNickName"] = params.CustomerNickName;
  if (params.CustomerType) query["CustomerType"] = params.CustomerType;
  if (params.CustomerName) query["CustomerName"] = params.CustomerName;
  if (params.PhoneNumber) query["PhoneNumber"] = params.PhoneNumber;
  if (params.Gender !== "" && params.Gender !== undefined) query["Gender"] = params.Gender;
  if (params.openCardTime && params.openCardTime.length === 2) {
    query["StartTime"] = params.openCardTime[0];
    query["EndTime"] = params.openCardTime[1];
  }
  return query;
}

const onSearch = () => {
  pageIndex.value = 1;
  fetchCustomerList();
};

function handlePagination(payload: { page: number; limit: number }) {
  pageIndex.value = payload.page;
  pageSize.value = payload.limit;
  fetchCustomerList();
}

onMounted(() => {
  fetchCustomerList();
  fetchCustomerTypeOptions();
});

const showAddDialog = ref(false);
const addFormRef = ref();
const addForm = ref({
  customerNickName: "",
  customerType: customerKindGuid.member,
  customerName: "",
  phoneNumber: "",
  growthValue: null,
  availableBalance: null,
  availableGiftBalance: null,
  availablePoints: null,
  gender: 0,
  birthday: "",
  region: [],
  address: "",
});
const regionOptions = ref(regionData);
const addRules = {
  customerType: [{ required: true, message: "请选择客户类型", trigger: "change" }],
  customerName: [{ required: true, message: "请输入客户姓名", trigger: "blur" }],
  phoneNumber: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "手机号格式不正确", trigger: "blur" },
  ],
};
const submitAddForm = () => {
  addFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    // 组装省市区为city字段，格式化birthday为日期
    const { region, birthday, ...rest } = addForm.value;
    let birthdayStr = "";
    if (birthday) {
      if (typeof birthday === "string") {
        birthdayStr = birthday.slice(0, 10);
      } else if (Object.prototype.toString.call(birthday) === "[object Date]") {
        birthdayStr = (birthday as Date).toISOString().slice(0, 10);
      }
    }
    // customerNickName 必须有值，若为空则用 customerName 代替
    let customerNickName = rest.customerNickName;
    if (!customerNickName || customerNickName.trim() === "") {
      customerNickName = rest.customerName || "客户";
    }
    const params: Record<string, any> = {
      ...rest,
      customerNickName,
      city: (region || []).join(" "),
      birthday: birthdayStr,
      address: addForm.value.address,
    };
    // 移除值为null、undefined、空字符串的字段
    Object.keys(params).forEach((key) => {
      if (params[key] === null || params[key] === undefined || params[key] === "") {
        delete params[key];
      }
    });
    await addCustomer(params);
    showAddDialog.value = false;
    // TODO: 刷新客户列表
  });
};

const showEditLevelDialog = ref(false);
const editLevelForm = ref({ customerType: "" });
const editLevelFormRef = ref();
const editLevelRules = {
  customerType: [{ required: true, message: "请选择会员等级", trigger: "change" }],
};
function handleSelectionChange(selection: any[]) {
  selectedCustomerIds.value = selection.map((item) => item.id);
  console.log("handleSelectionChange", selection, selectedCustomerIds.value);
}
function openEditLevelDialog() {
  if (selectedCustomerIds.value.length === 0) {
    ElMessage.warning("请先选择要修改的客户！");
    return;
  }
  editLevelForm.value.customerType = "";
  showEditLevelDialog.value = true;
}
async function submitEditLevel(formRef: any) {
  console.log(
    "submitEditLevel called",
    formRef,
    selectedCustomerIds.value,
    editLevelForm.value.customerType
  );
  if (!formRef || !formRef.value) return;
  if (selectedCustomerIds.value.length === 0) {
    ElMessage.warning("请先选择要修改的客户！");
    return;
  }
  formRef.value.validate(async (valid: boolean) => {
    console.log("form validate result", valid);
    if (!valid) {
      ElMessage.warning("请完整选择等级后再提交！");
      return;
    }
    console.log(
      "calling updateCustomerLevel",
      selectedCustomerIds.value,
      editLevelForm.value.customerType
    );
    await updateCustomerLevel(selectedCustomerIds.value, editLevelForm.value.customerType);
    showEditLevelDialog.value = false;
    ElMessage.success("批量修改成功！");
    fetchCustomerList();
  });
}

const resetFilters = () => {
  filters.value = {
    CustomerNickName: "",
    CustomerType: "",
    CustomerName: "",
    PhoneNumber: "",
    Gender: "",
    openCardTime: [],
    infoType: "phone",
    infoValue: "",
  };
  pageIndex.value = 1;
  fetchCustomerList();
};
</script>

<style scoped>
.filter-card {
  background: #fafbfc;
  border-radius: 12px;
  padding: 18px 18px 10px 18px;
  margin-bottom: 18px;
  box-sizing: border-box;
}
.filter-form {
  margin-bottom: 0;
}
.filter-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  height: 45px !important;
}
.flex-row {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  height: 45px !important;
}
.flex-row-left {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 45px !important;
}
.flex-row-right {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 45px !important;
}
.customer-info-label {
  font-size: 15px;
  margin-right: 8px;
  line-height: 1.2;
  white-space: nowrap;
  height: 45px !important;
}
.ops-row {
  margin-bottom: 0;
  margin-top: 0;
  flex-wrap: wrap;
  gap: 8px;
  height: 45px !important;
}
.el-form-item {
  margin-bottom: 0;
  margin-right: 16px;
}
.el-form-item__label {
  font-weight: 600;
  font-size: 15px;
  color: #222;
}
.el-input,
.el-select,
.el-date-editor {
  width: 180px !important;
  height: 45px !important;
  font-size: 16px;
  line-height: 56px;
}
.search-btn {
  margin-right: 8px;
  height: 32px;
  width: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.expand-btn {
  height: 32px;
  min-width: 56px;
  padding: 0 12px;
  border-radius: 4px;
  font-size: 14px;
  margin-left: 0;
}
.filter-label {
  font-size: 15px;
  color: #222;
  width: 180px;
  margin-right: 16px;
  text-align: left;
}
.label-row {
  display: flex;
  align-items: center;
  margin-bottom: 2px;
}
.input-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.double-col {
  flex: 2;
  display: flex;
  align-items: center;
}
.filter-label.double-col {
  white-space: nowrap;
  min-width: 400px;
  width: 400px;
  height: 56px;
  line-height: 56px;
}
.el-button {
  height: 56px !important;
  line-height: 56px !important;
  font-size: 16px;
  padding: 0 18px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
:deep(.el-input-number) {
  width: 100% !important;
}
:deep(.el-input-number .el-input__wrapper) {
  height: 45px !important;
  min-height: 45px !important;
  font-size: 16px;
  border-radius: 6px;
  box-sizing: border-box;
  padding: 0 11px;
}
:deep(.el-input-number .el-input__inner) {
  height: 45px !important;
  line-height: 45px !important;
  font-size: 16px;
  padding: 0;
}
.add-customer-form :deep(.el-input),
.add-customer-form :deep(.el-select),
.add-customer-form :deep(.el-date-editor),
.add-customer-form :deep(.el-cascader) {
  width: 100% !important;
  min-width: 0;
}
.add-customer-form .el-form-item {
  margin-bottom: 18px;
}
.query-card {
  margin-bottom: 24px;
  background: #fafbfc;
  border-radius: 12px;
  border: none;
}
.table-card {
  background: #fff;
  border-radius: 12px;
  border: none;
}
.input-row :deep(.el-input),
.input-row :deep(.el-select),
.input-row :deep(.el-date-picker),
.input-row :deep(.el-date-editor),
.input-row :deep(.el-input__wrapper),
.input-row :deep(.el-range-editor),
.input-row :deep(.el-range-input),
.input-row :deep(.el-input__inner),
.input-row :deep(.el-select .el-input__inner) {
  height: 45px !important;
  min-height: 45px !important;
  line-height: 45px !important;
  font-size: 16px !important;
  border-radius: 8px !important;
  box-sizing: border-box;
}
.open-card-date,
.open-card-date .el-input,
.open-card-date .el-input__wrapper,
.open-card-date .el-range-editor,
.open-card-date .el-range-input {
  width: 150px !important;
  min-width: 150px !important;
  max-width: 150px !important;
  height: 45px !important;
  box-sizing: border-box;
}
.open-card-date {
  flex-shrink: 0 !important;
}
.input-row .el-select,
.input-row .el-select .el-input,
.input-row .el-select .el-input__wrapper {
  height: 45px !important;
  min-height: 45px !important;
  line-height: 45px !important;
  box-sizing: border-box;
}
:deep(.el-select-dropdown__item) {
  height: 45px !important;
  line-height: 45px !important;
  font-size: 16px;
}
.dialog-footer.center-footer {
  text-align: center;
  justify-content: center;
  display: flex;
  padding-right: 0;
}
.dialog-footer .el-button + .el-button {
  margin-left: 12px;
}
.dialog-footer .el-button {
  min-width: 80px;
  height: 36px;
  font-size: 16px;
}
.el-dialog__title {
  font-weight: bold;
  font-size: 18px;
}
.el-form-item__label {
  font-size: 16px;
}
.el-select {
  font-size: 16px;
}
::v-deep(.el-dialog) {
  margin: auto !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}
</style>
