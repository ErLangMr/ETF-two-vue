<template>
  <div class="indexSnapshot">
    <div class="indexSnapshot-container">
      <!-- 第一行 -->
      <div class="row">
        <div class="block">
          <div class="section-title">基本信息</div>
          <div class="info-list">
            <div class="info-row">
              <span>基日</span
              ><span
                class="linkStyle"
                @click.stop="clickVitals(props.detailsData?.fundInfoByVitals)"
                >{{ props.detailsData?.fundInfoByVitals?.fundMgrs }}</span
              >
            </div>
            <div class="info-row">
              <span>基点</span
              ><span
                class="linkStyle"
                @click.stop="clickVitals(props.detailsData?.fundInfoByVitals)"
                >{{ props.detailsData?.fundInfoByVitals?.shortName }}</span
              >
            </div>
            <div class="info-row">
              <span>发布日期</span>
              <span>{{
                formatValue(props.detailsData?.fundInfoByVitals?.fee, "percent")
              }}</span>
            </div>
            <div class="info-row">
              <span>发布机构</span>
              <span>{{ props.detailsData?.fundInfoByVitals?.setupDate }}</span>
            </div>
            <div class="info-row">
              <span>加权方式</span>
              <span>{{
                props.detailsData?.fundInfoByVitals?.trackIndexName
              }}</span>
            </div>
            <div class="info-row">
              <span>收益处理方式</span>
              <span>{{
                props.detailsData?.fundInfoByVitals?.trackIndexName
              }}</span>
            </div>
          </div>
        </div>
        <div class="block">
          <div class="section-title">交易信息</div>
          <div class="info-list">
            <div class="info-row">
              <span>最新交易日</span
              ><span>
                {{
                  categoryList.find(
                    (item) =>
                      item.value ===
                      props.detailsData?.fundInfoByThemes?.category
                  )?.label
                }}
              </span>
            </div>
            <div class="info-row">
              <span>最新收盘价</span
              ><span>
                {{ props.detailsData?.fundInfoByThemes?.styleAttribute }}
              </span>
            </div>
            <div class="info-row">
              <span>总市值（万亿元）</span
              ><span>
                {{ props.detailsData?.fundInfoByThemes?.compMarketCap }}
              </span>
            </div>
            <div class="info-row">
              <span>自由流通市值（万亿元）</span
              ><span>
                {{ props.detailsData?.fundInfoByThemes?.investStrategy }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="snapshot_ProductOverview">
        <h4>挂钩产品概览</h4>
        <div class="snapshot_ProductOverview_list">
          <div>
            <p>ETF 产品数量</p>
            <p>
              <span>43</span
              ><span style="font-weight: 400; font-size: 14px">只</span>
            </p>
          </div>
          <div>
            <p>ETF 产品规模</p>
            <p>
              <span>43.2838</span
              ><span style="font-weight: 400; font-size: 14px">亿元</span>
            </p>
          </div>
          <div>
            <p>ETF 净流入</p>
            <p>
              <span>-43.2838</span
              ><span style="font-weight: 400; font-size: 14px">亿元</span>
            </p>
          </div>
        </div>
      </div>
      <div style="display: flex">
        <div id="indexSnapshotOneChart"></div>
        <div id="indexSnapshotTwoChart"></div>
      </div>
      <div>
        <el-table
          :data="tableData"
          :header-cell-style="{ background: '#d7d9dc', color: '#333' }"
          style="width: 100%"
        >
          <el-table-column prop="type" label="" width="180" />
          <el-table-column prop="shortName" label="简称" width="180" />
          <el-table-column prop="fee" label="费用率(%)" />
          <el-table-column
            prop="totalMarketValue"
            label="基金规模(百万元)"
            unit="million"
          />
          <el-table-column
            prop="avgDailyVolumeForYear"
            label="日均成交额(百万元)"
            unit="million"
          />
          <el-table-column prop="ytdReturns" label="年初至今回报(%)" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import * as echarts from "echarts";
import { formatValue } from "@/utils/formatValue";
import { nextTick, onUnmounted, ref, watch } from "vue";

const router = useRouter();
const props = defineProps({
  detailsData: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const categoryList = ref([
  { label: "股票", value: "EQUITY" },
  { label: "债券", value: "BOND" },
  { label: "商品", value: "GOODS" },
  { label: "货币", value: "CURRENCY" },
  { label: "跨境", value: "CROSS_BOUNDARY" },
]);

function clickVitals(data: any) {
  router.push({
    path: "/proshares",
    query: {
      issuer: JSON.stringify(data),
    },
  });
}

watch(
  () => props.detailsData,
  (newVal) => {
    if (newVal) {
      if (newVal.fundInfoByIndexData) {
        tableData.value = [];
        Object.keys(newVal.fundInfoByIndexData).forEach((key) => {
          let typeName = "";
          if (key === "bestReturn") {
            typeName = "年初至今回报最高";
          } else if (key === "highestVolume") {
            typeName = "流动性最高";
          } else if (key === "largestSize") {
            typeName = "规模最大";
          } else if (key === "lowestFee") {
            typeName = "费用最低";
          }
          tableData.value.push({
            type: typeName,
            shortName: newVal.fundInfoByIndexData[key].shortName,
            fee: newVal.fundInfoByIndexData[key].fee,
            totalMarketValue: newVal.fundInfoByIndexData[key].totalMarketValue,
            avgDailyVolumeForYear:
              newVal.fundInfoByIndexData[key].avgDailyVolumeForYear,
            ytdReturns: newVal.fundInfoByIndexData[key].ytdReturns,
          });
        });
      }
    }
  }
);

const columns = [
  { key: "type", label: "类型" },
  {
    key: "shortName",
    label: "简称",
    // isLink: true,
    // onClick: (symbol: string) => {
    //   router.push(`/details?symbol=${symbol}`);
    // },
  },
  { key: "fee", label: "费用率(%)" },
  { key: "totalMarketValue", label: "基金规模(百万元)", unit: "million" },
  {
    key: "avgDailyVolumeForYear",
    label: "日均成交额(百万元)",
    unit: "million",
  },
  { key: "ytdReturns", label: "年初至今回报(%)" },
];

const tableData = ref<Record<string, any>[]>([]);

let indexSnapshotOneChart: echarts.ECharts | null = null;
let indexSnapshotTwoChart: echarts.ECharts | null = null;
function getChartData() {
  disposeCharts();
  indexSnapshotOneChart = echarts.init(
    document.getElementById("indexSnapshotOneChart") as HTMLElement
  );
  indexSnapshotTwoChart = echarts.init(
    document.getElementById("indexSnapshotTwoChart") as HTMLElement
  );
  initChart(indexSnapshotOneChart);
  initTwoChart(indexSnapshotTwoChart);
}
function initChart(myChart: echarts.ECharts) {
  myChart.setOption({
    title: {
      text: "ETF规模",
      left: "3%",
      top: "3%",
    },
    grid: {
      left: "8%",
      right: "9%",
      top: "15%",
    },
    xAxis: {
      type: "category",
      data: [
        "动量因子",
        "投资因子",
        "盈利因子",
        "价值因子",
        "规模因子",
        "市场因子",
      ],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        stack: "total",
        barWidth: "60%",
        type: "bar",
      },
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        stack: "total",
        barWidth: "60%",
        type: "bar",
      },
    ],
  });
}
function initTwoChart(chart: echarts.ECharts) {
  chart.setOption({
    title: {
      text: "ETF份额（万份）",
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
        "ten",
        "nine",
        "eight",
        "seven",
        "six",
        "five",
        "four",
        "three",
        "two",
        "one",
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
      {
        data: [0.6, 0.3, -0.4, 0.5, -0.4, 0.6, -0.2, 0.3, -0.7, 0.3],
        symbol: 'none',
        type: "line",
      },
    ],
    graphic:
      [1, 2, 3].length === 0
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
watch(
  () => props.detailsData,
  () => {
    nextTick(() => {
      getChartData();
    });
  }
);
function disposeCharts() {
  const charts = [indexSnapshotOneChart, indexSnapshotTwoChart];

  charts.forEach((chart) => {
    if (chart) {
      chart.dispose();
      chart = null;
    }
  });
}

function resizeChart() {
  const charts = [indexSnapshotOneChart, indexSnapshotTwoChart];

  charts.forEach((chart) => {
    if (chart) {
      chart.resize();
    }
  });
}
window.addEventListener("resize", resizeChart);
onUnmounted(() => {
  window.removeEventListener("resize", resizeChart);
  disposeCharts();
});
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;
.indexSnapshot {
  background: #fff;
  color: #222;
  font-size: var(--font-size-base);
}
.indexSnapshot-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
#detailOneEcart {
  width: 100%;
  height: 400px;
}
.row {
  display: flex;
  gap: 62px;
}
.block {
  flex: 1;
  min-width: 0;
}
.section-title {
  font-weight: 600;
  font-size: var(--font-size-base);
  margin-bottom: 10px;
  color: #222;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.analyst-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.info-list {
  border-radius: 0;
  border: none;
  background: none;
  padding: 0;
}
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 0;
  border-bottom: 1px solid #ececec;
  font-size: var(--font-size-base);
}
.info-row:last-child {
  border-bottom: none;
}
.info-row span:first-child {
  color: #333;
}
.info-row .link {
  color: var(--theme-purple);
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}

.fa-report-btn {
  background: var(--theme-purple);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 7px 18px;
  font-weight: 600;
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: background 0.2s;
  margin-left: 10px;
}
.fa-report-btn:hover {
  background: var(--theme-purple);
}
.analyst-content {
  color: #444;
  font-size: var(--font-size-base);
  line-height: 1.7;
  margin-bottom: 4px;
}
.see-more {
  color: var(--theme-purple);
  cursor: pointer;
  margin-left: 6px;
  font-size: var(--font-size-base);
}
.snapshot_ProductOverview {
  width: 100%;
  height: 130px;
  border: 1px solid #ececec;
  h4 {
    height: 35px;
    line-height: 35px;
    padding: 0 20px;
    border-bottom: 1px solid #ececec;
  }
  .snapshot_ProductOverview_list {
    display: flex;
    justify-content: space-around;
    height: calc(130px - 35px);
    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }
  }
}
#indexSnapshotOneChart,
#indexSnapshotTwoChart {
  width: 50%;
  height: 400px;
}
@media (max-width: 768px) {
  .row {
    flex-direction: column;
    gap: 0;
  }
  .block {
    margin-bottom: 40px;
  }
}
</style>
