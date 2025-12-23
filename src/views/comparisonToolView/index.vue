<template>
  <div class="comparisonTool_container">
    <div class="page-header">
      <h1>ETF对比工具</h1>
      <p class="page-desc">
        下表比较了多项ETF指标。对比费用、业绩、股息收益率、持仓、技术指标以及许多其他指标，以便做出更明智的投资决策。
      </p>
    </div>
    <div class="table_area">
      <div class="filter-tabs-wrapper">
        <div class="filter-tabs">
          <div
            v-for="tab in filterTabs"
            :key="tab.value"
            :class="['filter-tab', { active: activeTab === tab.value }]"
            @click="handleTabClick(tab.value)"
          >
            {{ tab.label }}
          </div>
        </div>
      </div>
      <h2 style="margin: 2rem 0">
        {{ filterTabs.find((tab) => tab.value === activeTab)?.descTitle }}
      </h2>
      <p style="margin-bottom: 2rem; font-size: 1rem">
        {{ filterTabs.find((tab) => tab.value === activeTab)?.desc || "" }}
      </p>
      <component
        v-loading="tableLoading"
        :is="componentTab"
        :tableData="tableData"
      ></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw, onMounted } from "vue";
import TableComp from "./components/tableComp.vue";
import performanceAndRisk from "./components/performanceAndRisk.vue";
import fundFlows from "./components/fundFlows.vue";
import holdingsCharacteristics from "./components/holdingsCharacteristics.vue";
import holdingBehaviorAndHolderBehavior from "./components/holdingBehaviorAndHolderBehavior.vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getCompareOverviewApi,
  getCompareNetValueApi,
  getCompareFundFlowApi,
  getCompareFeeApi,
  getCompareTradingEfficiencyApi,
  getCompareDividendApi,
  getCompareRiskApi,
  getCompareHoldingFeatureApi,
  getCompareValuationApi,
} from "@/api/compareTool";

const router = useRouter();
const route = useRoute();
const ETFCodes = route.query.ETFCodes;

const componentTab = ref(markRaw(TableComp));
const activeTab = ref("basicInformation");
const filterTabs = [
  {
    label: "基本信息",
    value: "basicInformation",
    descTitle: "基础信息",
    desc: "基础信息的一些描述",
  },
  {
    label: "收益和成本",
    value: "returnsAndCosts",
    descTitle: "收益和成本",
    desc: "收益和成本的一些描述",
  },
  {
    label: "资金流动",
    value: "fundFlows",
    descTitle: "资金流动",
    desc: "资金流动的一些描述",
  },
  {
    label: "费用",
    value: "expenses",
    descTitle: "费用",
    desc: "费用的一些描述",
  },
  {
    label: "交易效率",
    value: "tradingEfficiency",
    descTitle: "交易效率",
    desc: "交易效率的一些描述",
  },
  {
    label: "分工和估值",
    value: "divisionAndValuation",
    descTitle: "分工和估值",
    desc: "分工和估值的一些描述",
  },
  {
    label: "业绩和风险",
    value: "performanceAndRisk",
    descTitle: "业绩和风险",
    desc: "业绩和风险的一些描述",
  },
  {
    label: "持仓特征",
    value: "holdingsCharacteristics",
    descTitle: "持仓特征",
    desc: "持仓特征的一些描述",
  },
  {
    label: "估值",
    value: "valuation",
    descTitle: "估值",
    desc: "估值的一些描述",
  },
  // {
  //   label: "持仓行为和持有人行为",
  //   value: "holdingBehaviorAndHolderBehavior",
  //   descTitle: "持仓行为和持有人行为",
  //   desc: "持仓行为和持有人行为的一些描述",
  // },
];
onMounted(() => {
  getCompareOverview();
});
const handleTabClick = (tab: string) => {
  activeTab.value = tab;
  switch (tab) {
    case "basicInformation":
      componentTab.value = markRaw(TableComp);
      getCompareOverview();
      break;
    case "returnsAndCosts":
      componentTab.value = markRaw(TableComp);
      getCompareNetValue();
      break;
    case "fundFlows":
      // componentTab.value = markRaw(fundFlows);
      componentTab.value = markRaw(TableComp);
      getCompareFundFlow();
      break;
    case "expenses":
      componentTab.value = markRaw(TableComp);
      getCompareFee();
      break;
    case "tradingEfficiency":
      componentTab.value = markRaw(TableComp);
      getCompareTradingEfficiency();
      break;
    case "divisionAndValuation":
      componentTab.value = markRaw(TableComp);
      getCompareDividend();
      break;
    case "performanceAndRisk":
      // componentTab.value = markRaw(performanceAndRisk);
      componentTab.value = markRaw(TableComp);
      getCompareRisk();
      break;
    case "holdingsCharacteristics":
      // componentTab.value = markRaw(holdingsCharacteristics);
      componentTab.value = markRaw(TableComp);
      getCompareHoldingFeature();
      break;
    case "valuation":
      componentTab.value = markRaw(TableComp);
      getCompareValuation();
      break;
    // case "attributionAnalysis":
    //   componentTab.value = markRaw(TableComp);
    //   break;
    // case "holdingBehaviorAndHolderBehavior":
    //   componentTab.value = markRaw(holdingBehaviorAndHolderBehavior);
    //   break;
  }
};

interface TableColumn {
  label: string;
  prop: string;
}

interface TableData {
  data: any[];
  columns: TableColumn[];
}

const tableLoading = ref(false);
const tableData = ref<TableData>({
  data: [],
  columns: [],
});
let ETFCodesArr: string[] = [];
if (!ETFCodes) {
  // ElMessage({
  //   message: "请先选择需要对比的ETF",
  //   type: "warning",
  // });
  ElMessageBox.confirm(
    "没有选择需要对比的ETF，是否跳转到筛选器页面？",
    "警告",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(() => {
      router.push({
        name: "screener",
      });
    })
    .catch(() => {});
} else {
  ETFCodesArr = (ETFCodes as string).split(",");
  const arr = [
    {
      label: "",
      prop: "name",
    },
  ];
  for (let i = 0; i < ETFCodesArr.length; i++) {
    arr.push({
      label: ETFCodesArr[i],
      prop: ETFCodesArr[i],
      // width: "120px",
      // align: "center",
      // fixed: "left",
    });
  }
  tableData.value.columns = arr;
}
function getCompareOverview() {
  tableLoading.value = true;
  getCompareOverviewApi(ETFCodesArr)
    .then((res) => {
      if (res && res.length > 0) {
        const enumData = {
          etfName: "etf名称",
          etfFullname: "etf全称",
          typeI: "资产类型",
          nav: "份额净值",
          shares: "份额(百万份)",
          aum: "资产规模(百万元)",
          close: "最新收盘价(元)",
          coverRatio: "折溢价率",
          ytdPrice: "今年以来价格变化(%)",
        };
        tableData.value.data = processData(res, enumData);
      } else {
        tableData.value.data = [];
      }
    })
    .finally(() => {
      tableLoading.value = false;
    });
}
function getCompareNetValue() {
  tableLoading.value = true;
  getCompareNetValueApi(ETFCodesArr)
    .then((res) => {
      if (res && res.length > 0) {
        const enumData = {
          etfName: "ETF简称",
          weeklyReturns: "近1周回报(%)",
          ret1: "近1月回报(%)",
          ret3: "近3月回报(%)",
          ret6: "近6月回报(%)",
          ytdNav: "今年以来回报(%)",
          ret12: "近1年回报(%)",
          ret36: "近3年回报(%)",
          ret60: "近5年回报(%)",
        };
        tableData.value.data = processData(res, enumData);
      } else {
        tableData.value.data = [];
      }
    })
    .finally(() => {
      tableLoading.value = false;
    });
}
function getCompareFundFlow() {
  tableLoading.value = true;
  getCompareFundFlowApi(ETFCodesArr)
    .then((res) => {
      if (res && res.length > 0) {
        const enumData = {
          etfName: "ETF简称",
          ff1: "近1月净流入额(百万元)",
          ff3: "近3月净流入额(百万元)",
          ff6: "近6月净流入额(百万元)",
          ytdFf: "今年以来净流入额(百万元)",
          ff12: "近1年净流入额(百万元)",
          ff36: "近3年净流入额(百万元)",
          ff60: "近5年净流入额(百万元)",
        };
        tableData.value.data = processData(res, enumData);
      } else {
        tableData.value.data = [];
      }
    })
    .finally(() => {
      tableLoading.value = false;
    });
}
function getCompareFee() {
  tableLoading.value = true;
  getCompareFeeApi(ETFCodesArr)
    .then((res) => {
      if (res && res.length > 0) {
        const enumData = {
          etfName: "ETF简称",
          issuer: "发行人",
          managementFee: "管理费率(%)",
          custodianFee: "托管费率(%)",
          salesServiceFee: "销售服务费率(%)",
          subscriptionFee: "最高申购费率(%)",
          redemptionFee: "最高赎回费率(%)",
          totalFee: "总费率(%)",
        };
        tableData.value.data = processData(res, enumData);
      } else {
        tableData.value.data = [];
      }
    })
    .finally(() => {
      tableLoading.value = false;
    });
}
function getCompareTradingEfficiency() {
  tableLoading.value = true;
  getCompareTradingEfficiencyApi(ETFCodesArr)
    .then((res) => {
      if (res && res.length > 0) {
        const enumData = {
          etfName: "ETF简称",
          volume1: "近1月日均交易量(百万份)",
          volume3: "近3月日均交易量(百万份)",
          amount1: "近1月日均交易额(百万元)",
          amount3: "近3月日均交易额(百万元)",
          turnover1: "近1月换手率",
          turnover3: "近3月换手率",
          cover1: "近1月日均折溢价率",
          cover3: "近3月日均折溢价率",
          dev1: "近1月日均跟踪偏离度",
          dev3: "近3月日均跟踪偏离度",
          tr1: "近1月日均跟踪误差",
          tr3: "近3月日均跟踪误差",
        };
        tableData.value.data = processData(res, enumData);
      } else {
        tableData.value.data = [];
      }
    })
    .finally(() => {
      tableLoading.value = false;
    });
}
function getCompareDividend() {
  getCompareDividendApi(ETFCodesArr)
    .then((res) => {
      if (res && res.length > 0) {
        const enumData = {
          etfName: "ETF简称",
          cumD: "单位累计分红(元)",
          lyD: "上一年度单位分红(元)",
          ytdD: "今年以来单位分红(元)",
          cumCount: "累计分红次数",
          lyCount: "上一年度分红次数",
          ytdCount: "今年以来分红次数",
          dp: "年度股息率(%)",
        };
        tableData.value.data = processData(res, enumData);
      } else {
        tableData.value.data = [];
      }
    })
    .finally(() => {
      tableLoading.value = false;
    });
}
function getCompareRisk() {
  tableLoading.value = true;
  getCompareRiskApi(ETFCodesArr)
    .then((res) => {
      if (res && res.length > 0) {
        const enumData = {
          etfName: "ETF简称",
          vol1: "近1月收益标准差",
          vol3: "近3月收益标准差",
          vol6: "近6月收益标准差",
          vol12: "近1年收益标准差",
          vol36: "近3年收益标准差",
          beta1: "近1月Beta",
          beta3: "近3月Beta",
          beta12: "近1年Beta",
          beta36: "近3年Beta",
          maxD12: "近1年最大回撤",
          maxD36: "近3年最大回撤",
        };
        tableData.value.data = processData(res, enumData);
      } else {
        tableData.value.data = [];
      }
    })
    .finally(() => {
      tableLoading.value = false;
    });
}
function getCompareHoldingFeature() {
  tableLoading.value = true;
  getCompareHoldingFeatureApi(ETFCodesArr)
    .then((res) => {
      if (res && res.length > 0) {
        const enumData = {
          etfName: "ETF简称",
          etfFullname: "ETF全称",
          stockNumber: "持有证券数量(只)",
          weightedTotalMarketValue: "持仓证券平均市值(百万元)",
          top5HoldingPercent: "前五大持仓占比(%)",
          top10HoldingPercent: "前十大持仓占比(%)",
          top20HoldingPercent: "前二十大持仓占比(%)",
          bigCapPercent: "大盘股占比(%)",
          midCapPercent: "中盘股占比(%)",
          smallCapPercent: "小盘股占比(%)",
          weightedPe: "加权平均PE",
          weightedPb: "加权平均PB",
          weightedPs: "加权平均PS",
          weightedPcf: "加权平均PCF",
        };
        tableData.value.data = processData(res, enumData);
      } else {
        tableData.value.data = [];
      }
    })
    .finally(() => {
      tableLoading.value = false;
    });
}
function getCompareValuation() {
  tableLoading.value = true;
  getCompareValuationApi(ETFCodesArr)
    .then((res) => {
      if (res && res.length > 0) {
        const enumData = {
          etfName: "ETF简称",
          unitProfit: "份额盈利",
          unitNetValue: "份额净资产",
          unitSalesIncome: "份额销售收入",
          unitCashFlow: "份额现金流",
          unitDividend: "份额分红",
          etfPe: "ETF_PE",
          etfPB: "ETF_PB",
          etfPs: "ETF_PS",
          etfPcf: "ETF_PCF",
          etfDp: "ETF_DP",
        };
        tableData.value.data = processData(res, enumData);
      } else {
        tableData.value.data = [];
      }
    })
    .finally(() => {
      tableLoading.value = false;
    });
}
function processData(data: any[], enumData: Record<string, string>) {
  // const arr = []
  // ETFCodesArr.forEach((code) => {
  //   for(let item of res){
  //     if(item.etfCode === code){
  //       (Object.keys(enumData) as Array<keyof typeof enumData>).forEach((key) => {
  //         const index = arr.findIndex((i) => i.name === enumData[key]);
  //         if(index === -1){
  //           arr.push({
  //             name: enumData[key],
  //             [code]: item[key],
  //           });
  //         }else {
  //           arr[index][code] = item[key];
  //         }
  //       });
  //     }
  //   }
  // })
  const resMap = new Map(data.map((item) => [item.etfCode, item]));
  const keys = Object.keys(enumData) as Array<keyof typeof enumData>;
  const arr = keys.map(
    (key) => ({ name: enumData[key] } as Record<string, any>)
  );
  ETFCodesArr.forEach((code) => {
    const item = resMap.get(code);
    if (item) {
      keys.forEach((key, index) => {
        arr[index][code] = item[key];
      });
    }
  });
  return arr;
}
</script>

<style lang="scss" scoped>
@use "@/styles/variables.scss" as *;
$gray-bg: #eee;
$gray-text: #222;
$desc-color: #444;
.comparisonTool_container {
  height: 100%;
  width: 100%;
  padding: 20px;
  .table-pagination {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: right;
  }
  .table_area {
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    margin: 2rem 20px 20px 20px;
    padding: 20px;
  }
  .filter-tabs-wrapper {
    width: 100%;
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
  .link-cell {
    color: $theme-purple;
    text-decoration: none;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  // 移动端适配
  @media (max-width: 768px) {
    padding: 8px;
    .etf-tabs {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0;
      margin-bottom: 1rem;
      .etf-tab-btn {
        font-size: 0.95rem;
        height: 36px;
        padding: 0.4rem 0;
        border-radius: 0;
      }
    }
    .etf-table-section {
      margin-bottom: 1.2rem;
      .etf-table-title {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
      }
      .etf-el-table {
        font-size: 0.95rem;
        :deep(.el-table__body-wrapper),
        :deep(.el-table__header-wrapper) {
          overflow-x: auto !important;
        }
      }
      .etf-table-more {
        font-size: 0.85rem;
        margin-top: 0;
      }
    }
  }
}
</style>
