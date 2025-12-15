<template>
  <div class="position-holding-behavior">
    <div style="display: flex; justify-content: flex-end; align-items: center;">
      <el-date-picker
          v-model="yearValue"
          value-format="YYYY"
          type="year"
          placeholder="Pick a year"
        />
      <div style="margin-left: 10px;">
        <el-button :type="periodType === 'half' ? 'primary' : ''" @click="periodType = 'half'">半年度</el-button>
        <el-button :type="periodType === 'year' ? 'primary' : ''" @click="periodType = 'year'">年度</el-button>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between; gap: 40px">
      <div style="width: 100%">
        <h4 style="margin-bottom: 10px;">前5大买入、卖出股票</h4>
        <el-table
          :data="gupiaoTableData"
          row-key="id"
          default-expand-all
          v-loading="tableloading"
          :header-cell-style="{
            background: '#d7d9dc',
            color: '#333',
            height: '35px',
            padding: 0,
            fontSize: '16px',
          }"
          :cell-style="{ height: '35px', padding: 0, fontSize: '16px' }"
        >
          <el-table-column prop="stkCode" label="股票代码" />
          <el-table-column prop="stkName" label="股票名称" />
          <el-table-column prop="amount" label="数量" />
          <el-table-column prop="rank" label="排名" />
        </el-table>
      </div>
      <!-- <div style="width: 50%">
        <h4 style="margin-bottom: 10px;">前5持股市值占比增加最多、减少最多的股票</h4>
        <el-table
          :data="gupiaoTableData"
          row-key="id"
          default-expand-all
          :header-cell-style="{
            background: '#d7d9dc',
            color: '#333',
            height: '30px',
            padding: 0,
            fontSize: '16px',
          }"
          :cell-style="{ height: '30px', padding: 0, fontSize: '16px' }"
        >
          <el-table-column prop="name" label="" />
          <el-table-column prop="shizhi" label="百分比" />
          <el-table-column prop="shouyi" label="数量" />
        </el-table>
      </div> -->
    </div>
    <!-- <div style="display: flex; justify-content: space-between; gap: 40px">
      <div id="behavior-hangye"></div>
      <div id="behavior-diqu"></div>
      <div id="behavior-shizhi"></div>
    </div> -->
    <div style="display: flex; justify-content: space-between; gap: 40px;margin-top: 40px;">
      <div id="behavior-chart1" v-loading="chart1Loading"></div>
      <div id="behavior-chart2" v-loading="chart2Loading"></div>
    </div>
    <div style="display: flex; justify-content: space-between; gap: 40px;margin-top: 20px;">
      <div id="behavior-chart3" v-loading="chart3Loading"></div>
      <div id="behavior-chart4" v-loading="chart4Loading"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { nextTick, onMounted, onUnmounted, ref, watch, watchEffect } from "vue";
import { getHoldingChangeTop5Api, getMVRatioChartApi, getAreaRatioChartApi, getGICSRatioChartApi, getICBRatioChartApi } from "@/api/filterDetails";

const props = defineProps({
  tabActiveName: {
    type: String,
    default: "",
  },
  code: {
    type: String,
    default: "",
  },
});
// const gupiaoTableData = [
//   {
//     name: "最大买入",
//     shizhi: "100",
//     shouyi: "10",
//     id: "1",
//     children: [
//       {
//         name: "银行",
//         shizhi: "100",
//         shouyi: "10",
//         id: "1-1",
//       },
//       {
//         name: "银行",
//         shizhi: "100",
//         shouyi: "10",
//         id: "1-2",
//       },
//       {
//         name: "银行",
//         shizhi: "100",
//         shouyi: "10",
//         id: "1-3",
//       },
//       {
//         name: "银行",
//         shizhi: "100",
//         shouyi: "10",
//         id: "1-4",
//       },
//       {
//         name: "银行",
//         shizhi: "100",
//         shouyi: "10",
//         id: "1-5",
//       },
//     ],
//   },
//   {
//     name: "最大卖出",
//     shizhi: "100",
//     shouyi: "10",
//     id: "2",
//     children: [
//       {
//         name: "银行",
//         shizhi: "100",
//         shouyi: "10",
//         id: "3",
//       },
//       {
//         name: "银行",
//         shizhi: "100",
//         shouyi: "10",
//         id: "4",
//       },
//       {
//         name: "银行",
//         shizhi: "100",
//         shouyi: "10",
//         id: "5",
//       },
//       {
//         name: "银行",
//         shizhi: "100",
//         shouyi: "10",
//         id: "6",
//       },
//       {
//         name: "银行",
//         shizhi: "100",
//         shouyi: "10",
//         id: "7",
//       },
//     ],
//   },
// ];
watch(
  () => props.tabActiveName,
  (newVal, oldVal) => {
    if (newVal === "PositionHoldingBehavior") {
     nextTick(() => {
      getHoldingChangeTop5List();
      getMVRatioChart();
      getAreaRatioChart();
      getGICSRatioChart();
      getICBRatioChart();
    });
    }
  }, { immediate: true }
);
const yearValue = ref(new Date().getFullYear().toString());
const periodType = ref('half');
const tableloading = ref(false);
const dateParam = ref('');
watchEffect(() => {
  dateParam.value = `${yearValue.value}-${periodType.value === 'half' ? '06-30' : '12-31'}`;
});
const gupiaoTableData = ref([]);
function getHoldingChangeTop5List() {
  tableloading.value = true;
  getHoldingChangeTop5Api({
    etfCode: '159150.OF',
    date: dateParam.value,
  }).then((res) => {
    tableloading.value = false;
    gupiaoTableData.value = res.buyList;
  }).finally(() => {
    tableloading.value = false;
  });
}
let behaviorChart1: echarts.ECharts | null;
let behaviorChart2: echarts.ECharts | null;
let behaviorChart3: echarts.ECharts | null;
let behaviorChart4: echarts.ECharts | null;
const chart1Loading = ref(false);
const chart2Loading = ref(false);
const chart3Loading = ref(false);
const chart4Loading = ref(false);
function getMVRatioChart(){
  chart1Loading.value = true;
  if(behaviorChart1){
    behaviorChart1.dispose();
    behaviorChart1 = null;
  }
   behaviorChart1 = echarts.init(document.getElementById("behavior-chart1") as HTMLElement);
  getMVRatioChartApi({
    etfCode: '159150.OF',
    date: dateParam.value,
  }).then((res) => {
    initCharts(behaviorChart1 as echarts.ECharts, res.xaxis, res.series, 'ETF持股市值占比');
  }).finally(() => {
    chart1Loading.value = false;
  });
}

function getAreaRatioChart(){
  chart2Loading.value = true;
  if(behaviorChart2){
    behaviorChart2.dispose();
    behaviorChart2 = null;
  }
  behaviorChart2 = echarts.init(document.getElementById("behavior-chart2") as HTMLElement);
  getAreaRatioChartApi({
    etfCode: '159150.OF',
    date: dateParam.value,
  }).then((res) => {
    initCharts(behaviorChart2 as echarts.ECharts, res.xaxis, res.series, 'ETF地区占比变化图');
  }).finally(() => {
    chart2Loading.value = false;
  });
}
function getGICSRatioChart(){
  chart3Loading.value = true;
  if(behaviorChart3){
    behaviorChart3.dispose();
    behaviorChart3 = null;
  }
  behaviorChart3 = echarts.init(document.getElementById("behavior-chart3") as HTMLElement);
  getGICSRatioChartApi({
    etfCode: '159150.OF',
    date: dateParam.value,
  }).then((res) => {
    initCharts(behaviorChart3 as echarts.ECharts, res.xaxis, res.series, 'GICS 一级行业配置变化图');
  }).finally(() => {
    chart3Loading.value = false;
  });
}

function getICBRatioChart(){
  chart4Loading.value = true;
  if(behaviorChart4){
    behaviorChart4.dispose();
    behaviorChart4 = null;
  }
  behaviorChart4 = echarts.init(document.getElementById("behavior-chart4") as HTMLElement);
  getICBRatioChartApi({
    etfCode: '159150.OF',
    date: dateParam.value,
  }).then((res) => {
    initCharts(behaviorChart4 as echarts.ECharts, res.xaxis, res.series, 'IBC 一级行业配置变化图');
  }).finally(() => {
    chart4Loading.value = false;
  });
}

function initCharts(chart: echarts.ECharts, xaxis: any, series: any, title: string) {
  // if (chart) {
  //   chart.setOption({
  //     title: {
  //       text: title,
  //     },
  //     tooltip: {
  //       trigger: "axis",
  //       axisPointer: {
  //         type: "shadow",
  //       },
  //     },
  //     // legend: {},
  //     grid: {
  //       left: "3%",
  //       right: "15%",
  //       bottom: "3%",
  //       containLabel: true,
  //     },
  //     xAxis: {
  //       type: "value",
  //       boundaryGap: [0, 0.1]
  //     },
  //     yAxis: {
  //       type: "category",
  //       data: xaxis,
  //       position: "right",
  //       axisTick: {
  //         show: false,
  //       },
  //     },
  //     series: [
  //       {
  //         name: "2011",
  //         type: "bar",
  //         barGap: 0,
  //         data: series,
  //         itemStyle: {
  //           color: (params: any) => {
  //             return params.value >= 0 ? '#14b143' : '#ef232a';
  //           }
  //         }
  //       },
  //     ],
  //   });
  // }
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
          name: series && series.length>0 ? series[0].name : '',
          type: "bar",
          barGap: 0,
          data: series && series.length>0 ? series[0].data : [],
          label: {
            show: true,
            position: "right",
            valueAnimation: true,
          },
        },
        {
          name: series && series.length>1 ? series[1].name : '',
          type: "bar",
          data: series && series.length>1 ? series[1].data : [],
          label: {
            show: true,
            position: "right",
            valueAnimation: true,
          },
        },
      ],
      graphic: series && series.length>0 ? [] : {
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
}
function resizeChart() {
  const charts = [behaviorChart1, behaviorChart2, behaviorChart3, behaviorChart4]
  charts.forEach((chart) => {
    if (chart) {
      chart.resize();
    }
  });
}
function disposeCharts() {
  const charts = [behaviorChart1, behaviorChart2, behaviorChart3, behaviorChart4]
  charts.forEach((chart) => {
    if (chart) {
      chart.dispose();
      chart = null;
    }
  });
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
.position-holding-behavior {
  width: 100%;
  height: 100%;
  :deep(.el-table__expand-icon) {
    display: none;
  }
  #behavior-chart1,
  #behavior-chart2,
  #behavior-chart3,
  #behavior-chart4 {
    width: 50%;
    height: 400px;
  }
}
</style>
