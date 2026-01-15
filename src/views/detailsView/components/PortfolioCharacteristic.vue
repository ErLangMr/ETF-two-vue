<template>
  <div class="portfolio-characteristic">
    <div v-loading="loading" id="portfolio-characteristic-chart"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted, onActivated, onDeactivated, watch, nextTick, onUnmounted } from 'vue'
import { getPortfolioChartApi } from '@/api/filterDetails'


const props = defineProps<{
  tabActiveName: string,
  code: string
}>()

watch(() => props.tabActiveName, (newVal) => {
  if (newVal === 'PortfolioCharacteristic') {
    nextTick(() => {
      getPortfolioChart()
    })
  }
})
const loading = ref(false)

let myChart: echarts.ECharts | null = null

function getPortfolioChart() {
  loading.value = true
  return getPortfolioChartApi({etfCode: props.code }).then(res => {
    console.log(res)
    initChart(res.xaxis || [], res.series || [])
  }).finally(() => {
    loading.value = false
  })
}

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
  console.log(dates, data1, data2, data3, data4, data5)
  return { dates, data1, data2, data3, data4, data5 }
}

const initChart = (xaxis: string[], series: any[]) => {
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
  // const { dates, data1, data2, data3, data4, data5 } = generateMockData()
  myChart = echarts.init(document.getElementById("portfolio-characteristic-chart"))

  const option: echarts.EChartsOption = {
    grid: [
      { left: '5%', right: '5%', top: '3%', height: '12%' },
      { left: '5%', right: '5%', top: '19%', height: '12%' },
      { left: '5%', right: '5%', top: '35%', height: '12%' },
      { left: '5%', right: '5%', top: '51%', height: '12%' },
      { left: '5%', right: '5%', top: '67%', height: '12%' },
      { left: '5%', right: '5%', top: '83%', height: '12%' },
    ],
    xAxis: [
      {
        type: 'category',
        data: xaxis,
        gridIndex: 0,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: true, lineStyle: { color: '#E5E5E5' } },
        splitLine: { show: true, lineStyle: { color: '#F5F5F5' } }
      },
      {
        type: 'category',
        data: xaxis,
        gridIndex: 1,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: true, lineStyle: { color: '#E5E5E5' } },
        splitLine: { show: true, lineStyle: { color: '#F5F5F5' } }
      },
      {
        type: 'category',
        data: xaxis,
        gridIndex: 2,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: true, lineStyle: { color: '#E5E5E5' } },
        splitLine: { show: true, lineStyle: { color: '#F5F5F5' } }
      },
      {
        type: 'category',
        data: xaxis,
        gridIndex: 3,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: true, lineStyle: { color: '#E5E5E5' } },
        splitLine: { show: true, lineStyle: { color: '#F5F5F5' } }
      },
      {
        type: 'category',
        data: xaxis,
        gridIndex: 4,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: true, lineStyle: { color: '#E5E5E5' } },
        splitLine: { show: true, lineStyle: { color: '#F5F5F5' } }
      },
      {
        type: 'category',
        data: xaxis,
        gridIndex: 5,
        axisLabel: {
          show: true,
          // formatter: (value: string) => {
          //   const date = new Date(value)
          //   const month = date.toLocaleString('en', { month: 'short' })
          //   const year = date.getFullYear()
          //   return date.getMonth() === 0 ? year.toString() : month
          // },
          // color: '#666'
        },
        axisTick: { show: true },
        // axisLine: { show: true, lineStyle: { color: '#E5E5E5' } },
        // splitLine: { show: true, lineStyle: { color: '#F5F5F5' } }
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
        name: series[0]?.name,
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
        name: series[1]?.name,
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
        name: series[2]?.name,
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
        name: series[3]?.name,
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
        name: series[4]?.name,
        nameLocation: 'end',
        nameGap: 10,
        nameTextStyle: { color: '#666', fontSize: 12, align: 'right' }
      },
      {
        type: 'value',
        gridIndex: 5,
        position: 'right',
        axisLabel: { color: '#666', fontSize: 11 },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: true, lineStyle: { color: '#F5F5F5' } },
        name: series[5]?.name,
        nameLocation: 'end',
        nameGap: 10,
        nameTextStyle: { color: '#666', fontSize: 12, align: 'right' }
      }
    ],
    series: [
      {
        name: series[0]?.name,
        type: 'line',
        data: series[0]?.data,
        xAxisIndex: 0,
        yAxisIndex: 0,
        showSymbol: false,
        lineStyle: { color: '#1E90FF', width: 1.5 },
        itemStyle: { color: '#1E90FF' }
      },
      {
        name: series[1]?.name,
        type: 'line',
        data: series[1]?.data,
        xAxisIndex: 1,
        yAxisIndex: 1,
        showSymbol: false,
        lineStyle: { color: '#1E90FF', width: 1.5 },
        itemStyle: { color: '#1E90FF' }
      },
      {
        name: series[2]?.name,
        type: 'line',
        data: series[2]?.data,
        xAxisIndex: 2,
        yAxisIndex: 2,
        showSymbol: false,
        lineStyle: { color: '#1E90FF', width: 1.5 },
        itemStyle: { color: '#1E90FF' }
      },
      {
        name: series[3]?.name,
        type: 'line',
        data: series[3]?.data,
        xAxisIndex: 3,
        yAxisIndex: 3,
        showSymbol: false,
        lineStyle: { color: '#1E90FF', width: 1.5 },
        itemStyle: { color: '#1E90FF' }
      },
      {
        name: series[4]?.name,
        type: 'line',
        data: series[4]?.data,
        xAxisIndex: 4,
        yAxisIndex: 4,
        showSymbol: false,
        lineStyle: { color: '#1E90FF', width: 1.5 },
        itemStyle: { color: '#1E90FF' }
      },
      {
        name: series[5]?.name,
        type: 'line',
        data: series[5]?.data,
        xAxisIndex: 5,
        yAxisIndex: 5,
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
        xAxisIndex: [0, 1, 2, 3, 4, 5],
        start: 0,
        end: 100
      },
      {
        type: 'slider',
        xAxisIndex: [0, 1, 2, 3, 4, 5],
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
}

onMounted(() => {
  window.addEventListener('resize', resizeChart)
})

function resizeChart() {
  if (myChart) {
    myChart.resize();
  }
}

onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
});
onMounted(() => {
  window.addEventListener("resize", resizeChart);
});

</script>

<style lang="scss" scoped>
.portfolio-characteristic {
  width: 100%;
  height: 100%;

  #portfolio-characteristic-chart {
      width: 100%;
      height: 1000px;
    }
}
</style>
