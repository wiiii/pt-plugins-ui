<template>
  <el-container class="main-container">
    <Sidebar @menu-click="handleMenuClick"/>
    <el-container>
      <el-header class="app-header">
        <div class="logo" v-show="!isCollapsed">PT 插件系统</div>
        <el-button
            v-show="isCollapsed"
            type="primary"
            icon="el-icon-s-unfold"
            @click="toggleCollapse"
        />
      </el-header>
      <ContentArea class="content-wrapper"/>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import ContentArea from '@/components/ContentArea.vue';

// c_secure_uid=MTAwMDE%3D; c_secure_pass=939e628cf404074b8ecc224acd99c92e;


const isCollapsed = ref(false);
const toggleCollapse = () => (isCollapsed.value = !isCollapsed.value);

const handleMenuClick = (path: any) => {
  // 这里可以替换为实际路由跳转
  console.log('导航到:', path);
};
</script>

<style scoped>

body {
  margin: 0;
}

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