<template>
  <div class="section">
    <div class="section-title">
      <i class="fas fa-hand-holding-usd"></i> 贷款记录
    </div>

    <el-table :data="records" border style="width:100%">
      <el-table-column prop="loanStartDate" label="贷款时间" width="180"></el-table-column>
      <el-table-column prop="loanStatus" label="状态" width="120">
        <template #default="scope">
          <span class="badge" :class="{
              primary: scope.row.loanStatus === '正常',
              success: scope.row.loanStatus === '结清',
              danger: scope.row.loanStatus === '逾期'
            }">
            <i class="fas"
               :class="{
                 'fa-sync': scope.row.loanStatus === '正常',
                 'fa-check-circle': scope.row.loanStatus === '结清',
                 'fa-exclamation-circle': scope.row.loanStatus === '逾期'
               }"></i>
            {{ scope.row.loanStatus }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="loanAmt" label="贷款金额">
        <template #default="scope">
          <span class="amount loan">{{ scope.row.loanAmt }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="loanTerm" label="期限">
        <template #default="scope">{{ scope.row.loanTerm }}月</template>
      </el-table-column>
      <el-table-column label="总还款额">
        <template #default="scope">
          <span class="amount repay">{{ Number(scope.row.loanAmt) + 100 }}</span>
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
import { ref } from 'vue';

const records = ref([
  {
    loanStartDate: '2025-04-05',
    loanStatus: '正常',
    loanAmt: '1000.00',
    loanTerm: 12,
    loanEndDate: '2026-04-05'
  },
  {
    loanStartDate: '2024-01-05',
    loanStatus: '结清',
    loanAmt: '500.00',
    loanTerm: 6,
    loanEndDate: '2024-07-05'
  }
]);
</script>

<style scoped>
.section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.el-table {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  overflow: hidden;
}

.el-table th {
  background-color: #f5f7fa;
  color: #1a1a1a;
  font-weight: 600;
}

.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #f9f9f9;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: 13px;
  border-radius: 4px;
  font-weight: 500;
}

.badge.primary {
  background-color: #e6f7ff;
  color: #1890ff;
}

.badge.success {
  background-color: #f6ffed;
  color: #52c41a;
}

.badge.danger {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.amount {
  display: inline-block;
  padding: 4px 8px;
  font-weight: 500;
  border-radius: 4px;
}

.amount.loan {
  color: #ff4d4f;
  background-color: #fff1f0;
}

.amount.repay {
  color: #ff4d4f;
  background-color: #fff1f0;
}

.no-data {
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-size: 14px;
}

.no-data i {
  font-size: 40px;
  color: #ddd;
  margin-bottom: 10px;
}

.el-pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

.el-pagination .btn-prev,
.el-pagination .btn-next,
.el-pagination .el-pager li {
  background-color: #fafafa;
  border-color: #ddd;
  color: #333;
}

.el-pagination .el-pager li.active {
  background-color: #1890ff;
  color: #fff;
}
</style>
