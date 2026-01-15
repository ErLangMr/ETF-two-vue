<template>
  <div class="holder-behavior-analysis">
    <div style="display: flex; justify-content: flex-end; align-items: center;">
      <el-date-picker
          v-model="yearValue"
          :clearable="false"
          value-format="YYYY"
          type="year"
          placeholder="选择年份"
          @change="yearChange"
        />
      <div style="margin-left: 10px;">
        <el-button :type="periodType === 'half' ? 'primary' : ''" @click="dateBtnClick">半年度</el-button>
        <el-button :type="periodType === 'year' ? 'primary' : ''" @click="dateBtnClick">年度</el-button>
      </div>
    </div>
    <div
      v-for="item in tableKeys"
     style="margin-bottom: 40px;"
    >
      <div v-loading="tableloading">
        <h4 style="margin-bottom: 10px">{{ tableTitleFilter(item) }}</h4>
        <el-table
          :data="tableDataList[item] || []"
          default-expand-all
          :header-cell-style="{
            background: '#d7d9dc',
            color: '#333',
            height: '30px',
            padding: 0,
            fontSize: '14px',
          }"
          :cell-style="{ height: '30px', padding: 0, fontSize: '16px' }"
        >
          <el-table-column prop="activity" label="持有人行为" show-overflow-tooltip min-width="120" />
          <el-table-column prop="holderName" label="持有人名称" show-overflow-tooltip min-width="150" />
          <el-table-column prop="holderNum" label="持有份额" show-overflow-tooltip min-width="120" />
          <el-table-column prop="holderNum1" label="上一期持有份额" show-overflow-tooltip min-width="150" />
          <el-table-column prop="holderV" label="持有规模（元）" show-overflow-tooltip min-width="150" />
          <el-table-column prop="holderV1" label="上一期持有规模" show-overflow-tooltip min-width="150" />
          <el-table-column prop="holderWeight" label="持有比例（%）" show-overflow-tooltip min-width="150" />
          <el-table-column prop="holderWeight1" label="上一期持有比例（%）" show-overflow-tooltip min-width="180" />
          <el-table-column prop="lx" label="持有人类型编码" show-overflow-tooltip min-width="130" />
          <el-table-column prop="net" label="持有人净买卖规模" show-overflow-tooltip min-width="150" />
          <el-table-column prop="ret" label="过去6个月ETF累计收益" show-overflow-tooltip min-width="180" />
        </el-table>
      </div>
      <!-- <div style="width: 50%">
        <h4 style="margin-bottom: 10px">前5大进入、退出的持有人</h4>
        <el-table
          :data="inOutTableData"
          default-expand-all
          :header-cell-style="{
            // background: '#d7d9dc',
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
    <div style="display: flex; width: 100%; justify-content: space-between; gap: 40px;margin-top: 20px;">
      <div id="leixing"></div>
      <div id="fengge"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted, nextTick, watchEffect } from "vue";
import * as echarts from "echarts";
import { getHolderBehaviorApi, getHolderBehaviorCategoryChartApi, getHolderBehaviorStyleChartApi } from "@/api/filterDetails";

const props = defineProps<{
  tabActiveName: string;
  code: string;
}>();
const maiTableData = [
  {
    id: "1",
    name: "中科华华",
    shizhi: "0.05%",
    shouyi: "0.05%",
  },
  {
    id: "2",
    name: "中科华华",
    shizhi: "0.05%",
    shouyi: "0.05%",
  },
];
const inOutTableData = maiTableData;
watch(
  () => props.tabActiveName,
  (val) => {
    if (val === "HolderBehaviorAnalysis") {
      nextTick(() => {
        getHolderBehavior();
        getHolderBehaviorCategoryChart();
        getHolderBehaviorStyleChart();
      });
    }
  },
  { immediate: true }
);
const yearValue = ref(new Date().getFullYear().toString());
const periodType = ref('half');
const dateParam = ref('');
watchEffect(() => {
  dateParam.value = `${yearValue.value}-${periodType.value === 'half' ? '06-30' : '12-31'}`;
});
function yearChange() {
  nextTick(() => {
    getHolderBehavior();
    getHolderBehaviorCategoryChart();
    getHolderBehaviorStyleChart();
  });
}
function dateBtnClick() {
  periodType.value = periodType.value === 'half' ? 'year' : 'half';
  nextTick(() => {
    getHolderBehavior();
    getHolderBehaviorCategoryChart();
    getHolderBehaviorStyleChart();
  });
}

const tableloading = ref(false);
const tableDataList = ref();
const tableKeys = ref();
function getHolderBehavior(){
  tableloading.value = true;
  getHolderBehaviorApi({
    etfCode: props.code,
    date: dateParam.value
  }).then((res) => {
    tableDataList.value = res;
    const keys = Object.keys(res);
    tableKeys.value = keys;
    console.log(keys, "res")
  }).finally(() => {
    tableloading.value = false;
  })
}
function tableTitleFilter(key: string) {
  if(key === 'buyers'){
    return '买入持有人列表';
  } else if(key === 'enters'){
    return '新进入持有人列表';
  } else if(key === 'exits'){
    return '退出持有人列表';
  } else if(key === 'holders'){
    return '稳定持有人列表';
  } else if(key === 'sellers'){
    return '卖出持有人列表';
  }
}

let leixingChart: echarts.ECharts | null = null;
let fenggeChart: echarts.ECharts | null = null;
function getHolderBehaviorCategoryChart(){
  if(fenggeChart){
    fenggeChart.dispose();
    fenggeChart = null;
  }
   fenggeChart = echarts.init(document.getElementById("fengge") as HTMLDivElement);
  getHolderBehaviorCategoryChartApi({
    etfCode: props.code,
    date: dateParam.value
  }).then((res) => {
    const xaxis = res.xaxis;
    const series = res.series;
    initChart(fenggeChart as echarts.ECharts, xaxis, series, '不同类型持有人行为');
  })
}
function getHolderBehaviorStyleChart(){
  if(leixingChart){
    leixingChart.dispose();
    leixingChart = null;
  }
  leixingChart = echarts.init(document.getElementById("leixing") as HTMLDivElement);
  getHolderBehaviorStyleChartApi({
    etfCode: props.code,
    date: dateParam.value
  }).then((res) => {
    const xaxis = res.xaxis;
    const series = res.series;
    initChart(leixingChart as echarts.ECharts, xaxis, series, '不同风格持有人行为');
  })
}
function initChart(chart: echarts.ECharts, xaxis: any, series: any, title: string) {
  // chart.setOption({
  //   title: {
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
  //       data: ["Brazil", "Indonesia", "USA", "India", "China", "World"],
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
  //         data: [-18203, -23489, -29034, 104970, -131744, -130230],
  //         itemStyle: {
  //           color: (params: any) => {
  //             return params.value >= 0 ? '#14b143' : '#ef232a';
  //           }
  //         }
  //       },
  //     ],
  // })
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
function resizeChart() {
  const charts = [leixingChart, fenggeChart] as echarts.ECharts[];
  charts.forEach((chart) => {
    if (chart) {
      chart.resize();
    }
  });
}
function disposeCharts() {
  const charts = [leixingChart, fenggeChart];
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
.holder-behavior-analysis {
  width: 100%;
  #leixing,
  #fengge {
    width: 50%;
    height: 400px;
  }
}
</style>
