<template>
  <div class="pagination">
    <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="currentPageSize"
        :page-sizes="[50,40,30,20,10]"
        layout="total, sizes, prev, pager, next"
        :total="total"
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
import {defineProps, defineEmits, computed} from 'vue'
import debounce from 'lodash.debounce'

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

// 防抖处理
const debouncedHandleSizeChange = debounce((size: number) => {
  emit('update:pageSize', size)
  emit('change', {pageNum: props.pageNum, pageSize: size})
}, 300)

const handleSizeChange = (size: number) => {
  debouncedHandleSizeChange(size)
}

const handleCurrentChange = (page: number) => {
  emit('update:pageNum', page)
  emit('change', {pageNum: page, pageSize: props.pageSize})
}

// 计算总页数，防止除零错误
const pageCount = computed(() => {
  if (props.pageSize <= 0) return 0
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
