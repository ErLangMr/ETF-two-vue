<template>
  <div class="etf-product-list">
    <div class="list-box">
      <ScreenerTable
        class="table-area"
        :tableData="etfList"
        :hasTableFilter="true"
        :filterTabsProp="trankingTabs"
        :tableColumnListProp="trankingColumnList"
      >
        <template #table-pagination>
          <el-pagination
            v-model:current-page="page"
            layout="total, prev, pager, next"
            :pager-count="!isMobile() ? 7 : 3"
            :total="total"
            :page-size="pageSize"
            @current-change="handlePageChange"
          />
        </template>
      </ScreenerTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ScreenerTable from "@/components/ScreenerTable.vue";
import { useDevice } from "@/utils/device";

const { isMobile } = useDevice();

interface TableColumn {
  prop: string;
  label: string;
  type?: string;
  url?: string | undefined;
  unit?: string;
}
const trankingTabs = [
  { label: "概览", value: "overview" },
  { label: "收益", value: "returns" },
  { label: "资金流动", value: "fundFlows" },
  { label: "分红", value: "dividends" },
  { label: "风险指标", value: "risk" },
  { label: "持仓特征", value: "holdings" },
  { label: "估值", value: "valuation" },
  { label: "相关ETF", value: "relatedETF" },
];

const trankingColumnList: Record<string, TableColumn[]> = {
  overview: [
    { prop: "code", label: "指数代码" },
    {
      prop: "shortName",
      label: "指数简称",
      type: "link",
      url: "/trackingIndexDetails",
    },
    {
      prop: "fullName",
      label: "指数全称",
      type: "link",
      url: "/trackingIndexDetails",
    },
    { prop: "category", label: "资产类型" },
    { prop: "fabu", label: "发布日期" },
    { prop: "jiri", label: "基日" },
    { prop: "jigou", label: "发布机构" },
    { prop: "jiaquan", label: "加权方式" },
  ],
  returns: [
    { prop: "code", label: "指数代码" },
    {
      prop: "shortName",
      label: "指数简称",
      type: "link",
      url: "/trackingIndexDetails",
    },
    { prop: "return1M", label: "近1月" },
    { prop: "return3M", label: "3月" },
    { prop: "returnYTD", label: "今年以来" },
    { prop: "return1Y", label: "1年" },
    { prop: "return3Y", label: "3年" },
    { prop: "return5Y", label: "5年涨跌" },
  ],
  fundFlows: [
    { prop: "code", label: "指数代码" },
    {
      prop: "shortName",
      label: "指数简称",
      type: "link",
      url: "/trackingIndexDetails",
    },
    { prop: "flow1M", label: "近1月" },
    { prop: "flow3M", label: "3月" },
    { prop: "flowYTD", label: "今年以来" },
    { prop: "flow1Y", label: "1年" },
    { prop: "flow3Y", label: "3年" },
    { prop: "flow5Y", label: "5年资金净流入" },
  ],
  dividends: [
    { prop: "code", label: "指数代码" },
    {
      prop: "shortName",
      label: "指数简称",
      type: "link",
      url: "/trackingIndexDetails",
    },
    { prop: "annualDividend", label: "年度分红" },
    { prop: "dividendYield", label: "股息率" },
  ],
  risk: [
    { prop: "code", label: "指数代码" },
    {
      prop: "shortName",
      label: "指数简称",
      type: "link",
      url: "/trackingIndexDetails",
    },
    { prop: "volatility1M", label: "近1月" },
    { prop: "volatility3M", label: "3月" },
    { prop: "volatilityYTD", label: "今年以来" },
    { prop: "volatility1Y", label: "1年" },
    { prop: "volatility3Y", label: "3年" },
    { prop: "volatility5Y", label: "5年波动率" },
  ],
  holdings: [
    { prop: "code", label: "指数代码" },
    {
      prop: "shortName",
      label: "指数简称",
      type: "link",
      url: "/trackingIndexDetails",
    },
    { prop: "sampleSize", label: "样本数量" },
    { prop: "indexFloatMarketCap", label: "指数自由流通市值" },
    { prop: "avgFloatMarketCap", label: "样本平均自由流通市值" },
    { prop: "medianFloatMarketCap", label: "样本自由流通市值中位数" },
    { prop: "top5Weight", label: "前五大权重之和" },
    { prop: "top10Weight", label: "前十大权重之和" },
  ],
  valuation: [
    { prop: "code", label: "指数代码" },
    {
      prop: "shortName",
      label: "指数简称",
      type: "link",
      url: "/trackingIndexDetails",
    },
    { prop: "pe", label: "PE" },
    { prop: "pePercentile3Y", label: "PE分位值(3年)" },
    { prop: "pePercentile5Y", label: "PE分位值(5年)" },
    { prop: "pePercentile10Y", label: "PE分位值(10年)" },
    { prop: "pb", label: "PB" },
    { prop: "pbPercentile3Y", label: "PB分位值(3年)" },
    { prop: "pbPercentile5Y", label: "PB分位值(5年)" },
    { prop: "pbPercentile10Y", label: "PB分位值(10年)" },
  ],
  relatedETF: [
    { prop: "code", label: "指数代码" },
    {
      prop: "shortName",
      label: "指数简称",
      type: "link",
      url: "/trackingIndexDetails",
    },
    { prop: "relatedETFCount", label: "相关ETF只数" },
    { prop: "relatedETFScale", label: "相关ETF规模" },
    { prop: "relatedETFDetail", label: "相关ETF明细" },
  ],
};
const page = ref(1);
const pageSize = ref(20);
const total = ref(0);
const etfList = ref<any[]>([]);
const handlePageChange = (newPage: number) => {
  page.value = newPage;
  // getFilterTableData();
};
</script>

<style lang="scss" scoped>
.etf-product-list {
  width: 100%;
  height: 100%;
}
</style>
