<template>
  <div class="deepCompare_container">
    <div class="contentBox">
      <div class="overlap-card mainBox">
        <header class="section-title">持仓重合度</header>
        <div class="main-content">
          <!-- 左侧：圆环图 -->
          <div class="venn-diagram">
            <svg
              :width="svgWidth"
              :height="svgHeight"
              :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
            >
              <!-- 左圆环 (ETF1) -->
              <circle
                :cx="circlePositions.circle1.cx"
                :cy="circlePositions.circle1.cy"
                :r="radius"
                fill="none"
                :stroke="etfColors[0]"
                stroke-width="5"
                class="circle-animate"
              />
              <!-- 右圆环 (ETF2) -->
              <circle
                :cx="circlePositions.circle2.cx"
                :cy="circlePositions.circle2.cy"
                :r="radius"
                fill="none"
                :stroke="etfColors[1]"
                stroke-width="5"
                class="circle-animate"
              />
            </svg>
          </div>

          <!-- 右侧：指标数据 -->
          <div class="metrics">
            <div class="metric-item">
              <div class="metric-value">
                {{ overlapData.weightPercentage }}%
              </div>
              <div class="metric-label">
                <div>按权重</div>
                <div>重合度</div>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-value">{{ overlapData.holdingsCount }}</div>
              <div class="metric-label">
                <div>重合</div>
                <div>持仓数</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部：ETF详细数据 -->
        <div class="etf-details">
          <div class="etf-detail-item">
            <div
              class="etf-header"
              :style="{ borderTop: `4px solid ${etfColors[0]}` }"
            ></div>
            <div class="detail-stats">
              <div class="detail-stat">
                <span class="stat-num">{{ overlapData.etf1.ETFCode }}</span>
              </div>
              <div class="detail-stat">
                <span class="stat-num">{{
                  overlapData.etf1.totalHoldings
                }}</span>
                <span class="stat-text">持仓数</span>
              </div>
              <div class="detail-stat">
                <span class="stat-num">{{ overlapData.etf1.alsoInEtf2 }}%</span>
                <span class="stat-text">重合部分</span>
              </div>
            </div>
          </div>

          <div class="etf-detail-item">
            <div
              class="etf-header"
              :style="{ borderTop: `4px solid ${etfColors[1]}` }"
            ></div>
            <div class="detail-stats">
              <div class="detail-stat">
                <span class="stat-num">{{ overlapData.etf2.ETFCode }}</span>
              </div>
              <div class="detail-stat">
                <span class="stat-num">{{
                  overlapData.etf2.totalHoldings
                }}</span>
                <span class="stat-text">持仓数</span>
              </div>
              <div class="detail-stat">
                <span class="stat-num">{{ overlapData.etf2.alsoInEtf1 }}%</span>
                <span class="stat-text">重合部分</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mainBox">
        <header class="section-title">两只ETF持仓权重之差</header>
        <div id="chart"></div>
      </div>
    </div>
    <div style="width: 100%; padding: 20px;">
      <div class="mainBox">
        <header class="section-title" style="margin-bottom: 10px;">重合持有的股票明细</header>
        <el-table
          :data="tableData"
          :header-cell-style="{
            background: '#f5f5fa',
            color: '#333',
            fontWeight: 'bold',
            fontSize: '1rem',
          }"
        >
          <el-table-column
            v-for="col in tableColumn"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
          />
        </el-table>
      </div>
    </div>
    <div class="contentBox">
      <div class="mainBox">
        <header class="section-title">两只ETF持仓权重之差</header>
        <div class="weight-diff-container">
          <div
            v-for="item in weightDiffData"
            :key="item.stockCode"
            class="weight-diff-item"
          >
            <div class="stock-name">{{ item.stockName }}</div>
            <div class="progress-wrapper">
              <div
                class="progress-bar"
                :style="{ width: (item.weightDiff / maxWeightDiff * 100) + '%' }"
              ></div>
            </div>
            <div class="weight-value">{{ item.weightDiff }}%</div>
          </div>
        </div>
      </div>
      <div class="mainBox">
        <header class="section-title">两只ETF持仓权重之差</header>
        <div class="weight-diff-container">
          <div
            v-for="item in weightDiffData"
            :key="item.stockCode"
            class="weight-diff-item"
          >
            <div class="stock-name">{{ item.stockName }}</div>
            <div class="progress-wrapper">
              <div
                class="progress-bar"
                :style="{ width: (item.weightDiff / maxWeightDiff * 100) + '%' }"
              ></div>
            </div>
            <div class="weight-value">{{ item.weightDiff }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import * as echarts from "echarts";

const route = useRoute();
onMounted(() => {
  const ETFCodes = route.query.codes;
  if (ETFCodes) {
    window.addEventListener("resize", () => {
      if (myChart) {
        myChart.resize();
      }
    });
    etfCodes.value = (ETFCodes as string).split(",");
    etfCodes.value.forEach((code) => {
      tableColumn.value.push({ prop: code, label: code + "权重" });
    });
    tableColumn.value.push({ prop: "overlap", label: "重叠" });
    fetchOverlapData();
    initChart();
  }
});

const tableData = ref([]);
const tableColumn = ref([{ prop: "stockCode", label: "" }]);
const etfCodes = ref<string[]>([]);
const etfColors = ref<string[]>(["#1e5a78", "#7ba3d1"]);

interface WeightDiffData {
  stockCode: string;
  stockName: string;
  weightDiff: number;
}

const weightDiffData = ref<WeightDiffData[]>([]);

const maxWeightDiff = computed(() => {
  if (weightDiffData.value.length === 0) return 10;
  return Math.max(...weightDiffData.value.map(item => item.weightDiff));
});

interface OverlapData {
  weightPercentage: number;
  holdingsCount: number;
  etf1: {
    ETFCode: string;
    totalHoldings: number;
    alsoInEtf2: number;
  };
  etf2: {
    ETFCode: string;
    totalHoldings: number;
    alsoInEtf1: number;
  };
}

const overlapData = ref<OverlapData>({
  weightPercentage: 0,
  holdingsCount: 0,
  etf1: {
    ETFCode: "",
    totalHoldings: 0,
    alsoInEtf2: 0,
  },
  etf2: {
    ETFCode: "",
    totalHoldings: 0,
    alsoInEtf1: 0,
  },
});

// 圆环半径（固定）
const radius = 60;
const svgWidth = 250;
const svgHeight = 250;

// 根据重合度动态计算两个圆心的位置
const circlePositions = computed(() => {
  const overlapPercent = overlapData.value.weightPercentage;

  // 重合度 0% 时，两圆分离（圆心距离 = 2*radius + 20）
  // 重合度 100% 时，两圆完全重叠（圆心距离 = 0）
  // 重合度 50% 时，圆心距离约为 radius（交叉面积约为单圆面积的一半）

  // 使用非线性映射，让视觉效果更直观
  const maxDistance = radius * 2 + 5; // 两圆刚好相切时的距离
  const minDistance = 0; // 完全重叠

  // 将重合度转换为圆心距离（0-100% 映射到 maxDistance-minDistance）
  // 使用平方根函数使变化更平滑
  const normalizedOverlap = overlapPercent / 100;
  const distance = maxDistance * (1 - Math.sqrt(normalizedOverlap));

  // 计算两个圆心的X坐标（Y坐标固定在中心）
  const centerY = svgHeight / 2;
  const centerX = svgWidth / 2;

  const circle1X = centerX - distance / 2;
  const circle2X = centerX + distance / 2;

  return {
    circle1: { cx: circle1X, cy: centerY },
    circle2: { cx: circle2X, cy: centerY },
  };
});

const fetchOverlapData = async () => {
  // TODO: 调用API获取实际数据
  // const response = await getOverlapDataApi(etfCodes.value);
  // overlapData.value = response.data;
  overlapData.value = {
    weightPercentage: 40,
    holdingsCount: 88,
    etf1: {
      ETFCode: etfCodes.value[0],
      totalHoldings: 503,
      alsoInEtf2: 1,
    },
    etf2: {
      ETFCode: etfCodes.value[1],
      totalHoldings: 102,
      alsoInEtf1: 87,
    },
  };

  // TODO: 调用API获取权重差异数据
  // 模拟数据
  weightDiffData.value = [
    { stockCode: "NVDA", stockName: "NVIDIA CORP", weightDiff: 8.8 },
    { stockCode: "AAPL", stockName: "APPLE INC", weightDiff: 6.6 },
    { stockCode: "MSFT", stockName: "MICROSOFT CORP", weightDiff: 6.1 },
    { stockCode: "AVGO", stockName: "BROADCOM INC.", weightDiff: 1.8 },
    { stockCode: "ORCL", stockName: "ORACLE CORP", weightDiff: 1.5 },
    { stockCode: "AMD", stockName: "ADVANCED MICRO DEVICES", weightDiff: 1.3 },
    { stockCode: "PLTR", stockName: "PALANTIR TECHNOLOGIES INC. CLASS A", weightDiff: 1.3 },
    { stockCode: "IBM", stockName: "INTL BUSINESS MACHINES CORP", weightDiff: 0.9 },
    { stockCode: "CSCO", stockName: "CISCO SYSTEMS INC", weightDiff: 0.9 },
    { stockCode: "MU", stockName: "MICRON TECHNOLOGY INC", weightDiff: 0.8 },
  ];
};
let myChart: echarts.ECharts;

function initChart() {
  if (myChart) {
    myChart.dispose();
  }
  myChart = echarts.init(document.getElementById("chart"));
  myChart.setOption({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "15%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.1],
    },
    yAxis: {
      type: "category",
      data: ["Brazil", "Indonesia", "USA", "India", "China", "World"],
      position: "right",
      axisTick: {
        show: false,
      },
    },
    series: [
      {
        name: "2011",
        type: "bar",
        barGap: 0,
        data: [-18203, -23489, -29034, 104970, -131744, -130230],
      },
    ],
  });
}
onUnmounted(() => {
  if (myChart) {
    myChart.dispose();
  }
});
</script>

<style lang="scss" scoped>
.deepCompare_container {
  width: 100%;
  .overlap-card {
    // background: #4a5568;
    border-radius: 8px;
    padding: 24px 32px;
    // color: #fff;
  }

  .section-title {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
  }

  .main-content {
    display: flex;
    align-items: center;
  }

  .venn-diagram {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    // 圆环位置平滑过渡动画
    .circle-animate {
      transition: cx 0.6s ease-in-out, cy 0.6s ease-in-out;
    }
  }

  .metrics {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 40px;
    align-items: center;
  }

  .metric-item {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .metric-value {
    font-size: 32px;
    font-weight: 700;
    line-height: 1;
  }

  .metric-label {
    font-size: 16px;
    line-height: 1.6;
    font-weight: 500;
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }

  .etf-details {
    display: flex;
    gap: 40px;
  }

  .etf-detail-item {
    flex: 1;
  }

  .etf-header {
    margin-bottom: 20px;
  }

  .etf-code {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 1px;
  }

  .detail-stats {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }

  .detail-stat {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .stat-num {
    font-size: 20px;
    font-weight: 700;
    line-height: 1;
  }

  .stat-text {
    font-size: 14px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    opacity: 0.9;
  }
  .contentBox {
    display: flex;
    justify-content: space-between;
    .mainBox {
      width: 50%;
      height: 400px;
      padding: 20px;
      header {
        padding: 0 20px;
        height: 40px;
        line-height: 40px;
        background: #f5f5fa;
      }
      #chart {
        width: 100%;
        height: calc(100% - 40px);
      }
    }
  }

  .weight-diff-container {
    padding: 20px;
    overflow-y: auto;
  }

  .weight-diff-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    gap: 15px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .stock-name {
    width: 80%;
    flex-shrink: 0;
    text-align: left;
  }

  .progress-wrapper {
    flex: 1;
    background: rgba(255, 255, 255, 0.1);
    height: 16px;
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    background: #5b8fb9;
    border-radius: 0 2px 2px 0;
    transition: width 0.6s ease;
  }

  .weight-value {
    width: 50px;
    flex-shrink: 0;
    text-align: right;
  }
}
</style>
