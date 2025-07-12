<template>
  <el-calendar v-model="calendarDate">
    <template #date-cell="{ data }">
      <div @click="onDateClick(data)">
        <span>{{ data.day.split("-").slice(1).join("-") }}</span>
        <div v-if="priceMap[data.day]" style="font-weight: bold">
          ￥{{ priceMap[data.day].calendarPrice }}
        </div>
      </div>
    </template>
  </el-calendar>

  <el-dialog v-model="dialogVisible" title="修改价格" width="500px">
    <el-form :model="editForm">
      <el-form-item label="价格" required>
        <el-input v-model="editForm.calendarPrice" />
      </el-form-item>
      <el-form-item label="重复" required>
        <el-select v-model="editForm.repeatType">
          <el-option label="仅当天" value="仅当天" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="onSubmit">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  getRoomPriceCalendars,
  updateRoomPriceCalendar,
} from "@/api/system/roomprice";
import { ElMessage } from "element-plus";

const route = useRoute();
const calendarDate = ref(new Date());
const priceMap = ref<Record<string, any>>({});

const dialogVisible = ref(false);
const editForm = ref({
  roomTypeId: "", // 房型id
  priceTableId: "", // 价钱表主键
  calendarDate: "", // 当前日期
  calendarPrice: "", // 价格
  repeatType: "仅当天", // 重复类型
  calendarsId: "", //日历id
});
// 获取房间价格日历
const fetchData = async () => {
  const roomTypeId = route.query.ids; // 关键点
  const res = await getRoomPriceCalendars({
    roomTypeId,
  });
  const arr = res.data?.data || res.data || res || [];
  priceMap.value = {};
  arr.forEach((item: any) => {
    const key = item.calendarDate.split(" ")[0].split("T")[0];
    priceMap.value[key] = item;
  });
};
//修改房间价格日历
const onDateClick = (data: any) => {
  // 1. 当前日期
  editForm.value.calendarDate = data.day;
  // 2. 房型id
  editForm.value.roomTypeId = route.query.ids;
  // 3. 日历表主键
  if (priceMap.value[data.day]) {
    editForm.value.calendarsId = priceMap.value[data.day].id;
    editForm.value.calendarPrice = priceMap.value[data.day].calendarPrice;
    // 4. 价钱表主键（如有）
    editForm.value.priceTableId = priceMap.value[data.day].priceTableId || "";
    console.log("priceMap.value[data.day]", priceMap.value[data.day].id);
  } else {
    // 新增时主键为空
    editForm.value.calendarPrice = "";
    editForm.value.priceTableId = "";
  }
  dialogVisible.value = true;
};

const onSubmit = async () => {
  // 构造请求体
  const payload = {
    roomTypeId: editForm.value.roomTypeId,
    priceTableId: editForm.value.priceTableId,
    calendarDate: editForm.value.calendarDate,
    calendarPrice: editForm.value.calendarPrice,
    calendarsId: editForm.value.calendarsId,
  };

  await updateRoomPriceCalendar(payload);
  ElMessage.success("修改成功");
  dialogVisible.value = false;
  fetchData(); // 刷新日历
};

onMounted(() => {
  fetchData();
});
</script>

<style>
.is-selected {
  color: #1989fa;
}
</style>
