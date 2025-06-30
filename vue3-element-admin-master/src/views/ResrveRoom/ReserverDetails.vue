<template>
  <div class="reserve-room-list">

    <el-card class="mb-20">
      <div class="section-title">预订信息</div>
      <el-form :model="form" label-width="200px" :inline="true">
        <el-form-item label="客源信息" required>
          {{ form.infomation }}
        </el-form-item>
        <el-form-item label="订单来源" required>
          {{ form.ordersource }}
        </el-form-item>
        <el-form-item label="预订姓名" required>
          {{ form.reserveName }}
        </el-form-item>
        <el-form-item label="手机号" required>
          {{ form.phone }}
        </el-form-item>
        <el-form-item>
          <el-button>查询</el-button>
        </el-form-item>
        <el-form-item label="预订单号(外部)">
          {{ form.bookingNumber }}
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mb-20">
      <div class="section-title">客房信息</div>
      <div class="room-table-wrapper">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="roomTypeName" label="房型名称" />
          <el-table-column prop="roomNum" label="房间号码" />
          <el-table-column prop="sdate" label="入住日期" />
          <el-table-column prop="edate" label="离店日期" />
          <el-table-column prop="day" label="入住天数" />
          <el-table-column prop="status" label="入住状态" />
          <el-table-column prop="price" label="房间价格" />
          <el-table-column prop="breakfast" label="早餐份数" />
        </el-table>
      </div>
    </el-card>
    <el-card class="mb-20">
      <div class="section-title">预订信息</div>
      <el-form :model="form" label-width="200px" :inline="true">
        <el-form-item label="会员状态" required>
          {{ form.infomation }}
        </el-form-item>

        <el-form-item label="手机号" required>
          {{ form.phone }}
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mb-20">
      <div class="section-title">商户备注</div>
      {{ form.message }}
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AuthAPI from "@/api/Reserve/ReservRoom.api";

const form = reactive({
  infomation: "",
  ordersource: "",
  reserveName: "",
  phone: "",
  bookingNumber: "",
  sdate: "",
  edate: "",
  day: 0,
  roomTypeid: "",
  breakfastNum: 0,
  price: 0,
  status: 0,
  roomNum: "",
  message: "",
  idCard: "",
});
onMounted(() => {
  load();
});


import { useRoute } from "vue-router";
const route = useRoute();

const tableData = ref();
const load = async () => {
  const id = route.query.ids;

  const res = await AuthAPI.FanRoom(id);
  console.log(res);
  Object.assign(form, res);
  tableData.value = res ? [res] : [];
  console.log("tableData", tableData.value);
  console.log("frpm", form)
};


</script>

<style scoped>
.reserve-room-list {
  padding: 24px;
  background: #f5f7fa;
}

.mb-20 {
  margin-bottom: 20px;
}

.section-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 12px;
}

.room-table-wrapper {
  margin-top: 10px;
}

.footer-btns {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  gap: 20px;
}
</style>
