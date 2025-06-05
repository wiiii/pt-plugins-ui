<template>
  <div class="rule-container">
    <h2>中奖规则</h2>
    <ul class="rule-list">
      <li class="rule-item" v-for="(rule, index) in rules" :key="index">
        <i :class="rule.icon"></i>
        <span>{{ rule.description }}</span>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { ref } from 'vue';

const rules = ref([
  {
    icon: 'fa-solid fa-star text-primary',
    description: '当中奖 [VIP] 时，如果用户已经是 [VIP]，VIP时间累加'
  },
  {
    icon: 'fa-solid fa-medal text-primary',
    description: '当中奖 [勋章] 时，如果用户已经拥有勋章，奖励魔力：100000'
  },
  {
    icon: 'fa-solid fa-pencil text-primary',
    description: '当中奖 [改名卡] 时，多次数量不累计，可在个人详情页使用'
  },
  {
    icon: 'fa-solid fa-rainbow text-primary',
    description: '当中奖 [彩虹 ID] 时，多次时间累计'
  }
]);
</script>

<style scoped>
.rule-container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.rule-container h2 {
  margin-bottom: 15px;
  font-size: 18px;
  color: #333;
}

.rule-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.rule-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.rule-item:last-child {
  border-bottom: none;
}

.rule-item i {
  margin-right: 10px;
  font-size: 16px;
}

.rule-item span {
  font-size: 14px;
  color: #555;
}

.text-primary {
  color: #409eff;
}
</style>
