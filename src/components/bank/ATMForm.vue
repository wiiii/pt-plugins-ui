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
            <el-input v-model="formData.depositAmount" placeholder="请输入存款金额" type="number">
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
            <el-input v-model="formData.withdrawAmount" placeholder="请输入取款金额" type="number">
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
            <el-input v-model="formData.loanAmt" placeholder="请输入贷款金额" type="number">
              <template #prepend>魔力值</template>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-input v-model="formData.loanTerm" placeholder="1" type="number">
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

import {reactive} from 'vue'

// 定义 formData 并初始化相关字段
const formData = reactive({
  depositAmount: null as number | null,
  withdrawAmount: null as number | null,
  loanAmt: null as number | null,
  loanTerm: 1 as number
})

import {deposit, drawn, getUserBankDetail, loan} from '@/api/bank'
import {ElMessage, ElMessageBox} from 'element-plus'
import {eventBus} from '@/utils/eventBus' // 导入事件总线

const handleDeposit = async () => {
  if (!formData.depositAmount || formData.depositAmount <= 0) {
    ElMessage.error('请输入正确的存款金额')
    return
  }
  let response = await deposit(formData.depositAmount)
  if (response.code === 0) {
    ElMessage.success('存款成功,存款金额为: ' + formData.depositAmount)
    await getUserBankDetail()
    eventBus.emit('refreshAccount') // 触发刷新事件
  } else {
    ElMessage.error('存款失败!' + response.msg);
  }
}

const handleWithdraw = async () => {
  if (!formData.withdrawAmount || formData.withdrawAmount <= 0) {
    ElMessage.error('请输入正确的取款金额')
    return
  }
  let drawnResponse = await drawn(formData.withdrawAmount)
  if (drawnResponse.code === 0) {
    ElMessage.success('取款成功,取款金额为: ' + formData.withdrawAmount);
    await getUserBankDetail()
    eventBus.emit('refreshAccount') // 触发刷新事件
  } else {
    ElMessage.error('取款失败!' + drawnResponse.msg)
  }
}

const handleLoan = async () => {
  // 分开校验贷款金额
  if (formData.loanAmt === null || formData.loanAmt <= 0) {
    ElMessage.error('请输入正确的贷款金额')
    return
  }

  // 分开校验贷款期限
  if (formData.loanTerm === null) {
    ElMessage.error('贷款期限不能为空')
    return
  }

  if (formData.loanTerm < 1 || formData.loanTerm > 12) {
    ElMessage.error('贷款期限必须为1~12个月之间的整数')
    return
  }
  const loanResponse = await loan({
    loanAmt: formData.loanAmt,
    loanTerm: formData.loanTerm
  })
  if (loanResponse.code === 0) {
    ElMessage.success(`贷款成功，金额为：${formData.loanAmt}，期限：${formData.loanTerm} 个月`)
    await getUserBankDetail()
    eventBus.emit('refreshAccount') // 触发刷新事件
  } else {
    ElMessage.error('贷款失败！' + loanResponse.msg)
  }
}
</script>


