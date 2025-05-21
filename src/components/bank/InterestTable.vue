<template>
  <div class="section">
    <div class="section-title">
      <i class="fas fa-percentage"></i> 利息流水
    </div>

    <el-table :data="records" border style="width: 100%">
      <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
      <el-table-column prop="interestMana" label="利息">
        <template #default="scope">
          <span class="amount">{{ scope.row.interestMana }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sendTag" label="是否发放" width="120">
        <template #default="scope">
          <span class="badge" :class="{ success: scope.row.sendTag, warning: !scope.row.sendTag }">
            <i class="fas" :class="scope.row.sendTag ? 'fa-check-circle' : 'fa-clock'"></i>
            {{ scope.row.sendTag ? '已发放' : '待发放' }}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="!records.length" class="no-data">
      <i class="fas fa-chart-line" style="font-size:40px;color:#ddd;"></i>
      <p>暂无利息记录</p>
    </div>

    <el-pagination layout="prev, pager, next" :total="100"></el-pagination>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const records = ref([
  { createTime: '2025-04-05 14:30', interestMana: '+32.50', sendTag: false },
  { createTime: '2025-04-05 14:25', interestMana: '+32.50', sendTag: true }
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

.amount {
  display: inline-block;
  padding: 4px 8px;
  font-weight: 500;
  border-radius: 4px;
  color: #52c41a;
  background-color: #eafff3;
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

.badge.success {
  background-color: #e6fffb;
  color: #13c2c2;
}

.badge.warning {
  background-color: #fffbe6;
  color: #faad14;
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
