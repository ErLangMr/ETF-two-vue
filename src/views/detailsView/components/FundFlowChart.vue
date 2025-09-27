<template>
  <div class="fund-flow-chart">
    <h2 class="h3">{{ code }}资金流动图表</h2>
    <p>查看包含 ETF 基金流量数据的图表。</p>
    <div class="fund-flow-chart-btn">
      <span>过去</span>
      <span class="span" :class="activeBtn === '1month' ? 'activeBtn' : ''" @click="handleChange('1month')"> 1 个月</span>
      <span class="span" :class="activeBtn === '3month' ? 'activeBtn' : ''" @click="handleChange('3month')">3 个月</span>
      <span class="span" :class="activeBtn === '6month' ? 'activeBtn' : ''" @click="handleChange('6month')">6 个月</span>
      <span class="span" :class="activeBtn === '1year' ? 'activeBtn' : ''" @click="handleChange('1year')">1 年</span>
      <span class="span" :class="activeBtn === '3year' ? 'activeBtn' : ''" @click="handleChange('3year')">3 年</span>
      <span>的日净流入</span>
    </div>
    <div v-loading="loading" id="fund-flow-chart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onUnmounted, watch, nextTick } from "vue";
import * as echarts from "echarts";
import { useDevice } from "@/utils/device";
import { getFundFlowDataApi } from "@/api/details";
import { getMonthAgoDate, getYearAgoDate } from "@/utils/formatValue";

let myChart: echarts.ECharts | null = null;
const props = defineProps<{
  tabActiveName: string;
  code: string;
}>();

const xAxisData = ref([]);
const seriesData = ref([]);
const activeBtn = ref('1month');
const loading = ref(false);
watch(() => props.tabActiveName, (newVal) => {
  if (newVal === 'FundFlowChart') {
    if(myChart) {
      myChart.dispose();
      myChart = null;
    }
    loading.value = true
    getFundFlowDataApi({
      code: props.code,
      // type: 'M',
      startDate: getMonthAgoDate(1),
      endDate: new Date().toISOString().slice(0, 10)
    }).then((res) => {
      xAxisData.value = res.x
      seriesData.value = res.y
      initChart()
      loading.value = false
    }).catch(() => {
      loading.value = false
    })
  }
}, { immediate: true });
// function getRecentDates(days: number) {
//   const arr: string[] = [];
//   const today = new Date("2025-05-16");
//   for (let i = days - 1; i >= 0; i--) {
//     const d = new Date(today);
//     d.setDate(today.getDate() - i);
//     arr.push(d.toISOString().slice(0, 10));
//   }
//   return arr;
// }
// const xAxisData = getRecentDates(15);

const { isMobile } = useDevice();

const handleChange = (type: string) => {
  activeBtn.value = type
  if(myChart) {
    myChart.dispose();
    myChart = null;
  }
  let startDate = ''
  let endDate = ''
  let typeVal = ''
  if (type === '1month') {
    startDate = getMonthAgoDate(1)
    endDate = new Date().toISOString().slice(0, 10)
    typeVal = 'M'
  } else if (type === '3month') {
    startDate = getMonthAgoDate(3)
    endDate = new Date().toISOString().slice(0, 10)
    typeVal = 'M'
  } else if (type === '6month') {
    startDate = getMonthAgoDate(6)
    endDate = new Date().toISOString().slice(0, 10)
    typeVal = 'M'
  } else if (type === '1year') {
    startDate = getYearAgoDate(1)
    endDate = new Date().toISOString().slice(0, 10)
    typeVal = 'Y'
  } else if (type === '3year') {
    startDate = getYearAgoDate(3)
    endDate = new Date().toISOString().slice(0, 10)
    typeVal = 'Y'
  }
  loading.value = true
  getFundFlowDataApi({
    code: props.code,
    // type: typeVal,
    startDate,
    endDate
  }).then((res) => {
    xAxisData.value = res.x
    seriesData.value = res.y
    initChart()
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

function resizeChart() {
  if (myChart) {
    myChart.resize();
  }
}

const initChart = async () => {
  await nextTick()
  const chartDom = document.getElementById("fund-flow-chart");
  myChart = echarts.init(chartDom);
  const option = {
    // title: {
    //   text: "1 Month Fund Flows",
    //   left: "left",
    //   top: "bottom",
    //   textStyle: {
    //     fontSize: 14,
    //   },
    // },
    grid: {
      left: "3%",
      right: "3%",
      bottom: 40,
      top: 10,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: xAxisData.value,
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
        data: seriesData.value,
        itemStyle: {
          color: function (params: { value: number }) {
            return params.value >= 0 ? "#2ca02c" : "#d62728";
          },
        },
        // barWidth: isMobile() ? 8 : 16,
      },
    ],
    graphic: seriesData.value.length === 0 ? [{
      type: 'text',
      left: 'center',
      top: 'middle',
      style: {
        text: '暂无数据',
        fontSize: 16,
        fill: '#999'
      }
    }] : [],
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: function (
        params: {
          axisValue: string;
          value: string;
        }[]
      ) {
        return params[0].axisValue + ": " + params[0].value + " B";
      },
    },
  };
  myChart.setOption(option);
  window.addEventListener("resize", resizeChart);
};

onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
});
</script>

<style scoped lang="scss">
.fund-flow-chart {
  width: 100%;
  height: 100%;
  #fund-flow-chart {
    width: 100%;
    height: 320px;
  }
  .fund-flow-chart-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 10px 0;
    .span {
      cursor: pointer;
      background: rgb(236, 234, 234);
      padding: 5px 10px;
      border-radius: 5px;
      &.activeBtn {
        background: #c9c6c6;
      }
    }
  }
}
@media (max-width: 768px) {
  #fund-flow-chart {
    height: 220px;
  }
  .fund-flow-chart-btn{
    display: flex;
    flex-wrap: wrap;
    .span{
      width: 60px;
    }
  }
}
</style>
