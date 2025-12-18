<template>
  <div class="fund-flow-chart">
    <div
      style="
        display: flex;
        align-items: center;
        justify-content: end;
        gap: 36px;
      "
    >
      <PeriodSelector
        v-model="activeBtn"
        :options="periodOptions"
        prefix="过去"
        suffix="的资金流动"
        @change="handleChange"
      />
      <div style="width: 333px">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="To"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          @change="handleDateRangeChange"
        />
      </div>
    </div>
    <div v-loading="loading" id="fund-flow-chart"></div>
    <div v-loading="chartTwoLoading" id="fund-flow-chart-2" style="margin-top: 40px;"></div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeUnmount,
  onUnmounted,
  watch,
  nextTick,
} from "vue";
import * as echarts from "echarts";
import { useDevice } from "@/utils/device";
import {
  getFundFlowChartApi,
  getScaleAndPriceChartApi,
} from "@/api/filterDetails";
import { getMonthAgoDate, getYearAgoDate } from "@/utils/formatValue";
import PeriodSelector from "@/components/PeriodSelector.vue";

let myChart: echarts.ECharts | null = null;
let myTwoChart: echarts.ECharts | null = null;
const props = defineProps<{
  tabActiveName: string;
  code: string;
}>();
const { isMobile } = useDevice();

const activeBtn = ref("1m");
const loading = ref(false);
const chartTwoLoading = ref(false);

const periodOptions: PeriodOption[] = [
  { label: "1 个月", value: "1m" },
  { label: "3 个月", value: "3m" },
  { label: "6 个月", value: "6m" },
  { label: "1 年", value: "1y" },
  { label: "3 年", value: "3y" },
  { label: "5 年", value: "5y" },
];

interface PeriodOption {
  label: string;
  value: string;
}

const dateRange = ref(["2025-01-01", "2025-09-30"]);

watch(
  () => props.tabActiveName,
  (newVal) => {
    if (newVal === "FundFlowChart") {
      getFundFlowChart();
      getScaleAndPriceChart();
    }
  },
  { immediate: true }
);

const handleDateRangeChange = (value: string) => {
  console.log(value, dateRange.value);
  if(!value) dateRange.value = ["2025-01-01", "2025-09-30"];
  getFundFlowChart();
  getScaleAndPriceChart();
};

const handleChange = (type: string) => {
  getFundFlowChart();
  getScaleAndPriceChart();
};
function getFundFlowChart() {
  loading.value = true;
  getFundFlowChartApi({
    code: props.code,
    dimension: activeBtn.value,
    start: dateRange.value[0],
    end: dateRange.value[1],
  })
    .then((res) => {
      const Xdata: string[] = res.dates;
      const seriesData: number[] = res.fundFlow;
      initFundFlowChart(Xdata, seriesData);
    })
    .finally(() => {
      loading.value = false;
    });
}

function initFundFlowChart(Xdata: string[], seriesData: number[]) {
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
  const chartDom = document.getElementById("fund-flow-chart");
  myChart = echarts.init(chartDom);
  myChart.setOption({
    title: {
      text: "资金净流入额（百万元）",
      textStyle: {
        fontSize: 14,
      },
    },
    grid: {
      left: "3%",
      right: "3%",
      bottom: 60,
      top: 40,
      containLabel: true,
    },
    dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 60,
        },
        {
          start: 0,
          end: 60,
        },
      ],
    xAxis: {
      type: "category",
      data: Xdata,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        show: true,
        rotate: 40,
        fontSize: 11,
        color: "#666",
      },
    },
    yAxis: {
      type: "value",
      position: "right",
      // min: -1,
      // max: 0.5,
      splitLine: { show: true },
      axisLabel: {
        // formatter: function (value) {
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
        data: seriesData,
        itemStyle: {
          color: function (params: { value: number }) {
            return params.value >= 0 ? "#2ca02c" : "#d62728";
          },
        },
        // barWidth: isMobile() ? 8 : 16,
      },
    ],
    graphic:
      seriesData.length === 0
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
      // formatter: function (
      //   params: {
      //     axisValue: string;
      //     value: string;
      //   }[]
      // ) {
      //   return params[0].axisValue + ": " + params[0].value + " B";
      // },
    },
  });
  window.addEventListener("resize", resizeChart);
}

function getScaleAndPriceChart() {
  chartTwoLoading.value = true;
  getScaleAndPriceChartApi({
    code: props.code,
    dimension: activeBtn.value,
    start: dateRange.value[0],
    end: dateRange.value[1],
  })
    .then((res) => {
      const Xdata: string[] = res.dates;
      const assetChange: number[] = res.assetChange;
      const priceInfluence: number[] = res.priceInfluence;
      initScaleAndPriceChart(Xdata, assetChange, priceInfluence);
    })
    .finally(() => {
      chartTwoLoading.value = false;
    });
}
function initScaleAndPriceChart(
  Xdata: string[],
  assetChange: number[],
  priceInfluence: number[]
) {
  if (myTwoChart) {
    myTwoChart.dispose();
    myTwoChart = null;
  }
  const chartDomTwo = document.getElementById("fund-flow-chart-2");
  myTwoChart = echarts.init(chartDomTwo);
  myTwoChart.setOption({
    title: {
      text: "资产规模变化",
      textStyle: {
        fontSize: 14,
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {
      data: [
        {
          name: "资金流动",
          icon: "circle",
          textStyle: { color: "#2D1C5A" },
        },
        { name: "价格变化", icon: "circle", textStyle: { color: "#1CA9A6" } },
      ],
      bottom: 0,
    },
    dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 60,
        },
        {
          start: 0,
          end: 60,
        },
      ],
    grid: { left: 40, right: 40, bottom: 90, top: 40 },
    xAxis: {
      type: "category",
      data: Xdata,
      // axisTick: { alignWithLabel: true },
      // axisLabel: { interval: 2 } // 只显示部分日期，防止重叠
    },
    yAxis: {
      type: "value",
      position: "right",
      axisLabel: {
        formatter: function (value: number) {
          return value + " B";
        },
      },
    },
    series: [
      {
        name: "资金流动",
        type: "bar",
        stack: "one",
        data: assetChange,
        itemStyle: { color: "#2D1C5A" },
        // barWidth: isMobile() ? 8 : 16
      },
      {
        name: "价格变化",
        type: "bar",
        stack: "one",
        data: priceInfluence,
        itemStyle: { color: "#1CA9A6" },
        // barWidth: isMobile() ? 8 : 16
      },
    ],
  });
  window.addEventListener("resize", resizeChart);
}

function resizeChart() {
  if (myChart) {
    myChart.resize();
  }
  if (myTwoChart) {
    myTwoChart.resize();
  }
}
function disposeCharts() {
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
  if (myTwoChart) {
    myTwoChart.dispose();
    myTwoChart = null;
  }
}
onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
  disposeCharts();
});
</script>

<style scoped lang="scss">
.fund-flow-chart {
  width: 100%;
  height: 100%;
  #fund-flow-chart,
  #fund-flow-chart-2 {
    width: 100%;
    height: 500px;
  }
}
@media (max-width: 768px) {
  #fund-flow-chart {
    height: 220px;
  }
}
</style>
