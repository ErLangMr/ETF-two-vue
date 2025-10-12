<template>
  <div class="base-data-container">
    <div class="block">
      <div class="section-title">基础资料</div>
      <div class="info-list">
        <div class="info-row">
          <span>资产类别</span
          ><span class="linkStyle" @click.stop="clickVitals('val')">{{
            "val"
          }}</span>
        </div>
        <div class="info-row">
          <span>投资区域</span
          ><span class="linkStyle" @click.stop="clickVitals('val')">{{
            "val"
          }}</span>
        </div>
        <div class="info-row">
          <span>经济部门</span>
          <span>{{ formatValue(29.9999, "percent") }}</span>
        </div>
        <div class="info-row">
          <span>细分行业</span>
          <span>{{ "val" }}</span>
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
    <div id="baseDataOne"></div>
    <div id="baseDataTwo"></div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import * as echarts from "echarts";
import { formatValue } from "@/utils/formatValue";

function clickVitals(data: any) {
  console.log(data);
}
const props = defineProps<{
  tabActiveName: string
}>();

watch(() => props.tabActiveName, (newVal) => {
  if (newVal === 'BaseData') {
    nextTick(() => {
      initChart()
    })
  }
}, { immediate: true });

let oneChart: echarts.ECharts | null = null;
let twoChart: echarts.ECharts | null = null;
function initChart() {
  const oneElement = document.getElementById("baseDataOne");
  const twoElement = document.getElementById("baseDataTwo");

  if (oneElement) {
    oneChart = echarts.init(oneElement);
    oneChart.setOption({
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
          areaStyle: {},
        },
      ],
    });
  }

  if (twoElement) {
    twoChart = echarts.init(twoElement);
    // 可以在这里为第二个图表设置选项
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

onMounted(() => {
  window.addEventListener("resize", resizeChart);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
  if (oneChart) {
    oneChart.dispose();
    oneChart = null;
  }
  if (twoChart) {
    twoChart.dispose();
    twoChart = null;
  }
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.base-data-container {
  height: 100%;
  #baseDataOne,
  #baseDataTwo {
    height: 400px;
    width: 100%;
  }
  .block {
    flex: 1;
    min-width: 0;
    max-width: 50%;
  }
  .section-title {
    font-weight: 600;
    font-size: var(--font-size-base);
    margin-bottom: 10px;
    color: #222;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .analyst-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .info-list {
    border-radius: 0;
    border: none;
    background: none;
    padding: 0;
  }
  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 0;
    border-bottom: 1px solid #ececec;
    font-size: var(--font-size-base);
  }
  .info-row:last-child {
    border-bottom: none;
  }
  .info-row span:first-child {
    color: #333;
  }
  .info-row .link {
    color: var(--theme-purple);
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
