<template>
  <el-card shadow="hover" style="margin-bottom: 24px;">
    <template #header>
      <div class="section-title">
        <i class="fas fa-chart-pie"></i> 银行统计
        <small style="font-size:12px;margin-left:10px;font-weight:normal;color:#999;">(每十分钟更新)</small>
      </div>
    </template>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="label">魔力池金额</div>
        <div class="value">{{ bankStats.totalMagicPool || '0.00' }}</div>
      </div>
      <div class="stat-card">
        <div class="label">开户总人数</div>
        <div class="value">{{ bankStats.totalUserNum || '0' }}</div>
      </div>
      <div class="stat-card">
        <div class="label">存款人数</div>
        <div class="value">{{ bankStats.totalDepositNum || '0' }}</div>
      </div>
      <div class="stat-card">
        <div class="label">贷款人数</div>
        <div class="value">{{ bankStats.totalLoanNum || '0' }}</div>
      </div>
    </div>

    <table class="info-table">
      <tbody>
      <tr>
        <td><i class="fas fa-money-bill-alt"></i> 存款总金额</td>
        <td><span class="amount">{{ bankStats.totalDeposit || '0.00' }}</span></td>
      </tr>
      <tr>
        <td><i class="fas fa-percentage"></i> 存款利率</td>
        <td><span class="badge badge-success">年利率{{ bankStats.depositRate ?? 6 }}%</span></td>
      </tr>
      <tr>
        <td><i class="fas fa-hand-holding-usd"></i> 贷款总金额</td>
        <td><span class="amount">{{ bankStats.totalLoan || '0.00' }}</span></td>
      </tr>
      <tr>
        <td><i class="fas fa-percentage"></i> 贷款利率</td>
        <td><span class="badge badge-warning">年利率{{ bankStats.interestRate ?? 18 }}%</span></td>
      </tr>
      </tbody>
    </table>
  </el-card>
</template>

<script setup lang="ts">
defineProps<{
  bankStats: any
}>()
</script>

<style scoped>
.section-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 每行显示 2 个卡片 */
  gap: 16px; /* 卡片之间的间距 */
  margin-bottom: 20px;
}


.stat-card {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.label {
  font-size: 13px;
  color: #777;
  margin-bottom: 8px;
}

.value {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary);
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
  font-size: 16px;
  color: var(--primary);
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #fff;
}

.badge-success {
  background-color: #52c41a;
}

.badge-warning {
  background-color: #faad14;
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
