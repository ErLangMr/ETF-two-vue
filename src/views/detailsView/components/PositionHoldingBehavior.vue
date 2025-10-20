<template>
  <div class="position-holding-behavior">
    <div style="display: flex; justify-content: space-between; gap: 40px">
      <div style="width: 50%">
        <h4 style="margin-bottom: 10px;">前5大买入、卖出股票</h4>
        <el-table
          :data="gupiaoTableData"
          row-key="id"
          default-expand-all
          :header-cell-style="{
            background: '#d7d9dc',
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
        <h4 style="margin-bottom: 10px;">前5持股市值占比增加最多、减少最多的股票</h4>
        <el-table
          :data="gupiaoTableData"
          row-key="id"
          default-expand-all
          :header-cell-style="{
            background: '#d7d9dc',
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
    <!-- <div style="display: flex; justify-content: space-between; gap: 40px">
      <div id="behavior-hangye"></div>
      <div id="behavior-diqu"></div>
      <div id="behavior-shizhi"></div>
    </div> -->
    <div id="behavior-hangye" style="width: 100%;height: 400px;margin-top: 20px;"></div>
    <div id="behavior-diqu" style="width: 100%;height: 400px;margin-top: 20px;"></div>
    <div id="behavior-shizhi" style="width: 100%;height: 400px;margin-top: 20px;"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
const props = defineProps({
  tabActiveName: {
    type: String,
    default: "",
  },
});
const gupiaoTableData = [
  {
    name: "最大买入",
    shizhi: "100",
    shouyi: "10",
    id: "1",
    children: [
      {
        name: "银行",
        shizhi: "100",
        shouyi: "10",
        id: "1-1",
      },
      {
        name: "银行",
        shizhi: "100",
        shouyi: "10",
        id: "1-2",
      },
      {
        name: "银行",
        shizhi: "100",
        shouyi: "10",
        id: "1-3",
      },
      {
        name: "银行",
        shizhi: "100",
        shouyi: "10",
        id: "1-4",
      },
      {
        name: "银行",
        shizhi: "100",
        shouyi: "10",
        id: "1-5",
      },
    ],
  },
  {
    name: "最大卖出",
    shizhi: "100",
    shouyi: "10",
    id: "2",
    children: [
      {
        name: "银行",
        shizhi: "100",
        shouyi: "10",
        id: "3",
      },
      {
        name: "银行",
        shizhi: "100",
        shouyi: "10",
        id: "4",
      },
      {
        name: "银行",
        shizhi: "100",
        shouyi: "10",
        id: "5",
      },
      {
        name: "银行",
        shizhi: "100",
        shouyi: "10",
        id: "6",
      },
      {
        name: "银行",
        shizhi: "100",
        shouyi: "10",
        id: "7",
      },
    ],
  },
];
watch(
  () => props.tabActiveName,
  (newVal, oldVal) => {
    if (newVal === "PositionHoldingBehavior") {
     nextTick(() => {
      getChartData();
    });
    }
  }, { immediate: true }
);
let behaviorHangyeChart: echarts.ECharts | null;
let behaviorDiquChart: echarts.ECharts | null;
let behaviorShizhiChart: echarts.ECharts | null;
function getChartData() {
  disposeCharts();
  behaviorHangyeChart = echarts.init(document.getElementById("behavior-hangye") as HTMLElement);
  behaviorDiquChart = echarts.init(document.getElementById("behavior-diqu") as HTMLElement);
  behaviorShizhiChart = echarts.init(document.getElementById("behavior-shizhi") as HTMLElement);
  initCharts(behaviorHangyeChart);
  initCharts(behaviorDiquChart);
  initCharts(behaviorShizhiChart);
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
    });
  }
}
function resizeChart() {
  const charts = [behaviorHangyeChart, behaviorDiquChart, behaviorShizhiChart] as echarts.ECharts[];
  charts.forEach((chart) => {
    if (chart) {
      chart.resize();
    }
  });
}
function disposeCharts() {
  const charts = [behaviorHangyeChart, behaviorDiquChart, behaviorShizhiChart];
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
.position-holding-behavior {
  width: 100%;
  height: 100%;
  :deep(.el-table__expand-icon) {
    display: none;
  }
  #behavior-hangye,
  #behavior-diqu,
  #behavior-shizhi {
    width: 33%;
    height: 400px;
  }
}
</style>
