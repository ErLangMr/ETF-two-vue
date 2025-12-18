<template>
  <div class="position-analysis">
    <div style="text-align: right">
      <el-date-picker
        v-model="dateValue"
        value-format="YYYY-MM-DD"
        type="date"
        placeholder="选择日期"
        style="margin-bottom: 10px"
        @change="dateValueChange"
      />
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{ backgroundColor: '#d7d9dc', color: '#333' }"
      :style="{ margin: '20px 0' }"
      v-loading="tableLoading"
    >
      <el-table-column prop="etfCode" label="ETF代码" />
      <el-table-column prop="etfName" label="ETF简称" />
      <el-table-column prop="date" label="日期" />
      <el-table-column prop="stockNumber" label="持有证券数量（只）" />
      <el-table-column prop="date" label="日期" />
      <el-table-column prop="bigCapPercent" label="大盘股占比（%）" />
      <el-table-column prop="midCapPercent" label="中盘股占比（%）" />
      <el-table-column prop="smallCapPercent" label="小盘股占比（%）" />
      <el-table-column prop="top5HoldingPercent" label="前五大持仓占比（%）" />
      <el-table-column prop="top10HoldingPercent" label="前十大持仓占比%）" />
      <el-table-column prop="top20HoldingPercent" label="前二十大持仓占比%）" />
    </el-table>
    <div style="display: flex; width: 100%; justify-content: space-between">
      <div id="hangye1" v-loading="hangye1Loading"></div>
      <div id="hangye2" v-loading="hangye2Loading"></div>
    </div>
    <div style="display: flex; width: 100%; justify-content: space-between">
      <div id="hangye3" v-loading="hangye3Loading"></div>
      <div id="hangye4" v-loading="hangye4Loading"></div>
    </div>
    <div style="display: flex; width: 100%; justify-content: space-between">
      <div id="diqu" v-loading="diquLoading"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { nextTick, onMounted, onUnmounted, watch } from "vue";
import { ref } from "vue";
import {
  getHoldingAnalysisListApi,
  getGICSLevel1ChartApi,
  getGICSLevel3ChartApi,
  getICBLevel1ChartApi,
  getICBLevel3ChartApi,
  getAreaChartApi,
} from "@/api/filterDetails";

const props = defineProps<{
  tabActiveName: string;
  code: string;
}>();
watch(
  () => props.tabActiveName,
  () => {
    if (props.tabActiveName === "PositionAnalysis") {
      nextTick(() => {
        getListData();
        getGICSLevel1Chart();
        getGICSLevel3Chart();
        getICBLevel1Chart();
        getICBLevel3Chart();
        getAreaChart();
      });
    }
  },
  { immediate: true }
);
const dateValue = ref("2025-06-30");
function dateValueChange() {
  getListData();
  getGICSLevel1Chart();
  getGICSLevel3Chart();
  getICBLevel1Chart();
  getICBLevel3Chart();
  getAreaChart();
}
const tableData = ref<Record<string, any>[]>([]);
const tableLoading = ref(false);
function getListData() {
  tableLoading.value = true;
  getHoldingAnalysisListApi({
    etfCode: props.code,
    date: dateValue.value || null,
  })
    .then((res) => {
      tableData.value = res;
    })
    .finally(() => {
      tableLoading.value = false;
    });
}
let hangyeChart: echarts.ECharts | null = null;
let hangye2Chart: echarts.ECharts | null = null;
let hangye3Chart: echarts.ECharts | null = null;
let hangye4Chart: echarts.ECharts | null = null;
let diquChart: echarts.ECharts | null = null;
let hangye1Loading = ref(false);
let hangye2Loading = ref(false);
let hangye3Loading = ref(false);
let hangye4Loading = ref(false);
let diquLoading = ref(false);

function getGICSLevel1Chart() {
  hangye1Loading.value = true;
  getGICSLevel1ChartApi({
    etfCode: props.code,
    date: dateValue.value || null,
  })
    .then((res) => {
      if (hangyeChart) {
        hangyeChart.dispose();
        hangyeChart = null;
      }
      hangyeChart = echarts.init(document.getElementById("hangye1"));
      initCharts(hangyeChart, res.xaxis, res.series, "GICS-level1");
    })
    .finally(() => {
      hangye1Loading.value = false;
    });
}
function getGICSLevel3Chart() {
  hangye2Loading.value = true;
  getGICSLevel3ChartApi({
    etfCode: props.code,
    date: dateValue.value || null,
  })
    .then((res) => {
      if (hangye2Chart) {
        hangye2Chart.dispose();
        hangye2Chart = null;
      }
      hangye2Chart = echarts.init(document.getElementById("hangye2"));
      initCharts(hangye2Chart, res.xaxis, res.series, "GICS-level3");
    })
    .finally(() => {
      hangye2Loading.value = false;
    });
}
function getICBLevel1Chart() {
  hangye3Loading.value = true;
  getICBLevel1ChartApi({
    etfCode: props.code,
    date: dateValue.value || null,
  })
    .then((res) => {
      if (hangye3Chart) {
        hangye3Chart.dispose();
        hangye3Chart = null;
      }
      hangye3Chart = echarts.init(document.getElementById("hangye3"));
      initCharts(hangye3Chart, res.xaxis, res.series, "ICB-level1");
    })
    .finally(() => {
      hangye3Loading.value = false;
    });
}
function getICBLevel3Chart() {
  hangye4Loading.value = true;
  getICBLevel3ChartApi({
    etfCode: props.code,
    date: dateValue.value || null,
  })
    .then((res) => {
      if (hangye4Chart) {
        hangye4Chart.dispose();
        hangye4Chart = null;
      }
      hangye4Chart = echarts.init(document.getElementById("hangye4"));
      initCharts(hangye4Chart, res.xaxis, res.series, "ICB-level3");
    })
    .finally(() => {
      hangye4Loading.value = false;
    });
}
function getAreaChart() {
  diquLoading.value = true;
  getAreaChartApi({
    etfCode: props.code,
    date: dateValue.value || null,
  })
    .then((res) => {
      if (diquChart) {
        diquChart.dispose();
        diquChart = null;
      }
      diquChart = echarts.init(document.getElementById("diqu"));
      initCharts(diquChart, res.xaxis, res.series, "投资区域");
    })
    .finally(() => {
      diquLoading.value = false;
    });
}

function initCharts(
  chart: echarts.ECharts,
  xaxis: string[],
  series: any,
  title: string
) {
  if (chart) {
    chart.setOption({
      title: {
        text: title,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      // legend: {},
      grid: {
        left: "1%",
        // right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.1],
        show: false,
      },

      yAxis: {
        type: "category",
        data: xaxis,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          name: series && series.length > 0 ? series[0].name : "",
          type: "bar",
          barGap: 0,
          data: series && series.length > 0 ? series[0].data : [],
          label: {
            show: true,
            position: "right",
            valueAnimation: true,
          },
        },
        {
          name: series && series.length > 1 ? series[1].name : "",
          type: "bar",
          data: series && series.length > 1 ? series[1].data : [],
          label: {
            show: true,
            position: "right",
            valueAnimation: true,
          },
        },
      ],
      graphic:
        series && series.length > 0
          ? []
          : {
              type: "text",
              left: "center",
              top: "middle",
              style: {
                text: "暂无数据",
                fontSize: 16,
                fill: "#999",
              },
            },
    });
  }
}
function resizeChart() {
  if (hangyeChart) {
    hangyeChart.resize();
  }
  if (hangye2Chart) {
    hangye2Chart.resize();
  }
  if (hangye3Chart) {
    hangye3Chart.resize();
  }
  if (hangye4Chart) {
    hangye4Chart.resize();
  }
  if (diquChart) {
    diquChart.resize();
  }
}
function disposeCharts() {
  if (hangyeChart) {
    hangyeChart.dispose();
    hangyeChart = null;
  }
  if (hangye2Chart) {
    hangye2Chart.dispose();
    hangye2Chart = null;
  }
  if (hangye3Chart) {
    hangye3Chart.dispose();
    hangye3Chart = null;
  }
  if (hangye4Chart) {
    hangye4Chart.dispose();
    hangye4Chart = null;
  }
  if (diquChart) {
    diquChart.dispose();
    diquChart = null;
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
.position-analysis {
  width: 100%;
  #hangye1,
  #hangye2,
  #hangye3,
  #hangye4 {
    width: 50%;
    height: 600px;
  }
  #diqu {
    width: 100%;
    height: 600px;
  }
}
</style>
