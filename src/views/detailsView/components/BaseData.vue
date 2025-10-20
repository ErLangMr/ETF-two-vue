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
    <div id="baseDataOne" style="margin-top: 20px"></div>
    <div id="baseDataTwo" style="margin-top: 10px"></div>
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
  tabActiveName: string;
}>();

watch(
  () => props.tabActiveName,
  (newVal) => {
    if (newVal === "BaseData") {
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
  disposeCharts()
  const oneElement = document.getElementById("baseDataOne");
  const twoElement = document.getElementById("baseDataTwo");

  if (oneElement) {
    oneChart = echarts.init(oneElement);
    oneChart.setOption({
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

  if (twoElement) {
    twoChart = echarts.init(twoElement);
    twoChart.setOption({
      title: {
        text: "ETF份额（万份）",
        // textStyle: {
        //   fontSize: 14,
        // },
      },
      grid: {
        left: "3%",
        right: "3%",
        bottom: 20,
        top: 40,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: [
      'ten',
      'nine',
      'eight',
      'seven',
      'six',
      'five',
      'four',
      'three',
      'two',
      'one'
    ],
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          show: false,
          rotate: 40,
          fontSize: 11,
          color: "#666",
          formatter: function (value: any) {
            return value;
          },
        },
      },
      yAxis: {
        type: "value",
        position: "left",
        // min: -1,
        // max: 0.5,
        splitLine: { show: true },
        axisLabel: {
          // formatter: function (value: any) {
          //   if (value === 0.5) return "0.5 B";
          //   if (value === 0) return "0 B";
          //   if (value === -0.5) return "-0.5 B";
          //   if (value === -1) return "-1 B";
          //   return "";
          // },
          color: "#222",
          fontWeight: 500,
          fontSize: 13,
        },
      },
      series: [
        {
          type: "bar",
          data: [0.5, 0.5, -0.5, 0.5, -0.5, 0.5, -0.5, 0.5, -0.5, 0.5],
          itemStyle: {
            color: function (params: any) {
              return params.value >= 0 ? "#2ca02c" : "#d62728";
            },
          },
          barWidth: 12,
        },
      ],
      graphic:
        [1,2,3].length === 0
          ? [
              {
                type: "text",
                left: "center",
                top: "middle",
                style: {
                  text: "暂无数据",
                  fontSize: 16,
                  fill: "#999",
                },
              },
            ]
          : [],
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: function (params: any) {
          return params[0].axisValue + ": " + params[0].value + " B";
        },
      },
    });
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

onMounted(() => {
  window.addEventListener("resize", resizeChart);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
  disposeCharts()
});
</script>

<style lang="scss" scoped>
@use "@/styles/variables.scss" as *;

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
