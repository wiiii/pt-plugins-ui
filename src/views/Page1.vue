<!-- src/views/Home.vue -->
<template>
  <div class="home-container">
    <div class="header">
      <h1>欢迎使用PT插件管理器</h1>
    </div>

    <div class="tab-wrapper">
      <el-tabs v-model="activeTab" type="border-card" @tab-click="handleTabClick">
        <el-tab-pane label="首页" name="LuckyDraw">
          <i class="fa fa-gift mr-2"></i>幸运抽奖
        </el-tab-pane>
        <el-tab-pane label="页面一" name="Page1">
          <i class="fa fa-list-alt mr-2"></i>任务列表
        </el-tab-pane>
        <el-tab-pane label="页面二" name="Page2">
          <i class="fa fa-bar-chart mr-2"></i>统计数据
        </el-tab-pane>
        <el-tab-pane label="页面三" name="Page3">
          <i class="fa fa-cog mr-2"></i>系统设置
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="content-container">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const activeTab = ref('LuckyDraw');

// 初始化并确保默认路由
onMounted(() => {
  if (!route.name) {
    router.push({ name: 'LuckyDraw' });
  } else {
    activeTab.value = route.name as string;
  }
});

// 监听路由变化，更新标签页
watch(
    () => route.name,
    (newName) => {
      if (newName) {
        activeTab.value = newName as string;
      }
    }
);

// 标签页点击事件
const handleTabClick = (tab: { name: string }) => {
  router.push({ name: tab.name });
};
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