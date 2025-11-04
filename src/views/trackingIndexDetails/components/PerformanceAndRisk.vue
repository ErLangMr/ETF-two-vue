<template>
  <div class="performance-and-risk">
    <div id="market-performance"></div>
    <h3>指数回报与风险特征</h3>
    <el-table
      :data="tableData"
      :header-cell-style="{ background: '#d7d9dc', color: '#333' }"
      style="width: 100%"
    >
      <el-table-column prop="name" label=""></el-table-column>
      <el-table-column
        :prop="column.prop"
        :label="column.label"
        v-for="column in tableColumn"
        :key="column.prop"
      >
        <template #default="{ row }">
          <span :style="{ color: row[column.prop] >= 0 ? 'red' : 'green' }">
            {{ row[column.prop] }}%
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  tabActiveName: { type: String, required: true },
});
watch(
  () => props.tabActiveName,
  (newVal) => {
    if (newVal === "PerformanceAndRisk")
      nextTick(() => {
        initChart();
      });
  }
);
onMounted(() => {
  window.addEventListener("resize", resizeChart);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
  disposeCharts();
});

const tableData = ref([
  {
    name: "XXXX",
    oneMonth: "0.08",
    threeMonth: "0.16",
    sixMonth: "0.24",
    ytdReturns: "0.32",
    yearlyReturns: "0.40",
    threeYearReturns: "0.48",
    fiveYearReturns: "0.56",
    establishedReturns: "0.64",
  },
  {
    name: "XXXX",
    oneMonth: "0.08",
    threeMonth: "0.16",
    sixMonth: "0.24",
    ytdReturns: "0.32",
    yearlyReturns: "0.40",
    threeYearReturns: "0.48",
    fiveYearReturns: "0.56",
    establishedReturns: "0.64",
  },
]);
const tableColumn = [
  { prop: "oneMonth", label: "近一月" },
  { prop: "threeMonth", label: "近三月" },
  { prop: "sixMonth", label: "近六个月" },
  { prop: "ytdReturns", label: "今年以来" },
  { prop: "yearlyReturns", label: "近一年" },
  { prop: "threeYearReturns", label: "近三年" },
  { prop: "fiveYearReturns", label: "近五年" },
  { prop: "establishedReturns", label: "成立以来" },
];

let marketPerformanceChart: echarts.ECharts | null = null;
function initChart() {
  disposeCharts();
  marketPerformanceChart = echarts.init(
    document.getElementById("market-performance")
  );
  marketPerformanceChart.setOption({
    title: {
      text: "市场表现",
    },
    tooltip: {
      trigger: "axis",
      // axisPointer: {
      //   type: "cross",
      //   crossStyle: {
      //     color: "#999",
      //   },
      // },
    },
    legend: {
      data: ["累计涨跌", "成交额"],
    },
    xAxis: [
      {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        // axisPointer: {
        //   type: "shadow",
        // },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "累计涨跌幅",
        axisLabel: {
          formatter: "{value} %",
        },
      },
      {
        type: "value",
        name: "成交额",
        axisLabel: {
          formatter: "{value} 亿元",
        },
      },
    ],
    series: [
      {
        name: "累计涨跌",
        type: "line",
        yAxisIndex: 0,
        symbol: "none",
        tooltip: {
          valueFormatter: function (value: any) {
            return value + "%";
          },
        },
        data: [0.1, -1, 0.2, 0.3, -0.22, 0.2, 0.3, 0.4, -0.5, 0.5, 0.3, 0.2],
      },
      {
        name: "成交额",
        type: "line",
        yAxisIndex: 1,
        symbol: "none",
        tooltip: {
          valueFormatter: function (value: any) {
            return value + " 亿元";
          },
        },
        data: [
          2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2,
        ],
      },
    ],
  });
}
function resizeChart() {
  if (marketPerformanceChart) {
    marketPerformanceChart.resize();
  }
}
function disposeCharts() {
  if (marketPerformanceChart) {
    marketPerformanceChart.dispose();
  }
}
</script>

<style lang="scss" scoped>
.performance-and-risk {
  width: 100%;
  height: 100%;
  #market-performance {
    width: 100%;
    height: 400px;
  }
}
</style>
