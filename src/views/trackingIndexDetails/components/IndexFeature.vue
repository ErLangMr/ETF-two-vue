<template>
  <div class="index-feature">
    <div class="row">
      <div class="block">
        <div class="section-title">所属类型</div>
        <div class="info-list">
          <div class="info-row">
            <span>资产类别</span><span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>投资区域</span><span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>所属行业</span>
            <span>{{ formatValue(29.9999, "percent") }}</span>
          </div>
          <div class="info-row">
            <span>市值标签</span>
            <span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>风格标签</span>
            <span>{{ "val" }}</span>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="section-title">指数特征</div>
        <div class="info-list">
          <div class="info-row">
            <span>样本数量</span><span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>A股自由流通市值（万亿元）</span><span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>占A股市场覆盖率</span>
            <span>{{ formatValue(29.9999, "percent") }}</span>
          </div>
          <div class="info-row">
            <span>平均A股自由流通市值（亿元）</span>
            <span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>A股自由流通市值中位数（亿元）</span>
            <span>{{ "val" }}</span>
          </div>
        </div>
      </div>
    </div>
    <div id="indexFeatureChart" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<script setup lang="ts">
import { formatValue } from "@/utils/formatValue";
import * as echarts from "echarts";
import { nextTick, onUnmounted, watch } from "vue";

const props = defineProps<{
  tabActiveName: string
}>();
let myChart: echarts.ECharts | null = null;
function initChart() {
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
  myChart = echarts.init(
    document.getElementById("indexFeatureChart") as HTMLElement
  );
  myChart.setOption({
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
watch(
  () => props.tabActiveName,
  (newVal) => {
    if (newVal === "IndexFeature") {
      nextTick(() => {
        initChart();
      });
    }
  }
);
function resizeChart() {
  if (myChart) {
    myChart.resize();
  }
}
window.addEventListener("resize", resizeChart);
onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
});
</script>

<style lang="scss" scoped>
.index-feature {
  width: 100%;
  height: 100%;
}
</style>
