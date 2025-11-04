<template>
  <div class="combo-position-feature">
    <h3>组合持股明细</h3>
    <el-table
      :data="tableData"
      default-expand-all
      :header-cell-style="{
        // background: '#d7d9dc',
        color: '#333',
        height: '30px',
        padding: 0,
        fontSize: '16px',
      }"
      :cell-style="{ height: '30px', padding: 0, fontSize: '16px' }"
    >
      <el-table-column prop="name" label="" />
      <el-table-column prop="shizhi" label="百分比" />
      <el-table-column prop="shouyi" label="数量" />
    </el-table>
    <div style="height: 30px;"></div>
    <div id="shizhi"></div>
    <div style="height: 30px;"></div>
    <div style="display: flex">
      <div id="hangye" style="width: 35%"></div>
      <div id="diqu" style="width: 65%">
        <h3>地区分布</h3>
        <CustomCharts :sectorData="sectorData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import * as echarts from "echarts";
import CustomCharts from "@/components/CustomCharts.vue";

const tableData = ref([
  {
    id: "1",
    name: "中科华华",
    shizhi: "0.05%",
    shouyi: "0.05%",
  },
  {
    id: "2",
    name: "中科华华",
    shizhi: "0.05%",
    shouyi: "0.05%",
  },
]);

const sectorData = ref([
  { name: "Electronic Technology", value: 21.94 },
  { name: "Technology Services", value: 20.78 },
  { name: "Finance", value: 15.21 },
  { name: "Retail Trade", value: 8.18 },
  { name: "Health Technology", value: 7.54 },
  { name: "Consumer Non-Durables", value: 3.85 },
  { name: "Producer Manufacturing", value: 3.34 },
  { name: "Consumer Services", value: 3.02 },
  { name: "Utilities", value: 2.48 },
  { name: "Energy Minerals", value: 2.45 },
  { name: "Consumer Durables", value: 2.43 },
  { name: "Transportation", value: 1.55 },
  { name: "Process Industries", value: 1.48 },
  { name: "Commercial Services", value: 1.08 },
  { name: "Health Services", value: 1.32 },
  { name: "Communications", value: 0.97 },
  { name: "Industrial Services", value: 0.93 },
  { name: "Distribution Services", value: 0.66 },
  { name: "Non-Energy Minerals", value: 0.45 },
  { name: "CASH", value: 0.22 },
  { name: "Miscellaneous", value: 0.05 },
]);

onMounted(() => {
  window.addEventListener("resize", resizeChart);
  initShizhiChart();
  initHangyeChart();
});

onUnmounted(() => {
  disposeCharts();
});

let shizhiChart: echarts.ECharts | null = null;
let hangyeChart: echarts.ECharts | null = null;
function initHangyeChart() {
  hangyeChart = echarts.init(document.getElementById("hangye"));
  hangyeChart.setOption({
    title: {
      text: "行业分布",
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

function initDiquChart() {}

function initShizhiChart() {
  shizhiChart = echarts.init(document.getElementById("shizhi"));
  shizhiChart.setOption({
    title: {
      text: "市值分布",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    // legend: {},
    grid: {
      left: "10%",
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
    ],
  });
}
function resizeChart() {
  const charts = [shizhiChart, hangyeChart];
  charts.forEach((chart) => {
    if (chart) {
      chart.resize();
    }
  });
}
function disposeCharts() {
  const charts = [shizhiChart, hangyeChart];
  charts.forEach((chart) => {
    if (chart) {
      chart.dispose();
      chart = null;
    }
  });
}
</script>

<style lang="scss" scoped>
.combo-position-feature {
  width: 100%;
  #shizhi,
  #hangye,
  #diqu {
    width: 100%;
    height: 400px;
  }
}
</style>
