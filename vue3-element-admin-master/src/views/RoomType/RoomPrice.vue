<template>
  <div>
    <el-row style="margin-bottom: 16px">
      <el-col :span="6">
        <el-button type="primary" @click="onAdd">新增房价计划</el-button>
      </el-col>
      <el-col :span="6" :offset="12" style="text-align: right">
        <el-select
          v-model="query.TypeName"
          placeholder="全部房型"
          style="width: 200px"
          @change="fetchData"
        >
          <el-option label="全部房型" value="" />
          <el-option v-for="item in typeNameOptions" :key="item" :label="item" :value="item" />
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
          <el-link v-if="scope.row.calendarStatus" type="primary">停用</el-link>
          <el-link v-else type="primary">启用</el-link>
          <el-link
            type="primary"
            style="margin-left: 8px"
            @click="RoomPriceCalendars(scope.row.roomTypeId)"
          >
            价格日历
          </el-link>
          <el-link type="primary" style="margin-left: 8px">编辑</el-link>
          <el-link type="primary" style="margin-left: 8px">删除</el-link>
          <el-link type="primary" style="margin-left: 8px">投放</el-link>
          <el-link type="primary" style="margin-left: 8px">礼</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { getRoomPrice } from "@/api/system/roomprice";
const router = useRouter();
const query = reactive({
  TypeName: "",
});
const tableData = ref([]);

const fetchData = async () => {
  const res = await getRoomPrice(query);
  console.log("232323", res);
  tableData.value = res;
};

const onAdd = () => {
  // 新增房价计划逻辑
};
const RoomPriceCalendars = (id: any) => {
  // 房价日历逻辑
  router.push({
    path: "/RoomPriceCalendars",
    query: {
      ids: id,
    },
  });
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped></style>
