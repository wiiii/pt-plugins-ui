<template>
  <div class="pagination">
    <el-pagination
      layout="prev, pager, next, sizes, ->, slot"
      :total="total"
      v-model:current-page="currentPage"
      v-model:page-size="currentPageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #default>
        <span class="pagination-total">
          共 {{ total }} 条 / 共 {{ pageCount }} 页
        </span>
      </template>
    </el-pagination>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps<{
  total: number
  pageNum: number
  pageSize: number
}>()

const emit = defineEmits<{
  (e: 'update:pageNum', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'change', params: { pageNum: number; pageSize: number }): void
}>()

const currentPage = {
  get: () => props.pageNum,
  set: (val: number) => emit('update:pageNum', val)
}

const currentPageSize = {
  get: () => props.pageSize,
  set: (val: number) => emit('update:pageSize', val)
}

const handleSizeChange = (size: number) => {
  emit('update:pageSize', size)
  emit('change', { pageNum: props.pageNum, pageSize: size })
}

const handleCurrentChange = (page: number) => {
  emit('update:pageNum', page)
  emit('change', { pageNum: page, pageSize: props.pageSize })
}

// 计算总页数
const pageCount = computed(() => {
  return Math.ceil(props.total / props.pageSize)
})
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  text-align: right;
}

.pagination-total {
  font-size: 13px;
  color: #666;
  margin-left: 10px;
}
</style>
