<template>
  <div class="performanceAndRisk-comparisonTool">
    <table-comp :tableData="tableData" />
    <div id="performanceAndRiskChart"></div>
  </div>
</template>

<script setup lang="ts">
import TableComp from './tableComp.vue';
import * as echarts from 'echarts';
import { onMounted, nextTick, onUnmounted } from 'vue';

const props = defineProps({
  tableData: {
    type: Object,
    default: () => ({})
  }
});

let myChart: echarts.ECharts | null = null;
onMounted(() => {
   window.addEventListener("resize", resizeChart);
  nextTick(() => {
    initChart();
  });
});
function initChart() {
  myChart = echarts.init(document.getElementById('performanceAndRiskChart') as HTMLDivElement);
  myChart.setOption({
      title: {
        text: "ETF 累计收益",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {},
      xAxis: {
        type: "category",
        data: ["Brazil", "Indonesia", "USA", "India", "China", "World"],
      },
      yAxis: {
        type: "value",
        boundaryGap: [0, 0.01],
      },
      series: [
        {
          name: "ETF1",
          type: "bar",
          data: [18203, 23489, 29034, 104970, 131744, 630230],
        },
        {
          name: "ETF2",
          type: "bar",
          data: [19325, 23438, 31000, 121594, 134141, 681807],
        },
      ],
    });
}
function disposeCharts() {
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
}

function resizeChart() {
  if (myChart) {
    myChart.resize();
  }
}
// 当组件完全卸载时
onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
  disposeCharts();
});
</script>

<style lang="scss" scoped>
.performanceAndRisk-comparisonTool {
  width: 100%;
  height: 100%;
  #performanceAndRiskChart {
    width: 100%;
    height: 400px;
    margin-top: 40px;
  }
}
</style>
