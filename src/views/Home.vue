<!-- src/views/Home.vue -->
<template>
  <div class="home-container">
    <div class="header">
      <h1>欢迎使用PT插件管理器</h1>
    </div>

    <div class="tab-container">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="首页" name="LuckyDraw">
          <router-link to="/lucky">
            <i class="fa fa-home mr-2"></i>首页
          </router-link>
        </el-tab-pane>
        <el-tab-pane label="页面一" name="Page1">
          <router-link to="/page1">
            <i class="fa fa-file-text-o mr-2"></i>页面一
          </router-link>
        </el-tab-pane>
        <el-tab-pane label="页面二" name="Page2">
          <router-link to="/page2">
            <i class="fa fa-picture-o mr-2"></i>页面二
          </router-link>
        </el-tab-pane>
        <el-tab-pane label="页面三" name="Page3">
          <router-link to="/page3">
            <i class="fa fa-cog mr-2"></i>页面三
          </router-link>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="content-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const activeTab = ref(route.name?.toString() || 'LuckyDraw');

// 监听路由变化，更新当前激活的标签
const updateActiveTab = () => {
  activeTab.value = route.name?.toString() || 'LuckyDraw';
};

onMounted(() => {
  updateActiveTab();
  if (!route.name) {
    router.push({ name: 'LuckyDraw' });
  }
});

// 监听标签切换事件
const handleTabClick = (tab: string) => {
  router.push({ name: tab });
};
</script>

<style scoped>
.home-container {
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 40px;
  color: #333;
  font-size: 32px;
  font-weight: bold;
}

.tab-container {
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
}

.el-tabs__item {
  font-size: 18px;
  font-weight: 500;
  color: #6c757d;
}

.el-tabs__item.is-active {
  color: #409eff;
}

.content-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 40px;
}

.mr-2 {
  margin-right: 12px;
}
</style>