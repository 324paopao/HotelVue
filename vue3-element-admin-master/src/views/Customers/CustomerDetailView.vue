<template>
  <el-card>
    <div class="header-row">
      <el-avatar :size="100" :src="customer.avatar || defaultAvatar" class="avatar"/>
      <div class="header-info">
        <div class="info-row">
          <div class="info-col">
            <div>微信昵称：{{ customer.customerNickName || '--' }}</div>
            <div>卡号：{{ customer.customerNumber || '--' }}</div>
            <div>剩余积分：{{ customer.availablePoints || 0 }}</div>
          </div>
          <div class="info-col">
            <div>等级：{{ customer.customerTypeName || '--' }}</div>
            <div>可用余额：{{ customer.availableBalance || 0 }}</div>
            <div>成为会员时间：{{ customer.createdTime || '--' }}</div>
            <div>会员状态：{{ customer.status === false ? '冻结' : '正常' }}</div>
            <div>成长值：{{ customer.growthValue || 0 }}</div>
          </div>
        </div>
        <div class="action-row">
          <el-button>送积分</el-button>
          <el-button>送优惠券</el-button>
          <el-button>修改等级</el-button>
          <el-button>充值</el-button>
          <el-button>消费</el-button>
          <el-button>修改余额</el-button>
        </div>
      </div>
    </div>
    <el-divider />
    <div>
      <h3>个人信息</h3>
      <div>姓名：{{ customer.customerName || '--' }}</div>
      <div>手机号：{{ customer.phoneNumber || '--' }}</div>
      <div>性别：{{ customer.gender === 0 ? '男' : customer.gender === 1 ? '女' : '--' }}</div>
      <div>生日：{{ customer.birthday ? (customer.birthday + '').slice(0, 10) : '--' }}</div>
      <div>详细地址：{{ customer.address || '--' }}</div>
    </div>
    <el-divider />
    <div class="info-blocks">
      <div>
        <h4>消费信息</h4>
        <div>消费次数：{{ customer.comsumerNumber || 0 }}</div>
        <div>累计消费金额：{{ customer.accumulativeconsumption || 0 }}</div>
        <div>平均消费金额：{{ customer.avgConsumption || 0 }}</div>
        <div>上次消费时间：{{ customer.lastConsumerTime || '--' }}</div>
      </div>
      <div>
        <h4>储值账户</h4>
        <div>账户余额：￥{{ customer.availableBalance || 0 }}</div>
        <div>累计充值次数：{{ customer.rechargeCount || 0 }}</div>
        <div>累计充值金额：￥{{ customer.rechargeAmount || 0 }}</div>
      </div>
      <div>
        <h4>积分</h4>
        <div>剩余积分：{{ customer.availablePoints || 0 }}</div>
        <div>累计积分：{{ customer.accumulativeintegral || 0 }}</div>
      </div>
      <div>
        <h4>优惠券</h4>
        <div>剩余可用优惠券：{{ customer.couponCount || 0 }}张</div>
        <div>累计领券：{{ customer.couponReceived || 0 }}张</div>
        <div>累计用券：{{ customer.couponUsed || 0 }}张</div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getCustomerDetailById } from '@/api/system/customer.api';

const route = useRoute();
const customer = ref<any>({});
const defaultAvatar = '/default-avatar.png'; // 可替换为你的默认头像

onMounted(async () => {
  
  const id = route.params.id as string;
  try {
    const res = await getCustomerDetailById(id);
    customer.value = res;
  } catch {
    ElMessage.error('获取客户详情失败');
  }
});
</script>

<style scoped>
.header-row {
  display: flex;
  align-items: flex-start;
  gap: 32px;
}
.avatar {
  flex-shrink: 0;
}
.header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.info-row {
  display: flex;
  gap: 48px;
  margin-bottom: 16px;
}
.info-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
}
.action-row {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}
.info-blocks {
  display: flex;
  gap: 32px;
  margin-top: 24px;
}
.info-blocks > div {
  flex: 1;
  background: #fafbfc;
  padding: 16px;
  border-radius: 8px;
}
</style> 