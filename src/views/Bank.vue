<!-- src/views/Home.vue -->
<template>
  <div class="home-container">
    <div class="header">
      <h1>银行管理中心</h1>
    </div>
    <div class="tab-wrapper">
      少时诵诗书纹
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.home-container {
  max-width: 1400px;
  margin: 30px auto;
  padding: 30px;
  background-color: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.header {
  text-align: center;
  margin-bottom: 40px;
  color: #1e293b;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.tab-wrapper {
  margin-bottom: 30px;
}

.el-tabs__header {
  margin: 0 0 20px 0;
}

.el-tabs__item {
  font-size: 18px;
  font-weight: 500;
  padding: 0 25px;
  height: 50px;
  line-height: 50px;
  color: #64748b;
  transition: all 0.3s ease;
}

.el-tabs__item:hover {
  color: #0f766e;
  transform: translateY(-2px);
}

.el-tabs__item.is-active {
  color: #0f766e;
  font-weight: 600;
  border-bottom: 3px solid #0f766e;
}

.el-tabs__active-bar {
  background-color: #0f766e;
  height: 3px;
}

.el-tabs--border-card {
  border: none;
  background: none;
}

.content-container {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 40px;
  min-height: 650px;
  transition: all 0.3s ease;
}

.mr-2 {
  margin-right: 10px;
}
</style>