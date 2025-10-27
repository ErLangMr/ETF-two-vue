<template>
  <div class="holdingBehaviorAndHolderBehavior">
    <table-comp :tableData="tableData" />
    <div style="display: flex; width: 100%; justify-content: space-between; gap: 40px;margin-top: 40px;">
      <div id="tradeChart"></div>
      <div id="inAndOutChart"></div>
      <div id="leixingChart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as echarts from 'echarts'
import TableComp from './tableComp.vue'
const props = defineProps({
  tableData: {
    type: Object,
    default: () => ({})
  }
});

let tradeChart: echarts.ECharts | null = null;
let inAndOutChart:  echarts.ECharts | null = null;
let leixingChart: echarts.ECharts | null = null;
function getChartData(){
  disposeCharts();
  tradeChart = echarts.init(document.getElementById("tradeChart") as HTMLDivElement);
  inAndOutChart= echarts.init(document.getElementById("inAndOutChart") as HTMLDivElement);
  leixingChart = echarts.init(document.getElementById("leixingChart") as HTMLDivElement);
  initChart(tradeChart, '买入/卖出前五大持有人的行为');
  initChart(inAndOutChart, '新进入/退出持有人的行为');
  initChart(leixingChart, '不同类型持有人的行为');
}
function initChart(chart: echarts.ECharts, title: string) {
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
        left: "3%",
        right: "15%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.1]
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
          itemStyle: {
            color: (params: any) => {
              return params.value >= 0 ? '#14b143' : '#ef232a';
            }
          }
        },
      ],
  })
}
function resizeChart() {
  const charts = [tradeChart, inAndOutChart, leixingChart] as echarts.ECharts[];
  charts.forEach((chart) => {
    if (chart) {
      chart.resize();
    }
  });
}
function disposeCharts() {
  const charts = [tradeChart, inAndOutChart, leixingChart];
  charts.forEach((chart) => {
    if (chart) {
      chart.dispose();
      chart = null;
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
.holdingBehaviorAndHolderBehavior {
  width: 100%;
  height: 100%;
  #tradeChart,
  #inAndOutChart,
  #leixingChart {
    width: 33%;
    height: 400px;
  }
}
</style>
