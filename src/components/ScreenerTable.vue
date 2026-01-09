<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed, ref, watch, type PropType } from 'vue'
import { useDevice } from '@/utils/device'
import { formatValue } from '@/utils/formatValue'
const { isMobile } = useDevice()

const props = defineProps({
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
  },
  filterTabsProp: {
    type: Array as PropType<any[]>,
    required: false
  },
  tableColumnListProp: {
    type: Object as PropType<Record<string, any[]>>,
    required: false
  }
})
const emit = defineEmits(['tableSelect', 'tableFilterTab'])
const route = useRoute()
const router = useRouter()
const isScreener = computed(() => route.path === '/screener') // 是否在筛选页面
const tableLoading = ref(true)
const tablePropData = ref<any[]>([])
watch(() => props.tableData, () => {
  tableLoading.value = false
  tablePropData.value = props.tableData
})
const filterTabs = ref([
  { label: "概览", value: "overview" },
  { label: "收益", value: "returns" },
  { label: "资金流动", value: "fundFlows" },
  { label: "费用", value: "expenses" },
  // { label: "ESG", value: "esg" },
  { label: '交易效率', value: "efficiency" },
  { label: "分红", value: "dividends" },
  { label: "风险指标", value: "risk" },
  { label: "持仓特征", value: "holdings" },
  { label: '估值', value: "valuation" },
  { label: 'ETF_Score', value: "etfScore" }
  // { label: "税务", value: "taxes" },
  // { label: "技术指标", value: "technicals" },
  // { label: "分析", value: "analysis" },
  // { label: "实时评级", value: "realtimeRatings" },
]);

interface TableColumn {
  prop: string;
  label: string;
  width: number;
  showTooltip?: boolean;
  type?: string;
  url?: string | undefined;
  unit?: string; // 可根据需要扩展单位类型
}

const tableColumnList = ref<Record<string, TableColumn[]>>(
  {
    overview: [
      { prop: "etfCode", label: "ETF代码", width: 110, showTooltip: false },
      { prop: "etfName", label: "ETF简称", width: 150, showTooltip: true, type: "link", url: "/details" },
      { prop: "etfFullname", label: "ETF全称", width: 160, showTooltip: true, type: "link", url: "/details" },
      { prop: "typeI", label: "资产类型", width: 100, showTooltip: false },
      { prop: "nav", label: "份额净值", width: 100, showTooltip: false },
      { prop: "shares", label: "份额(百万份)", width: 120, showTooltip: false },
      // { prop: "aum", label: "资产规模(百万元)", unit: "million" },
      { prop: "aum", label: "资产规模(百万元)", width: 110, showTooltip: true },
      { prop: "close", label: "最新收盘价(元)", width: 110, showTooltip: true },
      { prop: "coverRatio", label: "折溢价率", width: 110, showTooltip: true },
      { prop: "ytdPrice", label: "今年以来价格变化(%)", width: 110, showTooltip: true }
    ],
    returns: [
      { prop: "etfCode", label: "ETF代码", width: 110, showTooltip: false },
      { prop: "etfName", label: "ETF简称", width: 150, showTooltip: true, type: "link", url: "/details" },
      { prop: "weeklyReturns", label: "近1周回报(%)", width: 120, showTooltip: false },
      { prop: "ret1", label: "近1月回报(%)", width: 120, showTooltip: false },
      { prop: "ret3", label: "近3月回报(%)", width: 130, showTooltip: false },
      { prop: "ret6", label: "近6月回报(%)", width: 130, showTooltip: false },
      { prop: "ytdNav", label: "今年以来回报(%)", width: 150, showTooltip: false },
      { prop: "ret12", label: "近1年回报(%)", width: 120, showTooltip: true },
      { prop: "ret36", label: "近3年回报(%)", width: 130, showTooltip: true },
      { prop: "ret60", label: "近5年回报(%)", width: 130, showTooltip: true }
    ],
    fundFlows: [
      { prop: "etfCode", label: "ETF代码", width: 110, showTooltip: false },
      { prop: "etfName", label: "ETF简称", width: 150, showTooltip: true, type: "link", url: "/details" },
      { prop: "ff1", label: "近1月净流入额(百万元)", width: 130, showTooltip: false },
      { prop: "ff3", label: "近3月净流入额(百万元)", width: 130, showTooltip: false },
      { prop: "ff6", label: "近6月净流入额(百万元)", width: 130, showTooltip: false },
      { prop: "ytdFf", label: "今年以来净流入额(百万元)", width: 130, showTooltip: false },
      { prop: "ff12", label: "近1年净流入额(百万元)", width: 130, showTooltip: false },
      { prop: "ff36", label: "近3年净流入额(百万元)", width: 130, showTooltip: false },
      { prop: "ff60", label: "近5年净流入额(百万元)", width: 130, showTooltip: false },
    ],
    expenses: [
      { prop: "etfCode", label: "ETF代码", width: 110, showTooltip: false },
      { prop: "etfName", label: "ETF简称", width: 150, showTooltip: true, type: "link", url: "/details" },
      { prop: "managementFee", label: "管理费率(%)", width: 120, showTooltip: false },
      { prop: "custodianFee", label: "托管费率(%)", width: 120, showTooltip: false },
      { prop: "salesServiceFee", label: "销售服务费率(%)", width: 150, showTooltip: false },
      { prop: "subscriptionFee", label: "最高申购费率(%)", width: 150, showTooltip: false },
      { prop: "redemptionFee", label: "最高赎回费率(%)", width: 150, showTooltip: false },
      { prop: "totalFee", label: "总费率(%)", width: 110, showTooltip: false },
    ],
    efficiency: [
      { prop: "etfCode", label: "ETF代码", width: 110, showTooltip: false },
      { prop: "etfName", label: "ETF简称", width: 150, showTooltip: true, type: "link", url: "/details" },
      { prop: "volume1", label: "近1月日均交易量(百万份)", width: 120, showTooltip: false },
      { prop: "volume3", label: "近3月日均交易量(百万份)", width: 120, showTooltip: false },
      { prop: "amount1", label: "近1月日均交易额(百万元)", width: 120, showTooltip: false },
      { prop: "amount3", label: "近3月日均交易额(百万元)", width: 100, showTooltip: false },
      { prop: "turnover1", label: "近1月换手率", width: 100, showTooltip: false },
      { prop: "turnover3", label: "近3月换手率", width: 100, showTooltip: false },
      { prop: "cover1", label: "近1月日均折溢价率", width: 100, showTooltip: false },
      { prop: "cover3", label: "近3月日均折溢价率", width: 100, showTooltip: false },
      { prop: "dev1", label: "近1月日均跟踪偏离度", width: 100, showTooltip: false },
      { prop: "dev3", label: "近3月日均跟踪偏离度", width: 100, showTooltip: false },
      { prop: "tr1", label: "近1月日均跟踪误差", width: 100, showTooltip: false },
      { prop: "tr3", label: "近3月日均跟踪误差", width: 100, showTooltip: false },
    ],
    esg: [
      { prop: "etfCode", label: "ETF代码", width: 110, showTooltip: false },
      { prop: "etfName", label: "ETF简称", width: 150, showTooltip: true, type: "link", url: "/details" },
      { prop: "fullName", label: "ETF全称", width: 150, showTooltip: true, type: "link", url: "/details" },
      { prop: "esgScore", label: "ESG综合得分", width: 120, showTooltip: false },
      { prop: "esgControversyScore", label: "ESG争议事件得分", width: 140, showTooltip: false },
      { prop: "environmentScore", label: "ESG环境维度得分", width: 140, showTooltip: false },
      { prop: "socialScore", label: "ESG社会维度得分", width: 140, showTooltip: false },
      { prop: "governanceScore", label: "ESG治理维度得分", width: 140, showTooltip: false },
    ],
    dividends: [
      { prop: "etfCode", label: "ETF代码", width: 110, showTooltip: false },
      { prop: "etfName", label: "ETF简称", width: 150, showTooltip: true, type: "link", url: "/details" },
      // { prop: "divPerUnit", label: "单位年度分红(元)" },
      { prop: "cumD", label: "单位累计分红(元)", width: 150, showTooltip: false },
      { prop: "lyD", label: "上一年度单位分红(元)", width: 180, showTooltip: false },
      { prop: "ytdD", label: "今年以来单位分红(元)", width: 180, showTooltip: false },
      { prop: "cumCount", label: "累计分红次数", width: 150, showTooltip: false },
      { prop: "lyCount", label: "上一年度分红次数", width: 160, showTooltip: false },
      { prop: "ytdCount", label: "今年以来分红次数", width: 160, showTooltip: false },
      { prop: "dp", label: "年度股息率(%)", width: 140, showTooltip: false },
      // { prop: "divYield", label: "单位分红率(%)" }
    ],
    risk: [
      { prop: "etfCode", label: "ETF代码", width: 110, showTooltip: false },
      { prop: "etfName", label: "ETF简称", width: 150, showTooltip: true, type: "link", url: "/details" },
      { prop: "vol1", label: "近1月收益标准差", width: 150, showTooltip: false },
      { prop: "vol3", label: "近3月收益标准差", width: 150, showTooltip: false },
      { prop: "vol6", label: "近6月收益标准差", width: 150, showTooltip: false },
      { prop: "vol12", label: "近1年收益标准差", width: 150, showTooltip: false },
      { prop: "vol36", label: "近3年收益标准差", width: 150, showTooltip: false },
      { prop: "beta1", label: "近1月Beta", width: 140, showTooltip: false },
      { prop: "beta3", label: "近3月Beta", width: 140, showTooltip: false },
      { prop: "beta12", label: "近1年Beta", width: 140, showTooltip: false },
      { prop: "beta36", label: "近3年Beta", width: 140, showTooltip: false },
      { prop: "maxD12", label: "近1年最大回撤", width: 140, showTooltip: false },
      { prop: "maxD36", label: "近3年最大回撤", width: 140, showTooltip: false },
    ],
    holdings: [
      { prop: "etfCode", label: "ETF代码", width: 110, showTooltip: false },
      { prop: "etfName", label: "ETF简称", width: 150, showTooltip: true, type: "link", url: "/details" },
      { prop: "etfFullname", label: "ETF全称", width: 150, showTooltip: true, type: "link", url: "/details" },
      { prop: "stockNumber", label: "持有证券数量(只)", width: 100, showTooltip: false },
      { prop: "weightedTotalMarketValue", label: "持仓证券平均市值(百万元)", width: 160, showTooltip: false },
      { prop: "top5HoldingPercent", label: "前五大持仓占比(%)", width: 160, showTooltip: false },
      { prop: "top10HoldingPercent", label: "前十大持仓占比(%)", width: 160, showTooltip: false },
      { prop: "top20HoldingPercent", label: "前二十大持仓占比(%)", width: 160, showTooltip: false },
      { prop: "bigCapPercent", label: "大盘股占比(%)", width: 140, showTooltip: false },
      { prop: "midCapPercent", label: "中盘股占比(%)", width: 140, showTooltip: false },
      { prop: "smallCapPercent", label: "小盘股占比(%)", width: 140, showTooltip: false },
      { prop: "weightedPe", label: "加权平均PE", width: 120, showTooltip: false },
      { prop: "weightedPb", label: "加权平均PB", width: 120, showTooltip: false },
      { prop: "weightedPs", label: "加权平均PS", width: 120, showTooltip: false },
      { prop: "weightedPcf", label: "加权平均PCF", width: 120, showTooltip: false }
    ],
    technicals: [
      { prop: "etfCode", label: "ETF代码", width: 100, showTooltip: false },
      { prop: "etfName", label: "ETF简称", type: "link", url: "/details", width: 100, showTooltip: false },
      { prop: "fullName", label: "ETF全称", type: "link", url: "/details", width: 100, showTooltip: false },
      { prop: "lowerBoll", label: "下布林带", width: 100, showTooltip: false },
      { prop: "upBoll", label: "上布林带", width: 100, showTooltip: false },
    ],
    valuation: [
      { prop: "etfCode", label: "ETF代码", width: 110, showTooltip: false },
      { prop: "etfName", label: "ETF简称", type: "link", url: "/details", width: 150, showTooltip: true },
      { prop: "unitProfit", label: "份额盈利", width: 120, showTooltip: false },
      { prop: "unitNetValue", label: "份额净资产", width: 120, showTooltip: false },
      { prop: "unitSalesIncome", label: "份额销售收入", width: 130, showTooltip: false },
      { prop: "unitCashFlow", label: "份额现金流", width: 120, showTooltip: false },
      { prop: "unitDividend", label: "份额分红", width: 120, showTooltip: false },
      { prop: "etfPe", label: "ETF_PE", width: 100, showTooltip: false },
      { prop: "etfPB", label: "ETF_PB", width: 100, showTooltip: false },
      { prop: "etfPs", label: "ETF_PS", width: 100, showTooltip: false },
      { prop: "etfPcf", label: "ETF_PCF", width: 100, showTooltip: false },
      { prop: "etfDp", label: "ETF_DP", width: 100, showTooltip: false }
    ],
    ETF_Score: [
      { prop: "etfCode", label: "ETF代码", width: 110, showTooltip: false },
      { prop: "etfName", label: "ETF简称", type: "link", url: "/details", width: 150, showTooltip: true },
      { prop: "liquidity", label: "流动性", width: 110, showTooltip: false },
      { prop: "managementFee", label: "费率", width: 110, showTooltip: false },
      { prop: "yield", label: "收益", width: 110, showTooltip: false },
      { prop: "volatility", label: "波动率", width: 110, showTooltip: false },
      { prop: "dividend", label: "分红", width: 110, showTooltip: false },
      { prop: "concentration", label: "集中度", width: 110, showTooltip: false },
      { prop: "score", label: "综合得分", width: 110, showTooltip: false },
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
  if (props.tableColumnListProp) {
    return props.tableColumnListProp[activeTab.value as keyof typeof props.tableColumnListProp] || []
  }
  return tableColumnList.value[activeTab.value as keyof typeof tableColumnList.value] || []
})
const activeTab = ref("overview");

const handleTabClick = (tab: string) => {
  activeTab.value = tab
  tablePropData.value = []
  tableLoading.value = true
  emit("tableFilterTab", tab)
}

// 处理跳转
const handleJump = (url: string, code: string, name: string) => {
  router.push(`${url}?code=${code}&name=${name}`)
}
const expanded = ref<string | null>(null);
const toggleExpand = (symbol: string) => {
  expanded.value = expanded.value === symbol ? null : symbol;
};

const selectedCodes = ref<string[]>([])
const tableRef = ref()
const MAX_SELECTION = 5

// 控制每行的可选状态
const handleSelectable = (row: any) => {
  // 如果当前行已被选中，允许取消选择
  const isSelected = selectedCodes.value.includes(row.etfCode)
  if (isSelected) {
    return true
  }
  // 如果未达到最大选择数，允许选择
  return selectedCodes.value.length < MAX_SELECTION
}

const handleSelectionChange = (val: any[]) => {
  selectedCodes.value = val.map(item => item.etfCode)
  console.log(val, selectedCodes.value)
  emit("tableSelect", selectedCodes.value, val)
}

</script>
<template>
  <div class="screener-table-area">
    <div v-if="hasTableFilter" class="filter-tabs-wrapper">
      <div class="filter-tabs">
        <div
          v-for="tab in (filterTabsProp ? filterTabsProp : filterTabs)"
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
    <div v-if="isScreener" class="selection-tip">
      <span>已选择 <strong>{{ selectedCodes.length }}</strong> / {{ MAX_SELECTION }} 个ETF</span>
      <span v-if="selectedCodes.length >= MAX_SELECTION" class="max-tip">（已达到最大选择数量）</span>
    </div>
    <div class="table-scroll" v-if="!isMobile()">
      <el-table
        ref="tableRef"
        :data="tablePropData"
        v-loading="tableLoading"
        element-loading-text="加载中..."
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column
          v-if="isScreener"
          type="selection"
          width="50"
          :selectable="handleSelectable"
          :reserve-selection="false"
        />
        <el-table-column
          v-for="column in tableColumns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :min-width="column.width"
          :show-overflow-tooltip="column.showTooltip"
        >
          <template #default="scope">
            <template v-if="column.prop === 'category'">
              {{ categoryList.find(item => item.value === scope.row[column.prop])?.label }}
            </template>
            <template v-else>
              <span
                class="link-cell"
                v-if="column.type === 'link'"
                @click="handleJump(column.url??'', scope.row.etfCode || '', scope.row.etfName || '')"
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
      <div v-for="etf in tablePropData" :key="etf.symbol" class="etf-row-card">
        <template v-if="etf.shortName">
          <div class="etf-row-summary" @click="toggleExpand(etf.etfCode)">
            <span class="symbol">{{ etf.shortName }}</span>
            <!-- <span class="symbol-divider">-</span>
            <span class="name">{{ etf.name }}</span> -->
            <span class="arrow" :class="{ expanded: expanded === etf.etfCode }">
              <van-icon name="arrow" />
            </span>
          </div>
          <transition name="fade">
            <div v-if="expanded === etf.etfCode" class="etf-row-detail">
              <div
                v-for="header in tableColumns"
                :key="header.prop"
                class="etf-detail-item"
              >
                <span class="label">{{ header.label }}：</span>
                <span
                  class="value linkStyle"
                  v-if="header.type === 'link'"
                  @click="handleJump(header.url??'', etf.etfCode, etf.etfName)"
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
                @click="handleJump(header.url??'', etf.etfCode, etf.etfName)"
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
.selection-tip {
  padding: 8px 16px;
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: #606266;
  background: #f4f4f5;
  border-left: 3px solid var(--theme-purple);
  strong {
    color: var(--theme-purple);
    font-size: 1rem;
  }
  .max-tip {
    color: #f56c6c;
    margin-left: 8px;
    font-weight: 500;
  }
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
  // 隐藏表头的全选复选框
  .el-table__header-wrapper .el-table-column--selection .cell {
    display: none;
  }
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
