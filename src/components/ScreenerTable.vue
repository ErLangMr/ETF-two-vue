<script setup lang="ts">
import { useRouter } from 'vue-router'
import { QuestionFilled } from '@element-plus/icons-vue'
import { computed, ref, type PropType } from 'vue'
import { useDevice } from '@/utils/device'
import { formatValue } from '@/utils/formatValue'
const { isMobile } = useDevice()

defineProps({
  tableData: {
    type: Array as PropType<any[]>,
    required: true
  },
  hasTableFilter: {
    type: Boolean,
    required: false
  },
  description: {
    type: String,
    required: false
  }
})
const router = useRouter()
const filterTabs = ref([
  { label: "概览", value: "overview" },
  { label: "收益", value: "returns" },
  { label: "资金流动", value: "fundFlows" },
  { label: "费用", value: "expenses" },
  { label: "ESG", value: "esg" },
  { label: "分红", value: "dividends" },
  { label: "风险指标", value: "risk" },
  { label: "持仓特征", value: "holdings" },
  // { label: "税务", value: "taxes" },
  { label: "技术指标", value: "technicals" },
  // { label: "分析", value: "analysis" },
  // { label: "实时评级", value: "realtimeRatings" },
]);

interface TableColumn {
  prop: string;
  label: string;
  type?: string;
  url?: string | undefined;
  unit?: string; // 可根据需要扩展单位类型
}

const tableColumnList = ref<Record<string, TableColumn[]>>(
  {
    overview: [
      { prop: "code", label: "ETF代码" },
      { prop: "shortName", label: "ETF简称", type: "link", url: "/details" },
      { prop: "fullName", label: "ETF全称", type: "link", url: "/details" },
      { prop: "category", label: "资产类型" },
      { prop: "totalMarketValue", label: "ETF规模(百万元)", unit: "million" },
      { prop: "ytdPriceChange", label: "今年以来价格变化(%)" },
      { prop: "avgDailyVolume", label: "日均交易量(百万股)", unit: "million" },
      { prop: "preClose", label: "前收盘价(元)" }
    ],
    returns: [
      { prop: "code", label: "ETF代码" },
      { prop: "shortName", label: "ETF简称", type: "link", url: "/details" },
      { prop: "fullName", label: "ETF全称", type: "link", url: "/details" },
      { prop: "weeklyReturns", label: "近1周回报(%)" },
      { prop: "monthlyReturns", label: "近1月回报(%)" },
      { prop: "ytdReturns", label: "今年以来回报(%)" },
      { prop: "yearlyReturns", label: "近1年回报(%)" },
      { prop: "threeYearReturns", label: "近3年回报(%)" },
      { prop: "fiveYearReturns", label: "近5年回报(%)" },
      // { prop: "preClose", label: "回报排名" },
    ],
    fundFlows: [
      { prop: "code", label: "ETF代码" },
      { prop: "shortName", label: "ETF简称", type: "link", url: "/details" },
      { prop: "fullName", label: "ETF全称", type: "link", url: "/details" },
      { prop: "weeklyNetInflows", label: "近1周净流入额(百万元)", unit: "million" },
      { prop: "monthlyNetInflows", label: "近1月净流入额(百万元)", unit: "million" },
      { prop: "threeMonthNetInflows", label: "近3月净流入额(百万元)", unit: "million" },
      { prop: "ytdNetInflows", label: "今年以来净流入额(百万元)", unit: "million" },
      { prop: "yearlyNetInflows", label: "近1年净流入额(百万元)", unit: "million" },
      { prop: "threeYearNetInflows", label: "近3年净流入额(百万元)", unit: "million" },
      // { prop: "fiveYearNetInflows", label: "近5年净流入额" },
    ],
    expenses: [
      { prop: "code", label: "ETF代码" },
      { prop: "shortName", label: "ETF简称", type: "link", url: "/details" },
      { prop: "fullName", label: "ETF全称", type: "link", url: "/details" },
      { prop: "category", label: "资产类型" },
      { prop: "totalMarketValue", label: "ETF规模(百万元)", unit: "million" },
      { prop: "managementFee", label: "管理费率(%)" },
      { prop: "custodyFee", label: "托管费率(%)" },
      { prop: "serviceFee", label: "销售服务费率(%)" },
      { prop: "indexLicenseFee", label: "指数使用费率(%)" },
    ],
    esg: [
      { prop: "code", label: "ETF代码" },
      { prop: "shortName", label: "ETF简称", type: "link", url: "/details" },
      { prop: "fullName", label: "ETF全称", type: "link", url: "/details" },
      { prop: "esgScore", label: "ESG综合得分" },
      { prop: "esgControversyScore", label: "ESG争议事件得分" },
      { prop: "environmentScore", label: "ESG环境维度得分" },
      { prop: "socialScore", label: "ESG社会维度得分" },
      { prop: "governanceScore", label: "ESG治理维度得分" },
    ],
    dividends: [
      { prop: "code", label: "ETF代码" },
      { prop: "shortName", label: "ETF简称", type: "link", url: "/details" },
      { prop: "fullName", label: "ETF全称", type: "link", url: "/details" },
      { prop: "divPerUnit", label: "单位年度分红(元)" },
      { prop: "accDivPerUnit", label: "单位累计分红(元)" },
      { prop: "divTimes", label: "年度分红次数(次)" },
      { prop: "divYield", label: "单位分红率(%)" }
    ],
    risk: [
      { prop: "code", label: "ETF代码" },
      { prop: "shortName", label: "ETF简称", type: "link", url: "/details" },
      { prop: "fullName", label: "ETF全称", type: "link", url: "/details" },
      { prop: "std52Week", label: "收益标准差(%)" },
      // { prop: "市盈率P/E", label: "市盈率P/E" },
      { prop: "beta52Week", label: "Beta" },
      { prop: "volatility20Day", label: "近一月年化波动率(%)" },
      { prop: "volatility50Day", label: "近三月年化波动率(%)" },
      { prop: "volatility200Day", label: "近一年年化波动率(%)" },
      { prop: "maxDownSide", label: "最大回撤(%)" },
      { prop: "trakingError", label: "跟踪误差(%)" },
    ],
    holdings: [
      { prop: "code", label: "ETF代码" },
      { prop: "shortName", label: "ETF简称", type: "link", url: "/details" },
      { prop: "fullName", label: "ETF全称", type: "link", url: "/details" },
      { prop: "fundMgrs", label: "发行人" },
      { prop: "stockHoldings", label: "持有股票个数" },
      { prop: "top5Concentration", label: "前五大持仓集中度(%)" },
      { prop: "top10Concentration", label: "前十大持仓集中度(%)" },
      { prop: "top15Concentration", label: "前十五大持仓集中度(%)" },
      { prop: "top50Concentration", label: "前五十大持仓集中度(%)" },
      // { prop: "category", label: "全部持仓明细" },
      // { prop: "category", label: "持仓集中度排名" },
    ],
    technicals: [
      { prop: "code", label: "ETF代码" },
      { prop: "shortName", label: "ETF简称", type: "link", url: "/details" },
      { prop: "fullName", label: "ETF全称", type: "link", url: "/details" },
      { prop: "lowerBoll", label: "下布林带" },
      { prop: "upBoll", label: "上布林带" },
    ]
  }
)
const categoryList = ref([
  { label: "股票", value: "EQUITY" },
  { label: "债券", value: "BOND" },
  { label: "商品", value: "GOODS" },
  { label: "货币", value: "CURRENCY" },
  { label: "跨境", value: "CROSS_BOUNDARY" },
])
const tableColumns = computed(() => {
  return tableColumnList.value[activeTab.value as keyof typeof tableColumnList.value] || []
})
const activeTab = ref("overview");

const handleTabClick = (tab: string) => {
  activeTab.value = tab
}

// 处理跳转
const handleJump = (url: string, code: string) => {
  router.push(`${url}?code=${code}`)
}
const expanded = ref<string | null>(null);
const toggleExpand = (symbol: string) => {
  expanded.value = expanded.value === symbol ? null : symbol;
};


</script>
<template>
  <div class="screener-table-area">
    <div v-if="hasTableFilter" class="filter-tabs-wrapper">
      <div class="filter-tabs">
        <div
          v-for="tab in filterTabs"
          :key="tab.value"
          :class="['filter-tab', { active: activeTab === tab.value } ]"
          @click="handleTabClick(tab.value)"
        >
          {{ tab.label }}
          <!-- <el-tooltip v-if="tab?.icon" content="ESG 说明" placement="top">
            <el-icon style="font-size:14px;margin-left:2px;"><QuestionFilled /></el-icon>
          </el-tooltip> -->
        </div>
      </div>
    </div>
    <div v-if="description" class="description">
      {{ description }}
    </div>
    <div class="table-scroll" v-if="!isMobile()">
      <el-table :data="tableData" border>
        <el-table-column
          v-for="column in tableColumns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
        >
          <template #default="scope">
            <template v-if="column.prop === 'category'">
              {{ categoryList.find(item => item.value === scope.row[column.prop])?.label }}
            </template>
            <template v-else>
              <span
                class="link-cell"
                v-if="column.type === 'link'"
                @click="handleJump(column.url??'', scope.row.code || '')"
              >
                {{ scope.row[column.prop] }}
              </span>
              <span v-else>
                {{ formatValue(scope.row[column.prop], column?.unit) }}
              </span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="mobile-etf-list" v-if="isMobile()">
      <div v-for="etf in tableData" :key="etf.symbol" class="etf-row-card">
        <template v-if="etf.shortName">
          <div class="etf-row-summary" @click="toggleExpand(etf.code)">
            <span class="symbol">{{ etf.shortName }}</span>
            <!-- <span class="symbol-divider">-</span>
            <span class="name">{{ etf.name }}</span> -->
            <span class="arrow" :class="{ expanded: expanded === etf.code }">
              <van-icon name="arrow" />
            </span>
          </div>
          <transition name="fade">
            <div v-if="expanded === etf.code" class="etf-row-detail">
              <div
                v-for="header in tableColumns"
                :key="header.prop"
                class="etf-detail-item"
              >
                <span class="label">{{ header.label }}：</span>
                <span
                  class="value linkStyle"
                  v-if="header.type === 'link'"
                  @click="handleJump(header.url??'', etf.code)"
                  >{{ etf[header.prop as keyof typeof etf] }}</span
                >
                <span class="value" v-else>{{
                  formatValue(etf[header.prop as keyof typeof etf], header?.unit)
                }}</span>
              </div>
            </div>
          </transition>
        </template>
        <template v-else>
          <div class="etf-row-detail">
            <div
              v-for="header in tableColumns"
              :key="header.prop"
              class="etf-detail-item"
            >
              <span class="label">{{ header.label }}：</span>
              <span
                class="value linkStyle"
                v-if="header.type === 'link'"
                @click="handleJump(header.url??'', etf.code)"
                >{{ etf[header.prop as keyof typeof etf] }}</span
              >
              <span class="value" v-else>{{
                formatValue(etf[header.prop as keyof typeof etf], header?.unit)
              }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="table-pagination" v-if="$slots['table-pagination']">
      <slot name="table-pagination">
      </slot>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.screener-table-area {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  border: 1px solid #ebeef5;
  margin-top: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-width: 100%;
  .table-pagination{
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: right;
  }
}
.description {
  font-size: 1.08rem;
  color: #222;
  margin-bottom: 1.1rem;
  line-height: 1.7;
  padding: 0 16px;
}
.filter-tabs-wrapper {
  width: 100%;
  padding: 16px;
}
.filter-tabs {
  display: flex;
}
.filter-tab {
  flex: 1 1 0;
  text-align: center;
  max-width: none;
  min-width: 0;
  padding: 8px 0;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  // border-bottom: 2px solid transparent;
  // transition: border-color 0.2s, color 0.2s;
}
.filter-tab.active {
  color: #fff;
  background: var(--theme-purple);
  border-bottom: 2px solid var(--theme-purple);
}
.table-scroll {
  min-width: 0;
  overflow-x: auto;
}
:deep(.el-table) {
  max-width: 100%;
}
.link-cell {
  color: $theme-purple;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
@media (max-width: 768px) {
  .mobile-etf-list {
  padding: 8px;
  .etf-row-card {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border-left: 4px solid #e8e8f5;
    border-right: 4px solid #e8e8f5;
    border-top: 4px solid #e8e8f5;
    border-bottom: 2px solid #e8e8f5;
    box-sizing: border-box;
    // margin-bottom: 12px;
    overflow: hidden;
    transition: box-shadow 0.2s;
    &:active,
    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
    .etf-row-summary {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      cursor: pointer;
      font-size: var(--font-size-base);
      border-bottom: 1px solid #f0f0f0;
      .symbol-divider {
        margin: 0 3px;
      }
      .name {
        flex: 1;
        margin-right: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .arrow {
        font-size: var(--font-size-medium);
        font-weight: 600;
        transition: transform 0.2s;
        color: var(--theme-purple);
        &.expanded {
          transform: rotate(90deg);
        }
      }
    }
    .etf-row-detail {
      padding: 10px 14px 14px 14px;
      background: #f9f9fb;
      .etf-detail-item {
        display: flex;
        font-size: var(--font-size-base);
        padding: 6px 0;
        justify-content: space-between;
        border-bottom: 1px solid #f0f0f0;
        &:last-child {
          border-bottom: none;
        }
        .label {
          color: #888;
          min-width: 140px;
          flex-shrink: 0;
        }
        .value {
          color: #222;
          font-weight: 500;
          word-break: break-all;
        }
      }
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
}
@media (max-width: 768px) {
  .mobile-etf-list {
    padding: 0;
    .etf-row-card {
      border-radius: 0;
      // margin-bottom: 8px;
    }
  }
  .filter-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0;
    border-radius: 5px;
    overflow: hidden;
  }
  .filter-tab {
    flex: none;
    width: 100%;
    text-align: center;
    padding: 8px 0;
    border-radius: 5px;
    border: 1px solid #e5e5e5;
    border-right: none;
    border-bottom: none;
    background: #fff;
    color: var(--theme-purple);
    font-size: var(--font-size-base);
    font-weight: 500;
  }
  .filter-tab:nth-child(3n) {
    border-right: 1px solid #e5e5e5;
  }
  .filter-tab:nth-last-child(-n+3) {
    border-bottom: 1px solid #e5e5e5;
  }
  .filter-tab.active {
    background: var(--theme-purple);
    color: #fff;
    font-weight: 700;
  }
}
</style>
