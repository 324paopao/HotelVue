<template>
  <el-calendar v-model="calendarDate">
    <template #dateCell="{ date }">
      <div>
        <div v-if="priceMap[dateStr(date)]">￥{{ priceMap[dateStr(date)].calendarPrice }}</div>
      </div>
    </template>
  </el-calendar>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getRoomPriceCalendars } from "@/api/system/roomprice";

const route = useRoute();
const calendarDate = ref(new Date());
const priceMap = ref<Record<string, any>>({});

function dateStr(date: Date) {
  return date.toISOString().split("T")[0];
}

const fetchData = async () => {
  const res = await getRoomPriceCalendars({
    roomTypeId: route.params.id,
  });
  const arr = res.data?.data || res.data || [];
  priceMap.value = {};
  arr.forEach((item: any) => {
    const key = item.calendarDate.split("T")[0];
    priceMap.value[key] = item;
  });
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.calendar-table {
  width: 100%;
  border-collapse: collapse;
}
.calendar-table th,
.calendar-table td {
  border: 1px solid #eee;
  text-align: center;
  height: 80px;
  vertical-align: top;
}
.today {
  background: #e6f7ff;
}
</style>
