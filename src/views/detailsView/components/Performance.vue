<template>
  <div class="performance">
    <!-- <EtfCompareTable :columns="columns" :data="data" /> -->
     <div id="performancEshouYiChart" style="margin-top: 20px"></div>
     <div id="performancEchaoEChart" style="margin-top: 20px"></div>
  </div>
</template>

<script setup lang="ts">
import EtfCompareTable from "@/components/EtfCompareTable.vue";
import * as echarts from "echarts";
import { getPerformanceDataApi } from "@/api/details";
import { ref, onMounted, watch, onUnmounted, onActivated, onDeactivated, nextTick } from "vue";

const props = defineProps<{
  code: string;
  tabActiveName: string;
}>();

const data = ref<any[]>([]);

watch(
  () => props.tabActiveName,
  (newVal) => {
    if(newVal === "Performance"){
      nextTick(() => {
        initChart();
      });
    }
  }, { immediate: true }
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
      grid: {
        top: "15%",
        left: "3%",
        right: "4%",
        bottom: "3%",
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
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: "line",
          showSymbol: false,
          lineStyle: {
            color: "#4a90e2",
          },
          areaStyle: {
            color: "rgba(74, 144, 226, 0.5)",
          },
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
  getPerformanceDataApi(props.code).then((res) => {
    Object.keys(res).forEach((key) => {
      if (key === "monthlyReturns") {
        data.value.push({
          time: "近一个月",
          ETF: res[key],
          ETFRoute: res["monthlyReturnsAverage"],
        });
      } else if (key === "threeMonthReturns") {
        data.value.push({
          time: "近三个月",
          ETF: res[key],
          ETFRoute: res["threeMonthReturnsAverage"],
        });
      } else if (key === "ytdReturns") {
        data.value.push({
          time: "今年以来回报",
          ETF: res[key],
          ETFRoute: res["ytdReturnsAverage"],
        });
      } else if (key === "yearlyReturns") {
        data.value.push({
          time: "近一年",
          ETF: res[key],
          ETFRoute: res["yearlyReturnsAverage"],
        });
      } else if (key === "threeYearReturns") {
        data.value.push({
          time: "近三年",
          ETF: res[key],
          ETFRoute: res["threeYearReturnsAverage"],
        });
      } else if (key === "fiveYearReturns") {
        data.value.push({
          time: "近五年",
          ETF: res[key],
          ETFRoute: res["fiveYearReturnsAverage"],
        });
      }
    });
  });
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
