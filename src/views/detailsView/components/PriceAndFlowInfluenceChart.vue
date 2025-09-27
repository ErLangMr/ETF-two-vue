<template>
  <div class="price-and-flow-influence-chart">
    <h2 class="h3">IVV Price vs Flows AUM Influence Charts</h2>
    <p>View charts that break down the influence that fund flows and price had on overall assets.</p>
    <div id="price-and-flow-influence-chart" style="width: 100%; height: 350px;"></div>
    <div style="margin-top: 16px; font-weight: bold;">
      1 Month Net AUM Change: <span style="color: #2D1C5A;">{{ chartData.aumChange }} B</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import { useDevice } from "@/utils/device";
import * as echarts from "echarts";
const props = defineProps<{
  tabActiveName: string;
}>();
const { isMobile } = useDevice();
watch(() => props.tabActiveName, (newVal) => {
  if (newVal === '价格与流量影响力图表') {
    nextTick(() => {
      initChart()
    })
  }
}, { immediate: true });

function resizeChart() {
  if (myChart) {
    myChart.resize();
  }
}

const initChart = async () => {
  await nextTick()
  const chartDom = document.getElementById("price-and-flow-influence-chart")!;
    myChart = echarts.init(chartDom);
    myChart.setOption({
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
        data: chartData.dates,
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
          data: chartData.priceInfluence,
          itemStyle: { color: '#2D1C5A' },
          // barWidth: isMobile() ? 8 : 16
        },
        {
          name: 'Fund Flow',
          type: 'bar',
          stack: 'one',
          data: chartData.fundFlow,
          itemStyle: { color: '#1CA9A6' },
          // barWidth: isMobile() ? 8 : 16
        }
      ]
    });
    window.addEventListener("resize", resizeChart);
}
const chartData = {
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
};

let myChart: echarts.ECharts | null = null;

// onMounted(() => {
//   nextTick(() => {

//   });
// });

onBeforeUnmount(() => {
  if (myChart) {
    myChart.dispose();
  }
  window.removeEventListener("resize", resizeChart);
});
</script>
<style scoped lang="scss">
.price-and-flow-influence-chart {
  width: 100%;
  height: 100%;
}
</style>

