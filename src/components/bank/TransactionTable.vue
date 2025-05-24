<template>
  <div class="section">
    <div class="section-title">
      <i class="fas fa-exchange-alt"></i> 存取流水
    </div>

    <el-table :data="records" border style="width: 100%">
      <el-table-column prop="time" label="时间" width="180">
        <template #default="scope">{{ scope.row.time }}</template>
      </el-table-column>

      <el-table-column prop="amount" label="金额">
        <template #default="scope">
          <span class="amount" :class="{ deposit: scope.row.type === '存款', withdraw: scope.row.type !== '存款' }">
            {{ scope.row.amount }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="type" label="类型">
        <template #default="scope">
          <span class="amount" :class="{ deposit: scope.row.type === '存款', withdraw: scope.row.type !== '存款' }">
            <i class="fas" :class="{
              'fa-arrow-circle-up': scope.row.type === '存款',
              'fa-arrow-circle-down': scope.row.type !== '存款'
            }"></i>
            {{ scope.row.type }}
          </span>
        </template>
      </el-table-column>


    </el-table>

    <div v-if="!records.length" class="no-data">
      <i class="fas fa-inbox" style="font-size:40px;color:#ddd;"></i>
      <p>暂无交易记录</p>
    </div>

    <Pagination
        :total="pagination.total"
        :page-num="pagination.pageNum"
        :page-size="pagination.pageSize"
        @update:pageNum="pagination.pageNum = $event"
        @update:pageSize="pagination.pageSize = $event"
        @change="handlePageChange"
    />


  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onActivated} from 'vue'
import {getDepositAndDrawnRecords} from '@/api/bank'
import {ElMessage} from 'element-plus'
import Pagination from '@/components/common/Pagination.vue'


// 表格数据
const records = ref<any[]>([])
const loading = ref(false)

// 分页参数
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    debugger
    const response = await getDepositAndDrawnRecords({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize
    })

    if (response.code === 0) {
      records.value = response.data.records.map((item: any) => ({
        time: item.time, // 根据后端返回字段调整
        type: item.type,
        amount: item.amount
      }))
      pagination.total = response.data.total
    } else {
      ElMessage.error('获取数据失败：' + response.msg)
    }
  } catch (error) {
    console.error('请求失败:', error)
    ElMessage.error('网络错误，请重试')
  } finally {
    loading.value = false
  }
}

const handlePageChange = ({ pageNum, pageSize }: { pageNum: number; pageSize: number }) => {
  pagination.pageNum = pageNum
  pagination.pageSize = pageSize
  fetchData()
}


// 只有在 Tab 激活时才请求数据（仅首次加载）
onActivated(() => {
  fetchData()
})

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
