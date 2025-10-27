<template>
  <div class="fundFlows-comparison-tool">
    <div id="fundFlowsOne"></div>
    <div id="fundFlowsTwo"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  tableData: {
    type: Object,
    default: () => ({})
  }
});
onMounted(() => {
  window.addEventListener("resize", resizeCharts);
  nextTick(() => {
    getChartData();
  });
});

let fundFlowsOne: echarts.ECharts | null = null;
let funcdlFlowsTwo: echarts.ECharts | null = null;
function getChartData(){
  fundFlowsOne = echarts.init(document.getElementById('fundFlowsOne') as HTMLDivElement);
  funcdlFlowsTwo = echarts.init(document.getElementById('fundFlowsTwo') as HTMLDivElement);
  initOneChart(fundFlowsOne);
  initTwoChart(funcdlFlowsTwo);
}
function initOneChart(chart: echarts.ECharts) {
  chart.setOption({
      title: {
        text: "资金流动",
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
const chartTwoData = {
  dates: [
    "14. Apr", "15. Apr", "16. Apr", "17. Apr", "18. Apr", "19. Apr", "20. Apr",
    "21. Apr", "22. Apr", "23. Apr", "24. Apr", "25. Apr", "26. Apr", "27. Apr",
    "28. Apr", "29. Apr", "30. Apr", "1. May", "2. May", "3. May", "4. May",
    "5. May", "6. May", "7. May", "8. May", "9. May", "10. May", "11. May",
    "12. May", "13. May"
  ],
  priceInfluence: [10, 4, 3, 0, 0, -12, -12, 0, 14, 12, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 6],
  fundFlow: [-2, -9, 0, 0, 0, 0, 0, -8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -2, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  aumChange: 27.15
}
function initTwoChart(chart: echarts.ECharts) {
  chart.setOption({
    title: {
        text: "资金净流动",
        // textStyle: {
        //   fontSize: 14,
        // },
      },
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
          stack: "total",
          data: chartTwoData.priceInfluence,
          itemStyle: { color: '#2D1C5A' },
          // barWidth: isMobile() ? 8 : 16
        },
        {
          name: 'Fund Flow',
          type: 'bar',
          stack: 'total',
          data: chartTwoData.fundFlow,
          itemStyle: { color: '#1CA9A6' },
          // barWidth: isMobile() ? 8 : 16
        }
      ]
    })
}
function disposeCharts() {
  const charts = [fundFlowsOne, funcdlFlowsTwo];
  charts.forEach((chart) => {
    if (chart) {
      chart.dispose();
      chart = null;
    }
  });
}
function resizeCharts() {
  const charts = [fundFlowsOne, funcdlFlowsTwo];
  charts.forEach((chart) => {
    if (chart) {
      chart.resize();
    }
  });
}
onUnmounted(() => {
  window.removeEventListener("resize", resizeCharts);
  disposeCharts();
});
</script>

<style lang="scss" scoped>
.fundFlows-comparison-tool {
  width: 100%;
  height: 100%;
  #fundFlowsOne,
  #fundFlowsTwo {
    width: 100%;
    height: 400px;
    margin-bottom: 40px;
  }
}
</style>
