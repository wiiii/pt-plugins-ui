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
                <span class="highlight">{{ lotteryBasicInfo.seedBonus }}</span>
              </div>
              <div class="bonus-item">
                <span class="bonus-label">
                  <i class="fa-solid fa-coins text-primary"></i> 每次抽奖需要魔力：
                </span>
                <span>{{ lotteryBasicInfo.costMagic }}</span>
              </div>
              <div class="bonus-item">
                <span class="bonus-label">
                  <i class="fa-solid fa-coins text-primary"></i> 当前折扣：
                </span>
                <span>{{ lotteryBasicInfo.discount }}折</span>
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
              <el-table-column prop="prize" label="中奖结果" align="center">
                <template #default="scope">
                  <span class="prize-icon-text">
                    <!-- 根据 prizeType 显示不同的图标 -->
                    <i v-if="scope.row.prizeType === '01'" class="fa-solid fa-coins icon-magic"></i> <!-- 魔力 -->
                    <i v-else-if="scope.row.prizeType === '02'" class="fa-solid fa-star icon-vip"></i> <!-- VIP -->
                    <i v-else-if="scope.row.prizeType === '03'" class="fa-solid fa-pen icon-rename"></i> <!-- 改名卡 -->
                    <i v-else-if="scope.row.prizeType === '04'" class="fa-solid fa-rainbow icon-rainbow"></i>
                    <!-- 彩虹ID -->
                    <i v-else-if="scope.row.prizeType === '05'" class="fa-solid fa-calendar-check icon-checkin"></i>
                    <!-- 补签卡 -->
                    <i v-else-if="scope.row.prizeType === '06'" class="fa-solid fa-arrow-alt-circle-up icon-upload"></i>
                    <!-- 上传量 -->
                    <i v-else-if="scope.row.prizeType === '99'" class="fa-solid fa-times-circle icon-none"></i>
                    <!-- 谢谢参与 -->
                    <!-- 显示文字 -->
                    {{
                      scope.row.prizeType !== '99'
                          ? `${scope.row.prizeName} ${scope.row.prizeValue} ${scope.row.unitName}`
                          : scope.row.prizeName
                    }}
                  </span>
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
import {ref, onMounted, reactive, computed} from 'vue';
import {ElMessage, ElNotification} from 'element-plus';
import {getLotteryBasicInfo, getRecordsByPage, listLuckyPrizeConfig, luckyDraw} from '@/api/lucky';
import {LuckyDrawRecord} from '@/types/lucky';
import Pagination from "@/components/common/Pagination.vue";
import PrizeRules from "@/components/lucky/PrizeRules.vue";

// 常量定义
const DEFAULT_USER_INFO = {
  userId: 10003,
  seedBonus: 14535.0,
  costMagic: 2000,
  discount: 75.00
};

const DEFAULT_PAGINATION = {
  pageNum: 1,
  pageSize: 10,
  total: 0
};

const DEFAULT_LOTTERY_CONFIG = {
  radius: 280,
  centerX: 300,
  centerY: 300,
  startAngle: -90, // 默认从 12 点方向开始
  pointerDirectionOffset: 0, // 指针方向相对于起始角的偏移量（单位：度），默认为 0 表示正上方
  colors: [
    '#FFE4E1', '#FFD700', '#F0E68C', '#90EE90',
    '#87CEEB', '#E6E6FA', '#FFB6C1', '#FFA500',
    '#40E0D0', '#EE82EE', '#F08080', '#483D8B',
  ],
  prizes: [],
  prizesConfig: []
};

// 响应式数据
let lotteryBasicInfo = ref(DEFAULT_USER_INFO);
const records = ref<LuckyDrawRecord[]>([]);
const isDrawing = ref(false);

// 分页参数
const pagination = reactive(DEFAULT_PAGINATION);

// 转盘配置
const lotteryConfig = ref(DEFAULT_LOTTERY_CONFIG);

const isResetNeeded = ref(false); // 是否需要复位（即是否已抽奖过）

const lotteryCanvasRef = ref<HTMLCanvasElement | null>(null);
const pointerCanvasRef = ref<HTMLCanvasElement | null>(null);


// 通用错误处理函数
const handleApiError = (error: any, message: string) => {
  console.error(message, error);
  ElMessage.error('网络异常，请稍后再试');
};

const fetchLotteryBasicInfo = async () => {
  try {
    const res = await getLotteryBasicInfo();
    if (res.code === 0 && res.data) {
      lotteryBasicInfo.value = res.data;
    } else {
      ElMessage.error(res.msg || '获取客户信息失败');
    }
  } catch (error) {
    handleApiError(error, '请求记录失败:');
  }
};

const fetchLuckyPrizeConfig = async () => {
  try {
    const res = await listLuckyPrizeConfig();
    if (res.code === 0 && res.data) {
      lotteryConfig.value.prizes = res.data;

      // ✅ 动态分配 index，确保 index=0 是第一个绘制的扇区（12点方向）
      lotteryConfig.value.prizesConfig = res.data.map((item: any, index: number) => ({
        id: item.id,
        name: item.name + item.value + item.unitName,
        index: index
      }));
      drawLottery();
      drawPointer();
    } else {
      ElMessage.error(res.msg || '获取奖品配置失败');
    }
  } catch (error) {
    handleApiError(error, '请求奖品配置失败:');
  }
};

const getPrizeIndexById = (prizeId: number): number => {
  const prizeConfig = lotteryConfig.value.prizesConfig.find(p => p.id === prizeId);
  if (!prizeConfig) {
    ElMessage.error('未找到对应奖品配置');
    return 0;
  }

  const {index} = prizeConfig;
  return index;
};

// 绘制转盘
const drawLottery = () => {
  if (!lotteryCanvasRef.value) return;
  const ctx = lotteryCanvasRef.value.getContext('2d');
  const {centerX, centerY, radius, startAngle, prizes} = lotteryConfig.value;
  const totalPrizes = prizes.length;
  const colors = lotteryConfig.value.colors.slice(0, totalPrizes);
  const anglePerPrize = 360 / totalPrizes; // 每个扇区角度

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
    const angle = anglePerPrize * index;
    const start = (startAngle + angle) * Math.PI / 180;
    const end = (startAngle + angle + anglePerPrize) * Math.PI / 180;

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
    const {name, value, unitName} = prizes[index];
    const lines: any = [];
    if (name === '未中奖') {
      lines.push(name);
      lines.push('');
    } else {
      lines.push(name);
      lines.push(`${value}${unitName}`);
    }

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
      // ctx.fillText(`idx:${index}`, textX, textY);
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

const resetLottery = () => {
  debugger;
  if (isDrawing.value) return;

  const resetAngle = -90; // 初始角度
  const currentAngle = lotteryConfig.value.startAngle;

  if (Math.abs(currentAngle - resetAngle) < 1) {
    // 已经在初始角度，无需复位
    isResetNeeded.value = false;
    ElMessage.info('请再次点击以开始新一轮抽奖');
    return;
  }

  isDrawing.value = true;

  const animateReset = (current: number) => {
    requestAnimationFrame(() => {
      if (Math.abs(current - resetAngle) > 1) {
        const step = (resetAngle - current) * 0.2; // 缓动效果
        lotteryConfig.value.startAngle += step;
        drawLottery();
        animateReset(lotteryConfig.value.startAngle);
      } else {
        lotteryConfig.value.startAngle = resetAngle;
        drawLottery();
        isResetNeeded.value = false;
        isDrawing.value = false;
        ElMessage.success('转盘已复位，请再次点击抽奖');
      }
    });
  };

  animateReset(currentAngle);
};


const startLottery = async () => {
  if (isDrawing.value || lotteryBasicInfo.value.seedBonus < lotteryBasicInfo.value.costMagic) {
    ElMessage.warning('魔力不足或正在抽奖中！');
    return;
  }

  if (isResetNeeded.value) {
    // 如果已经抽过奖，则需要先复位
    resetLottery();
    return;
  }

  isDrawing.value = true;

  try {
    const res = await luckyDraw({size: 1});

    if (res.code === 0 && res.data) {
      debugger
      const prizeId = res.data[0].prizeId;
      const prizeIndex = getPrizeIndexById(prizeId); // 获取 Canvas.index

      const totalPrizes = lotteryConfig.value.prizes.length;
      const anglePerPrize = 360 / totalPrizes;

      // 计算目标扇区中心角
      const sectorCenter = (prizeIndex + 0.5) * anglePerPrize;
      const targetSectorCenter = 360 - sectorCenter + lotteryConfig.value.startAngle;
      // 计算增量和最终角度
      const fullRotation = 360 * 3; // 固定旋转圈数
      const finalTargetAngle = fullRotation + targetSectorCenter;

      console.log("奖品:", JSON.stringify(res.data[0]));
      console.log("最终角度:", finalTargetAngle % 360);
      console.log("对应扇区:", Math.floor((finalTargetAngle % 360) / anglePerPrize));

      // 动画函数
      const animate = (currentAngle: number) => {
        requestAnimationFrame(() => {
          if (currentAngle < finalTargetAngle) {
            lotteryConfig.value.startAngle = currentAngle;
            drawLottery();
            animate(currentAngle + 5); // 控制速度
          } else {
            lotteryConfig.value.startAngle = finalTargetAngle;
            drawLottery(); // 最后一帧强制重绘
            isDrawing.value = false;
            isResetNeeded.value = true; // 抽奖完成后设置为“需要复位”
            let prize = handlePrize(res.data[0]);
            ElMessage.success(`中奖结果:${prize}`);
            fetchRecords();
            fetchLotteryBasicInfo();
          }
        });
      };
      animate(lotteryConfig.value.startAngle);
    }
  } catch (error) {
    handleApiError(error, '抽奖请求失败:');
    isDrawing.value = false;
  }
};

const fetchRecords = async () => {
  try {
    const res = await getRecordsByPage(pagination);
    if (res.code === 0 && res.data.records) {
      records.value = res.data.records;
      pagination.total = res.data.total || res.data.records.length;
    } else {
      ElMessage.error(res.msg || '获取记录失败');
    }
  } catch (error) {
    handleApiError(error, '请求记录失败:');
  }
};

// 处理中奖结果
const handlePrize = (res: any) => {
  const {prizeName, prizeType, prizeValue, unitName} = res;
  let prizeText = '';
  if (prizeType === '99') {
    prizeText = prizeName;
  } else {
    prizeText = `${prizeName}${prizeValue}${unitName}`;
  }
  return prizeText;
};

// 连抽逻辑
const continuousDraw = async (count: number) => {
  let costRealMagic = lotteryBasicInfo.value.costMagic * count * lotteryBasicInfo.value.discount * 0.01;
  if (lotteryBasicInfo.value.seedBonus < costRealMagic) {
    ElMessage({
      message: '魔力不足！',
      type: 'warning',
    });
    return;
  }
  const res = await luckyDraw({size: count});
  if (res.code === 0 && res.data) {
    const summary: Record<string, { count: number; iconClass: string; iconStyleClass: string }> = {};

    res.data.forEach((item: any) => {
      const prizeText = handlePrize(item);
      const prizeType = item.prizeType;

      // 定义不同 prizeType 对应的图标类名 & 颜色类名
      const iconMap: Record<string, { iconClass: string; iconStyleClass: string }> = {
        '01': {iconClass: 'fa-solid fa-coins', iconStyleClass: 'icon-magic'},       // 魔力
        '02': {iconClass: 'fa-solid fa-star', iconStyleClass: 'icon-vip'},          // VIP
        '03': {iconClass: 'fa-solid fa-pen', iconStyleClass: 'icon-rename'},        // 改名卡
        '04': {iconClass: 'fa-solid fa-rainbow', iconStyleClass: 'icon-rainbow'},   // 彩虹ID
        '05': {iconClass: 'fa-solid fa-calendar-check', iconStyleClass: 'icon-checkin'}, // 补签卡
        '06': {iconClass: 'fa-solid fa-arrow-alt-circle-up', iconStyleClass: 'icon-upload'}, // 上传量
        '99': {iconClass: 'fa-solid fa-times-circle', iconStyleClass: 'icon-none'},  // 谢谢参与
      };

      const {iconClass, iconStyleClass} = iconMap[prizeType] || {
        iconClass: '',
        iconStyleClass: ''
      };

      if (summary[prizeText]) {
        summary[prizeText].count += 1;
      } else {
        summary[prizeText] = {count: 1, iconClass, iconStyleClass};
      }
    });

    // 构建带图标的 HTML 消息，使用 class 而不是 inline style
    const summaryMessage = Object.entries(summary)
        .map(([prize, {count, iconClass, iconStyleClass}]) => {
          return `<div style="margin: 4px 0;">
                  <i class="${iconClass} ${iconStyleClass}"></i>&nbsp;
                  ${prize} x ${count}
                </div>`;
        })
        .join('');

    ElNotification({
      title: '连抽中奖结果',
      dangerouslyUseHTMLString: true,
      message: summaryMessage,
      duration: 4000,
      type: 'success',
      showClose: true,
    });

    await fetchLotteryBasicInfo();
  }
};

const handlePageChange = ({pageNum, pageSize}: { pageNum: number; pageSize: number }) => {
  pagination.pageNum = pageNum;
  pagination.pageSize = pageSize;
  fetchRecords();
};

onMounted(() => {
  fetchRecords(); // 初始化抽奖记录
  fetchLotteryBasicInfo();
  fetchLuckyPrizeConfig();
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

.info-card,
.continuous-card,
.record-container {
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

.prize-icon-text {
  display: flex;
  align-items: center;
  gap: 8px; /* 图标与文字间距 */
}

/* 图标颜色区分 */
.icon-magic {
  color: gold;
}

.icon-vip {
  color: yellow;
}

.icon-rename {
  color: #409eff;
}

.icon-rainbow {
  color: #ff7f50;
}

.icon-checkin {
  color: #4caf50;
}

.icon-upload {
  color: #2196f3;
}

.icon-none {
  color: #ff4d4d;
}
</style>