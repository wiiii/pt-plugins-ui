<template>
  <el-container style="min-height: 100vh;">
    <el-main class="main-content">
      <el-row :gutter="20">
        <!-- 左侧账户信息 -->
        <el-col :span="8" :xs="24" :sm="8" :md="8" :lg="8" :xl="5">
          <AccountInfo :account-info="accountInfo"/>
          <BankStats :bank-stats="bankStats"/>
        </el-col>

        <!-- 右侧 Tab 内容 -->
        <el-col :span="16" :xs="24" :sm="16" :md="16" :lg="16" :xl="19">
          <el-tabs v-model="activeTab" type="card">
            <el-tab-pane label="ATM操作台" name="atm">
              <ATMForm/>
            </el-tab-pane>
            <el-tab-pane label="存取流水" name="transaction">
              <TransactionTable/>
            </el-tab-pane>
            <el-tab-pane label="利息流水" name="interest">
              <InterestTable/>
            </el-tab-pane>
            <el-tab-pane label="贷款记录" name="loan">
              <LoanTable/>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import AccountInfo from '@/components/bank/AccountInfo.vue'
import BankStats from '@/components/bank/BankStats.vue'
import ATMForm from '@/components/bank/ATMForm.vue'
import TransactionTable from '@/components/bank/TransactionTable.vue'
import InterestTable from '@/components/bank/InterestTable.vue'
import LoanTable from '@/components/bank/LoanTable.vue'

const activeTab = ref('atm')

// 示例数据（可根据接口动态加载）
const accountInfo = ref({
  userName: '星陨阁管理员',
  seedBonus: '1,234.56',
  depositMana: '5,000.00',
  depositInterest: '32.50',
  loanMana: '0.00',
  createTime: new Date().getTime()
})

const bankStats = ref({
  totalMagicPool: '1,234,567.89',
  totalUserNum: '1234',
  totalDepositNum: '987',
  totalLoanNum: '123',
  totalDeposit: '5,678,900.00',
  depositRate: 6,
  totalLoan: '1,234,500.00',
  interestRate: 18
})
</script>

<style scoped>

.header {
  background: linear-gradient(120deg, #2b4b80 0%, #1a365d 100%);
  color: white;
  text-align: center;
  padding: 20px;
}

.el-container {
  overflow-x: hidden;
}

.el-main {
  padding: 0px;
}

.header h1 {
  margin: 0;
  font-size: 24px;
}

.main-content {
  background-color: #f5f7fa;
}
</style>
