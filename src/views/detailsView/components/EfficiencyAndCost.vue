<template>
  <div class="efficiency-and-cost-container">
    <div style="display: flex; justify-content: end;align-items: center;">
      <PeriodSelector
        v-model="activeBtn"
        :options="periodOptions"
        prefix="过去"
        suffix=""
        @change="handleChange"
      />
      <el-date-picker
        v-model="dateFilter"
        type="date"
        value-format="YYYY-MM-DD"
        style="margin-left: 20px"
        placeholder="选择日期"
        @change="dateFilterChange"
      />
    </div>
    <div style="display: flex; gap: 62px">
      <div class="block">
        <div class="section-title">效率和成本</div>
        <div class="info-list">
          <div class="info-row">
            <span>交易金额（百万元）</span><span>{{ formatValue(infoData.amount) }}</span>
          </div>
          <div class="info-row">
            <span>折溢价率</span><span>{{ formatValue(infoData.cover) }}</span>
          </div>
          <div class="info-row">
            <span>托管费率</span>
            <span>{{ formatValue(infoData.custodianFee) }}</span>
          </div>
          <div class="info-row">
            <span>跟踪偏离度</span>
            <span>{{ formatValue(infoData.dev) }}</span>
          </div>
          <div class="info-row">
            <span>查询维度（月）</span>
            <span>{{ formatValue(infoData.dimension) }}</span>
          </div>
          <div class="info-row">
            <span>管理费率</span>
            <span>{{ formatValue(infoData.managementFee) }}</span>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="section-title"></div>
        <div class="info-list">
          <div class="info-row">
            <span>申购费率</span><span>{{ formatValue(infoData.subscriptionFee) }}</span>
          </div>
          <div class="info-row">
            <span>总费率</span><span>{{ formatValue(infoData.totalFee) }}</span>
          </div>
          <div class="info-row">
            <span>跟踪误差</span>
            <span>{{ formatValue(infoData.trackingError) }}</span>
          </div>
          <div class="info-row">
            <span>换手率</span>
            <span>{{ formatValue(infoData.turnover) }}</span>
          </div>
          <div class="info-row">
            <span>交易量（百万份）</span>
            <span>{{ formatValue(infoData.volume) }}</span>
          </div>
          <div class="info-row">
            <span>赎回费率</span>
            <span>{{ formatValue(infoData.redemptionFee) }}</span>
          </div>
          <div class="info-row">
            <span>销售服务费率</span>
            <span>{{ formatValue(infoData.salesServiceFee) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div id="efficiency-and-cost-chart"></div>
  </div>
</template>

<script setup lang="ts">
import { formatValue } from "@/utils/formatValue";
import * as echarts from "echarts";
import { nextTick, onUnmounted, ref, watch } from "vue";
import {
  getEfficiencyAndCostInfoApi,
  getEfficiencyAndCostLineApi,
} from "@/api/filterDetails";
import PeriodSelector from "@/components/PeriodSelector.vue";

const props = defineProps<{
  tabActiveName: string;
  code: string;
}>();

watch(
  () => props.tabActiveName,
  (val) => {
    if (val === "EfficiencyAndCost") {
      nextTick(() => {
        getData();
        getLineData();
      });
    }
  },
  { immediate: true }
);

function dateFilterChange() {
  getData();
  getLineData();
}

const dateFilter = ref('');
interface PeriodOption {
  label: string;
  value: string;
}
const activeBtn = ref("1");
const periodOptions: PeriodOption[] = [
  { label: "1 个月", value: "1" },
  { label: "3 个月", value: "3" },
  { label: "6 个月", value: "6" },
  { label: "1 年", value: "12" },
  { label: "3 年", value: "36" },
  { label: "5 年", value: "60" },
];
const infoData = ref<Record<string, any>>({});
function getData() {
  getEfficiencyAndCostInfoApi({
    code: props.code,
    dimension: activeBtn.value || null,
    date: dateFilter.value || null,
  }).then((res) => {
    infoData.value = res;
  });
}

function getLineData() {
  // 显示 loading
  if (myChart) {
    myChart.showLoading({
      text: '加载中...',
      // color: '#4a90e2',
      // textColor: '#333',
      // maskColor: 'rgba(255, 255, 255, 0.8)',
      // zlevel: 0
    });
  }

  getEfficiencyAndCostLineApi({
    code: props.code,
    date: dateFilter.value || null,
  }).then((res) => {
    // 隐藏 loading
    if (myChart) {
      myChart.hideLoading();
    }
    initChart(res.months, res.trackingErrors);
  }).catch(() => {
    // 出错时隐藏 loading 并显示无数据
    if (myChart) {
      myChart.hideLoading();
    }
    initChart([], []);
  });
}

const handleChange = (type: string) => {
  console.log(type);
  activeBtn.value = type;
  getData();
};

let myChart: echarts.ECharts | null = null;
function initChart(XData: string[], YData: number[]) {
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
  myChart = echarts.init(document.getElementById("efficiency-and-cost-chart"));

  const hasData = XData && XData.length > 0 && YData && YData.length > 0;

  myChart.setOption({
    title: {
      text: "月度跟踪误差",
    },
    grid: {
      top: "15%",
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: XData || [],
    },
    yAxis: {
      type: "value",
    },
    series: hasData ? [
      {
        data: YData,
        type: "line",
        showSymbol: false,
        lineStyle: {
          color: "#4a90e2",
        },
        areaStyle: {
          color: "rgba(74, 144, 226, 0.5)",
        },
      },
    ] : [],
    graphic: hasData ? [] : {
      type: 'text',
      left: 'center',
      top: 'middle',
      style: {
        text: '暂无数据',
        fontSize: 16,
        fill: '#999'
      }
    }
  });
}

function clickVitals(type: string) {
  console.log(type);
}
function resizeChart() {
  if (myChart) {
    myChart.resize();
  }
}
window.addEventListener("resize", resizeChart);
onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
});
</script>

<style lang="scss" scoped>
@use "@/styles/variables.scss" as *;
.efficiency-and-cost-container {
  height: 100%;
  #efficiency-and-cost-chart {
    width: 100%;
    height: 400px;
  }
}
</style>
