<template>
  <div class="section">
    <div class="section-title">
      <i class="fas fa-exchange-alt"></i> 存取流水
    </div>

    <el-table :data="records" border style="width: 100%">
      <el-table-column prop="time" label="时间" width="180"></el-table-column>
      <el-table-column prop="type" label="类型" width="120">
        <template #default="scope">
          <span class="badge" :class="{ primary: scope.row.type === '存款', warning: scope.row.type !== '存款' }">
            <i class="fas" :class="scope.row.type === '存款' ? 'fa-arrow-circle-up' : 'fa-arrow-circle-down'"></i>
            {{ scope.row.type }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额">
        <template #default="scope">
          <span class="amount" :class="{ deposit: scope.row.type === '存款', withdraw: scope.row.type !== '存款' }">
            {{ scope.row.amount }}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="!records.length" class="no-data">
      <i class="fas fa-inbox" style="font-size:40px;color:#ddd;"></i>
      <p>暂无交易记录</p>
    </div>

    <el-pagination layout="prev, pager, next" :total="100"></el-pagination>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const records = ref([
  { time: '2025-04-05 14:30', type: '存款', amount: '+500.00' },
  { time: '2025-04-05 14:25', type: '取款', amount: '-200.00' }
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

.badge.warning {
  background-color: #fffbe6;
  color: #faad14;
}

.amount {
  display: inline-block;
  padding: 4px 8px;
  font-weight: 500;
  border-radius: 4px;
}

.amount.deposit {
  color: #1890ff;
  background-color: #e6f7ff;
}

.amount.withdraw {
  color: #fa8c16;
  background-color: #fffbe6;
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
