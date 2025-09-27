<template>
  <div class="holding-analysis-chart">
    <h2 class="h3">Geographic Exposure</h2>
    <p style="margin-bottom: 40px;">The following charts reflect the geographic spread of IVV's underlying holdings.</p>
    <div class="chart-item">
      <CustomCharts :sectorData="sectorData" :active="componentName === '持股分析图表'" :title="title" />
    </div>
    <div class="chart-item">
      <CustomCharts :sectorData="sectorData" :active="componentName === '持股分析图表'" :title="title" />
    </div>
    <div class="chart-item">
      <CustomCharts :sectorData="sectorData" :active="componentName === '持股分析图表'" :title="title" />
    </div>
    <div class="chart-item">
      <CustomCharts :sectorData="sectorData" :active="componentName === '持股分析图表'" :title="title" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import CustomCharts from '@/components/CustomCharts.vue'
const props = defineProps<{
  tabActiveName: string
}>()
const componentName = ref('')
watch(() => props.tabActiveName, (newVal) => {
  if (newVal === '持股分析图表') {
    nextTick(() => {
      componentName.value = '持股分析图表'
    })
  }
}, { immediate: true });
const title = ref('Region\nBreakdown')
const sectorData = ref([
{ name: 'Electronic Technology', value: 21.94 },
  { name: 'Technology Services', value: 20.78 },
  { name: 'Finance', value: 15.21 },
  { name: 'Retail Trade', value: 8.18 },
  { name: 'Health Technology', value: 7.54 },
  { name: 'Consumer Non-Durables', value: 3.85 },
  { name: 'Producer Manufacturing', value: 3.34 },
  { name: 'Consumer Services', value: 3.02 },
  { name: 'Utilities', value: 2.48 },
  { name: 'Energy Minerals', value: 2.45 },
  { name: 'Consumer Durables', value: 2.43 },
  { name: 'Transportation', value: 1.55 },
  { name: 'Process Industries', value: 1.48 },
  { name: 'Commercial Services', value: 1.08 },
  { name: 'Health Services', value: 1.32 },
  { name: 'Communications', value: 0.97 },
  { name: 'Industrial Services', value: 0.93 },
  { name: 'Distribution Services', value: 0.66 },
  { name: 'Non-Energy Minerals', value: 0.45 },
  { name: 'CASH', value: 0.22 },
  { name: 'Miscellaneous', value: 0.05 }
])
</script>

<style scoped lang="scss">
.holding-analysis-chart {
  width: 100%;
  height: 100%;
  background: #fff;
  .h3 {
    font-size: var(--font-size-title);
  }
  .chart-item {
    padding-bottom: 20px;
    margin-bottom: 40px;
    border-bottom: 1px solid #e5e5e5;
  }
}
</style>
