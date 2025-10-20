<template>
  <div class="portfolio-characteristic">
    <div ref="chartRef" id="portfolio-characteristic-chart" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted, onActivated, onDeactivated, watch } from 'vue'

const props = defineProps<{
  tabActiveName: string
}>()

watch(() => props.tabActiveName, (newVal) => {
  if (newVal === 'PortfolioCharacteristic') {
    initChart()
  }
})
const chartRef = ref<HTMLElement | null>(null)
let myChart: echarts.ECharts | null = null
let isInitialized = false

// 生成模拟数据
const generateMockData = () => {
  const dates: string[] = []
  const data1: number[] = []
  const data2: number[] = []
  const data3: number[] = []
  const data4: number[] = []
  const data5: number[] = []

  const startDate = new Date('2022-07-01')
  const endDate = new Date('2025-07-01')

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
    dates.push(d.toISOString().split('T')[0])

    // 生成波动数据
    const baseValue1 = 27 + Math.sin(dates.length * 0.05) * 3
    const baseValue2 = 5.3 + Math.sin(dates.length * 0.06) * 1.5
    const baseValue3 = 18 + Math.sin(dates.length * 0.04) * 4
    const baseValue4 = 3.3 + Math.sin(dates.length * 0.05) * 0.8
    const baseValue5 = 12.5 + Math.sin(dates.length * 0.055) * 2.5

    data1.push(baseValue1 + (Math.random() - 0.5) * 2)
    data2.push(baseValue2 + (Math.random() - 0.5) * 0.5)
    data3.push(baseValue3 + (Math.random() - 0.5) * 2)
    data4.push(baseValue4 + (Math.random() - 0.5) * 0.3)
    data5.push(baseValue5 + (Math.random() - 0.5) * 1.5)
  }

  return { dates, data1, data2, data3, data4, data5 }
}

const initChart = () => {
  const { dates, data1, data2, data3, data4, data5 } = generateMockData()
  myChart = echarts.init(document.getElementById("portfolio-characteristic-chart"))

  const option: echarts.EChartsOption = {
    grid: [
      { left: '5%', right: '5%', top: '4%', height: '14%' },
      { left: '5%', right: '5%', top: '22%', height: '14%' },
      { left: '5%', right: '5%', top: '40%', height: '14%' },
      { left: '5%', right: '5%', top: '58%', height: '14%' },
      { left: '5%', right: '5%', top: '76%', height: '14%' }
    ],
    xAxis: [
      {
        type: 'category',
        data: dates,
        gridIndex: 0,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: true, lineStyle: { color: '#E5E5E5' } },
        splitLine: { show: true, lineStyle: { color: '#F5F5F5' } }
      },
      {
        type: 'category',
        data: dates,
        gridIndex: 1,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: true, lineStyle: { color: '#E5E5E5' } },
        splitLine: { show: true, lineStyle: { color: '#F5F5F5' } }
      },
      {
        type: 'category',
        data: dates,
        gridIndex: 2,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: true, lineStyle: { color: '#E5E5E5' } },
        splitLine: { show: true, lineStyle: { color: '#F5F5F5' } }
      },
      {
        type: 'category',
        data: dates,
        gridIndex: 3,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: true, lineStyle: { color: '#E5E5E5' } },
        splitLine: { show: true, lineStyle: { color: '#F5F5F5' } }
      },
      {
        type: 'category',
        data: dates,
        gridIndex: 4,
        axisLabel: {
          show: true,
          formatter: (value: string) => {
            const date = new Date(value)
            const month = date.toLocaleString('en', { month: 'short' })
            const year = date.getFullYear()
            return date.getMonth() === 0 ? year.toString() : month
          },
          color: '#666'
        },
        axisTick: { show: false },
        axisLine: { show: true, lineStyle: { color: '#E5E5E5' } },
        splitLine: { show: true, lineStyle: { color: '#F5F5F5' } }
      }
    ],
    yAxis: [
      {
        type: 'value',
        gridIndex: 0,
        position: 'right',
        axisLabel: { color: '#666', fontSize: 11 },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: true, lineStyle: { color: '#F5F5F5' } },
        name: 'P/E - LTM',
        nameLocation: 'end',
        nameGap: 10,
        nameTextStyle: { color: '#666', fontSize: 12, align: 'right' }
      },
      {
        type: 'value',
        gridIndex: 1,
        position: 'right',
        axisLabel: { color: '#666', fontSize: 11 },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: true, lineStyle: { color: '#F5F5F5' } },
        name: 'P/B - LTM',
        nameLocation: 'end',
        nameGap: 10,
        nameTextStyle: { color: '#666', fontSize: 12, align: 'right' }
      },
      {
        type: 'value',
        gridIndex: 2,
        position: 'right',
        axisLabel: { color: '#666', fontSize: 11 },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: true, lineStyle: { color: '#F5F5F5' } },
        name: 'P/CF - LTM',
        nameLocation: 'end',
        nameGap: 10,
        nameTextStyle: { color: '#666', fontSize: 12, align: 'right' }
      },
      {
        type: 'value',
        gridIndex: 3,
        position: 'right',
        axisLabel: { color: '#666', fontSize: 11 },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: true, lineStyle: { color: '#F5F5F5' } },
        name: 'P/Sales - LTM',
        nameLocation: 'end',
        nameGap: 10,
        nameTextStyle: { color: '#666', fontSize: 12, align: 'right' }
      },
      {
        type: 'value',
        gridIndex: 4,
        position: 'right',
        axisLabel: { color: '#666', fontSize: 11 },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: true, lineStyle: { color: '#F5F5F5' } },
        name: 'Dividend Yield',
        nameLocation: 'end',
        nameGap: 10,
        nameTextStyle: { color: '#666', fontSize: 12, align: 'right' }
      }
    ],
    series: [
      {
        name: 'P/E - LTM',
        type: 'line',
        data: data1,
        xAxisIndex: 0,
        yAxisIndex: 0,
        showSymbol: false,
        lineStyle: { color: '#1E90FF', width: 1.5 },
        itemStyle: { color: '#1E90FF' }
      },
      {
        name: 'P/B - LTM',
        type: 'line',
        data: data2,
        xAxisIndex: 1,
        yAxisIndex: 1,
        showSymbol: false,
        lineStyle: { color: '#1E90FF', width: 1.5 },
        itemStyle: { color: '#1E90FF' }
      },
      {
        name: 'P/CF - LTM',
        type: 'line',
        data: data3,
        xAxisIndex: 2,
        yAxisIndex: 2,
        showSymbol: false,
        lineStyle: { color: '#1E90FF', width: 1.5 },
        itemStyle: { color: '#1E90FF' }
      },
      {
        name: 'P/Sales - LTM',
        type: 'line',
        data: data4,
        xAxisIndex: 3,
        yAxisIndex: 3,
        showSymbol: false,
        lineStyle: { color: '#1E90FF', width: 1.5 },
        itemStyle: { color: '#1E90FF' }
      },
      {
        name: 'Dividend Yield',
        type: 'line',
        data: data5,
        xAxisIndex: 4,
        yAxisIndex: 4,
        showSymbol: false,
        lineStyle: { color: '#1E90FF', width: 1.5 },
        itemStyle: { color: '#1E90FF' }
      }
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        link: [{ xAxisIndex: 'all' }]
      },
      formatter: (params: any) => {
        if (!Array.isArray(params) || params.length === 0) return ''
        const date = params[0].axisValue
        let result = `${date}<br/>`
        params.forEach((param: any) => {
          result += `${param.seriesName}: ${param.value.toFixed(2)}<br/>`
        })
        return result
      }
    },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1, 2, 3, 4],
        start: 0,
        end: 100
      },
      {
        type: 'slider',
        xAxisIndex: [0, 1, 2, 3, 4],
        start: 0,
        end: 100,
        bottom: 0,
        height: 20,
        borderColor: 'transparent',
        fillerColor: 'rgba(30, 144, 255, 0.2)',
        handleStyle: {
          color: '#1E90FF'
        }
      }
    ]
  }

  myChart.setOption(option)
  isInitialized = true

  // 调整图表尺寸
  setTimeout(() => {
    myChart?.resize()
  }, 100)
}

onMounted(() => {
  // 如果组件已经激活，直接初始化
  initChart()
})

onActivated(() => {
  // 在动态组件激活时初始化或调整尺寸
  if (isInitialized && myChart) {
    setTimeout(() => {
      myChart?.resize()
    }, 100)
  } else {
    initChart()
  }
})

onDeactivated(() => {
  // 组件失活时销毁图表实例释放资源
  if (myChart) {
    myChart.dispose()
    myChart = null
    isInitialized = false
  }
})
</script>

<style lang="scss" scoped>
.portfolio-characteristic {
  width: 100%;
  height: 100%;

  .chart-container {
    width: 100%;
    height: 800px;
  }
}
</style>
