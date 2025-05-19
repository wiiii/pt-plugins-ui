<template>
  <el-aside :width="isCollapsed ? '64px' : '200px'" class="sidebar">
    <!-- 折叠按钮 -->
    <div class="toggle-btn" @click="toggleCollapse">
      <i class="fa" :class="isCollapsed ? 'fa-angle-right' : 'fa-angle-left'"></i>
    </div>

    <!-- 导航菜单 -->
    <el-menu
        :default-active="activeMenu"
        :default-openeds="['1']"
        :collapse="isCollapsed"
        :collapse-transition="false"
        mode="vertical"
        background-color="#2c3e50"
        text-color="#fff"
        active-text-color="#3498db">

      <!-- 抽奖管理 -->
      <el-menu-item index="lucky">
        <i class="fa fa-gift menu-icon"></i>
        <span v-show="!isCollapsed">抽奖管理</span>
      </el-menu-item>

      <!-- 银行管理 -->
      <el-menu-item index="bank">
        <i class="fa fa-university menu-icon"></i>
        <span v-show="!isCollapsed">银行管理</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import {ref, watchEffect} from 'vue';
import {useRoute} from 'vue-router';

const route = useRoute();
const isCollapsed = ref(false);
const activeMenu = ref('lottery'); // 默认激活抽奖管理

// 根据当前路由自动更新活跃菜单
watchEffect(() => {
  activeMenu.value = route.name || 'lottery';
});

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const handleMenuClick = (item) => {
  // 路由跳转逻辑
  console.log('导航到:', item.index);
};
</script>

<style scoped>
.sidebar {
  background-color: #2c3e50;
  height: 100vh;
  overflow-y: auto;
  transition: width 0.3s ease;
}

.toggle-btn {
  text-align: center;
  padding: 12px;
  cursor: pointer;
  color: #fff;
  border-bottom: 1px solid #34495e;
}

.menu-icon {
  width: 24px;
  text-align: center;
  margin-right: 8px;
}

.submenu-icon {
  width: 24px;
  text-align: center;
  margin-right: 4px;
}

/* 优化菜单展开/折叠动画 */
.el-sub-menu__title span {
  transition: opacity 0.3s ease;
}

/* 修复菜单颜色显示问题 */
.el-menu-item.is-active {
  background-color: rgba(52, 152, 219, 0.2) !important;
}

.el-sub-menu.is-active .el-sub-menu__title {
  color: #3498db !important;
}

.el-menu-item:hover,
.el-sub-menu__title:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>