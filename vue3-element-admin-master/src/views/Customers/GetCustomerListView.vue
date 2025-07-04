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
              style="width: 120px; height: 32px"
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
              style="width: 220px; margin-left: 20px; height: 32px"
              :clearable="true"
              :editable="false"
              range-separator="~"
              size="small"
            />
          </div>
          <!-- 按钮区 -->
          <div class="filter-row flex-row" style="margin-top: 8px">
            <div>
              <el-button @click="handleExportCustomers">导出客户数据</el-button>
              <el-button>打标签</el-button>
              <el-button @click="openEditLevelDialog">修改等级</el-button>
              <el-button @click="handleBatchFreeze">冻结</el-button>
              <el-button @click="handleBatchUnfreeze">解冻</el-button>
              <el-button type="primary" @click="showAddDialog = true">添加客户</el-button>
              <el-button>导入客户</el-button>
            </div>
            <div class="flex-row-right">
              <el-button @click="goToTagManagement">标签管理</el-button>
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
              <el-input v-model="filters.infoValue" placeholder="请输入关键词" />
              <el-button
                icon="el-icon-search"
                circle
                class="search-btn"
                @click="onSearch"
              ></el-button>
              <el-button class="expand-btn" @click="toggleExpand">展开</el-button>
            </div>
            <div class="flex-row-right">
              <el-button @click="goToTagManagement">标签管理</el-button>
              <el-button>同步粉丝</el-button>
            </div>
          </div>
          <div class="filter-row ops-row">
            <el-button @click="handleExportCustomers">导出客户数据</el-button>
            <el-button>打标签</el-button>
            <el-button @click="openEditLevelDialog">修改等级</el-button>
            <el-button @click="handleBatchFreeze">冻结</el-button>
            <el-button @click="handleBatchUnfreeze">解冻</el-button>
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
              <div>昵称：{{ scope.row.customerNickName || "--" }}</div>
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
          <div>
            <div>
              <template v-if="scope.row.status === false">
                <span class="frozen-tag">已冻结</span>
              </template>
              <template v-else>
                {{ scope.row.customerTypeName }}
              </template>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="标签" width="120">
        <template #default="">
          <el-link type="primary">添加标签</el-link>
        </template>
      </el-table-column>
      <el-table-column label="卡号" prop="id" align="center" />
      <el-table-column label="手机" prop="phoneNumber" align="center" />
      <el-table-column label="可用余额" prop="availableBalance" align="center">
        <template #default="scope">
          <span>￥{{ scope.row.availableBalance }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可用积分" prop="availablePoints" align="center" />
      <el-table-column label="累计消费金额" prop="accumulativeconsumption" align="center" />
      <el-table-column label="累计消费次数" prop="comsumerNumber" align="center" />
      <el-table-column label="操作" width="260">
        <template #default="scope">
          <el-link type="primary">详情</el-link>
          <el-divider direction="vertical" />
          <el-link v-if="scope.row.status !== false" type="danger" @click="handleFreeze(scope.row)">
            冻结
          </el-link>
          <el-link
            v-if="scope.row.status === false"
            type="success"
            @click="handleUnfreeze(scope.row)"
          >
            解冻
          </el-link>
          <el-divider direction="vertical" />
          <el-link @click="handleSetLevel(scope.row)">设置等级</el-link>
          <el-divider direction="vertical" />
          <el-link>送积分</el-link>
          <el-divider direction="vertical" />
          <el-link>送优惠券</el-link>
          <el-divider direction="vertical" />
          <el-link v-if="scope.row.status !== false" @click="openRechargeDialog(scope.row)">
            充值
          </el-link>
          <el-divider v-if="scope.row.status !== false" direction="vertical" />
          <el-link v-if="scope.row.status !== false" @click="openConsumeDialog(scope.row)">
            消费
          </el-link>
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
        <el-button type="primary" @click="submitEditLevel()">确定</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 会员充值弹窗 -->
  <el-dialog v-model="showRechargeDialog" title="充值" width="750px" :close-on-click-modal="false">
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

  <!-- 客户消费弹窗 -->
  <el-dialog
    v-model="showConsumeDialog"
    title="客户消费"
    width="750px"
    :close-on-click-modal="false"
  >
    <div class="simple-form-item">
      <div class="simple-form-label">客户信息：</div>
      <div class="simple-form-content customer-info">
        {{ consumeForm.customerName }}
        <span class="balance-info">
          （可用实充金额{{ consumeForm.availableBalance ?? "0" }} 元，可用赠送余额{{
            consumeForm.giftBalance ?? "0"
          }}
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
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import {
  addCustomer,
  getCustomerList,
  getCustomerTypeList,
  updateCustomerLevel,
  exportCustomerData,
  rechargeCustomerBalance,
  customerConsume,
  updateCustomerStatus,
} from "@/api/system/customer.api";
import { regionData } from "element-china-area-data";
import Pagination from "@/components/Pagination/index.vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();

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
function openEditLevelDialog(row?: any) {
  if (row && selectedCustomerIds.value.length === 0) {
    selectedCustomerIds.value = [row.id];
  } else if (selectedCustomerIds.value.length === 0) {
    ElMessage.warning("请先选择要修改的客户！");
    return;
  }
  editLevelForm.value.customerType = "";
  showEditLevelDialog.value = true;
}
async function submitEditLevel() {
  console.log(
    "submitEditLevel called",
    //formRef,
    selectedCustomerIds.value,
    editLevelForm.value.customerType
  );
  //if (!formRef || !formRef.value) return;
  if (selectedCustomerIds.value.length === 0) {
    ElMessage.warning("请先选择要修改的客户！");
    return;
  }
  editLevelFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      ElMessage.warning("请完整选择等级后再提交！");
      return;
    }

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

/**
 * 导出客户数据功能
 * 根据当前筛选条件导出客户数据到Excel文件
 * 1. 获取当前筛选参数
 * 2. 调用后端API导出数据
 * 3. 将响应转换为Blob对象并创建下载链接
 * 4. 触发文件下载并提供用户反馈
 */
const handleExportCustomers = async () => {
  try {
    // 构建与当前列表查询相同的筛选参数
    const params = buildQueryParams();

    // 调用API获取文件数据流
    const response = await exportCustomerData(params);

    // 关闭加载提示

    // 验证响应数据
    if (!response.data) {
      ElMessage.error("导出失败：未获取到数据");
      return;
    }

    // 生成包含日期的文件名
    const date = new Date();
    const dateString = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
    const timeString = `${date.getHours().toString().padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}`;
    const filename = `客户数据_${dateString}_${timeString}.xlsx`;

    // 将响应数据转换为Excel文件blob对象
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // 下载文件
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // 显示成功消息，添加文件名提示
    ElMessage.success(`导出成功，文件名：${filename}`);
  } catch (error: any) {
    // 错误处理与反馈
    console.error("导出客户数据失败", error);

    // 更详细的错误提示
    if (error.response) {
      // 服务器返回错误状态码
      ElMessage.error(`导出失败：服务器返回 ${error.response.status} 错误`);
    } else if (error.request) {
      // 请求发送但没有收到响应
      ElMessage.error("导出失败：服务器无响应，请检查网络连接");
    } else {
      // 请求配置出错
      ElMessage.error(`导出失败：${error.message || "未知错误"}`);
    }
  }
};

/**
 * 跳转到标签管理页面
 */
const goToTagManagement = () => {
  router.push("/customers/tags-management");
};

// 充值弹窗相关数据和方法
const showRechargeDialog = ref(false);
const rechargeForm = ref({
  customerId: "",
  customerName: "",
  amount: "",
  remark: "",
  operatorId: "17376144917", // 这里应该从登录用户信息中获取
});
const invalidRechargeAmount = ref(false);

// 监听充值金额变化，检查金额是否有效
watch(
  () => rechargeForm.value.amount,
  (newValue) => {
    if (showRechargeDialog.value) {
      const amount = parseFloat(newValue || "0");

      // 检查金额是否有效（超出范围或小数位过多）
      invalidRechargeAmount.value = !!(
        newValue &&
        (isNaN(amount) || amount < 0.01 || amount > 950000 || !/^\d+(\.\d{1,2})?$/.test(newValue))
      );
    }
  }
);

// 打开充值弹窗
const openRechargeDialog = (row: any) => {
  rechargeForm.value = {
    customerId: row.id,
    customerName: row.customerName || row.customerNickName || "未知客户",
    amount: "",
    remark: "",
    operatorId: row.phoneNumber,
  };
  invalidRechargeAmount.value = false; // 重置金额无效标志
  showRechargeDialog.value = true;
};

// 提交充值
const submitRecharge = async () => {
  // 简单验证
  if (!rechargeForm.value.amount) {
    ElMessage.warning("请输入充值金额");
    return;
  }

  const amount = parseFloat(rechargeForm.value.amount);

  // 验证金额是否在有效范围内（0.01-950000之间且最多两位小数）
  if (isNaN(amount) || amount < 0.01 || amount > 950000) {
    ElMessage.warning("请输入0.01-950000之间的数");
    return;
  }

  // 验证最多两位小数
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
    fetchCustomerList(); // 刷新列表
  } catch (error) {
    console.error("充值失败", error);
    ElMessage.error("充值失败，请重试");
  }
};

const showConsumeDialog = ref(false);
const consumeForm = ref({
  customerId: "",
  customerName: "",
  sumofconsume: "",
  consumerDesc: "",
  availableBalance: undefined,
  giftBalance: undefined,
  operatorId: "17376144917",
});
const insufficientBalance = ref(false);
const invalidAmount = ref(false);

// 监听消费金额变化，检查余额是否足够和金额是否有效
watch(
  () => consumeForm.value.sumofconsume,
  (newValue) => {
    if (showConsumeDialog.value) {
      const amount = parseFloat(newValue || "0");
      const availableBalance = parseFloat(consumeForm.value.availableBalance || "0");
      const giftBalance = parseFloat(consumeForm.value.giftBalance || "0");

      // 首先检查金额是否有效（超出范围或小数位过多）
      invalidAmount.value = !!(
        newValue &&
        (isNaN(amount) || amount < 0.01 || amount > 950000 || !/^\d+(\.\d{1,2})?$/.test(newValue))
      );

      // 只有在金额有效的情况下才检查余额是否足够
      if (!invalidAmount.value) {
        insufficientBalance.value =
          !isNaN(amount) && amount > 0 && amount > availableBalance + giftBalance;
      } else {
        // 如果金额无效，不显示余额不足
        insufficientBalance.value = false;
      }
    }
  }
);

const openConsumeDialog = (row: any) => {
  consumeForm.value = {
    customerId: row.id,
    customerName: row.customerName || row.customerNickName || "未知客户",
    sumofconsume: "",
    consumerDesc: "",
    availableBalance: row.availableBalance,
    giftBalance: row.availableGiftBalance,
    operatorId: row.phoneNumber,
  };
  insufficientBalance.value = false; // 重置余额不足标志
  invalidAmount.value = false; // 重置金额无效标志
  showConsumeDialog.value = true;
};

const submitConsume = async () => {
  if (!consumeForm.value.sumofconsume) {
    ElMessage.warning("请输入消费金额");
    return;
  }
  const amount = parseFloat(consumeForm.value.sumofconsume);

  // 验证金额是否在有效范围内（0.01-950000之间且最多两位小数）
  if (isNaN(amount) || amount < 0.01 || amount > 950000) {
    ElMessage.warning("请输入0.01-950000之间的数");
    return;
  }

  // 验证最多两位小数
  if (!/^\d+(\.\d{1,2})?$/.test(consumeForm.value.sumofconsume)) {
    ElMessage.warning("金额最多支持两位小数");
    return;
  }

  // 验证余额是否足够
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
      consumerNumber: 0, // 如有实际次数可替换
      consumerDesc: consumeForm.value.consumerDesc || "",
    });
    ElMessage.success("消费成功");
    showConsumeDialog.value = false;
    fetchCustomerList(); // 刷新列表
  } catch (error) {
    console.error("消费失败", error);
    ElMessage.error("消费失败，请重试");
  }
};

const handleFreeze = async (row: any) => {
  try {
    await updateCustomerStatus([row.id], false); // false=冻结
    ElMessage.success("冻结成功");
    fetchCustomerList();
  } catch {
    ElMessage.error("冻结失败");
  }
};

const handleUnfreeze = async (row: any) => {
  try {
    await updateCustomerStatus([row.id], true); // true=解冻
    ElMessage.success("解冻成功");
    fetchCustomerList();
  } catch {
    ElMessage.error("解冻失败");
  }
};

const handleBatchFreeze = async () => {
  if (!selectedCustomerIds.value.length) {
    ElMessage.warning("请先选择客户");
    return;
  }
  await updateCustomerStatus(selectedCustomerIds.value, false);
  ElMessage.success("批量冻结成功");
  fetchCustomerList();
};

const handleBatchUnfreeze = async () => {
  if (!selectedCustomerIds.value.length) {
    ElMessage.warning("请先选择客户");
    return;
  }
  await updateCustomerStatus(selectedCustomerIds.value, true);
  ElMessage.success("批量解冻成功");
  fetchCustomerList();
};

const handleSetLevel = (row: any) => {
  // 这里可以打开等级设置弹窗，或直接调用相关逻辑
  // 例如：openEditLevelDialog(row)
  openEditLevelDialog(row);
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
  height: 32px !important;
}
.flex-row {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  height: 32px !important;
}
.flex-row-left {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 32px !important;
}
.flex-row-left :deep(.el-select),
.flex-row-left :deep(.el-input) {
  width: 170px !important;
  height: 32px !important;
}
.flex-row-right {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 32px !important;
}
.customer-info-label {
  font-size: 14px;
  margin-right: 8px;
  line-height: 1.2;
  white-space: nowrap;
  height: 32px !important;
}
.ops-row {
  margin-bottom: 0;
  margin-top: 0;
  flex-wrap: wrap;
  gap: 8px;
  height: 32px !important;
}
.el-form-item {
  margin-bottom: 0;
  margin-right: 16px;
}
.el-form-item__label {
  font-weight: normal;
  font-size: 14px;
  color: #606266;
}
.el-input,
.el-select,
.el-date-editor {
  width: 170px !important;
  height: 32px !important;
  font-size: 14px;
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
  font-size: 14px;
  color: #606266;
  width: 170px;
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
  height: 32px;
  line-height: 32px;
}
.el-button {
  height: 32px !important;
  line-height: 32px !important;
  font-size: 14px;
  padding: 0 16px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}
:deep(.el-input-number) {
  width: 100% !important;
}
:deep(.el-input-number .el-input__wrapper) {
  height: 32px !important;
  min-height: 32px !important;
  font-size: 14px;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 0 11px;
}
:deep(.el-input-number .el-input__inner) {
  height: 32px !important;
  line-height: 32px !important;
  font-size: 14px;
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
  margin-bottom: 16px;
  background: #fafbfc;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}
.table-card {
  background: #fff;
  border-radius: 4px;
  border: 1px solid #ebeef5;
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
  height: 32px !important;
  min-height: 32px !important;
  line-height: 32px !important;
  font-size: 14px !important;
  border-radius: 4px !important;
  box-sizing: border-box;
}
.open-card-date,
.open-card-date :deep(.el-range-editor),
.open-card-date :deep(.el-range-input) {
  width: 220px !important;
  min-width: 0 !important;
  max-width: 100% !important;
  padding: 0;
}
.open-card-date {
  flex-shrink: 0 !important;
}
.open-card-date :deep(.el-range__icon),
.open-card-date :deep(.el-range-separator),
.open-card-date :deep(.el-range__close-icon) {
  line-height: 20px;
  height: 20px;
}
.open-card-date :deep(.el-range-input) {
  font-size: 14px !important;
  line-height: 20px !important;
  height: 20px !important;
  min-height: 20px !important;
  padding: 0;
}
.open-card-date :deep(.el-input__wrapper) {
  padding: 0 8px;
}
.input-row .el-select,
.input-row .el-select .el-input,
.input-row .el-select .el-input__wrapper {
  height: 32px !important;
  min-height: 32px !important;
  line-height: 32px !important;
  box-sizing: border-box;
}
:deep(.el-select-dropdown__item) {
  height: 32px !important;
  line-height: 32px !important;
  font-size: 14px;
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
  height: 32px;
  font-size: 14px;
}
.el-dialog__title {
  font-weight: bold;
  font-size: 16px;
}
.el-form-item__label {
  font-size: 14px;
}
.el-select {
  font-size: 14px;
}
::v-deep(.el-dialog) {
  margin: auto !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}
.recharge-form {
  margin: 20px 0;
}
.recharge-info {
  padding: 0 20px;
  font-size: 14px;
}
.recharge-dialog {
  height: 300px;
}
:deep(.recharge-dialog .el-dialog__body) {
  height: 150px;
  overflow-y: auto;
  padding-top: 30px;
}

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

.dialog-footer {
  text-align: right;
  padding: 0 20px;
}

:deep(.dialog-footer .el-button) {
  padding: 8px 20px;
}
.balance-info {
  color: #999;
  font-size: 14px;
  margin-left: 8px;
}
.customer-info {
  display: flex;
  align-items: center;
  line-height: 32px;
  height: 32px;
}
.balance-label {
  color: #999;
  font-size: 14px;
}
.balance-value {
  color: #222;
  font-weight: 500;
  margin: 0 2px;
  font-size: 14px;
}
.balance-unit {
  color: #bbb;
  margin-left: 2px;
  font-size: 14px;
}
.operator-info {
  font-size: 14px;
  color: #606266;
  margin-top: 2px;
  line-height: 32px;
  height: 32px;
  display: flex;
  align-items: center;
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
.frozen-tag {
  display: inline-block;
  background: #e5e5e5;
  color: #fff;
  font-size: 16px;
  border-radius: 8px;
  padding: 0 12px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  min-width: 60px;
  font-weight: bold;
}
.frozen-status {
  color: #fff;
  background: #e5e5e5;
  font-size: 12px;
  border-radius: 8px;
  padding: 0 8px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  display: inline-block;
  margin-top: 2px;
}
</style>
