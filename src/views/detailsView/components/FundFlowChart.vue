<template>
  <div class="fund-flow-chart">
    <h2 class="h3">{{ code }}资金流动图表</h2>
    <p>查看包含 ETF 基金流量数据的图表。</p>
    <PeriodSelector
      v-model="activeBtn"
      :options="periodOptions"
      prefix="过去"
      suffix="的日净流入"
      @change="handleChange"
    />
    <div v-loading="loading" id="fund-flow-chart"></div>
    <div v-loading="chartTwoLoading" id="fund-flow-chart-2"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onUnmounted, watch, nextTick } from "vue";
import * as echarts from "echarts";
import { useDevice } from "@/utils/device";
import { getFundFlowDataApi } from "@/api/details";
import { getMonthAgoDate, getYearAgoDate } from "@/utils/formatValue";
import PeriodSelector from "@/components/PeriodSelector.vue";

let myChart: echarts.ECharts | null = null;
let myTwoChart: echarts.ECharts | null = null;
const props = defineProps<{
  tabActiveName: string;
  code: string;
}>();

const xAxisData = ref([]);
const seriesData = ref([]);
const activeBtn = ref('1month');
const loading = ref(false);
const chartTwoLoading = ref(false);

const periodOptions: [PeriodOption, PeriodOption, PeriodOption, PeriodOption, PeriodOption] = [
  { label: '1 个月', value: '1month' },
  { label: '3 个月', value: '3month' },
  { label: '6 个月', value: '6month' },
  { label: '1 年', value: '1year' },
  { label: '3 年', value: '3year' }
];

interface PeriodOption {
  label: string
  value: string
}
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

const chartTwoData = {
  dates: [
    "14. Apr", "15. Apr", "16. Apr", "17. Apr", "18. Apr", "19. Apr", "20. Apr",
    "21. Apr", "22. Apr", "23. Apr", "24. Apr", "25. Apr", "26. Apr", "27. Apr",
    "28. Apr", "29. Apr", "30. Apr", "1. May", "2. May", "3. May", "4. May",
    "5. May", "6. May", "7. May", "8. May", "9. May", "10. May", "11. May",
    "12. May", "13. May"
  ],
  priceInfluence: [10, 4, 3, 0, 0, -12, -12, 0, 14, 12, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 6],
  fundFlow: [-2, -9, 0, 0, 0, 0, 0, -8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -2, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}

const initChart = async () => {
  disposeCharts();
  const chartDom = document.getElementById("fund-flow-chart");
  const chartDomTwo = document.getElementById("fund-flow-chart-2");
  myChart = echarts.init(chartDom);
  myTwoChart = echarts.init(chartDomTwo);
  if(myChart){
    myChart.setOption({
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
  });
  }
  if(myTwoChart){
    myTwoChart.setOption({
     tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        data: [
          { name: 'Price Influence', icon: 'circle', textStyle: { color: '#2D1C5A' } },
          { name: 'Fund Flow', icon: 'circle', textStyle: { color: '#1CA9A6' } }
        ],
        bottom: 0
      },
      grid: { left: 40, right: 40, bottom: 60, top: 40 },
      xAxis: {
        type: 'category',
        data: chartTwoData.dates,
        // axisTick: { alignWithLabel: true },
        // axisLabel: { interval: 2 } // 只显示部分日期，防止重叠
      },
      yAxis: {
        type: 'value',
        position: 'right',
        axisLabel: {
          formatter: function (value: number) {
            return value + ' B';
          }
        }
      },
      series: [
        {
          name: 'Price Influence',
          type: 'bar',
          stack: 'one',
          data: chartTwoData.priceInfluence,
          itemStyle: { color: '#2D1C5A' },
          // barWidth: isMobile() ? 8 : 16
        },
        {
          name: 'Fund Flow',
          type: 'bar',
          stack: 'one',
          data: chartTwoData.fundFlow,
          itemStyle: { color: '#1CA9A6' },
          // barWidth: isMobile() ? 8 : 16
        }
      ]
    })
  }
  window.addEventListener("resize", resizeChart);
};
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
  #fund-flow-chart, #fund-flow-chart-2 {
    width: 100%;
    height: 400px;
  }
}
@media (max-width: 768px) {
  #fund-flow-chart {
    height: 220px;
  }
}
</style>
