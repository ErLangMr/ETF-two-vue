<template>
  <div class="performance">
    <h2 class="h3">{{ code }} 业绩表现</h2>
    <p>本节展示此ETF相对于同类ETF的表现。一年期回报率为年化回报率。</p>
    <EtfCompareTable :columns="columns" :data="data" />
  </div>
</template>

<script setup lang="ts">
import EtfCompareTable from "@/components/EtfCompareTable.vue";
import { getPerformanceDataApi } from "@/api/details";
import { ref, onMounted } from "vue";

const props = defineProps<{
  code: any;
}>();

const data = ref<any[]>([]);

onMounted(() => {
  getPerformanceDataApi(props.code).then((res) => {
    Object.keys(res).forEach((key) => {
      if(key === 'monthlyReturns') {
        data.value.push({
          time: '近一个月',
          ETF: res[key],
          ETFRoute: res['monthlyReturnsAverage']
        });
      } else if(key === 'threeMonthReturns') {
        data.value.push({
          time: '近三个月',
          ETF: res[key],
          ETFRoute: res['threeMonthReturnsAverage']
        });
      } else if(key === 'ytdReturns') {
        data.value.push({
          time: '今年以来回报',
          ETF: res[key],
          ETFRoute: res['ytdReturnsAverage']
        });
      } else if(key === 'yearlyReturns') {
        data.value.push({
          time: '近一年',
          ETF: res[key],
          ETFRoute: res['yearlyReturnsAverage']
        });
      } else if(key === 'threeYearReturns') {
        data.value.push({
          time: '近三年',
          ETF: res[key],
          ETFRoute: res['threeYearReturnsAverage']
        });
      } else if(key === 'fiveYearReturns') {
        data.value.push({
          time: '近五年',
          ETF: res[key],
          ETFRoute: res['fiveYearReturnsAverage']
        });
      }
    });
  });
});

const columns = [
  { key: 'time', label: '' },
  { key: 'ETF', label: '单只 ETF' },
  { key: 'ETFRoute', label: '追踪同一指数的 ETF 平均回报' },
];
</script>

<style scoped lang="scss">
.performance {
  width: 100%;
  height: 100%;
}
</style>
