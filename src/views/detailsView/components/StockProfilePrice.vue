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
              ><span
                class="linkStyle"
                @click.stop="clickVitals(props.detailsData?.fundInfoByVitals)"
                >{{ props.detailsData?.fundInfoByVitals?.fundMgrs }}</span
              >
            </div>
            <div class="info-row">
              <span>基金公司</span
              ><span
                class="linkStyle"
                @click.stop="clickVitals(props.detailsData?.fundInfoByVitals)"
                >{{ props.detailsData?.fundInfoByVitals?.shortName }}</span
              >
            </div>
            <div class="info-row">
              <span>追踪指数</span>
              <span>{{ formatValue(props.detailsData?.fundInfoByVitals?.fee, 'percent') }}</span>
            </div>
            <div class="info-row">
              <span>管理费率</span>
              <span>{{ props.detailsData?.fundInfoByVitals?.setupDate }}</span>
            </div>
            <div class="info-row">
              <span>托管费率</span>
              <span>{{
                props.detailsData?.fundInfoByVitals?.trackIndexName
              }}</span>
            </div>
            <div class="info-row">
              <span>联接基金</span>
              <span>{{
                props.detailsData?.fundInfoByVitals?.trackIndexName
              }}</span>
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
                {{ categoryList.find(item => item.value === props.detailsData?.fundInfoByThemes?.category)?.label }}
              </span>
            </div>
            <div class="info-row">
              <span>最新收盘价</span
              ><span>
                {{ props.detailsData?.fundInfoByThemes?.styleAttribute }}
              </span>
            </div>
            <div class="info-row">
              <span>最新份额净值</span
              ><span>
                {{ props.detailsData?.fundInfoByThemes?.compMarketCap }}
              </span>
            </div>
            <div class="info-row">
              <span>最新流通规模</span
              ><span>
                {{ props.detailsData?.fundInfoByThemes?.investStrategy }}
              </span>
            </div>
            <div class="info-row">
              <span>最新资产净值规模</span
              ><span>
                {{ props.detailsData?.fundInfoByThemes?.investStrategy }}
              </span>
            </div>
            <div class="info-row">
              <span>折溢价率</span
              ><span>
                {{ props.detailsData?.fundInfoByThemes?.investStrategy }}
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
      <div>
        <el-table :data="tableData" :header-cell-style="{ background: '#d7d9dc', color: '#333' }" style="width: 100%">
          <el-table-column prop="type" label="" width="180" />
          <el-table-column prop="shortName" label="简称" width="180" />
          <el-table-column prop="fee" label="费用率(%)" />
          <el-table-column prop="totalMarketValue" label="基金规模(百万元)" unit="million" />
          <el-table-column prop="avgDailyVolumeForYear" label="日均成交额(百万元)" unit="million" />
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
import { onUnmounted, ref, watch } from "vue";

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
])

function clickVitals(data: any) {
  router.push({
    path: '/proshares',
    query: {
      issuer: JSON.stringify(data),
    },
  })
}

watch(
  () => props.detailsData,
  (newVal) => {
    if (newVal) {
      if (newVal.fundInfoByIndexData) {
        tableData.value = []
        Object.keys(newVal.fundInfoByIndexData).forEach((key) => {
          let typeName = ''
          if(key === "bestReturn") {
            typeName = '年初至今回报最高'
          } else if(key === "highestVolume") {
            typeName = '流动性最高'
          } else if(key === "largestSize") {
            typeName = '规模最大'
          }else if(key === "lowestFee") {
            typeName = '费用最低'
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
  { key: "totalMarketValue", label: "基金规模(百万元)",unit: 'million' },
  { key: "avgDailyVolumeForYear", label: "日均成交额(百万元)",unit: 'million' },
  { key: "ytdReturns", label: "年初至今回报(%)" },
];

const tableData = ref<Record<string, any>[]>([]);
let myChart: echarts.ECharts | null = null;
function initChart() {
  myChart = echarts.init(document.getElementById("detailOneEcart") as HTMLElement);
  myChart.setOption({
    title: {
    text: '业绩表现'
  },
  tooltip: {
    trigger: 'axis'
  },

  legend: {
    orient: 'horizontal',
    left: 'center',
    bottom: '1%'
  },
  grid: {
    top: '10%',
    left: '3%',
    right: '4%',
    bottom: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Email',
      type: 'line',
      showSymbol: false,
      // smooth: true,
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: 'Union Ads',
      type: 'line',
      showSymbol: false,
      // smooth: true,
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: 'Video Ads',
      type: 'line',
      showSymbol: false,
      // smooth: true,
      data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
      name: 'Direct',
      type: 'line',
      showSymbol: false,
      // smooth: true,
      data: [320, 332, 301, 334, 390, 330, 320]
    },
    {
      name: 'Search Engine',
      type: 'line',
      showSymbol: false,
      // smooth: true,
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
  })
}
watch(() => props.detailsData, () => {
  initChart()
})
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
@use '@/styles/variables.scss' as *;
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
