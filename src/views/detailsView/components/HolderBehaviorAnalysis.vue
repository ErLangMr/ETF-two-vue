<template>
  <div class="holder-behavior-analysis">
    <div
      style="
        display: flex;
        width: 100%;
        justify-content: space-between;
        gap: 40px;
      "
    >
      <div style="width: 50%">
        <h4 style="margin-bottom: 10px">前5大买入、卖出量的持有人</h4>
        <el-table
          :data="maiTableData"
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
      </div>
      <div style="width: 50%">
        <h4 style="margin-bottom: 10px">前5大进入、退出的持有人</h4>
        <el-table
          :data="inOutTableData"
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
      </div>
    </div>
    <div style="display: flex; width: 100%; justify-content: space-between; gap: 40px;margin-top: 20px;">
      <div id="leixing"></div>
      <div id="fengge"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from "vue";
import * as echarts from "echarts";

const props = defineProps<{
  tabActiveName: string;
}>();
const maiTableData = [
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
];
const inOutTableData = maiTableData;
watch(
  () => props.tabActiveName,
  (val) => {
    if (val === "HolderBehaviorAnalysis") {
      nextTick(() => {
        getChartData();
      });
    }else{
      disposeCharts();
    }
  }
);
let leixingChart: echarts.ECharts | null = null;
let fenggeChart: echarts.ECharts | null = null;
function getChartData(){
  disposeCharts();
  leixingChart = echarts.init(document.getElementById("leixing") as HTMLDivElement);
  fenggeChart = echarts.init(document.getElementById("fengge") as HTMLDivElement);
  initChart(leixingChart);
  initChart(fenggeChart);
}
function initChart(chart: echarts.ECharts) {
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
  const charts = [leixingChart, fenggeChart] as echarts.ECharts[];
  charts.forEach((chart) => {
    if (chart) {
      chart.resize();
    }
  });
}
function disposeCharts() {
  const charts = [leixingChart, fenggeChart];
  charts.forEach((chart) => {
    if (chart) {
      chart.dispose();
      chart = null;
    }
  });
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
.holder-behavior-analysis {
  width: 100%;
  #leixing,
  #fengge {
    width: 50%;
    height: 400px;
  }
}
</style>
