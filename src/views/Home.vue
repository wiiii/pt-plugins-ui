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
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const activeTab = ref(route.name?.toString() || 'Home');

// 监听路由变化，更新当前激活的标签
const updateActiveTab = () => {
  activeTab.value = route.name?.toString() || 'Home';
};

onMounted(() => {
  updateActiveTab();
});

// 监听标签切换事件
const handleTabClick = (tab: string) => {
  router.push({ name: tab });
};
</script>

<style scoped>
.home-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.tab-container {
  margin-bottom: 30px;
}

.content {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  min-height: 300px;
}

.feature-cards {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

.feature-card {
  flex: 1;
}

.card-header {
  display: flex;
  align-items: center;
}

.card-header i {
  margin-right: 10px;
  color: #409eff;
}

.mr-2 {
  margin-right: 8px;
}
</style>