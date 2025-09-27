<template>
  <div class="price-and-volume-chart">
    <h2 class="h3">IVV Price and Volume Charts</h2>
    <div ref="chartRef" style="width: 100%; height: 500px;"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { useRoute } from 'vue-router'
import { getETFChartDataApi } from '@/api/details'

const route = useRoute()
const code = route.query.code as string
console.log(code, 'code')
const props = defineProps<{
  tabActiveName: string
}>()
const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

// 示例数据（请替换为你的真实数据）
let dates = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2024, 1, 23 + i);
  return date.toISOString().slice(0, 10);
});
console.log(dates, 'dates')
let kData = Array.from({ length: 30 }, (_, i) => {
  // 随机生成K线数据，模拟波动
  const base = 600 + Math.floor(Math.sin(i / 5) * 20) + i;
  const open = base + Math.floor(Math.random() * 10 - 5);
  const close = open + Math.floor(Math.random() * 10 - 5);
  const low = Math.min(open, close) - Math.floor(Math.random() * 5);
  const high = Math.max(open, close) + Math.floor(Math.random() * 5);
  return [open, close, low, high];
});
console.log(kData, 'kData')
let volumeData = Array.from({ length: 30 }, () => 3500000 + Math.floor(Math.random() * 1500000));
console.log(volumeData, 'volumeData')
// 生成成交量颜色（与K线涨跌同步）
const volumeColors = kData.map(item => item[1] > item[0] ? '#26A69A' : '#EF5350');
// 计算成交量最大值
const maxVolume = Math.max(...volumeData);

watch(() => props.tabActiveName, (newVal) => {
  if (newVal === '价格和数量图表') {
    console.log('条件匹配，准备初始化图表');
    nextTick(() => {
      // initChart();
      getChartData()
    });
  }
}, { immediate: true });

function getChartData() {
  console.log(code, 'code')
  getETFChartDataApi({
    code: code,
    startDate : '2025-01-01',
    endDate : '2025-05-25'
  }).then((res: any) => {
    console.log(res, 'res')
    dates = res.timeArray
    // kData = res.klineDataArray
    volumeData = res.volumeArray
    initChart();
  })
}

const initChart = async () => {
  await nextTick()
  if (chartRef.value) {
    chart = echarts.init(chartRef.value)
    chart.setOption({
      animation: false,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        backgroundColor: 'rgba(245, 245, 245, 0.8)',
        borderWidth: 1,
        borderColor: '#ccc',
        textStyle: { color: '#333' }
      },
      axisPointer: {
        link: [{ xAxisIndex: [0, 1] }],
        label: { backgroundColor: '#777' }
      },
      grid: [
        { left: 0, right: '10%', top: 40, height: 260 },
        { left: 0, right: '10%', top: 320, height: 80 }
      ],
      xAxis: [
        {
          type: 'category',
          data: dates,
          scale: true,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          min: 'dataMin',
          max: 'dataMax',
          axisLabel: { color: '#888' }
        },
        {
          type: 'category',
          gridIndex: 1,
          data: dates,
          scale: true,
          boundaryGap: false,
          axisLine: { onZero: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false }
        }
      ],
      yAxis: [
        {
          scale: true,
          position: 'right',
          axisLabel: { color: '#888' },
          splitLine: { lineStyle: { color: '#eee' } }
        },
        {
          scale: true,
          gridIndex: 1,
          position: 'right',
          axisLabel: {
            color: '#888',
            formatter: (val: number) => (val / 1000000).toFixed(2) + 'M'
          },
          splitLine: { show: false },
          min: 0,
          max: maxVolume * 1.2,
          interval: Math.ceil(maxVolume * 1.2 / 4)
        }
      ],
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: [0, 1],
          start: 0,
          end: 100,
          height: 20,
          bottom: 10
        }
      ],
      series: [
        {
          name: 'K线',
          type: 'candlestick',
          data: kData,
          itemStyle: {
            color: '#26A69A', // 涨
            color0: '#EF5350', // 跌
            borderColor: '#26A69A',
            borderColor0: '#EF5350'
          }
        },
        {
          name: '成交量',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: volumeData,
          itemStyle: {
            color: (params: any) => volumeColors[params.dataIndex]
          },
          barWidth: '70%',
        }
      ],
      // 右侧最新价和成交量标签
      graphic: [
        {
          type: 'group',
          right: 0,
          top: 40,
          children: [
            {
              type: 'rect',
              z: 100,
              right: 0,
              top: 0,
              shape: { width: 60, height: 24 },
              style: { fill: '#26A69A' }
            },
            {
              type: 'text',
              z: 101,
              right: 8,
              top: 4,
              style: {
                text: kData[kData.length - 1][1].toFixed(2),
                fill: '#fff',
                font: 'bold 14px sans-serif'
              }
            }
          ]
        },
        {
          type: 'group',
          right: 0,
          top: 320,
          children: [
            {
              type: 'rect',
              z: 100,
              right: 0,
              top: 0,
              shape: { width: 60, height: 24 },
              style: { fill: '#26A69A' }
            },
            {
              type: 'text',
              z: 101,
              right: 8,
              top: 4,
              style: {
                text: (volumeData[volumeData.length - 1] / 1000000).toFixed(2) + 'M',
                fill: '#fff',
                font: 'bold 14px sans-serif'
              }
            }
          ]
        }
      ]
    })
  }
}

onBeforeUnmount(() => {
  chart?.dispose()
})
</script>

<style scoped lang="scss">
.price-and-volume-chart {
  width: 100%;
}
</style>
