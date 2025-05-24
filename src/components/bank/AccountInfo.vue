<template>
  <el-card shadow="hover" style="margin-bottom: 24px;">
    <template #header>
      <div class="section-title">
        <i class="fas fa-user-circle"></i> 账户信息
      </div>
    </template>
    <table class="info-table">
      <tbody>
      <tr v-if="loading">
        <td colspan="2" style="text-align:center; padding: 20px;">
          <el-spin/>
          加载中...
        </td>
      </tr>
      <tr v-else>
        <td><i class="fas fa-user"></i> 用户名</td>
        <td>{{ accountInfo.userName || '******' }}</td>
      </tr>
      <tr v-if="!loading">
        <td><i class="fas fa-bolt"></i> 当前魔力</td>
        <td><span class="amount">{{ accountInfo.seedBonus || '0.00' }}</span></td>
      </tr>
      <tr v-if="!loading">
        <td><i class="fas fa-piggy-bank"></i> 存款金额</td>
        <td><span class="amount deposit-amount">{{ accountInfo.depositMana || '0.00' }}</span></td>
      </tr>
      <tr v-if="!loading">
        <td><i class="fas fa-chart-line"></i> 活期利息</td>
        <td>
          <span class="amount">{{ accountInfo.depositInterest || '0.00' }}</span>
          <span style="color:#888;font-size:12px;">(待结算)</span>
        </td>
      </tr>
      <tr v-if="!loading">
        <td><i class="fas fa-money-bill-wave"></i> 贷款金额</td>
        <td><span class="amount loan-amount">{{ accountInfo.loanMana || '0.00' }}</span></td>
      </tr>
      <tr v-if="!loading">
        <td><i class="fas fa-calendar-plus"></i> 开户时间</td>
        <td>{{ accountInfo.createTime ? formatDate(accountInfo.createTime) : '未知' }}</td>
      </tr>
      <tr v-if="error">
        <td colspan="2" style="text-align:center; color:red; padding: 20px;">
          {{ error }}
        </td>
      </tr>
      </tbody>
    </table>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { checkAccount, createUserAccount, getUserBankDetail } from '@/api/bank'
import { formatDate } from '@/utils/date'
import { ElMessage } from 'element-plus';
import { eventBus } from '@/utils/eventBus' // 导入事件总线

interface AccountInfo {
  userName?: string
  seedBonus?: string
  depositMana?: string
  depositInterest?: string
  loanMana?: string
  createTime?: number
}

const accountInfo = ref<AccountInfo>({})
const loading = ref(true)
const error = ref<string | null>(null)

async function initAccountInfo() {
  try {
    const hasAccount = await checkAccount()
    let data: AccountInfo = {}

    if (hasAccount.code !== 0 || !hasAccount.data) {
      const createResult = await createUserAccount()
      if (createResult.code !== 0) {
        ElMessage.error(createResult.msg)
      } else {
        ElMessage.success('恭喜!账户自动创建成功!')
      }
    } else {
      const userBankDetailData = await getUserBankDetail()
      if (userBankDetailData.code == 0) {
        data = userBankDetailData.data
      } else {
        ElMessage.error(userBankDetailData.msg);
      }
      accountInfo.value = data
      error.value = null
    }
  } catch (err: any) {
    console.error('初始化账户信息失败:', err)
    error.value = '加载账户信息失败，请刷新重试'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  initAccountInfo()

  // 监听刷新事件
  eventBus.on('refreshAccount', initAccountInfo)
})

onBeforeUnmount(() => {
  // 组件卸载时移除监听器
  eventBus.off('refreshAccount', initAccountInfo)
})
</script>

<style scoped>
.section-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.info-table td {
  padding: 10px 10px;
  border-bottom: 1px solid #eee;
}

.info-table td:first-child {
  font-weight: 500;
  color: #333;
  width: 40%;
}

.amount {
  font-weight: 600;
  font-size: 14px;
  color: var(--primary);
}

.deposit-amount {
  color: #52c41a;
}

.loan-amount {
  color: #ff4d4f;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .info-table td {
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }

  .info-table tr {
    display: block;
    margin-bottom: 10px;
  }
}
</style>
