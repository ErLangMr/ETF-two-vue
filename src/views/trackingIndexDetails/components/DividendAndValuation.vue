<template>
  <div class="dividend-and-valuation">
    <h4 style="margin-bottom: 10px">基本面</h4>
    <el-table
      :data="tableData"
      :header-cell-style="{ background: '#d7d9dc', color: '#333' }"
      style="width: 100%"
    >
      <el-table-column prop="tradingDate" label="营业收入" />
      <el-table-column prop="closePrice" label="营业收入增幅" />
      <el-table-column prop="change" label="净利润">
        <template #default="{ row }">
          <span :style="{ color: row.change >= 0 ? 'red' : 'green' }">
            {{ row.change }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="changePercent" label="净利润增速">
        <template #default="{ row }">
          <span :style="{ color: row.change >= 0 ? 'red' : 'green' }">
            {{ row.changePercent }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="openDateChange" label="加权平均ROE" />
    </el-table>
    <div id="ValuationChart" style="height: 400px"></div>
    <div>
      <h4 style="margin-bottom: 10px">分红概览</h4>
      <div class="dividend-overview">
        <!-- 股息率 -->
        <div class="overview-card">
          <div class="card-title">
            股息率(近12个月)
            <!-- <span class="view-history">查看历史</span> -->
          </div>
          <div class="card-value">2.66%</div>
          <div class="card-detail">
            <div class="detail-item">
              <span>近3年分位点:</span>
              <span class="value">6.21%</span>
            </div>
            <div class="detail-item">
              <span>近5年分位点:</span>
              <span class="value">43.52%</span>
            </div>
          </div>
        </div>

        <!-- 分红总额 -->
        <div class="overview-card">
          <div class="card-title">分红总额(已宣告)</div>
          <div class="card-value">
            18,192.03<span class="unit">亿元</span>
            <span class="change positive">+7.18%</span>
          </div>
          <div class="card-detail">
            <div class="detail-item">
              <span>年度现金分红总额(已实施)</span>
              <span class="value">18,192.03亿元</span>
            </div>
            <div class="detail-item">
              <span>实施进度</span>
              <span class="value">100.00%</span>
            </div>
          </div>
        </div>

        <!-- 分红公司家数 -->
        <div class="overview-card">
          <div class="card-title">分红公司家数</div>
          <div class="card-value">
            280<span class="unit">家</span>
            <span class="change negative">-3家</span>
          </div>
          <div class="card-detail">
            <div class="detail-item">
              <span>年度已实施家数</span>
              <span class="value">280家</span>
            </div>
            <div class="detail-item">
              <span>年度已宣告待实施家数</span>
              <span class="value">0家</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div style="display: flex; justify-content: space-between; gap: 20px">

    </div> -->
    <div id="dividendChart" style="height: 400px;"></div>
      <div style="height: 400px">
        <el-table
          :data="tableData"
          :header-cell-style="{ background: '#d7d9dc', color: '#333' }"
          style="width: 100%"
        >
          <el-table-column prop="tradingDate" label="营业收入" />
          <el-table-column prop="closePrice" label="营业收入增幅" />
          <el-table-column prop="change" label="净利润">
            <template #default="{ row }">
              <span :style="{ color: row.change >= 0 ? 'red' : 'green' }">
                {{ row.change }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="changePercent" label="净利润增速">
            <template #default="{ row }">
              <span :style="{ color: row.change >= 0 ? 'red' : 'green' }">
                {{ row.changePercent }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="openDateChange" label="加权平均ROE" />
        </el-table>
      </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from "vue";
import * as echarts from "echarts";

const tableData = ref([
  {
    tradingDate: "2025-09-19",
    openPrice: 4499.09,
    highPrice: 4533.09,
    lowPrice: 4491.84,
    closePrice: 4501.92,
    change: 3.81,
    changePercent: "0.08%",
    openDateChange: -189.51,
    openDateChangePercent: "-4.04%",
    volume: "2,250,440.00",
    turnover: "60,388,705.98",
  },
  {
    tradingDate: "2025-09-18",
    openPrice: 4546.03,
    highPrice: 4573.83,
    lowPrice: 4454.99,
    closePrice: 4498.11,
    change: -52.91,
    changePercent: "-1.16%",
    openDateChange: -193.32,
    openDateChangePercent: "-4.12%",
    volume: "3,098,598.26",
    turnover: "83,998,712.74",
  },
  {
    tradingDate: "2025-09-17",
    openPrice: 4517.29,
    highPrice: 4556.03,
    lowPrice: 4503.8,
    closePrice: 4551.02,
    change: 27.69,
    changePercent: "0.61%",
    openDateChange: -140.41,
    openDateChangePercent: "-2.99%",
    volume: "2,357,164.72",
    turnover: "60,845,420.05",
  },
  {
    tradingDate: "2025-09-16",
    openPrice: 4539.92,
    highPrice: 4552.42,
    lowPrice: 4494.79,
    closePrice: 4523.34,
    change: -9.72,
    changePercent: "-0.21%",
    openDateChange: -168.09,
    openDateChangePercent: "-3.58%",
    volume: "2,492,692.06",
    turnover: "61,372,833.48",
  },
  {
    tradingDate: "2025-09-15",
    openPrice: 4534.89,
    highPrice: 4566.91,
    lowPrice: 4522.5,
    closePrice: 4533.06,
    change: 11.06,
    changePercent: "0.24%",
    openDateChange: -158.37,
    openDateChangePercent: "-3.38%",
    volume: "2,318,856.78",
    turnover: "61,331,465.24",
  },
  {
    tradingDate: "2025-09-12",
    openPrice: 4544.59,
    highPrice: 4564.67,
    lowPrice: 4517.79,
    closePrice: 4522.0,
    change: -26.04,
    changePercent: "-0.57%",
    openDateChange: -169.43,
    openDateChangePercent: "-3.61%",
    volume: "2,664,420.03",
    turnover: "68,957,607.57",
  },
]);
const props = defineProps<{
  tabActiveName: string;
}>();
let ValuationChart: echarts.ECharts | null = null;
let dividendChart: echarts.ECharts | null = null;
function getChartData() {
  disposeCharts();
  ValuationChart = echarts.init(
    document.getElementById("ValuationChart") as HTMLElement
  );
  dividendChart = echarts.init(
    document.getElementById("dividendChart") as HTMLElement
  );
  initValuationChart(ValuationChart);
  initDividendChart(dividendChart);
}
function initValuationChart(chart: echarts.ECharts) {
  chart.setOption({
    //   title: {
    //   text: '业绩表现'
    // },
    tooltip: {
      trigger: "axis",
    },

    legend: {
      orient: "horizontal",
      left: "center",
      bottom: "1%",
    },
    grid: {
      top: "10%",
      left: "3%",
      right: "4%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    // visualMap: {
    //   // top: 50,
    //   // right: 10,
    //   pieces: [
    //     {
    //       gt: 0,
    //       lte: 50,
    //       color: "#93CE07",
    //     },
    //     {
    //       gt: 50,
    //       lte: 100,
    //       color: "#FBDB0F",
    //     },
    //     {
    //       gt: 100,
    //       lte: 150,
    //       color: "#FC7D02",
    //     },
    //     {
    //       gt: 150,
    //       lte: 200,
    //       color: "#FD0100",
    //     },
    //     {
    //       gt: 200,
    //       lte: 300,
    //       color: "#AA069F",
    //     },
    //     {
    //       gt: 300,
    //       color: "#AC3B2A",
    //     },
    //   ],
    //   outOfRange: {
    //     color: "#999",
    //   },
    // },
    series: [
      {
        name: "Email",
        type: "line",
        showSymbol: false,
        symbol: "none",
        // smooth: true,
        data: [310, 232, 201, 134, 90, 40, 10],
        markLine: {
          silent: true,
          lineStyle: {
            color: "#333",
          },
          data: [
            {
              yAxis: 50,
            },
            {
              yAxis: 100,
            },
            {
              yAxis: 150,
            },
            {
              yAxis: 200,
            },
            {
              yAxis: 300,
            },
          ],
        },
      },
      {
        name: "Union Ads",
        type: "line",
        showSymbol: false,
        symbol: "none",
        // smooth: true,
        data: [20, 82, 131, 200, 260, 290, 310],
      },
    ],
  });
}
function initDividendChart(chart: echarts.ECharts) {
  chart.setOption({
    title: {
      text: "ETF规模",
      left: "3%",
      top: "3%",
    },
    grid: {
      left: "8%",
      right: "9%",
      top: "15%",
    },
    xAxis: {
      type: "category",
      data: [
        "动量因子",
        "投资因子",
        "盈利因子",
        "价值因子",
        "规模因子",
        "市场因子",
      ],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "ETF规模",
        data: [120, 200, 150, 80, 70, 110, 130],
        barWidth: "60%",
        type: "bar",
      },
      {
        name: "Temperature",
        type: "line",
        data: [120, 200, 150, 80, 70, 110, 130],
      },
    ],
  });
}
watch(
  () => props.tabActiveName,
  (newVal) => {
    if (newVal === "DividendAndValuation") {
      nextTick(() => {
        getChartData();
      });
    }
  }
);
function resizeChart() {
  const charts = [ValuationChart, dividendChart];
  charts.forEach((chart) => {
    if (chart) {
      chart.resize();
    }
  });
}
function disposeCharts() {
  const charts = [ValuationChart, dividendChart];
  charts.forEach((chart) => {
    if (chart) {
      chart.dispose();
      chart = null;
    }
  });
}
window.addEventListener("resize", resizeChart);
onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
  disposeCharts();
});
</script>

<style lang="scss" scoped>
.dividend-and-valuation {
  width: 100%;
  height: 100%;
}

.dividend-overview {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.overview-card {
  flex: 1;
  min-width: 200px;
  border: 1px solid #e4e7ed;
  border-radius: 5px;
  padding: 16px;
  background-color: #fff;

  .card-title {
    text-align: center;
    font-weight: bold;
    color: #303133;
    margin-bottom: 6px;
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    .view-history {
      color: #409eff;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .card-value {
    font-weight: bold;
    color: #303133;
    margin-bottom: 12px;
    text-align: center;

    .unit {
      font-size: 14px;
      font-weight: normal;
      margin-left: 4px;
    }

    .change {
      // font-size: 14px;
      margin-left: 8px;
      font-weight: normal;

      &.positive {
        color: #f56c6c;
      }

      &.negative {
        color: #67c23a;
      }
    }
  }

  .card-detail {
    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #909399;
      margin-bottom: 8px;
      line-height: 1.5;

      &:last-child {
        margin-bottom: 0;
      }

      .value {
        color: #606266;
        font-weight: 500;
        margin-left: 8px;
      }
    }
  }
}
</style>
