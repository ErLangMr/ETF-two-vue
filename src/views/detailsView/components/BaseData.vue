<template>
  <div class="base-data-container">
    <div style="text-align: right">
      <el-date-picker
        v-model="baseDataDate"
        value-format="YYYY-MM-DD"
        type="date"
        style="margin-bottom: 10px"
        @change="baseDataDateChange"
      />
    </div>
    <div class="block">
      <div class="section-title">基础资料</div>
      <div class="info-list">
        <div class="info-row">
          <span>GICS 一级标签</span>
          <span>{{ industryData.gics1 }}</span>
        </div>
        <div class="info-row">
          <span>GICS 三级标签</span><span>{{ industryData.gics3 }}</span>
        </div>
        <div class="info-row">
          <span>ICB 一级标签</span>
          <span>{{ industryData.icb1 }}</span>
        </div>
        <div class="info-row">
          <span>ICB 三级标签</span>
          <span>{{ industryData.icb3 }}</span>
        </div>
        <div class="info-row">
          <span>标签日期</span>
          <span>{{ industryData.labelDate }}</span>
        </div>
        <div class="info-row">
          <span>市值标签</span>
          <span>{{ industryData.marketCapLabel }}</span>
        </div>
        <div class="info-row">
          <span>风格标签</span>
          <span>{{ industryData.styleLabel }}</span>
        </div>
      </div>
    </div>
    <div style="text-align: right; margin-top: 20px">
      <el-button
        @click="dayOrMonthClick('day')"
        :type="dayOrMonth === 'day' ? 'primary' : ''"
        >日度</el-button
      >
      <el-button
        @click="dayOrMonthClick('month')"
        :type="dayOrMonth === 'month' ? 'primary' : ''"
        >月度</el-button
      >
    </div>
    <div id="baseDataOne"></div>
    <div id="baseDataTwo" style="margin-top: 10px"></div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import * as echarts from "echarts";
import { formatValue } from "@/utils/formatValue";
import {
  getBaseInfoChartApi,
  getBaseInfoIndustryApi,
} from "@/api/filterDetails";

const props = defineProps<{
  tabActiveName: string;
  code: string;
}>();

watch(
  () => props.tabActiveName,
  (newVal) => {
    if (newVal === "BaseData") {
      nextTick(() => {
        getBaseInfoIndustry();
        getBaseInfoChart();
      });
    }
  },
  { immediate: true }
);
const baseDataDate = ref("");
const industryData = ref<Record<string, any>>({});

function getBaseInfoIndustry() {
  getBaseInfoIndustryApi({
    code: props.code,
    date: baseDataDate.value || null,
  }).then((res) => {
    industryData.value = res;
  });
}

const dayOrMonth = ref("month");
function dayOrMonthClick(type: string) {
  dayOrMonth.value = type;
}

// 监听日度/月度切换,更新图表
watch(dayOrMonth, () => {
  initChart();
});

const chartData = {
  day: {
    xData: [] as string[],
    assetNetValue: [] as string[],
    share: [] as string[],
  },
  month: {
    xData: [] as string[],
    assetNetValue: [] as string[],
    share: [] as string[],
  },
};
function getBaseInfoChart() {
  getBaseInfoChartApi({
    code: props.code,
    date: baseDataDate.value || null,
  }).then((res) => {
    // 清空之前的数据
    chartData.day.xData = [];
    chartData.day.assetNetValue = [];
    chartData.day.share = [];
    chartData.month.xData = [];
    chartData.month.assetNetValue = [];
    chartData.month.share = [];

    // 填充日度数据
    res.daily?.forEach((item: any) => {
      chartData.day.xData.push(item.date);
      chartData.day.assetNetValue.push(item.aum);
      chartData.day.share.push(item.shares);
    });

    // 填充月度数据
    res.monthly?.forEach((item: any) => {
      chartData.month.xData.push(item.date);
      chartData.month.assetNetValue.push(item.aum);
      chartData.month.share.push(item.shares);
    });

    initChart();
  });
}

function baseDataDateChange() {
  getBaseInfoIndustry();
  getBaseInfoChart();
}
let oneChart: echarts.ECharts | null = null;
let twoChart: echarts.ECharts | null = null;
function initChart(): void {
  disposeCharts();

  // 根据当前选择的日度/月度获取对应的数据
  const currentData =
    dayOrMonth.value === "day" ? chartData.day : chartData.month;
  const xData = currentData.xData;
  const assetNetValueData = currentData.assetNetValue;
  const shareData = currentData.share;

  const oneElement = document.getElementById("baseDataOne");
  const twoElement = document.getElementById("baseDataTwo");

  if (oneElement) {
    oneChart = echarts.init(oneElement);
    oneChart.setOption({
      title: {
        text: "资产净值规模（百万元）",
      },
      grid: {
        top: "15%",
        left: "3%",
        right: "4%",
        bottom: 60,
        containLabel: true,
      },
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 40,
        },
        {
          start: 0,
          end: 40,
        },
      ],
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "line" },
        formatter: function (params: any) {
          return params[0].axisValue + ": " + params[0].value + "百万元";
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: xData,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: assetNetValueData,
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
        text: "ETF份额（百万份）",
        // textStyle: {
        //   fontSize: 14,
        // },
      },
      grid: {
        left: "3%",
        right: "3%",
        bottom: 80,
        top: 40,
        containLabel: true,
      },
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 10,
        },
        {
          start: 0,
          end: 10,
        },
      ],
      xAxis: {
        type: "category",
        data: xData,
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
          data: shareData,
          itemStyle: {
            color: function (params: any) {
              return params.value >= 0 ? "#2ca02c" : "#d62728";
            },
          },
          barWidth: 12,
        },
      ],
      graphic:
        [1, 2, 3].length === 0
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
          return params[0].axisValue + ": " + params[0].value + "百万份";
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
  disposeCharts();
});
</script>

<style lang="scss" scoped>
@use "@/styles/variables.scss" as *;

.base-data-container {
  height: 100%;
  #baseDataOne,
  #baseDataTwo {
    height: 600px;
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
