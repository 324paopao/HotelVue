<template>
  <div>
    <el-row style="margin-bottom: 16px">
      <el-col :span="6">
        <el-button @click="onAdd">新增房价计划</el-button>
      </el-col>
      <el-col :span="6" :offset="12" style="text-align: right">
        <el-select
          v-model="query.TypeName"
          placeholder="全部房型"
          size="small"
          style="width: 60%"
          @change="fetchData"
        >
          <el-option label="全部房型" :value="''" />
          <el-option
            v-for="group in roomGroups"
            :key="group.typeName"
            :label="group.typeName"
            :value="group.typeName"
          />
        </el-select>
      </el-col>
    </el-row>
    <el-table :data="tableData" border>
      <el-table-column prop="typeName" label="房型" />
      <el-table-column prop="productName" label="产品名称" />
      <el-table-column prop="breakfastCount" label="早餐" />
      <el-table-column prop="saleStrategy" label="销售策略" />
      <el-table-column prop="paymentType" label="付款方式" />
      <el-table-column label="价格">
        <template #default="scope">
          ￥{{ scope.row.minPrice }} ~ ￥{{ scope.row.maxPrice }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template #default="scope">
          <span :style="{ color: scope.row.calendarStatus ? 'green' : 'red' }">
            {{ scope.row.calendarStatus ? "启用" : "停用" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-link
            v-if="scope.row.calendarStatus"
            type="primary"
            @click="changeStatus(scope.row.id, false)"
          >
            停用
          </el-link>
          <el-link v-else type="primary" @click="changeStatus(scope.row.id, true)">启用</el-link>
          <el-link
            type="primary"
            style="margin-left: 8px"
            @click="RoomPriceCalendars(scope.row.roomTypeId)"
          >
            价格日历
          </el-link>
          <el-link type="primary" style="margin-left: 8px">编辑</el-link>
          <el-link type="danger" style="margin-left: 8px" @click="deleteRoomPrice(scope.row.id)">
            删除
          </el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { getRoomPrice } from "@/api/system/roomprice";
import { getRoomStateList } from "@/api/system/roomstate";
import { updateRoomPriceStatus, deleteRoomPriceCalendar } from "@/api/system/roomprice";
import { ElMessage } from "element-plus";
const router = useRouter();
const query = reactive({
  TypeName: "",
});
const tableData = ref([]);

const fetchData = async () => {
  const res = await getRoomPrice(query);
  tableData.value = res;
};

const onAdd = () => {
  // 新增房价计划逻辑
};
// 价格日历跳转
const RoomPriceCalendars = (id: any) => {
  // 房价日历逻辑
  router.push({
    path: "/RoomPriceCalendars",
    query: {
      ids: id,
    },
  });
};
// 房型列表
const roomGroups = ref<any[]>([]);
// 获取房型列表下拉
function loadRoomGroups(params = {}) {
  getRoomStateList(params).then((res: any) => {
    if (res) {
      roomGroups.value = res;
    } else {
      roomGroups.value = [];
    }
  });
}
// 修改房型状态
const changeStatus = async (row: any, status: boolean) => {
  await updateRoomPriceStatus(row, status);
  console.log("22221", row, status);
  ElMessage.success("启用成功");
  fetchData(); // 刷新表格
};
const deleteRoomPrice = async (row: any) => {
  ElMessageBox.confirm("确定删除吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "error",
  })
    .then(async () => {
      await deleteRoomPriceCalendar(row);
      ElMessage.success("删除成功");
      fetchData();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "删除取消",
      });
    });
};
onMounted(() => {
  fetchData();
  loadRoomGroups(); //房型列表下拉
});
</script>

<style scoped></style>
