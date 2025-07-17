<!-- eslint-disable vue/valid-v-for -->
<template>
  <div>
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
          <el-button v-if="hasAction('导出明细')" type="primary" @click="exportDetail">导出明细</el-button>
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
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 0" type="success">待入住</el-tag>
            <el-tag v-if="scope.row.status === 1" type="warning">入住中</el-tag>
            <el-tag v-if="scope.row.status === 2" type="danger">已退房</el-tag>
            <el-tag v-if="scope.row.status === 3" type="success">已结算</el-tag>
            <el-tag v-if="scope.row.status === 4" type="warning">超时未入住</el-tag>
            <el-tag v-if="scope.row.status === 5" type="danger">已取消</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reserveName" label="客人姓名" width="120" />
        <el-table-column prop="sdate" label="(预)抵店时间" width="180" />
        <el-table-column prop="edate" label="(预)离店时间" width="180" />
        <el-table-column prop="infomation" label="客户类型" width="100" />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-link v-if="hasAction('入住') && scope.row.status === 0 && scope.row.status != 5" type="primary"
              @click="Ruzhu(scope.row)">入住</el-link>

            <el-link v-if="hasAction('排房') && scope.row.roomNum === '未排房' && scope.row.status != 5" type="primary"
              style="margin-left: 8px;"
              @click="PaiFang(scope.row.roomTypeName, scope.row.roomTypeid, scope.row.id)">排房</el-link>

            <el-link v-if="scope.row.roomNum != '未排房' && scope.row.status == 1" type="primary" style="margin-left: 8px;"
              @click="NoPaiFang(scope.row.id)">取消排房</el-link>

            <el-link v-if="hasAction('取消预订') && scope.row.status === 0 && scope.row.status != 5" type="primary"
              style="margin-left: 8px;" @click="NoReseRoom(scope.row.id)">取消预订</el-link>

            <el-link v-if="hasAction('详情')" type="primary" style="margin-left: 8px;"
              @click="Detail(scope.row.id)">详情</el-link>

            <el-link v-if="scope.row.status != 0 && scope.row.status <= 1" type="warning" style="margin-left: 8px;"
              @click="TuiFang(scope.row)">退房</el-link>
            <el-link v-if="scope.row.status != 0 && scope.row.status <= 2" type="success" style="margin-left: 8px;"
              @click="Jiesuan(scope.row)">结算</el-link>
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
            <el-option v-for="item in roomList.list" :label="item.name" :value="item.name" />

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

    <el-dialog v-model="dialogFormV" title="办理入住" width="500">
      <el-form :model="fromroom">
        <el-form-item label="房型信息" :label-width="formLabelWidth">
          {{ fromroom.roomTypeName }}
        </el-form-item>
        <el-form-item label="房间号码" :label-width="formLabelWidth">
          <el-select v-model="fromroom.roomNum" placeholder="请选择房间">
            <el-option v-for="item in roomList.list" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth">
          <el-input v-model="fromroom.phone" type="text" placeholder="请填写" />
        </el-form-item>
        <el-form-item label="房客姓名" :label-width="formLabelWidth">
          <el-input v-model="fromroom.reserveName" type="text" placeholder="请填写" />
        </el-form-item>
        <el-form-item label="证件类型" :label-width="formLabelWidth">
          <el-select v-model="fromroom.typ" placeholder="" style="width: 110px;">
            <el-option label="身份证" value="身份证" />
            <el-option label="驾驶证" value="驾驶证" />
            <el-option label="护照" value="护照" />
            <el-option label="军官证" value="军官证" />
            <el-option label="士兵证" value="士兵证" />
            <el-option label="港澳通行证" value="港澳通行证" />
            <el-option label="临时身份证" value="临时身份证" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码" :label-width="formLabelWidth">
          <el-input v-model="fromroom.idCard" type="text" placeholder="请填写" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormV = false">取消</el-button>
          <el-button type="primary" @click="Queren">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="tuifangDialogVisible" title="退房" width="700px">
      <div style="display: flex; align-items: center; margin-bottom: 24px;">
        <el-checkbox v-model="tuifangForm.checked">
          原房间：{{ tuifangForm.roomTypeName }},{{ tuifangForm.roomNum }},{{ tuifangForm.statusText }}
        </el-checkbox>
        <span style="margin-left: 40px;">
          住宿时间：{{ moment(tuifangForm.sdate).format('YYYY-MM-DD') }} ~ {{ moment(tuifangForm.edate).format('YYYY-MM-DD')
          }}
          &nbsp;&nbsp; 总共{{ tuifangForm.totalNights }}晚 已住{{ tuifangForm.livedNights }}晚
        </span>
      </div>
      <template #footer>
        <el-button @click="tuifangDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleTuiFangConfirm">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="jiesuanDialogVisible" title="退房结算" width="700px">
      <div style="margin-bottom: 24px;">
        <div style="font-weight: bold; margin-bottom: 12px;">房间信息</div>
        <div style="margin-bottom: 8px;">
          房型名称：{{ jiesuanForm.roomTypeName }} &nbsp;&nbsp;
          房间号码：{{ jiesuanForm.roomNum }}
        </div>
        <div style="font-weight: bold; margin: 16px 0 8px 0;">费用明细</div>
        <div style="margin-bottom: 8px;">
          消费金额：{{ jiesuanForm.amount }} &nbsp;&nbsp;
          已收金额：{{ jiesuanForm.paidAmount }}
        </div>
        <div style="font-weight: bold; margin: 16px 0 8px 0;">支付方式</div>
        <el-form ref="jiesuanFormRef" :model="jiesuanForm" label-width="100px">
          <el-form-item label="支付方式" required>
            <el-select v-model="fromJies.businesName" placeholder="请选择项目">
              <el-option label="人民币现金" value="现金" />
              <el-option label="银行卡" value="银行卡" />
              <el-option label="微信支付" value="微信" />
              <el-option label="支付宝" value="支付宝" />
              <el-option label="汇款支付" value="汇款" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
        </el-form>
        <div style="color: #888; margin-top: 12px;">
          <div>注：</div>
          <div>· 结账后，房间将被释放，客户不可再入住。</div>
          <div>· 收款方式请根据实际收款情况选择。</div>
          <div>· 房客需在结算后离店。</div>
        </div>
        <div style="margin-top: 16px; font-weight: bold;">
          待收金额：￥{{ jiesuanForm.amount - jiesuanForm.paidAmount }}
        </div>
      </div>
      <template #footer>
        <el-button @click="jiesuanDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleJiesuanConfirm">确认</el-button>
      </template>
    </el-dialog>
  </div>

</template>

<script setup lang="ts">
import AuthAPI from '@/api/Reserve/ReservRoom.api';
import router from '@/router';
import { useStore } from '@/store/Usertinfo';
const store = useStore()
import moment from 'moment';
import { ref, reactive } from 'vue';
const searchType = ref('');
const tableData = ref()
//#region 操作权限
import { useMenuStore } from '@/store';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { exportCustomerData } from '@/api/system/customer.api';
const menuStore = useMenuStore();
const route = useRoute();
const actions = computed(() => menuStore.getActionsByPath(route.path));
console.log("actions", actions.value)
function hasAction(actionName: string) {
  return actions.value.some(a => a.name === actionName);
}
//#endregion
onMounted(() => {
  load();
  console.log('当前路由path:', route.path)
  console.log('actions:', actions.value)
  console.log('菜单:', menuStore.menuList)
});
watch(actions.value, (val) => {
  console.log('actions变化了:', val)
})
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
//导出明细
async function exportDetail() {
  try {
    // 构建导出参数，使用当前的查询条件
    const params = {
      Status: Seach1.Status,
      Sdate: Seach1.Sdate,
      Edate: Seach1.Edate,
      Comman: Seach.Comman
    };

    // 调用导出API
    const response = await AuthAPI.Export(params);

    // 创建Blob对象
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // 创建下载链接
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `预订记录-${moment().format('YYYY-MM-DD')}.xlsx`;

    // 触发下载
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败，请重试');
  }
}
//排房
const roomList: any = reactive({
  list: []
})
const dialogFormVisible = ref(false)
const visible = ref(false)
const dialogFormV = ref(false);
const formLabelWidth = '140px'
const form = reactive({
  id: '',
  rid: '',
  name: '',
  num: '',
  NoReservRoom: '',
  Userid: store.id

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
  const params = { roomnum: form.num, id: form.rid, userid: store.id }
  const res = await AuthAPI.RoomOrderby(params)
  console.log("12121212", res)
  ElMessage.success("排房成功");
  dialogFormVisible.value = false;
  form.num = '';
  load();

}
//取消排房
const NoPaiFang = async (id: any) => {
  await AuthAPI.RoomNoOrderby(id);
  ElMessage.success("取消排房成功");
  load();
}
const NoReseRoom = (id: any) => {
  form.rid = id;
  visible.value = true;
}
//取消预订
const Notressave = async () => {
  const params = { NoReservRoom: form.NoReservRoom, id: form.rid, userid: store.id }
  await AuthAPI.NotReserveRoom(params);
  ElMessage.success("取消预定成功");
  form.NoReservRoom = "";
  visible.value = false;
  load();
}
//入住
const fromroom: any = reactive({
  id: '',
  ids: '',
  roomTypeName: "",
  roomNum: "",
  phone: "",
  reserveName: '',
  idCard: "",
  typ: '',
  userid: store.id
})
const Ruzhu = (Row: any) => {
  dialogFormV.value = true;
  fromroom.id = Row.id;
  fromroom.ids = Row.roomTypeid;
  fromroom.roomTypeName = Row.roomTypeName;
  fromroom.phone = Row.phone;
  fromroom.reserveName = Row.reserveName;
  fromroom.idCard = Row.idCard;
  fromroom.roomNum = Row.roomNum;
  Paiload1()
}
const Paiload1 = async () => {
  const params = { guid: fromroom.ids };
  const res = await AuthAPI.getRoomNum(params)
  console.log("显示", res)
  roomList.list = res
  //roomList.list = res;
}
const Queren = async () => {
  const params = {
    id: fromroom.id,
    roomNum: fromroom.roomNum,
    phone: fromroom.phone,
    reserveName: fromroom.reserveName,
    idCard: fromroom.idCard,
    userid: store.id
  }
  console.log("1213123123", params)
  await AuthAPI.ZhuRoom(params);
  ElMessage.success("入住成功");
  fromroom.id = "";
  fromroom.idCard = "";
  fromroom.phone = "";
  fromroom.reserveName = "";
  fromroom.roomNum = "";
  fromroom.roomTypeName = "";
  fromroom.typ = "";
  dialogFormV.value = false;
  load();
}
//退房
const tuifangDialogVisible = ref(false)
// 打开退房弹窗
const tuifangForm = reactive({
  checked: false,
  roomTypeName: '',
  roomNum: '',
  statusText: '',
  sdate: '',
  edate: '',
  totalNights: 0,
  livedNights: 0,
  id: ''
})
// 计算天数的工具函数
function getNights(sdate: string, edate: string) {
  if (!sdate || !edate) return 0
  const start = new Date(sdate)
  const end = new Date(edate)
  return Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
}
const TuiFang = (row: any) => {
  tuifangForm.checked = false
  tuifangForm.roomTypeName = row.roomTypeName
  tuifangForm.roomNum = row.roomNum
  tuifangForm.statusText = row.status || '入住中'
  tuifangForm.sdate = row.sdate
  tuifangForm.edate = row.edate
  tuifangForm.totalNights = getNights(row.sdate, row.edate)
  // 这里假设已住晚数为今天-入住日+1
  const today = new Date()
  const start = new Date(row.sdate)
  tuifangForm.livedNights = Math.min(
    tuifangForm.totalNights,
    Math.max(1, Math.round((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1)
  )
  tuifangForm.id = row.id
  tuifangDialogVisible.value = true
}

// 确认退房
async function handleTuiFangConfirm() {
  if (!tuifangForm.checked) {
    ElMessage.warning('请勾选原房间')
    return
  }
  const params = ({ id: tuifangForm.id })
  console.log("121212", params)
  // 这里写退房的接口调用
  await AuthAPI.NoRoom(tuifangForm.id)
  ElMessage.success('退房成功')
  tuifangDialogVisible.value = false
  load() // 退房后刷新列表
}

//结算
const jiesuanDialogVisible = ref(false)
const jiesuanFormRef = ref()
const jiesuanForm = reactive({
  roomTypeName: '',
  roomNum: '',
  amount: 0,
  paidAmount: 0,
  payType: ''
})


// 打开结算弹窗

const fromJies = reactive({
  bookingNumber: "",
  businesName: "",
  money: 0,
  money1: 0,
  message: "",
  loginName: ""
})


function Jiesuan(row: any) {
  fromJies.bookingNumber = row.id
  fromJies.money1 = row.price
  jiesuanForm.roomTypeName = row.roomTypeName
  jiesuanForm.roomNum = row.roomNum
  jiesuanForm.amount = row.price
  jiesuanForm.paidAmount = row.paidAmount || 0
  jiesuanForm.payType = ''
  jiesuanDialogVisible.value = true
}

// 确认结算
async function handleJiesuanConfirm() {

  // 这里写结算的接口调用
  await AuthAPI.RoomJiesuan(fromJies)
  ElMessage.success('结算成功')
  jiesuanDialogVisible.value = false
  load() // 结算后刷新列表
}

//详情
const Detail = (id: any) => {
  // router.push({
  //   path: '/ReserverDetails',
  //   query: {
  //     ids: id
  //   }
  // })
  router.push({
    path: '/ReserverDetails',
    query: {
      ids: id
    }
  })
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