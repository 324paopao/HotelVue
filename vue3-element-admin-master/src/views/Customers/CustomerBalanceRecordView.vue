<template>
  <div class="app-container no-border">
    <!-- 搜索栏 -->
    <div class="filter-container">
      <div class="search-container">
        <div class="search-item">
          <span class="label">交易时间：</span>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY/MM/DD"
            style="width: 350px"
            @change="handleDateRangeChange"
          />
        </div>

        <div class="search-item">
          <el-select v-model="searchType" placeholder="手机号" class="search-type-select">
            <el-option label="手机号" value="phone" />
            <el-option label="订单号" value="order" />
          </el-select>

          <el-input
            v-if="searchType === 'phone'"
            v-model="queryParams.Phone"
            placeholder="请输入手机号"
            clearable
            class="search-input"
          />
          <el-input
            v-if="searchType === 'order'"
            v-model="queryParams.Ordernumber"
            placeholder="请输入订单号"
            clearable
            class="search-input"
          />
        </div>

        <div class="search-buttons">
          <el-button type="primary" class="search-btn" @click="handleQuery">搜索</el-button>
          <el-button class="reset-btn" @click="resetQuery">重置</el-button>
          <el-button class="reset-btn" @click="handleExport">导出记录</el-button>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-container">
      <el-table v-loading="loading" :data="recordList" border style="width: 100%">
        <el-table-column prop="phone" label="手机号" min-width="120" />
        <el-table-column prop="customerNockName" label="客户昵称" min-width="120" />
        <el-table-column prop="customerName" label="客户姓名" min-width="120" />
        <el-table-column label="交易时间" min-width="160">
          <template #default="scope">
            {{ formatDateTime(scope.row.creationTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="slidingPrice" label="变动金额" min-width="100">
          <template #default="scope">
            <span :style="{ color: scope.row.slidingPrice > 0 ? '#67C23A' : '#F56C6C' }">
              {{
                scope.row.changeType === "后台消费" || scope.row.ordernumber?.includes("consume")
                  ? "-" + Math.abs(scope.row.slidingPrice)
                  : scope.row.slidingPrice > 0
                    ? "+" + scope.row.slidingPrice
                    : scope.row.slidingPrice
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="变动后余额" min-width="120">
          <template #default="scope">
            {{ Math.floor(scope.row.changePrice) }}
          </template>
        </el-table-column>
        <el-table-column prop="id" label="会员卡号" min-width="160" />
        <el-table-column prop="ordernumber" label="订单号" min-width="200" />
        <el-table-column prop="operator" label="操作门店" min-width="120" />
      </el-table>

      <!-- 分页 -->
      <div class="table-footer">
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="queryParams.PageIndex"
            v-model:page-size="queryParams.PageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getBalanceRecordList, exportBalanceRecordData } from "@/api/system/customer.api";

// 格式化日期时间
const formatDateTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return "--";

  // 尝试解析日期时间字符串
  const date = new Date(dateTimeStr);
  if (isNaN(date.getTime())) return dateTimeStr; // 如果解析失败，返回原始字符串

  // 格式化为 YYYY-MM-DD HH:MM:SS
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 数据加载状态
const loading = ref(false);
const total = ref(0);
const recordList = ref<any[]>([]);

// 日期范围
const dateRange = ref<any>(null);

// 查询参数
const queryParams = reactive({
  PageIndex: 1,
  PageSize: 10,
  Phone: "",
  Ordernumber: "",
  StartTime: "",
  EndTime: "",
  ChangeType: "",
});

// 搜索类型
const searchType = ref("phone");

// 处理日期范围变化
const handleDateRangeChange = (val: [string, string] | null) => {
  if (val) {
    queryParams.StartTime = val[0];
    queryParams.EndTime = val[1];
  } else {
    queryParams.StartTime = "";
    queryParams.EndTime = "";
  }
};

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const res = await getBalanceRecordList(queryParams);
    if (res && res.data) {
      recordList.value = res.data;
      total.value = res.data.length || 0; // 使用数据长度作为总数
    } else {
      recordList.value = [];
      total.value = 0;
    }
  } catch (error) {
    console.error("获取余额记录失败", error);
    ElMessage.error("获取余额记录失败");
  } finally {
    loading.value = false;
  }
};

// 查询
const handleQuery = () => {
  queryParams.PageIndex = 1;
  loadData();
};

// 重置
const resetQuery = () => {
  dateRange.value = null;
  Object.assign(queryParams, {
    PageIndex: 1,
    PageSize: 10,
    Phone: "",
    Ordernumber: "",
    StartTime: "",
    EndTime: "",
    ChangeType: "",
  });
  loadData();
};

// 分页处理
const handleSizeChange = (val: number) => {
  queryParams.PageSize = val;
  loadData();
};

const handleCurrentChange = (val: number) => {
  queryParams.PageIndex = val;
  loadData();
};

// 导出记录
const handleExport = async () => {
  try {
    loading.value = true;
    const params = {
      Phone: queryParams.Phone,
      Ordernumber: queryParams.Ordernumber,
      StartTime: queryParams.StartTime,
      EndTime: queryParams.EndTime,
    };

    const res = await exportBalanceRecordData(params);

    // 创建Blob对象并下载
    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    // 设置文件名
    const currentDate = new Date().toISOString().split("T")[0];
    link.download = `余额流水记录_${currentDate}.xlsx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出失败", error);
    ElMessage.error("导出失败");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.app-container {
  background-color: #f5f7fa;
  padding: 0;
}

.filter-container {
  padding: 15px;
  background-color: #fff;
  margin-bottom: 0;
  border-bottom: 2px solid #e4e7ed;
  position: relative;
}

.filter-container::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #e4e7ed;
  z-index: 1;
}

.search-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.label {
  white-space: nowrap;
  color: #606266;
  font-size: 14px;
}

.search-type-select {
  width: 120px;
}

.search-input {
  width: 200px;
}

.search-buttons {
  display: flex;
  gap: 10px;
}

.search-btn {
  background-color: #4e73f8;
  border-color: #4e73f8;
  padding: 9px 20px;
}

.reset-btn {
  background-color: #fff;
  border-color: #dcdfe6;
  color: #606266;
  padding: 9px 20px;
}

.table-container {
  background-color: #fff;
  padding: 15px;
  margin-top: 2px;
  border-top: 2px solid #e4e7ed;
}

.pagination-container {
  margin-top: 15px;
  text-align: right;
}

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
}

.no-border {
  border: none !important;
  box-shadow: none !important;
}

:deep(.el-table) {
  border: none !important;
}

:deep(.el-card) {
  border: none !important;
  box-shadow: none !important;
}

:deep(.el-card__body) {
  padding: 0 !important;
}

/* 日期选择器样式调整 */
:deep(.el-date-editor .el-range-separator) {
  color: #909399;
}

:deep(.el-input__wrapper),
:deep(.el-select .el-input__wrapper) {
  border-radius: 4px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-button) {
  border-radius: 4px;
}
</style>
