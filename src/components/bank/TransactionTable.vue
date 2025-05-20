<template>
  <div class="section">
    <div class="section-title"><i class="fas fa-exchange-alt"></i> 存取流水</div>
    <el-table :data="records" border style="width:100%">
      <el-table-column prop="time" label="时间" width="180"></el-table-column>
      <el-table-column prop="type" label="类型" width="100">
        <template #default="scope">
          <span class="badge badge-primary" v-if="scope.row.type === '存款'">
            <i class="fas fa-arrow-circle-up"></i> {{ scope.row.type }}
          </span>
          <span class="badge badge-warning" v-else>
            <i class="fas fa-arrow-circle-down"></i> {{ scope.row.type }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额">
        <template #default="scope">
          <span class="amount" :style="scope.row.type === '存款' ? 'color:#1890ff' : 'color:#fa8c16'">
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
const records = [
  { time: '2025-04-05 14:30', type: '存款', amount: '+500.00' },
  { time: '2025-04-05 14:25', type: '取款', amount: '-200.00' }
]
</script>
