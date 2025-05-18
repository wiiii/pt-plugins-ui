<!-- src/App.vue -->
<template>
  <div id="app">
    <div class="header">
      <h1>欢迎使用PT插件管理器</h1>
    </div>

    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="幸运大转盘" name="LuckyDraw">
        <div class="tab-content">
          <lucky-draw></lucky-draw>
        </div>
      </el-tab-pane>
      <el-tab-pane label="配置" name="Config">
        <div class="tab-content">
          <router-view/>
        </div>
      </el-tab-pane>
      <el-tab-pane label="角色" name="Role">
        <div class="tab-content">
          <router-view/>
        </div>
      </el-tab-pane>
      <el-tab-pane label="任务" name="Task">
        <div class="tab-content">
          <router-view/>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div class="copyright">
      <p>© 2025 PT插件管理器 版权所有</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import LuckyDraw from "./views/LuckyDraw.vue";

const route = useRoute();
const router = useRouter();
const activeName = ref('LuckyDraw');

// 初始化并确保默认路由
onMounted(() => {
  if (!route.name) {
    router.push({name: 'LuckyDraw'});
  } else {
    activeName.value = route.name as string;
  }
});

// 监听路由变化，更新标签页
watch(
    () => route.name,
    (newName) => {
      if (newName) {
        activeName.value = newName as string;
      }
    }
);

// 标签页点击事件
const handleClick = (tab: { name: string }) => {
  router.push({name: tab.name});
};
</script>

<style scoped>
#app {
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin: 50px 0 30px 0;
  color: #1e293b;
  font-size: 36px;
  font-weight: 700;
  letter-spacing: 2px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.demo-tabs {
  margin: 0 20px;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.el-tabs__header {
  margin: 0;
  border-bottom: 1px solid #ebeef5;
}

.el-tabs__item {
  font-size: 18px;
  font-weight: 500;
  padding: 0 30px;
  height: 55px;
  line-height: 55px;
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
  transform: scale(1.03);
}

.el-tabs__active-bar {
  background-color: #0f766e;
  height: 3px;
}

.tab-content {
  margin: 0 20px 30px 20px;
  background-color: #ffffff;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  min-height: 700px;
  transition: all 0.3s ease;
  flex-grow: 1;
}

.copyright {
  text-align: center;
  padding: 20px;
  color: #909399;
  font-size: 14px;
  border-top: 1px solid #f0f2f5;
  margin-top: 20px;
}

.mr-2 {
  margin-right: 12px;
}
</style>