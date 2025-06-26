<template>
  <div class="reserve-record">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>住宿订单</el-breadcrumb-item>
      <el-breadcrumb-item>住宿记录</el-breadcrumb-item>
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
      <div class="status-filter" style="margin: 16px 0;">
        <el-radio-group v-model="Seach1.Status">
          <el-radio-button label="全部" value="" />
          <el-radio-button label="待入住" :value="0" />
          <el-radio-button label="入住中" :value="1" />
          <el-radio-button label="已退房" :value="2" />
          <el-radio-button label="已结算" :value="3" />
          <el-radio-button label="超时未入住" :value="4" />
          <el-radio-button label="已取消" :value="5" />
        </el-radio-group>
      </div>
      <!-- 时间筛选和导出 -->
      <div class="date-export" style="display: flex; align-items: center;">
        下单日期：
        <el-date-picker v-model="Seach1.Sdate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" />
        -
        <el-date-picker v-model="Seach1.Edate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" />

        <!-- <el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
          style="margin-right: 16px;" /> -->
        <el-button type="primary" @click="exportDetail">导出明细</el-button>
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
      <el-table-column prop="status" label="状态" width="120" />
      <el-table-column prop="reserveName" label="客人姓名" width="120" />
      <el-table-column prop="sdate" label="(预)抵店时间" width="180" />
      <el-table-column prop="edate" label="(预)离店时间" width="180" />
      <el-table-column prop="infomation" label="客户类型" width="100" />
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-link v-if="scope.row.status === 0 && scope.row.status != 5" type="primary" @click="">入住</el-link>

          <el-link v-if="scope.row.roomNum === '未排房' && scope.row.status != 5" type="primary" style="margin-left: 8px;"
            @click="PaiFang(scope.row.roomTypeName, scope.row.roomTypeid, scope.row.id)">排房</el-link>

          <el-link v-if="scope.row.roomNum != '未排房' && scope.row.status != 5" type="primary" style="margin-left: 8px;"
            @click="NoPaiFang(scope.row.id)">取消排房</el-link>

          <el-link v-if="scope.row.status === 0 && scope.row.status != 5" type="primary" style="margin-left: 8px;"
            @click="NoReseRoom(scope.row.id)">取消预订</el-link>

          <el-link type="primary" style="margin-left: 8px;">详情</el-link>

          <el-link v-if="scope.row.status === '入住中' && scope.row.status != 5" type="warning"
            style="margin-left: 8px;">退房</el-link>
          <el-link v-if="scope.row.status === '入住中' && scope.row.status != 5" type="success"
            style="margin-left: 8px;">结算</el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div style="margin-top: 16px; text-align: right;">
      <el-pagination v-model:current-page="Seach1.PageIndex" v-model:page-size="Seach1.PageSize"
        :page-sizes="[3, 4, 5, 6]" layout="total, sizes, prev, pager, next, jumper" :total="Seach1.totleCount" />
    </div>
  </div>

  <el-dialog v-model="dialogFormVisible" title="排房" width="500">
    <el-form :model="form">
      <el-form-item :label="form.name" :label-width="formLabelWidth">
        <el-select v-model="form.num" placeholder="请选择房间">
          <el-option :label="item.name" :value="item.name" v-for="item in roomList.list" />

        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="Queding">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="visible" title="确定取消订单" width="600px">
    <div style="margin-bottom: 16px; color: #666;">
      取消后，如已支付（现金、积分、优惠券、现金券、余额）将全部退回客户账户
    </div>
    <el-form :model="form">
      <el-form-item>
        <div style="margin-bottom: 8px;">是否确定？</div>
        <el-input v-model="form.NoReservRoom" type="textarea" :rows="4" placeholder="请填写取消原因" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="Notressave">确认</el-button>
    </template>
  </el-dialog>

</template>

<script setup lang="ts">
import AuthAPI from '@/api/Reserve/ReservRoom.api';
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
  PageSize: 2,
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

function exportDetail() {
  // 导出明细逻辑
}

//排房

const roomList: any = reactive({
  list: []
})
const dialogFormVisible = ref(false)
const visible = ref(false)
const formLabelWidth = '140px'
const form = reactive({
  id: '',
  rid: '',
  name: '',
  num: '',
  NoReservRoom: ''

})

const PaiFang = (name: any, id: any, rid: any) => {
  dialogFormVisible.value = true;
  form.name = name;
  form.id = id;
  form.rid = rid;
  Paiload();
}
const Paiload = async () => {
  const params = { guid: form.id };
  const res = await AuthAPI.getRoomNum(params)
  console.log("显示", res)
  roomList.list = res
  //roomList.list = res;
}

const Queding = async () => {
  const params = { roomnum: form.num, id: form.rid }
  const res = await AuthAPI.RoomOrderby(params)
  console.log("12121212", res)
  ElMessage.success("排房成功");
  dialogFormVisible.value = false;
  form.num = '';
  load();

}

const NoPaiFang = async (id: any) => {
  const res = await AuthAPI.RoomNoOrderby(id);
  ElMessage.success("取消排房成功");
  load();
}

const NoReseRoom = (id: any) => {
  form.rid = id;
  visible.value = true;
}

const Notressave = async () => {
  const params = { NoReservRoom: form.NoReservRoom, id: form.rid }
  await AuthAPI.NotReserveRoom(params);
  ElMessage.success("取消预定成功");
  form.NoReservRoom = "";
  visible.value = false;
  load();
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