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
      <component :is="componentTab" :tableData="tableData"></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from "vue";
import TableComp from "./components/tableComp.vue";
import performanceAndRisk from "./components/performanceAndRisk.vue";
import fundFlows from "./components/fundFlows.vue";
import holdingsCharacteristics from "./components/holdingsCharacteristics.vue";
import holdingBehaviorAndHolderBehavior from "./components/holdingBehaviorAndHolderBehavior.vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
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
    label: "归因分析",
    value: "attributionAnalysis",
    descTitle: "归因分析",
    desc: "归因分析的一些描述",
  },
  {
    label: "资金流动",
    value: "fundFlows",
    descTitle: "资金流动",
    desc: "资金流动的一些描述",
  },
  {
    label: "持仓特征",
    value: "holdingsCharacteristics",
    descTitle: "持仓特征",
    desc: "持仓特征的一些描述",
  },
  {
    label: "持仓行为和持有人行为",
    value: "holdingBehaviorAndHolderBehavior",
    descTitle: "持仓行为和持有人行为",
    desc: "持仓行为和持有人行为的一些描述",
  },
];
const handleTabClick = (tab: string) => {
  activeTab.value = tab;
  switch (tab) {
    case "basicInformation":
      componentTab.value = markRaw(TableComp);
      break;
    case "returnsAndCosts":
      componentTab.value = markRaw(TableComp);
      break;
    case "divisionAndValuation":
      componentTab.value = markRaw(TableComp);
      break;
    case "performanceAndRisk":
      componentTab.value = markRaw(performanceAndRisk);
      break;
    case "attributionAnalysis":
      componentTab.value = markRaw(TableComp);
      break;
    case "fundFlows":
      componentTab.value = markRaw(fundFlows);
      break;
      case "holdingsCharacteristics":
      componentTab.value = markRaw(holdingsCharacteristics);
      break;
    case "holdingBehaviorAndHolderBehavior":
      componentTab.value = markRaw(holdingBehaviorAndHolderBehavior);
      break;
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

const tableData = ref<TableData>({
  data: [],
  columns: [],
});
if (!ETFCodes) {
  ElMessage({
    message: "请先选择需要对比的ETF",
    type: "warning",
  });
} else {
  const ETFCodesArr = (ETFCodes as string).split(",");
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
