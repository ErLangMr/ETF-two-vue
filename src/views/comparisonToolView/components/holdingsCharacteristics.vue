<template>
  <div class="holdingsCharacteristics">
    <table-comp :tableData="tableData" />
    <div style="display: flex; width: 100%; justify-content: space-between; gap: 40px;margin-top: 40px;">
      <div id="shizhiChart"></div>
      <div id="hangyeChart"></div>
      <div id="diquChart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import tableComp from './tableComp.vue';
import * as echarts from 'echarts';

const props = defineProps({
  tableData: {
    type: Object,
    default: () => ({})
  }
});
let shizhiChart: echarts.ECharts | null = null;
let hangyeChart: echarts.ECharts | null = null;
let diquChart: echarts.ECharts | null = null;
function getChartData() {
  shizhiChart = echarts.init(document.getElementById('shizhiChart'));
  hangyeChart = echarts.init(document.getElementById('hangyeChart'));
  diquChart = echarts.init(document.getElementById('diquChart'));
  initCharts(shizhiChart, "市值分布");
  initCharts(hangyeChart, "行业分布");
  initCharts(diquChart, "地区分布");
}
function initCharts(chart: echarts.ECharts, title: string) {
  if (chart) {
    chart.setOption({
      title: {
        text: title,
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
function disposeCharts() {
  const charts = [shizhiChart, hangyeChart, diquChart];
  charts.forEach((chart) => {
    if (chart) {
      chart.dispose();
      chart = null;
    }
  });
}
function resizeChart() {
  const charts = [shizhiChart, hangyeChart, diquChart];
  charts.forEach((chart) => {
    if (chart) {
      chart.resize();
    }
  });
}
onMounted(() => {
  window.addEventListener("resize", resizeChart);
  getChartData();
});
onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
  disposeCharts();
});
</script>

<style lang="scss" scoped>
.holdingsCharacteristics {
  width: 100%;
  height: 100%;
  #shizhiChart,
  #hangyeChart,
  #diquChart {
    width: 33%;
    height: 400px;
  }
}
</style>
