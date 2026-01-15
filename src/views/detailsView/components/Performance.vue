<template>
  <div class="performance">
    <!-- <EtfCompareTable :columns="columns" :data="data" /> -->
    <div style="text-align: right">
      <el-date-picker
        v-model="dateValue"
        value-format="YYYY-MM-DD"
        type="date"
        placeholder="选择日期"
        style="margin-bottom: 10px"
        @change="baseDataDateChange"
      />
    </div>
    <div id="performancEshouYiChart" style="margin-top: 20px"></div>
    <el-table
      :data="tableData"
      :header-cell-style="{ background: '#d7d9dc', color: '#333' }"
      :style="{ width: '100%', 'margin': '20px 0' }"
    >
      <el-table-column
        :prop="column.prop"
        :label="column.label"
        v-for="column in tableColumn"
        :key="column.prop"
      >
        <template #default="{ row }">
          <span v-if="column.prop === 'type' || column.prop === 'label'">{{ row[column.prop] }}</span>
          <span v-else :style="{ color: styleColor(row[column.prop]) }">
            {{ formatValue(row[column.prop]) }}<span v-if="row[column.prop]">%</span>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div id="performancEchaoEChart" style="margin-top: 20px"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import {
  getPerformanceListApi,
  getPerformanceBarApi,
  getPerformanceLineApi,
} from "@/api/filterDetails";
import { ref, onMounted, watch, onUnmounted, nextTick } from "vue";
import { formatValue } from "@/utils/formatValue";

const props = defineProps({
  code: {
    type: String,
    required: false,
  },
  tabActiveName: {
    type: String,
    required: false,
  },
});

const tableData = ref();
const tableColumn = [
  { prop: "label", label: "数据标签" },
  { prop: "type", label: "数据类型" },
  { prop: "data1", label: "近一月" },
  { prop: "data3", label: "近三月" },
  { prop: "data6", label: "近六个月" },
  { prop: "ytdData", label: "今年以来" },
  { prop: "data12", label: "近一年" },
  { prop: "data36", label: "近三年" },
  { prop: "data60", label: "近五年" },
  { prop: "ltdData", label: "成立以来" },
];
const dateValue = ref("");
function baseDataDateChange() {
  getPerformanceData();
  getPerformanceBar();
  getPerformanceLine();
}

watch(
  () => props.tabActiveName,
  (newVal) => {
    if (newVal === "Performance") {
      nextTick(() => {
        // initChart();
        getPerformanceData();
        getPerformanceBar();
        getPerformanceLine();
      });
    }
  },
  { immediate: true }
);

function styleColor(value: any) {
  if(value){
    return value >= 0 ? 'red' : 'green';
  }else{
    return 'black';
  }
}

function getPerformanceBar() {
  if (oneChart) {
    oneChart.showLoading();
  }
  getPerformanceBarApi({
    etfCode: props.code,
    date: dateValue.value || null,
  }).then((res) => {
    const xData: string[] = res.xaxis;
    const seriesData: { name: string; type: string; data: any[] }[] = res.series.map((item: any) => {
      return { name: item.name, type: "bar", data: item.data };
    });
    initBarChart(xData, seriesData);
  }).finally(() => {
    oneChart && oneChart.hideLoading();
  });
}
function getPerformanceLine() {
  if (twoChart) {
    twoChart.showLoading();
  }
  getPerformanceLineApi({
    etfCode: props.code,
    date: dateValue.value || null,
  }).then((res) => {
    const xData = res.xaxis;
    const seriesData = res.series.map((item: any) => {
      return { name: item.name, type: "line",showSymbol: false, data: item.data };
    });
    initLineChart(xData, seriesData);
  }).finally(() => {
    twoChart && twoChart.hideLoading();
  });
}
function getPerformanceData() {
  getPerformanceListApi({
    etfCode: props.code,
    date: dateValue.value || null,
  }).then((res) => {
    console.log(res);
    tableData.value = res.performanceDataList;
  });
}

let oneChart: echarts.ECharts | null = null;
let twoChart: echarts.ECharts | null = null;

interface SeriesItem {
  name: string;
  type: string;
  data: any[];
  showSymbol?: boolean;
}

function initBarChart(xData: string[], seriesData: SeriesItem[]) {
  // 只销毁当前图表实例
  if (oneChart) {
    oneChart.dispose();
    oneChart = null;
  }
  const hasData = xData.length > 0 && seriesData.length > 0;
  const oneElement = document.getElementById("performancEshouYiChart");
  oneChart = echarts.init(oneElement);
  oneChart.setOption({
    title: {
      text: "收益%",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
        top: "10%",
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
    dataZoom: [
        {
          type: "inside",
          start: 90,
          end: 100,
        },
        {
          start: 90,
          end: 100,
        },
      ],
    legend: {},
    xAxis: {
      type: "category",
      data: xData,
    },
    yAxis: {
      type: "value",
      boundaryGap: [0, 0.01],
    },
    series: seriesData,
    graphic: hasData ? [] : {
      type: 'text',
      left: 'center',
      top: 'middle',
      style: {
        text: '暂无数据',
        fontSize: 16,
        fill: '#999'
      }
    }
  });
}
function initLineChart(xData: string[], seriesData: SeriesItem[]) {
  // 只销毁当前图表实例
  if (twoChart) {
    twoChart.dispose();
    twoChart = null;
  }
  const hasData = xData.length > 0 && seriesData.length > 0;
  const twoElement = document.getElementById("performancEchaoEChart");
  twoChart = echarts.init(twoElement);
    twoChart.setOption({
      title: {
        text: "超额收益%",
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
        data: xData,
      },
      yAxis: {
        type: "value",
      },
      series: seriesData,
      graphic: hasData ? [] : {
        type: 'text',
        left: 'center',
        top: 'middle',
        style: {
          text: '暂无数据',
          fontSize: 16,
          fill: '#999'
        }
      }
    });
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
  console.log(props);
  if (!props.tabActiveName) {
    nextTick(() => {
      getPerformanceData();
      getPerformanceBar();
      getPerformanceLine();
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
