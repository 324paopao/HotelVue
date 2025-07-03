<!-- eslint-disable vue/valid-v-for -->
<template>
  <div class="reserve-record">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>住宿订单</el-breadcrumb-item>
      <el-breadcrumb-item>订房订单</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="filter-card" shadow="never">
      <!-- 快捷筛选 -->
      <div class="quick-filter">
        <el-button-group>
          <el-button>今日预抵列表</el-button>
          <el-button>今日预离列表</el-button>
          <el-button>今日抵店列表</el-button>
          <el-button>今日离店列表</el-button>
        </el-button-group>
      </div>
      <!-- 状态筛选 -->

      <!-- 时间筛选和导出 -->
      <div class="date-export" style="display: flex; align-items: center;">
        下单日期：
        <el-date-picker v-model="Seach1.Sdate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" />
        -
        <el-date-picker v-model="Seach1.Edate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" />

        <!-- <el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
          style="margin-right: 16px;" /> -->

        <el-select v-model="searchType" placeholder="房客姓名" style="width: 110px;">
          <el-option label="房客姓名" value="房客姓名" />
          <el-option label="证件号" value="证件号" />
          <el-option label="手机号" value="手机号" />
          <el-option label="房号" value="房号" />
        </el-select>
        <el-input v-model="Seach.Comman" placeholder="请输入查询关键字" style="margin-left: 8px; width: 200px;" />
        <el-button type="primary" style="margin-left: 8px;" @click="load">搜索</el-button>
      </div>
    </el-card>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="roomNum" label="房号" width="100" />
      <el-table-column prop="roomTypeName" label="房型" width="120" />
      <el-table-column prop="price" label="价钱" width="120" />
      <el-table-column prop="payStatus" label="状态" width="120">
        <template #default="scope">
          <el-tag v-if="scope.row.payStatus == 0" type="success">待支付</el-tag>
          <el-tag v-if="scope.row.payStatus == 1" type="warning">已支付</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="reserveName" label="客人姓名" width="120" />
      <el-table-column prop="sdate" label="(预)抵店时间" width="180" />
      <el-table-column prop="edate" label="(预)离店时间" width="180" />
      <el-table-column prop="infomation" label="客户类型" width="100" />
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-link v-if="scope.row.payStatus == 0" type="success" style="margin-left: 8px;"
            @click="zhifu(scope.row)">支付</el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div style="margin-top: 16px; text-align: right;">
      <el-pagination v-model:current-page="Seach1.PageIndex" v-model:page-size="Seach1.PageSize" :page-sizes="[4, 5, 6]"
        layout="total, sizes, prev, pager, next, jumper" :total="Seach1.totleCount" />
    </div>
  </div>


</template>

<script setup lang="ts">

//import AuthAPI1 from '@/api/Reserve/PayMoneey.api';
import AuthAPI from '@/api/Reserve/ReservRoom.api';
import axios from 'axios';
import { ref, reactive } from 'vue';
const searchType = ref('');
const tableData = ref()
onMounted(() => {
  load();
});
const Seach = reactive({
  Comman: ''
})
const Seach1 = reactive({
  PageIndex: 1,
  PageSize: 4,
  totleCount: 0,
  totlePage: 0,
  Status: '',
  Sdate: "",
  Edate: ""
})
watch(Seach1, () => {
  load();
})
async function load() {
  const params = {
    Status: Seach1.Status,
    Sdate: Seach1.Sdate,
    Edate: Seach1.Edate,
    Comman: Seach.Comman,
    PageIndex: Seach1.PageIndex,
    PageSize: Seach1.PageSize

  }
  console.log("条件", params)
  const res: any = await AuthAPI.RoomShow(params)
  //console.log("显示", res.data);
  tableData.value = res.data;
  Seach1.totleCount = res.totleCount;
  Seach1.totlePage = res.totlePage;

}

// const payform = reactive({
//   orderNo: '',
//   amount: '',
//   subject: '酒店预定支付'
// })
const zhifu = async (row: any) => {
  const params1 = {
    orderId: row.id,
    amount: row.price,
    subject: '酒店预定支付'
  }
  console.log("1111", row)
  console.log("12121", params1)
  axios.post('https://localhost:44384/api/alipay/pay', null, { params: params1 })
    //const res = await AuthAPI1.paymoney(params)
    .then(async res => {
      console.log("支付", res.data)
      document.write(res.data);
      // const html = await res.data
      // const div = document.createElement('div')
      // div.innerHTML = html
      // document.body.appendChild(div)
    })



  // // 创建一个临时 DOM 元素用于插入 HTML 表单

}



</script>
<style scoped>
.reserve-record {
  padding: 24px;
}

.filter-card {
  margin-bottom: 20px;
}

.quick-filter {
  margin-bottom: 12px;
}
</style>