<template>
  <el-card shadow="hover" style="margin-bottom: 24px;">
    <template #header>
      <div class="section-title">
        <i class="fas fa-cash-register"></i> ATM操作台
      </div>
    </template>

    <div class="operation-group">
      <div class="operation-title"><i class="fas fa-arrow-circle-up"></i> 存款操作</div>
      <el-input v-model="depositAmount" placeholder="请输入存款金额" type="number">
        <template #prepend>魔力值</template>
      </el-input>
      <el-button type="primary" icon="Upload">存入</el-button>
    </div>

    <div class="operation-group">
      <div class="operation-title"><i class="fas fa-arrow-circle-down"></i> 取款操作</div>
      <el-input v-model="withdrawAmount" placeholder="请输入取款金额" type="number">
        <template #prepend>魔力值</template>
      </el-input>
      <el-button type="primary" icon="Download">取出</el-button>
    </div>

    <div class="operation-group">
      <div class="operation-title"><i class="fas fa-comment-dollar"></i> 贷款操作</div>
      <el-input v-model="loanAmt" placeholder="请输入贷款金额" type="number">
        <template #prepend>魔力值</template>
      </el-input>
      <el-input v-model="loanTerm" placeholder="1" type="number" style="min-width:120px;width:120px">
        <template #append>月</template>
      </el-input>
      <el-button type="primary" icon="Money">贷款</el-button>
    </div>

    <div class="note">
      <p><i class="fas fa-circle" style="font-size:6px;vertical-align:middle;margin-right:5px;"></i> 存款不足24小时的次日才会产生利息，利息每月的1日结算</p>
      <p><i class="fas fa-circle" style="font-size:6px;vertical-align:middle;margin-right:5px;"></i> 贷款每期会按时扣款，可能会影响其他系统功能</p>
      <p><i class="fas fa-circle" style="font-size:6px;vertical-align:middle;margin-right:5px;"></i> 贷款时长1-12个月，提前还款需支付当月利息</p>
    </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

const depositAmount = ref('')
const withdrawAmount = ref('')
const loanAmt = ref('')
const loanTerm = ref('1')
</script>

<style scoped>
.operation-group {
  margin-bottom: 20px;
}

.operation-title {
  font-weight: 500;
  margin-bottom: 8px;
}

.note {
  margin-top: 16px;
  font-size: 12px;
  color: #777;
}
</style>
