<template>
  <div class="position-analysis">
    <el-table
      :data="tableData"
      :header-cell-style="{
        background: '#d7d9dc',
        color: '#333',
      }"
      style="margin: 20px 0"
    >
      <el-table-column prop="time" label="日期" />
      <el-table-column prop="shuliang" label="持股数量" />
      <el-table-column prop="jizhongdu" label="持股集中度" />
      <el-table-column prop="dapan" label="大盘股占比" />
      <el-table-column prop="zhongpan" label="中盘股占比" />
      <el-table-column prop="xiaopan" label="小盘股占比" />
    </el-table>
    <div style="display: flex; width: 100%; justify-content: space-between">
      <div id="hangye"></div>
      <div id="diqu"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { nextTick, onMounted, onUnmounted, watch } from "vue";

const props = defineProps<{
  tabActiveName: string;
}>();
watch(
  () => props.tabActiveName,
  () => {
    if (props.tabActiveName === "PositionAnalysis") {
      nextTick(() => {
        getChartData();
      });
    }
  },
  { immediate: true }
);
const tableData = [
  {
    time: "2025-10-18",
    shuliang: "1000",
    jizhongdu: "10",
    dapan: "10",
    zhongpan: "10",
    xiaopan: "10",
  },
  {
    time: "2025-10-18",
    shuliang: "1000",
    jizhongdu: "10",
    dapan: "10",
    zhongpan: "10",
    xiaopan: "10",
  },
  {
    time: "2025-10-18",
    shuliang: "1000",
    jizhongdu: "10",
    dapan: "10",
    zhongpan: "10",
    xiaopan: "10",
  },
  {
    time: "2025-10-18",
    shuliang: "1000",
    jizhongdu: "10",
    dapan: "10",
    zhongpan: "10",
    xiaopan: "10",
  },
  {
    time: "2025-10-18",
    shuliang: "1000",
    jizhongdu: "10",
    dapan: "10",
    zhongpan: "10",
    xiaopan: "10",
  },
  {
    time: "2025-10-18",
    shuliang: "1000",
    jizhongdu: "10",
    dapan: "10",
    zhongpan: "10",
    xiaopan: "10",
  },
];
let hangyeChart: echarts.ECharts | null = null;
let diquChart: echarts.ECharts | null = null;
function getChartData() {
  disposeCharts();
  hangyeChart = echarts.init(document.getElementById("hangye"));
  diquChart = echarts.init(document.getElementById("diqu"));
  initCharts(hangyeChart);
  initCharts(diquChart);
}
function initCharts(chart: echarts.ECharts) {
  if (chart) {
    chart.setOption({
      title: {
        text: "行业配置",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      // legend: {},
      grid: {
        left: "30%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.1],
        show: false,
      },

      yAxis: {
        type: "category",
        data: ["Brazil", "Indonesia", "USA", "India", "China", "World"],
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          name: "2011",
          type: "bar",
          barGap: 0,
          data: [18203, 23489, 29034, 104970, 131744, 630230],
          label: {
            show: true,
            position: "right",
            valueAnimation: true,
          },
        },
        {
          name: "2012",
          type: "bar",
          data: [19325, 23438, 31000, 121594, 134141, 681807],
          label: {
            show: true,
            position: "right",
            valueAnimation: true,
          },
        },
      ],
    });
  }
}
function resizeChart() {
  if (hangyeChart) {
    hangyeChart.resize();
  }
  if (diquChart) {
    diquChart.resize();
  }
}
function disposeCharts() {
  if (hangyeChart) {
    hangyeChart.dispose();
    hangyeChart = null;
  }
  if (diquChart) {
    diquChart.dispose();
    diquChart = null;
  }
}
onMounted(() => {
  window.addEventListener("resize", resizeChart);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
  disposeCharts();
});
</script>

<style lang="scss" scoped>
.position-analysis {
  width: 100%;
  #hangye,
  #diqu {
    width: 50%;
    height: 400px;
  }
}
</style>
