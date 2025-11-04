<template>
  <div class="performance">
    <!-- <EtfCompareTable :columns="columns" :data="data" /> -->
    <div id="performancEshouYiChart" style="margin-top: 20px"></div>
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
    <div id="performancEchaoEChart" style="margin-top: 20px"></div>
  </div>
</template>

<script setup lang="ts">
import EtfCompareTable from "@/components/EtfCompareTable.vue";
import * as echarts from "echarts";
import { getPerformanceDataApi } from "@/api/details";
import {
  ref,
  onMounted,
  watch,
  onUnmounted,
  nextTick,
} from "vue";

const props = defineProps({
  code:{
    type: String,
    required: false,
  },
  tabActiveName:{
    type: String,
    required: false,
  },
})

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

watch(
  () => props.tabActiveName,
  (newVal) => {
    if (newVal === "Performance") {
      nextTick(() => {
        initChart();
      });
    }
  },
  { immediate: true }
);

let oneChart: echarts.ECharts | null = null;
let twoChart: echarts.ECharts | null = null;

function initChart() {
  disposeCharts();
  const oneElement = document.getElementById("performancEshouYiChart");
  const twoElement = document.getElementById("performancEchaoEChart");

  // 确保 DOM 元素已经可见
  if (oneElement) {
    oneChart = echarts.init(oneElement);
    oneChart.setOption({
      title: {
        text: "World Population",
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
          name: "2011",
          type: "bar",
          data: [18203, 23489, 29034, 104970, 131744, 630230],
        },
        {
          name: "2012",
          type: "bar",
          data: [19325, 23438, 31000, 121594, 134141, 681807],
        },
      ],
    });
  }

  if (twoElement) {
    twoChart = echarts.init(twoElement);
    twoChart.setOption({
      title: {
        text: "资产净值规模（亿元）",
      },
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
      series: [
        {
          name: "Email",
          type: "line",
          showSymbol: false,
          // smooth: true,
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: "Union Ads",
          type: "line",
          showSymbol: false,
          // smooth: true,
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          name: "Video Ads",
          type: "line",
          showSymbol: false,
          // smooth: true,
          data: [150, 232, 201, 154, 190, 330, 410],
        },
        {
          name: "Direct",
          type: "line",
          showSymbol: false,
          // smooth: true,
          data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
          name: "Search Engine",
          type: "line",
          showSymbol: false,
          // smooth: true,
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
      ],
    });
  }
}

function disposeCharts() {
  if (oneChart) {
    oneChart.dispose();
    oneChart = null;
  }
  if (twoChart) {
    twoChart.dispose();
    twoChart = null;
  }
}

function resizeChart() {
  if (oneChart) {
    oneChart.resize();
  }
  if (twoChart) {
    twoChart.resize();
  }
}
// 当组件完全卸载时
onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
  disposeCharts();
});
onMounted(() => {
  window.addEventListener("resize", resizeChart);
  console.log(props)
  if(!props.tabActiveName){
    nextTick(() => {
        initChart();
      });
  }
});

const columns = [
  { key: "time", label: "" },
  { key: "ETF", label: "单只 ETF" },
  { key: "ETFRoute", label: "追踪同一指数的 ETF 平均回报" },
];
</script>

<style scoped lang="scss">
.performance {
  width: 100%;
  height: 100%;
  #performancEshouYiChart,
  #performancEchaoEChart {
    width: 100%;
    height: 400px;
  }
}
</style>
