<template>
  <div class="combo-position-feature">
    <div class="section-title" style="margin-bottom: 10px;">组合持股明细</div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      default-expand-all
      :header-cell-style="{
        // background: '#d7d9dc',
        color: '#333',
        height: '30px',
        padding: 0,
        fontSize: '16px',
      }"
      :cell-style="{ height: '30px', padding: 0, fontSize: '16px' }"
    >
      <el-table-column prop="stkCode" label="股票代码" />
      <el-table-column prop="stkName" label="股票名称" />
      <el-table-column prop="pport" label="组合权重（%）" />
      <!-- <el-table-column prop="pholdNumRatio" label="组合持股数量占比（%）" /> -->
    </el-table>
    <div style="display: flex; justify-content: flex-end; margin-top: 20px">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <div style="height: 30px"></div>
    <div class="section-title">市值分布</div>
    <div v-if="shizhiShow" id="shizhi" v-loading="shizhiChartLoading"></div>
    <el-empty v-else description="description" />
    <div style="height: 30px"></div>
    <div style="position: relative">
      <div class="section-title">行业分布</div>
      <div v-if="hangyeShow" id="hangye" style="width: 100%" v-loading="hangyeChartLoading"></div>
      <el-empty v-else description="description" />
      <div
        style="
          width: 120px;
          position: absolute;
          top: 0;
          left: calc(100% - 130px);
        "
      >
        <el-select
          v-model="industryType"
          placeholder="Select"
          @change="handleIndustryTypeChange"
        >
          <el-option value="GICS"></el-option>
          <el-option value="ICB"></el-option>
        </el-select>
      </div>
      <div id="diqu" style="width: 100%">
        <div class="section-title" style="margin-bottom: 10px;">地区分布</div>
        <CustomCharts v-show="sectorData.length > 0" :sectorData="sectorData" />
        <el-empty v-show="sectorData.length === 0" description="description" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import * as echarts from "echarts";
import CustomCharts from "@/components/CustomCharts.vue";
import {
  getPortfolioSimulatorHoldingsApi,
  getPortfolioSimulatorCapDistributionApi,
  getPortfolioSimulatorIndustryDistributionApi,
  getPortfolioSimulatorAreaDistributionApi,
} from "@/api/portfolioSimulator";

const props = defineProps<{
  etfList: Record<string, any>[];
  dayValue: string;
  analyzeBtnClick: boolean;
}>();

const emit = defineEmits<{
  "update:analyzeBtnClick": [value: boolean];
}>();
const etfCodesParams: string[] = [];
const weightsParams: number[] = [];

watch(
  () => props.analyzeBtnClick,
  function (newVal, oldVal) {
    if (newVal) {
      etfCodesParams.length = 0;
      weightsParams.length = 0;
      getComboPositionFeature();
      getComboPositionFeatureCapDistribution();
      getComboPositionFeatureIndustryDistribution();
      getComboPositionFeatureAreaDistribution();
      emit("update:analyzeBtnClick", false);
    }
  }
);

// 获取组合持股明细
function getComboPositionFeature() {
  tableLoading.value = true;
  props.etfList.forEach((item) => {
    etfCodesParams.push(item.code);
    weightsParams.push(item.ratio);
  });
  getPortfolioSimulatorHoldingsApi({
    etfCodes: etfCodesParams,
    baseDate: props.dayValue,
    weights: weightsParams,
    pageNum: currentPage.value,
    pageSize: pageSize.value,
  })
    .then((res) => {
      if (res.code === 200) {
        tableData.value = res.data.holdingsPage.list;
        total.value = res.data.holdingsPage.total;
      }
    })
    .finally(() => {
      tableLoading.value = false;
    });
}

const tableLoading = ref(false);
const tableData = ref([]);
// 分页相关
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
function handleSizeChange(val: number) {
  pageSize.value = val;
  etfCodesParams.length = 0;
  weightsParams.length = 0;
  getComboPositionFeature();
}
function handleCurrentChange(val: number) {
  currentPage.value = val;
  etfCodesParams.length = 0;
  weightsParams.length = 0;
  getComboPositionFeature();
}

const shizhiChartLoading = ref(false);
const shizhiShow = ref(false);
// 获取市值分布图表数据
function getComboPositionFeatureCapDistribution() {
  shizhiChartLoading.value = true;
  shizhiShow.value = true;
  getPortfolioSimulatorCapDistributionApi({
    etfCodes: etfCodesParams,
    baseDate: props.dayValue,
    weights: weightsParams,
  })
    .then((res) => {
      if (res.code === 200) {
        const yAxis = res.data.names;
        const seriesData = res.data.values;
        if (seriesData.length > 0) {
          initShizhiChart(yAxis, seriesData);
        }
      }
    })
    .finally(() => {
      shizhiChartLoading.value = false;
    });
}

const hangyeChartLoading = ref(false);
const hangyeShow = ref(false);
const industryType = ref<string>("GICS");
function handleIndustryTypeChange() {
  getComboPositionFeatureIndustryDistribution();
}
// 获取行业分布图表数据
function getComboPositionFeatureIndustryDistribution() {
  hangyeChartLoading.value = true;
  hangyeShow.value = true;
  getPortfolioSimulatorIndustryDistributionApi({
    etfCodes: etfCodesParams,
    baseDate: props.dayValue,
    weights: weightsParams,
  })
    .then((res) => {
      if (res.code === 200) {
        if (industryType.value === "GICS") {
          const yAxis = res.data.gicsData.names;
          const seriesData1 = res.data.gicsData.currentValues;
          const seriesData2 = res.data.gicsData.lastValues;
          if (yAxis.length > 0) {
            initHangyeChart(yAxis, seriesData1, seriesData2);
          }else{
            hangyeShow.value = false;
          }
        } else if (industryType.value === "ICB") {
          const yAxis = res.data.icbData.names;
          const seriesData1 = res.data.icbData.currentValues;
          const seriesData2 = res.data.icbData.lastValues;
          if (yAxis.length > 0) {
            initHangyeChart(yAxis, seriesData1, seriesData2);
          }else{
            hangyeShow.value = false;
          }
        }
      }
    })
    .finally(() => {
      hangyeChartLoading.value = false;
    });
}

function getComboPositionFeatureAreaDistribution() {
  getPortfolioSimulatorAreaDistributionApi({
    etfCodes: etfCodesParams,
    baseDate: props.dayValue,
    weights: weightsParams,
  }).then((res) => {
    if (res.code === 200) {
      sectorData.value = res.data.areaDistributionList;
    }
  });
}
const sectorData = ref([]);

onMounted(() => {
  window.addEventListener("resize", resizeChart);
});

onUnmounted(() => {
  disposeCharts();
});

let shizhiChart: echarts.ECharts | null = null;
let hangyeChart: echarts.ECharts | null = null;
function initHangyeChart(
  yAxis: string[],
  seriesData1: number[],
  seriesData2: number[]
) {
  hangyeChart = echarts.init(document.getElementById("hangye"));
  hangyeChart.setOption({
    // title: {
    //   text: "行业分布",
    // },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: (params: any) => {
        let html = `${params[0].name}`
        params.forEach((item: any) => {
          html += `<br/>${item.marker}${item.seriesName}: ${item.value.toFixed(2)}%`
        })
        return html
      },
    },
    // legend: {},
    grid: {
      left: "10%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.1],
      show: false,
    },

    yAxis: {
      type: "category",
      data: yAxis,
      axisLabel: {
        fontSize: 12,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    series: [
      {
        name: "本期占比",
        type: "bar",
        barGap: 0,
        barWidth: 25,
        data: seriesData1,
        label: {
          show: true,
          position: "right",
          valueAnimation: true,
          formatter: (params: any) => `${params.value.toFixed(2)}%`,
        },
      },
      {
        name: "上期占比",
        type: "bar",
        barWidth: 25,
        data: seriesData2,
        label: {
          show: true,
          position: "right",
          valueAnimation: true,
          formatter: (params: any) => `${params.value.toFixed(2)}%`,
        },
      },
    ],
  });
}

function initDiquChart() {}

function initShizhiChart(yAxis: string[], seriesData: number[]) {
  shizhiChart = echarts.init(document.getElementById("shizhi"));
  shizhiChart.setOption({
    // title: {
    //   text: "市值分布",
    // },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: (params: any) => {
        const item = params[0]
        return `${item.name}: ${item.value.toFixed(2)}%`
      },
    },
    // legend: {},
    grid: {
      left: "10%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.1],
      show: false,
    },

    yAxis: {
      type: "category",
      data: yAxis,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    series: [
      {
        type: "bar",
        barGap: 0,
        barWidth: 30,
        data: seriesData,
        label: {
          show: true,
          position: "right",
          valueAnimation: true,
          formatter: (params: any) => `${params.value.toFixed(2)}%`,
        },
      },
    ],
  });
}
function resizeChart() {
  const charts = [shizhiChart, hangyeChart];
  charts.forEach((chart) => {
    if (chart) {
      chart.resize();
    }
  });
}
function disposeCharts() {
  const charts = [shizhiChart, hangyeChart];
  charts.forEach((chart) => {
    if (chart) {
      chart.dispose();
      chart = null;
    }
  });
}
</script>

<style lang="scss" scoped>
.combo-position-feature {
  width: 100%;
  .section-title {
    font-weight: 600;
    font-size: var(--font-size-extra-large);
  }
  #shizhi,
  #hangye,
  #diqu {
    width: 100%;
    height: 400px;
  }
  #hangye {
    height: 800px;
  }
}
</style>
