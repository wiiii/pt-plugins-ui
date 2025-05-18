<!-- src/views/LuckyDraw.vue -->
<template>
  <div class="lucky-draw-container">
    <el-card class="lucky-card">
      <template #header>
        <div class="card-header">
          <h1>幸运大转盘</h1>
        </div>
      </template>

      <div class="draw-box">
        <canvas
            id="lotteryCanvas"
            width="600"
            height="600"
            ref="lotteryCanvasRef"
        ></canvas>
        <canvas
            id="pointerCanvas"
            width="200"
            height="200"
            title="GO"
            @click="startLottery"
            ref="pointerCanvasRef"
        ></canvas>
      </div>

      <!-- 左右分栏布局 -->
      <div class="sidebar-container">
        <!-- 左侧：基本说明和连抽 -->
        <div class="left-sidebar">
          <el-card class="info-card">
            <template #header>
              <h2>基本说明</h2>
            </template>
            <div class="bonus">
              <p>当前用户拥有魔力：<span class="highlight">{{ userTadpoles }}</span></p>
              <p>每次抽奖需要魔力：{{ singleDrawCost }}</p>
            </div>
            <div class="other">
              <el-collapse>
                <el-collapse-item title="中奖规则">
                  <ul>
                    <li><i class="fa-solid fa-star text-primary"></i> 当中奖 [VIP] 时，如果用户已经是 VIP 或以上等级，奖励魔力：250000</li>
                    <li><i class="fa-solid fa-medal text-primary"></i> 当中奖 [勋章] 时，如果用户已经拥有勋章，奖励魔力：100000</li>
                    <li><i class="fa-solid fa-pencil text-primary"></i> 当中奖 [改名卡] 时，多次数量不累计，可在个人详情页使用</li>
                    <li><i class="fa-solid fa-rainbow text-primary"></i> 当中奖 [彩虹 ID] 时，多次时间累计</li>
                  </ul>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-card>

          <el-card class="continuous-card">
            <template #header>
              <h2>连抽</h2>
            </template>
            <div class="continuous">
              <p>如果嫌一次次点击太慢，可以试试连抽</p>
              <p>连抽消耗魔力 = 次数 × 每次抽奖需要魔力</p>
              <p>连抽一次性返回全部结果</p>
              <div class="continuous-btn-box">
                <el-button
                    class="continuous-btn"
                    @click="continuousDraw(5)"
                >
                  <i class="fa-solid fa-play"></i> 5 连抽
                </el-button>
                <el-button
                    class="continuous-btn"
                    @click="continuousDraw(10)"
                >
                  <i class="fa-solid fa-play"></i> 10 连抽
                </el-button>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 右侧：抽奖记录 -->
        <div class="right-sidebar">
          <el-card class="record-container">
            <template #header>
              <h2>抽奖记录</h2>
            </template>
            <el-table :data="logs" stripe>
              <el-table-column
                  prop="createTime"
                  label="创建时间"
                  align="center"
                  width="200"
              ></el-table-column>
              <el-table-column
                  prop="costTadpoles"
                  label="花费魔力"
                  align="center"
                  width="150"
              ></el-table-column>
              <el-table-column
                  prop="prize"
                  label="中奖结果"
                  align="center"
              ></el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 25, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="logs.length"
            ></el-pagination>
          </el-card>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

// 基础数据
const userTadpoles = ref(381744.3);
const singleDrawCost = ref(2500);
const logs = ref([
  {
    createTime: '2025-05-04 18:09',
    costTadpoles: 2000,
    prize: '谢谢参与',
  },
]);
const currentPage = ref(1);
const pageSize = ref(10);
const isDrawing = ref(false);

// 转盘配置
const lotteryConfig = ref({
  radius: 280,
  centerX: 300,
  centerY: 300,
  startAngle: -90,
  colors: [
    '#FFE4E1', '#FFD700', '#F0E68C', '#90EE90',
    '#87CEEB', '#E6E6FA', '#FFB6C1', '#FFA500',
    '#40E0D0', '#EE82EE', '#F08080', '#483D8B',
  ],
  prizes: [
    'VIP\n奖励250000魔力',
    '勋章\n奖励100000魔力',
    '改名卡\n单次有效',
    '彩虹ID\n时间累计',
    '补签卡\n1张',
    '上传量\n+10068',
    '谢谢参与',
    '魔力\n+808',
    '勋章\n1枚',
    '上传量\n+808',
    '彩虹ID\n1天',
    'VIP\n1天',
  ],
});

const lotteryCanvasRef = ref<HTMLCanvasElement | null>(null);
const pointerCanvasRef = ref<HTMLCanvasElement | null>(null);

// 绘制转盘
const drawLottery = () => {
  if (!lotteryCanvasRef.value) return;
  const ctx = lotteryCanvasRef.value.getContext('2d');
  const { centerX, centerY, radius, startAngle, colors, prizes } = lotteryConfig.value;

  // 背景圆
  ctx.clearRect(0, 0, 600, 600);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#7e65ab';
  ctx.stroke();

  // 绘制扇形和文字
  colors.forEach((color, index) => {
    const angle = 30 * index;
    const start = (startAngle + angle) * Math.PI / 180;
    const end = (startAngle + angle + 30) * Math.PI / 180;

    // 绘制扇形背景
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, start, end);
    ctx.fillStyle = color;
    ctx.fill();

    // 绘制文字
    ctx.save();

    // 设置字体和对齐方式
    ctx.font = 'bold 16px Microsoft YaHei';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 计算文字位置
    const textRadius = radius * 0.75;
    const textAngle = start + (end - start) / 2;
    const textX = centerX + textRadius * Math.cos(textAngle);
    const textY = centerY + textRadius * Math.sin(textAngle);

    // 分割文本并分行显示
    const lines = prizes[index].split('\n');
    const lineHeight = 22;

    // 根据背景颜色智能选择文字颜色，确保对比度
    const isDarkBg = isDarkColor(color);
    const textColor = isDarkBg ? '#ffffff' : '#333333';

    // 绘制文字（带描边效果）
    lines.forEach((line, i) => {
      const yOffset = (lines.length - 1) * lineHeight / -2 + i * lineHeight;

      // 先绘制描边
      ctx.lineWidth = 2;
      ctx.strokeStyle = isDarkBg ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)';
      ctx.strokeText(line, textX, textY + yOffset);

      // 再绘制文字
      ctx.fillStyle = textColor;
      ctx.fillText(line, textX, textY + yOffset);
    });

    ctx.restore();
  });

  // 金色边框
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 10, 0, 2 * Math.PI);
  ctx.stroke();
};

// 判断颜色是否为深色
const isDarkColor = (color: string) => {
  // 处理颜色格式
  if (color.startsWith('#')) {
    let colorStr = color.substring(1);

    if (colorStr.length === 3) {
      // 3位颜色码转为6位
      colorStr = colorStr[0] + colorStr[0] + colorStr[1] + colorStr[1] + colorStr[2] + colorStr[2];
    }

    // 计算亮度
    const r = parseInt(colorStr.substring(0, 2), 16);
    const g = parseInt(colorStr.substring(2, 4), 16);
    const b = parseInt(colorStr.substring(4, 6), 16);

    // 使用感知亮度公式
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance < 0.5;
  }

  // 默认返回false
  return false;
};

// 绘制指针
const drawPointer = () => {
  if (!pointerCanvasRef.value) return;
  const ctx = pointerCanvasRef.value.getContext('2d');
  ctx.clearRect(0, 0, 200, 200);

  const centerX = 100;
  const centerY = 100;
  const innerRadius = 300 - 280; // 转盘半径与指针画布中心的差值

  // 三角箭头
  const triangleSize = 45;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - innerRadius - triangleSize); // 箭头顶部
  ctx.lineTo(centerX - triangleSize / 2, centerY - innerRadius); // 左下点
  ctx.lineTo(centerX + triangleSize / 2, centerY - innerRadius); // 右下点
  ctx.closePath();

  // 红色渐变
  const gradient = ctx.createLinearGradient(
      centerX - triangleSize / 2,
      centerY - innerRadius - triangleSize,
      centerX + triangleSize / 2,
      centerY - innerRadius
  );
  gradient.addColorStop(0, '#FF5252');
  gradient.addColorStop(1, '#FF1744');

  ctx.fillStyle = gradient;
  ctx.fill();

  // 绘制中心圆
  const buttonRadius = 20;
  ctx.beginPath();
  ctx.arc(centerX, centerY, buttonRadius, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // 绘制中心圆的金色边框
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(centerX, centerY, buttonRadius, 0, 2 * Math.PI);
  ctx.stroke();
};

// 开始抽奖
const startLottery = () => {
  if (isDrawing.value || userTadpoles.value < singleDrawCost.value) {
    ElMessage({
      message: '魔力不足或正在抽奖中！',
      type: 'warning',
    });
    return;
  }

  isDrawing.value = true;
  const randomAngle = 360 * 3 + Math.random() * 360;
  const targetAngle = lotteryConfig.value.startAngle + randomAngle;
  const step = 5;

  const animate = (currentAngle: number) => {
    requestAnimationFrame(() => {
      lotteryConfig.value.startAngle = currentAngle;
      drawLottery();

      if (currentAngle < targetAngle) {
        animate(currentAngle + step);
      } else {
        isDrawing.value = false;
        const prizeIndex = getPrizeIndex(targetAngle);
        handlePrize(prizeIndex);
      }
    });
  };

  animate(lotteryConfig.value.startAngle);
};

// 获取中奖索引
const getPrizeIndex = (angle: number) => {
  const degree = ((angle % 360) + 360) % 360;
  return Math.floor(degree / 30);
};

// 处理中奖结果
const handlePrize = (index: number) => {
  const prize = lotteryConfig.value.prizes[index];
  logs.value.unshift({
    createTime: new Date().toLocaleString(),
    costTadpoles: singleDrawCost.value,
    prize: prize.split('\n')[0],
  });

  // 模拟扣除魔力（实际需对接后端）
  userTadpoles.value -= singleDrawCost.value;

  // 显示中奖提示
  ElMessage({
    message: `恭喜获得：${prize}`,
    type: 'success',
    duration: 3000,
  });
};

// 连抽逻辑
const continuousDraw = (count: number) => {
  if (isDrawing.value || userTadpoles.value < count * singleDrawCost.value) {
    ElMessage({
      message: '魔力不足或正在抽奖中！',
      type: 'warning',
    });
    return;
  }

  for (let i = 0; i < count; i++) {
    startLottery(); // 简化逻辑，实际需处理动画队列
  }
};

// 分页处理
const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize;
};
const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage;
};

onMounted(() => {
  drawLottery();
  drawPointer();
});
</script>

<style scoped>
.lucky-draw-container {
  margin: 0;
  padding: 0;
}

.lucky-card {
  border-radius: 0;
  border: none;
  box-shadow: none;
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

h1 {
  color: #409eff;
  margin-right: 10px;
  margin-bottom: 0;
}

.powered-by {
  font-size: 14px;
  color: #909399;
}

.draw-box {
  position: relative;
  margin: 40px auto;
  display: flex;
  justify-content: center;
}

#lotteryCanvas {
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

#pointerCanvas {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 2;
}

.sidebar-container {
  display: flex;
  gap: 20px;
}

.left-sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-sidebar {
  flex: 1;
}

.info-card, .continuous-card, .record-container {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.highlight {
  color: #ff6b6b;
  font-weight: 500;
}

.continuous-btn {
  margin-right: 15px;
  padding: 8px 20px;
  background-color: #409eff;
  color: white;
  border-radius: 4px;
}

.continuous-btn:hover {
  background-color: #66b1ff;
}

.text-primary {
  color: #409eff;
}
</style>