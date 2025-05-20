<template>
  <div class="section">
    <div class="section-title"><i class="fas fa-percentage"></i> 利息流水</div>
    <el-table :data="records" border style="width:100%">
      <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
      <el-table-column prop="interestMana" label="利息">
        <template #default="scope">
          <span class="amount" style="color:#52c41a;">{{ scope.row.interestMana }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sendTag" label="是否发放" width="100">
        <template #default="scope">
          <span class="badge badge-success" v-if="scope.row.sendTag">
            <i class="fas fa-check-circle"></i> 已发放
          </span>
          <span class="badge badge-warning" v-else>
            <i class="fas fa-clock"></i> 待发放
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
const records = [
  { createTime: '2025-04-05 14:30', interestMana: '+32.50', sendTag: false },
  { createTime: '2025-04-05 14:25', interestMana: '+32.50', sendTag: true }
]
</script>
