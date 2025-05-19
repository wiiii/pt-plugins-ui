<template>
  <el-container class="main-container">
    <Sidebar @menu-click="handleMenuClick"/>
    <el-container>
      <el-header class="app-header">
        <div class="logo" v-show="!isCollapsed">PT 管理系统</div>
        <el-button
            v-show="isCollapsed"
            type="primary"
            icon="el-icon-s-unfold"
            @click="toggleCollapse"
        />
      </el-header>
      <ContentArea/>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import Sidebar from './components/Sidebar.vue';
import ContentArea from './components/ContentArea.vue';

const isCollapsed = ref(false);
const toggleCollapse = () => (isCollapsed.value = !isCollapsed.value);

const handleMenuClick = (path: any) => {
  // 这里可以替换为实际路由跳转
  console.log('导航到:', path);
};
</script>

<style scoped>
.main-container {
  min-width: 1200px;
  height: 100vh;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}
</style>