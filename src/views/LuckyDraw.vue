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
              <div class="bonus-item">
              <span class="bonus-label">
                <i class="fa-solid fa-bolt text-primary"></i> 当前用户拥有魔力：
              </span>
                <span class="highlight">{{ userTadpoles }}</span>
              </div>
              <div class="bonus-item">
              <span class="bonus-label">
                <i class="fa-solid fa-coins text-primary"></i> 每次抽奖需要魔力：
              </span>
                <span>{{ singleDrawCost }}</span>
              </div>
            </div>
            <!-- 添加间距 -->
            <div class="spacing-block"></div>
            <div class="other">
              <PrizeRules></PrizeRules>
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
            <el-table :data="records" stripe>
              <el-table-column
                  prop="createTime"
                  label="抽奖时间"
                  align="center"
                  width="200"
              ></el-table-column>
              <el-table-column
                  prop="costMagic"
                  label="花费魔力"
                  align="center"
                  width="150"
              ></el-table-column>
              <el-table-column prop="prize"
                               label="中奖结果"
                               align="center"
              >
                <template #default="scope">
                  {{
                    scope.row.prizeType !== '99' ? `${scope.row.prizeName} ${scope.row.prizeValue} ${scope.row.unitName}` : scope.row.prizeName
                  }}
                </template>
              </el-table-column>
            </el-table>
            <Pagination
                :total="pagination.total"
                :page-num="pagination.pageNum"
                :page-size="pagination.pageSize"
                @update:pageNum="pagination.pageNum = $event"
                @update:pageSize="pagination.pageSize = $event"
                @change="handlePageChange"
            />
          </el-card>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted, reactive} from 'vue'
import {ElMessage} from 'element-plus'
import {getRecordsByPage, luckyDraw} from '@/api/lucky'
import {LuckyDrawRecord} from '@/types/lucky'
import Pagination from "@/components/common/Pagination.vue";
import PrizeRules from "@/components/lucky/PrizeRules.vue";

// 响应式数据
const userTadpoles = ref(381744.3)
const singleDrawCost = ref(2500)
const records = ref<LuckyDrawRecord[]>([])
const isDrawing = ref(false)

// 分页参数
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

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
  const {centerX, centerY, radius, startAngle, colors, prizes} = lotteryConfig.value;

  // 背景圆
  ctx.clearRect(0, 0, 600, 600);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fillStyle = '#1f3285';
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
  const buttonRadius = 50;
  const triangleSize = 24;

  // 1. 绘制三角箭头（隐藏在圆下）
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 80);
  ctx.lineTo(centerX - triangleSize / 2, centerY - 50);
  ctx.lineTo(centerX + triangleSize / 2, centerY - 50);
  ctx.closePath();

  const arrowGradient = ctx.createLinearGradient(
      centerX - triangleSize / 2,
      centerY - 120,
      centerX + triangleSize / 2,
      centerY - 50
  );
  arrowGradient.addColorStop(0, '#FF5252');
  arrowGradient.addColorStop(1, '#FF1744');
  ctx.fillStyle = arrowGradient;
  ctx.fill();

  // 2. 中心圆（渐变色）
  const circleGradient = ctx.createLinearGradient(0, centerY - buttonRadius, 0, centerY + buttonRadius);
  circleGradient.addColorStop(0, '#4a90e2');
  circleGradient.addColorStop(1, '#2c57a0');

  ctx.beginPath();
  ctx.arc(centerX, centerY, buttonRadius, 0, 2 * Math.PI);
  ctx.fillStyle = circleGradient;
  ctx.fill();

  // 3. 外圈描边
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(centerX, centerY, buttonRadius, 0, 2 * Math.PI);
  ctx.stroke();
};

const startLottery = async () => {
  if (isDrawing.value || userTadpoles.value < singleDrawCost.value) {
    ElMessage({
      message: '魔力不足或正在抽奖中！',
      type: 'warning'
    });
    return;
  }

  isDrawing.value = true;

  try {
    const res = await luckyDraw({size: 1});

    if (res.code === 0 && res.data) {
      // 模拟转盘动画
      const randomAngle = 360 * 3 + Math.random() * 360; // 随机角度
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
            handlePrize(prizeIndex, res.data[0]); // 处理中奖结果
            fetchRecords(); // <<<<<<<<< 添加这一行以刷新抽奖记录列表
          }
        });
      };
      animate(lotteryConfig.value.startAngle);
    }
  } catch (error) {
    console.error('抽奖请求失败:', error);
    ElMessage.error('网络异常，请稍后再试');
    isDrawing.value = false;
  }
};


const fetchRecords = async () => {
  try {
    const res = await getRecordsByPage(pagination)
    if (res.code === 0 && res.data.records) {
      records.value = res.data.records
      pagination.total = res.data.total || res.data.records.length
    } else {
      ElMessage.error(res.msg || '获取记录失败')
    }
  } catch (error) {
    console.error('请求记录失败:', error)
    ElMessage.error('网络异常，请稍后再试')
  }
}


// 获取中奖索引
const getPrizeIndex = (angle: number) => {
  const degree = ((angle % 360) + 360) % 360;
  return Math.floor(degree / 30);
};

// 处理中奖结果
const handlePrize = (index: number, res: object) => {
  const {prizeName, prizeType, prizeValue, unitName} = res;
  let prizeText = '';
  if (prizeType == '99') {
    prizeText = prizeName;
    // 弹出提示
    ElMessage({
      message: `对不起您${prizeText}`,
      type: 'warning',
      duration: 3000
    });
  } else {
    prizeText = `${prizeName}${prizeValue}${unitName}`;
    // 弹出提示
    ElMessage({
      message: `恭喜获得：${prizeText}`,
      type: 'success',
      duration: 3000
    });
  }
  records.value.unshift(res);

  // 扣除魔力
  userTadpoles.value -= singleDrawCost.value;

};

// 连抽逻辑
const continuousDraw = async (count: number) => {
  if (userTadpoles.value < count * singleDrawCost.value) {
    ElMessage({
      message: '魔力不足！',
      type: 'warning',
    });
    return;
  }
  debugger;
  const res = await luckyDraw({size: count});
  if (res.code === 0 && res.data) {
    res.data.forEach((item: any) => {
      handlePrize(getPrizeIndex(item.angle), item);
    });
  }
};

const handlePageChange = ({pageNum, pageSize}: { pageNum: number; pageSize: number }) => {
  pagination.pageNum = pageNum
  pagination.pageSize = pageSize
  fetchRecords()
}


onMounted(() => {
  drawLottery()
  drawPointer()
  fetchRecords() // 初始化抽奖记录
});
</script>

<style scoped>
.lucky-draw-container {
  margin: 0;
  padding: 0;
}

.lucky-card {
  border-radius: 8px;
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
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
}

.bonus {
  display: flex;
  flex-direction: column;
  gap: 12px; /* 控制两行之间的间距 */
}

.bonus-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
}

.bonus-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.text-primary {
  color: #409eff;
}

.highlight {
  color: #ff6b6b;
  font-weight: bold;
}


.left-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;

  .record-container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .el-table {
    flex: 1;
    min-height: 400px;
  }

  .el-pagination {
    margin-top: 10px;
  }
}

.el-input__inner {
  height: 26px !important;
  line-height: 26px;
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

.spacing-block {
  height: 20px; /* 可根据需要调整 */
}

</style>