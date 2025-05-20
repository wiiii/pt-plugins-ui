<template>
  <div class="section">
    <div class="section-title"><i class="fas fa-hand-holding-usd"></i> 贷款记录</div>
    <el-table :data="records" border style="width:100%">
      <el-table-column prop="loanStartDate" label="贷款时间" width="180"></el-table-column>
      <el-table-column prop="loanStatus" label="状态" width="100">
        <template #default="scope">
          <span class="badge badge-primary" v-if="scope.row.loanStatus === '正常'">
            <i class="fas fa-sync"></i> 正常
          </span>
          <span class="badge badge-success" v-else-if="scope.row.loanStatus === '结清'">
            <i class="fas fa-check-circle"></i> 结清
          </span>
          <span class="badge badge-danger" v-else>
            <i class="fas fa-exclamation-circle"></i> 逾期
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="loanAmt" label="贷款金额">
        <template #default="scope">
          <span class="amount" style="color:#ff4d4f;">{{ scope.row.loanAmt }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="loanTerm" label="期限">
        <template #default="scope">{{ scope.row.loanTerm }}月</template>
      </el-table-column>
      <el-table-column label="总还款额">
        <template #default="scope">
          <span class="amount" style="color:#ff4d4f;">{{ Number(scope.row.loanAmt) + 100 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="loanEndDate" label="结束日期"></el-table-column>
    </el-table>

    <div v-if="!records.length" class="no-data">
      <i class="fas fa-file-invoice-dollar" style="font-size:40px;color:#ddd;"></i>
      <p>暂无贷款记录</p>
    </div>

    <el-pagination layout="prev, pager, next" :total="100"></el-pagination>
  </div>
</template>

<script setup lang="ts">
const records = [
  { loanStartDate: '2025-04-05', loanStatus: '正常', loanAmt: '1000.00', loanTerm: 12, loanEndDate: '2026-04-05' },
  { loanStartDate: '2024-01-05', loanStatus: '结清', loanAmt: '500.00', loanTerm: 6, loanEndDate: '2024-07-05' }
]
</script>
