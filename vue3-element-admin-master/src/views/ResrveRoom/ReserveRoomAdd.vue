<template>
  <div class="reserve-room-list">
    <el-breadcrumb separator="-">
      <el-breadcrumb-item>房态</el-breadcrumb-item>
      <el-breadcrumb-item>办理预订</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="mb-20">
      <div class="section-title">预订信息</div>
      <el-form :model="form" label-width="200px" :inline="true">
        <el-form-item label="客源信息" required>
          <el-select v-model="form.infomation" placeholder="请选择" style="width: 120px">
            <el-option label="散客" value="散客" />
            <el-option label="协议单位" value="协议单位" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单来源" required>
          <el-select v-model="form.ordersource" placeholder="门店前台" style="width: 120px">
            <el-option label="门店前台" value="门店前台" />
            <el-option label="OTA" value="OTA" />
          </el-select>
        </el-form-item>
        <el-form-item label="预订姓名" required>
          <el-input v-model="form.reserveName" placeholder="请输入预订姓名" />
        </el-form-item>
        <el-form-item label="手机号" required>
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item>
          <el-button>查询</el-button>
        </el-form-item>
        <el-form-item label="预订单号(外部)">
          <el-input v-model="form.bookingNumber" placeholder="请输入预订单号" />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mb-20">
      <div class="section-title">房间信息</div>
      <el-form :model="form" label-width="120px" :inline="true">
        <el-form-item label="入住日期" required>
          <el-date-picker v-model="form.sdate" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="离店日期" required>
          <el-date-picker v-model="form.edate" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="入住天数" required>
          <el-input v-model="form.day" disabled />
        </el-form-item>
      </el-form>
      <div class="room-table-wrapper">
        <el-table :data="roomTypes" border style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" />
          <el-table-column prop="name" label="房型列表" />
          <!-- <el-table-column prop="canReserve" label="可定数" /> -->
          <el-table-column prop="price" label="门市价" />
          <!-- <el-table-column prop="avgPrice" label="房间均价" /> -->
          <el-table-column prop="" label="房间数量">
            {{ 1 }}
          </el-table-column>

          <!-- <el-table-column prop="sort" label="排序">
            <div v-if="form.roomNum = ''">未排房</div>
            <div v-else>
              {{ form.roomNum }}
            </div>
          </el-table-column> -->

          <el-table-column prop="breakfast" label="早餐份数">
            <el-input v-model="form.breakfastNum" size="small" placeholder="请输入" />
          </el-table-column>

          <el-table-column prop="price" label="自定义价格">
            <template #default="scop">
              <el-input v-model="scop.row.price" size="small" />
            </template>
          </el-table-column>

        </el-table>
      </div>
    </el-card>

    <el-card class="mb-20">
      <div class="section-title">商户备注</div>
      <el-input v-model="form.message" type="textarea" placeholder="商户备注" />
    </el-card>

    <div class="footer-btns">
      <el-button type="primary" @click="save">确定</el-button>
      <el-button>取消</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import AuthAPI from "@/api/Reserve/ReservRoom.api";
import { useStore } from '@/store/Usertinfo';
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const form = reactive({
  infomation: "",
  ordersource: "",
  reserveName: "",
  phone: "",
  bookingNumber: Date.now() + Math.random().toString(36).substr(2, 9),
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
  aaa: [],
  userid: store.id,


});

const roomTypes = ref();
onMounted(() => {
  load();
});

const load = async () => {
  const res = await AuthAPI.getCaptcha();
  console.log(res);
  roomTypes.value = res;
};
watch(
  () => [form.sdate, form.edate],
  ([start, end]) => {
    if (start && end) {
      const s = new Date(start).getTime();
      const e = new Date(end).getTime();
      form.day = Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)));
    }
  }
);

function handleSelectionChange(selection: any) {
  form.aaa = selection;
  // 你可以在这里做其它操作，比如
  console.log("1213", form.aaa);
}

const save = () => {
  const res = AuthAPI.RoomAdd(form);
  console.log("qweqw", res);
  ElMessage.success("添加成功");
  router.push('/ReserverGetlist')
}
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
