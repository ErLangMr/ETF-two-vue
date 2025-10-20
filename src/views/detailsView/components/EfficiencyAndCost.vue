<template>
  <div class="efficiency-and-cost-container">
    <div style="display: flex; gap: 62px">
      <div class="block">
        <div class="section-title">效率</div>
        <div class="info-list">
          <div class="info-row">
            <span>过去一个月平均日交易量</span
            ><span class="linkStyle" @click.stop="clickVitals('val')">{{
              "val"
            }}</span>
          </div>
          <div class="info-row">
            <span>过去三个月平均日交易量</span
            ><span class="linkStyle" @click.stop="clickVitals('val')">{{
              "val"
            }}</span>
          </div>
          <div class="info-row">
            <span>过去一个月平均日交易额</span>
            <span>{{ formatValue(29.9999, "percent") }}</span>
          </div>
          <div class="info-row">
            <span>过去三个月平均日交易额</span>
            <span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>过去1个月日跟踪偏离度</span>
            <span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>过去3个月日跟踪偏离度</span>
            <span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>过去1个月日均折溢价率</span>
            <span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>过去3个月日均折溢价率</span>
            <span>{{ "val" }}</span>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="section-title">成本</div>
        <div class="info-list">
          <div class="info-row">
            <span>日常运作费率</span
            ><span class="linkStyle" @click.stop="clickVitals('val')">{{
              "val"
            }}</span>
          </div>
          <div class="info-row">
            <span>管理费率</span
            ><span class="linkStyle" @click.stop="clickVitals('val')">{{
              "val"
            }}</span>
          </div>
          <div class="info-row">
            <span>托管费率</span>
            <span>{{ formatValue(29.9999, "percent") }}</span>
          </div>
          <div class="info-row">
            <span>销售服务费率</span>
            <span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>交易费率</span>
            <span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>申购费率</span>
            <span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>赎回费率</span>
            <span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>交易佣金</span>
            <span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>总费率（持有1年）</span>
            <span>{{ "val" }}</span>
          </div>
        </div>
      </div>
    </div>
    <div id="efficiency-and-cost-chart"></div>
  </div>
</template>

<script setup lang="ts">
import { formatValue } from "@/utils/formatValue";
import * as echarts from "echarts";
import { nextTick, onUnmounted, watch } from "vue";

const props = defineProps<{
  tabActiveName: string;
}>();

watch(
  () => props.tabActiveName,
  (val) => {
    if (val === "EfficiencyAndCost") {
      nextTick(() => {
        initChart();
      });
    }
  },{ immediate: true }
);

let myChart: echarts.ECharts | null = null;
function initChart() {
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
  myChart = echarts.init(document.getElementById("efficiency-and-cost-chart"));
  myChart.setOption({
    title: {
      text: "月度跟踪误差",
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

function clickVitals(type: string) {
  console.log(type);
}
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
@use "@/styles/variables.scss" as *;
.efficiency-and-cost-container {
  height: 100%;
  #efficiency-and-cost-chart {
    width: 100%;
    height: 400px;
  }
}
</style>
