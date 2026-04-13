<template>
  <div class="index-feature">
    <div style="text-align: right">
      <el-date-picker
        v-model="dateValue"
        value-format="YYYY-MM-DD"
        type="date"
        placeholder="选择日期"
        style="margin-bottom: 10px"
        @change="baseDataDateChange"
      />
    </div>
    <div class="block" v-loading="loading">
      <!-- <div class="section-title">所属类型</div> -->
      <div class="info-list">
        <div class="info-row">
          <span>所属类型（股票、债券、商品、货币）</span>
          <span>{{ formatValue(indexFeatureData.typeI) }}</span>
        </div>
        <div class="info-row">
          <span>成份证券数量</span>
          <span>{{ formatValue(indexFeatureData.stkNum) }}</span>
        </div>
        <div class="info-row">
          <span>指数市值（亿元）</span>
          <span>{{ formatValue(indexFeatureData.tmv) }}</span>
        </div>
        <div class="info-row">
          <span>指数流通A股市值（亿元）</span><span>{{ formatValue(indexFeatureData.tamv) }}</span>
        </div>
        <div class="info-row">
          <span>总市值全市场覆盖率（%）</span>
          <span>{{ formatValue(indexFeatureData.tmvCr, "percent") }}</span>
        </div>
        <div class="info-row">
          <span>流通A股市值全市场覆盖率（%）</span><span>{{ formatValue(indexFeatureData.tamvCr, "percent") }}</span>
        </div>
        <div class="info-row">
          <span>样本平均流通A股市值（亿元）</span><span>{{ formatValue(indexFeatureData.aamv) }}</span>
        </div>
        <!-- <div class="info-row">
          <span>指数代码</span><span>{{ indexFeatureData.indexCode }}</span>
        </div>
        <div class="info-row">
          <span>指数名称</span>
          <span>{{ indexFeatureData.indexName }}</span>
        </div> -->
        <div class="info-row">
          <span>样本流通A股市值中位数（亿元）</span>
          <span>{{ formatValue(indexFeatureData.mamv) }}</span>
        </div>
      </div>
    </div>
    <!-- <div class="row">
      <div class="block">
        <div class="section-title">所属类型</div>
        <div class="info-list">
          <div class="info-row">
            <span>资产类别</span><span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>投资区域</span><span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>所属行业</span>
            <span>{{ formatValue(29.9999, "percent") }}</span>
          </div>
          <div class="info-row">
            <span>市值标签</span>
            <span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>风格标签</span>
            <span>{{ "val" }}</span>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="section-title">指数特征</div>
        <div class="info-list">
          <div class="info-row">
            <span>样本数量</span><span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>A股自由流通市值（万亿元）</span><span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>占A股市场覆盖率</span>
            <span>{{ formatValue(29.9999, "percent") }}</span>
          </div>
          <div class="info-row">
            <span>平均A股自由流通市值（亿元）</span>
            <span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>A股自由流通市值中位数（亿元）</span>
            <span>{{ "val" }}</span>
          </div>
        </div>
      </div>
    </div> -->
    <div id="indexFeatureChart" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<script setup lang="ts">
import { formatValue } from "@/utils/formatValue";
import * as echarts from "echarts";
import { nextTick, onUnmounted, ref, watch } from "vue";
import { getIndexCharacteristicsApi } from "@/api/trackingIndex";

const props = defineProps<{
  tabActiveName: string
  code: string
}>();
let myChart: echarts.ECharts | null = null;
function initChart() {
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
  myChart = echarts.init(
    document.getElementById("indexFeatureChart") as HTMLElement
  );
  myChart.setOption({
    //   title: {
    //   text: '业绩表现'
    // },
    tooltip: {
      trigger: "axis",
    },

    legend: {
      orient: "horizontal",
      left: "center",
      bottom: "1%",
    },
    grid: {
      top: "10%",
      left: "3%",
      right: "4%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Email",
        type: "line",
        showSymbol: false,
        symbol: "none",
        // smooth: true,
        data: [310, 232, 201, 134, 90, 40, 10],
      },
      {
        name: "Union Ads",
        type: "line",
        showSymbol: false,
        symbol: "none",
        // smooth: true,
        data: [20, 82, 131, 200, 260, 290, 310],
      }
    ],
  });
}

const dateValue = ref("");
const loading = ref(false);
watch(
  () => props.tabActiveName,
  (newVal) => {
    if (newVal === "IndexFeature") {
      nextTick(() => {
        getIndexCharacteristics();
      });
    }
  },
  { immediate: true }
);
const indexFeatureData = ref<Record<string, any>>({});
function getIndexCharacteristics() {
  loading.value = true;
  getIndexCharacteristicsApi({
    code: props.code,
    date: dateValue.value,
  }).then((res) => {
    indexFeatureData.value = res;
    loading.value = false;
  }).finally(() => {
    loading.value = false;
  });
}

function baseDataDateChange() {
  getIndexCharacteristics();
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
.index-feature {
  width: 100%;
  height: 100%;
}
</style>
