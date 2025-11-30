<template>
  <div class="stock-profile-price">
    <div class="stock-profile-price-container">
      <!-- 第一行 -->
      <div class="row">
        <div class="block">
          <div class="section-title">基本信息</div>
          <div class="info-list">
            <div class="info-row">
              <span>成立日期</span
              ><span>{{ formatDate(detailsData?.inceptionDate) }}</span>
            </div>
            <div class="info-row">
              <span>基金公司</span
              ><span>{{ formatValue(detailsData?.issuer) }}</span>
            </div>
            <div class="info-row">
              <span>指数名称</span>
              <span>{{ formatValue(detailsData?.indexName) }}</span>
            </div>
            <div class="info-row">
              <span>管理费率(%)</span>
              <span>{{ formatValue(detailsData?.managementFee) }}</span>
            </div>
            <div class="info-row">
              <span>托管费率(%)</span>
              <span>{{ formatValue(detailsData?.custodianFee) }}</span>
            </div>
            <div class="info-row">
              <span>联接基金</span>
              <span>{{ formatValue(detailsData?.etfLj) }}</span>
            </div>
          </div>
        </div>
        <!-- <div class="block">
          <div class="section-title analyst-title-row">
            <span>Analyst Report</span>
            <button class="fa-report-btn">FA Report PDF</button>
          </div>
          <div class="analyst-content">
            The BNY Mellon US Large Cap Core Equity ETF (BKLC) tracks an index
            of large cap U.S. equities... and does it for free. That's right:
            BKLC's management fee is zero. BKLC is part of a lineup of ETFs
            introduced by BNY Mellon in April 2020. As a latecomer to a crowded
            market, BNY Mellon is betting that its fee-free and ultra-low-cost
            funds will help win over investors.
            <span class="see-more">See more</span>
          </div>
        </div> -->
        <div class="block">
          <div class="section-title">交易信息</div>
          <div class="info-list">
            <div class="info-row">
              <span>最新交易日</span
              ><span>
                {{ formatDate(detailsData?.latestDate) }}
              </span>
            </div>
            <div class="info-row">
              <span>最新收盘价(元)</span
              ><span>
                {{ formatValue(detailsData?.close) }}
              </span>
            </div>
            <div class="info-row">
              <span>最新份额净值</span
              ><span>
                {{ formatValue(detailsData?.nav) }}
              </span>
            </div>
            <div class="info-row">
              <span>最新流通规模</span
              ><span>
                {{ formatValue(detailsData?.mktCap) }}
              </span>
            </div>
            <div class="info-row">
              <span>最新资产净值规模</span
              ><span>
                {{ formatValue(detailsData?.aum) }}
              </span>
            </div>
            <div class="info-row">
              <span>价格收益率(%)</span
              ><span>
                {{ formatValue(detailsData?.retPrice) }}
              </span>
            </div>
            <!-- <div class="info-row">
              <span>Region (General)</span
              ><span class="link" @click="router.push('/etfs-list')">North America</span>
            </div>
            <div class="info-row">
              <span>Region (Specific)</span><span class="link" @click="router.push('/etfs-list')">U.S.</span>
            </div> -->
          </div>
        </div>
      </div>
      <!-- 第四行：ETF Database Large Cap Growth Equities Category -->
      <div class="">
        <div id="detailOneEcart"></div>
      </div>
      <div style="text-align: right;">
        <el-date-picker
          v-model="tableDate"
          value-format="YYYY-MM-DD"
          @change="handleDateChange"
          type="date"
          style="margin-bottom: 10px;"
        />
        <el-table
          :data="tableData"
          :header-cell-style="{ background: '#d7d9dc', color: '#333' }"
          :style="{ width: '100%' }"
        >
          <el-table-column
            v-for="column in columns"
            :prop="column.key"
            :label="column.label"
          >
            <template #default="scope">
              {{ formatValue(scope.row[column.key]) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import * as echarts from "echarts";
import { formatValue, formatDate } from "@/utils/formatValue";
import { nextTick, onUnmounted, ref, watch } from "vue";
import {
  getSnapshotInfoApi,
  getSnapshotLineApi,
  getSnapshotReturnsApi,
} from "@/api/filterDetails";

const router = useRouter();
const props = defineProps({
  tabActiveName: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

const categoryList = ref([
  { label: "股票", value: "EQUITY" },
  { label: "债券", value: "BOND" },
  { label: "商品", value: "GOODS" },
  { label: "货币", value: "CURRENCY" },
  { label: "跨境", value: "CROSS_BOUNDARY" },
]);

const tableDate = ref('');
const handleDateChange = (date: string) => {
  getSnapshotReturns();
};


watch(
  () => props.tabActiveName,
  (newVal) => {
    if (newVal === "StockProfilePrice") {
      getSnapshotInfoApi({
        code: props.code,
      }).then((res) => {
        detailsData.value = res as Record<string, any>;
      });
      getSnapshotLineApi({
        code: props.code,
      }).then((res) => {
        const lineData = res.points;
        const XData: string[] = [];
        // 上市至今基准总回报(%)
        const ltdBenchData = {
          name: "上市至今基准总回报(%)",
          type: "line",
          showSymbol: false,
          // smooth: true,
          data: [] as number[],
        };
        // 上市至今市场总回报(%)
        const ltdMarketData = {
          name: "上市至今市场总回报(%)",
          type: "line",
          showSymbol: false,
          // smooth: true,
          data: [] as number[],
        };
        // 上市至今净值总回报(%)
        const ltdNavData = {
          name: "上市至今净值总回报(%)",
          type: "line",
          showSymbol: false,
          // smooth: true,
          data: [] as number[],
        };
        // 上市至今价格总回报(%)
        const ltdPriceData = {
          name: "上市至今价格总回报(%)",
          type: "line",
          showSymbol: false,
          // smooth: true,
          data: [] as number[],
        };
        lineData.forEach((item: Record<string, any>) => {
          XData.push(item.date);
          ltdBenchData.data.push(item.ltdBench);
          ltdMarketData.data.push(item.ltdMarket);
          ltdNavData.data.push(item.ltdNav);
          ltdPriceData.data.push(item.ltdPrice);
        });
        console.log(ltdBenchData, "ltdBenchData");
        initChart(XData, [
          ltdBenchData,
          ltdMarketData,
          ltdNavData,
          ltdPriceData,
        ]);
      });
      getSnapshotReturns();
    }
  },
  { immediate: true }
);
function getSnapshotReturns() {
  getSnapshotReturnsApi({
        code: props.code,
        date: tableDate.value || null,
      }).then((res) => {
        tableData.value = [
          {
            type: "基于净值的收益(%)",
            ytd: res.ytdNav,
            mt1: res.ret1,
            mt3: res.ret3,
            mt6: res.ret6,
            mt12: res.ret12,
            mt36: res.ret36,
            mt60: res.ret60,
            ltd: res.ltdNav,
            ytdReturns: res.ytdReturns,
          },
          {
            type: "基于价格的收益(%)",
            ytd: res.ytdPrice,
            mt1: res.pf1,
            mt3: res.pf3,
            mt6: res.pf6,
            mt12: res.pf12,
            mt36: res.pf36,
            mt60: res.pf60,
            ltd: res.ltdPrice,
          },
          {
            type: "基准指数收益(%)",
            ytd: res.ytdBench,
            mt1: res.bench1,
            mt3: res.bench3,
            mt6: res.bench6,
            mt12: res.bench12,
            mt36: res.bench36,
            mt60: res.bench60,
            ltd: res.ltdBench,
          },
          {
            type: "全市场收益(%)",
            ytd: res.ytdMkt,
            mt1: res.mkt1,
            mt3: res.mkt3,
            mt6: res.mkt6,
            mt12: res.mkt12,
            mt36: res.mkt36,
            mt60: res.mkt60,
            ltd: res.ltdMkt,
          },
        ];
      });
}
const detailsData = ref<Record<string, any>>({});
const columns = [
  { key: "type", label: "" },
  { key: "ytd", label: "今年以来" },
  { key: "mt1", label: "近一个月" },
  { key: "mt3", label: "近三个月" },
  { key: "mt6", label: "近六个月" },
  { key: "mt12", label: "近一年" },
  { key: "mt36", label: "近三年" },
  { key: "mt60", label: "近五年" },
  { key: "ltd", label: "上市至今总回报" },
  { key: "ytdReturns", label: "年化回报" },
];

const tableData = ref<Record<string, any>[]>([]);
let myChart: echarts.ECharts | null = null;
function initChart(xData: string[], seriesData: any[]) {
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
  myChart = echarts.init(
    document.getElementById("detailOneEcart") as HTMLElement
  );
  myChart.setOption({
    title: {
      text: "业绩表现",
    },
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
      data: xData,
    },
    yAxis: {
      type: "value",
    },
    series: seriesData,
  });
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

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;
.stock-profile-price {
  background: #fff;
  color: #222;
  font-size: var(--font-size-base);
}
.stock-profile-price-container {
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
