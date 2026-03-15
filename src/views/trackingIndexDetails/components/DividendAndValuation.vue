<template>
  <div class="dividend-and-valuation">
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      "
    >
      <h4>基本面</h4>
      <div style="width: auto">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="To"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          @change="handleDateChange"
        />
      </div>
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{ background: '#d7d9dc', color: '#333' }"
      style="width: 100%"
    >
      <el-table-column prop="indexCode" label="指数代码" min-width="100" />
      <el-table-column prop="indexName" label="指数名称" min-width="100" />
      <el-table-column prop="tys" label="营业收入(单位：亿元)" min-width="180">
        <template #default="{ row }">
          <span>
            {{ (row.tys/100000000).toFixed(4) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="ysZS" label="营业收入增幅" min-width="150">
        <template #default="{ row }">
          <span :style="{ color: row.ysZS >= 0 ? 'red' : 'green' }">
            {{ row.ysZS.toFixed(4) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="tnp" label="净利润(单位：亿元)" min-width="180">
        <template #default="{ row }">
          <span :style="{ color: row.tnp >= 0 ? 'red' : 'green' }">
            {{ (row.tnp/100000000).toFixed(4) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="npZS" label="净利润增速" min-width="150">
        <template #default="{ row }">
          <span :style="{ color: row.npZS >= 0 ? 'red' : 'green' }">
            {{ row.npZS.toFixed(4) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="troe" label="加权平均ROE" min-width="150">
        <template #default="{ row }">
          <span>
            {{ row.troe.toFixed(4) }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: flex-end; margin-top: 20px">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- <div id="ValuationChart" style="height: 400px"></div>
    <div>
      <h4 style="margin-bottom: 10px">分红概览</h4>
      <div class="dividend-overview">
        <div class="overview-card">
          <div class="card-title">
            股息率(近12个月)
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
    <div id="dividendChart" style="height: 400px"></div>
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
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from "vue";
import * as echarts from "echarts";
import { getIndexDividendFundamentalsApi } from "@/api/trackingIndex";

const tableData = ref([]);
const props = defineProps<{
  tabActiveName: string;
  code: string;
}>();

const dateValue = ref(['2011-12-31', '2025-09-30']);

function handleDateChange() {
  getChartData();
}
// 分页相关
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
function handleSizeChange(val: number) {
  pageSize.value = val;
  getIndexDividendFundamentals();
}
function handleCurrentChange(val: number) {
  currentPage.value = val;
  getIndexDividendFundamentals();
}
function getIndexDividendFundamentals() {
  getIndexDividendFundamentalsApi({
    indexCode: props.code,
    start: dateValue.value[0],
    end: dateValue.value[1],
    pageNum: currentPage.value,
    pageSize: pageSize.value,
  }).then((res) => {
    tableData.value = res.content;
    total.value = res.totalElements;
  });
}

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
        markLine: {
          silent: true,
          lineStyle: {
            color: "#333",
          },
          data: [
            {
              yAxis: 200,
            },
            {
              yAxis: 300,
            },
          ],
        },
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
        getIndexDividendFundamentals();
        // getChartData();
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
