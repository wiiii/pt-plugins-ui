<template>
  <el-card shadow="hover" style="margin-bottom: 24px;">
    <template #header>
      <div class="section-title">
        <i class="fas fa-cash-register"></i> ATM操作台
      </div>
    </template>

    <el-form label-position="top" :model="formData" ref="formRef">

      <!-- 存款操作 -->
      <el-form-item label="存款操作">
        <el-row :gutter="12">
          <el-col :span="16">
            <el-input v-model="depositAmount" placeholder="请输入存款金额" type="number">
              <template #prepend>魔力值</template>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-button @click="handleDeposit" type="primary" icon="Upload" style="width: 100%;">
              <i class="fas fa-arrow-circle-up"></i> 存入
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 取款操作 -->
      <el-form-item label="取款操作">
        <el-row :gutter="12">
          <el-col :span="16">
            <el-input v-model="withdrawAmount" placeholder="请输入取款金额" type="number">
              <template #prepend>魔力值</template>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-button @click="handleWithdraw" type="primary" icon="Download" style="width: 100%;">
              <i class="fas fa-arrow-circle-down"></i> 取出
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 贷款操作 -->
      <el-form-item label="贷款操作">
        <el-row :gutter="12">
          <el-col :span="10">
            <el-input v-model="loanAmt" placeholder="请输入贷款金额" type="number">
              <template #prepend>魔力值</template>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-input v-model="loanTerm" placeholder="1" type="number">
              <template #append>月</template>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button @click="handleLoan" type="primary" icon="Money" style="width: 100%;">
              <i class="fas fa-hand-holding-usd"></i> 贷款
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>

    </el-form>

    <!-- 提示信息 -->
    <div class="note">
      <p><i class="fas fa-circle" style="font-size:6px;vertical-align:middle;margin-right:5px;"></i>
        存款不足24小时的次日才会产生利息，利息每月的1日结算</p>
      <p><i class="fas fa-circle" style="font-size:6px;vertical-align:middle;margin-right:5px;"></i>
        贷款每期会按时扣款，可能会影响其他系统功能</p>
      <p><i class="fas fa-circle" style="font-size:6px;vertical-align:middle;margin-right:5px;"></i>
        贷款时长1-12个月，提前还款需支付当月利息</p>
    </div>
  </el-card>
</template>
<script setup lang="ts">
import {ref} from 'vue'
import {deposit, drawn, getUserBankDetail, loan} from '@/api/bank'
import {ElMessage, ElMessageBox} from 'element-plus'
import {eventBus} from '@/utils/eventBus' // 导入事件总线

const depositAmount = ref<number | null>(null)
const withdrawAmount = ref<number | null>(null)
const loanAmt = ref<number | null>(null)
const loanTerm = ref<number | null>(1)

const handleDeposit = async () => {
  if (!depositAmount.value || depositAmount.value <= 0) {
    ElMessage.error('请输入正确的存款金额')
    return
  }
  let response = await deposit(depositAmount.value)
  if (response.code === 0) {
    ElMessage.success('存款成功,存款金额为: ' + depositAmount.value)
    await getUserBankDetail()
    eventBus.emit('refreshAccount') // 触发刷新事件
  } else {
    ElMessage.error('存款失败!' + response.msg);
  }
}

const handleWithdraw = async () => {
  if (!withdrawAmount.value || withdrawAmount.value <= 0) {
    ElMessage.error('请输入正确的取款金额')
    return
  }
  let drawnResponse = await drawn(withdrawAmount.value)
  if (drawnResponse.code === 0) {
    ElMessage.success('取款成功,取款金额为: ' + withdrawAmount.value);
    await getUserBankDetail()
    eventBus.emit('refreshAccount') // 触发刷新事件
  } else {
    ElMessage.error('取款失败!' + drawnResponse.msg)
  }
}

const handleLoan = async () => {
  // 分开校验贷款金额
  if (loanAmt.value === null || loanAmt.value <= 0) {
    ElMessage.error('请输入正确的贷款金额')
    return
  }

  // 分开校验贷款期限
  if (loanTerm.value === null) {
    ElMessage.error('贷款期限不能为空')
    return
  }

  if (loanTerm.value < 1 || loanTerm.value > 12) {
    ElMessage.error('贷款期限必须为1~12个月之间的整数')
    return
  }

  try {
    ElMessageBox.confirm(
        `确定申请贷款 ${loanAmt.value} 魔力值，期限为 ${loanTerm.value} 个月吗？`,
        '贷款确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          const loanRespone = loan({loanAmt: loanAmt.value, loanTerm: loanTerm.value})
          if (loanRespone.code === 0) {
            ElMessage.success(`贷款成功，金额为：${loanAmt.value}，期限：${loanTerm.value} 个月`)
            getUserBankDetail()
            eventBus.emit('refreshAccount')
          } else {
            ElMessage.error('贷款失败！' + loanRespone.msg)
          }
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: 'Delete canceled',
          })
        })
  } catch (e) {
    ElMessage.info('已取消贷款')
  }
}
</script>


