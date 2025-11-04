<template>
  <div class="position-analysis">
    <h3>权重集中度</h3>
    <div id="weight-concentration"></div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  tabActiveName: {
    type: String,
    required: true,
  },
});
watch(() => props.tabActiveName, (newValue) => {
  if (newValue === "PositionAnalysis") {
    disposeCharts()
    nextTick(() => {
      initWeightChart();
    });
  }
});
onMounted(() => {
  window.addEventListener("resize", resizeChart);
});
onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
  disposeCharts()
});
let weightChart: echarts.ECharts | null = null;
function initWeightChart() {
  weightChart = echarts.init(document.getElementById("weight-concentration"));
  weightChart.setOption({
    //   title: {
    //   text: '业绩表现'
    // },
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
        symbol: "none",
        // smooth: true,
        data: [310, 232, 201, 134, 90, 40, 10],
      },
      {
        name: "Union Ads",
        type: "line",
        showSymbol: false,
        symbol: "none",
        // smooth: true,
        data: [20, 82, 131, 200, 260, 290, 310],
      }
    ],
  });
}
function resizeChart() {
  const charts = [weightChart];
  charts.forEach((chart) => {
    if (chart) {
      chart.resize();
    }
  });
}
function disposeCharts() {
  const charts = [weightChart];

  charts.forEach((chart) => {
    if (chart) {
      chart.dispose();
      chart = null;
    }
  });
}
</script>

<style lang="scss" scoped>
.position-analysis {
  width: 100%;
  height: 100%;
  #weight-concentration {
    width: 100%;
    height: 400px;
  }
}
</style>
