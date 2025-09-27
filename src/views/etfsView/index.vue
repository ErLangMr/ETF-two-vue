<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { getETFAtoZApi, getETFAumApi, getETFExpenseApi, getETFFundFlowApi, getETFReturnApi, getETFIssuerRevenueApi, getETFDividendApi } from '@/api/ETFType'
import { formatValue } from '@/utils/formatValue'
const router = useRouter();

interface TableColumn {
  prop: string;
  label: string;
  minWidth: string;
  unit?: string;
}

const tableList = ref([
  {
    title: "资产类别",
    value: "category",
    data: [],
    originalColumns: [
      { prop: "category", label: "资产类型", minWidth: "120" },
    ],
    currentColumns: [] as TableColumn[]
  },
  {
    title: "行业",
    value: "sector",
    data: [],
    originalColumns: [
      { prop: "category", label: "行业名称", minWidth: "120" },
    ],
    currentColumns: [] as TableColumn[]
  },
  // {
  //   title: "地区",
  //   value: "region",
  //   data: [],
  //   originalColumns: [
  //     { prop: "category", label: "地区名称", minWidth: "120" },
  //   ],
  // },
  {
    title: "投资区域",
    value: "investmentRegion",
    data: [],
    originalColumns: [
      { prop: "category", label: "区域名称", minWidth: "120" },
    ],
  },
  {
    title: "债券类型",
    value: "category=BOND:bondType",
    data: [],
    originalColumns: [
      { prop: "category", label: "债券类型", minWidth: "120" },
    ],
  },
  {
    title: "债券期限",
    value: "category=BOND:bondDuration",
    data: [],
    originalColumns: [
      { prop: "category", label: "债券期限类型", minWidth: "120" },
    ],
  },
  {
    title: "商品",
    value: "category=GOODS:commodityType",
    data: [],
    originalColumns: [
      { prop: "category", label: "商品类型", minWidth: "120" },
    ],
  },
  {
    title: "商品敞口",
    value: "category=GOODS:commodityExposure",
    data: [],
    originalColumns: [
      { prop: "category", label: "商品敞口", minWidth: "120" },
    ],
  },
  // {
  //   title: "自然资源",
  //   value: "naturalResources",
  //   data: [],
  //   originalColumns: [
  //     { prop: "category", label: "自然资源", minWidth: "120" },
  //   ],
  // },
  // {
  //   title: "货币",
  //   value: "currency",
  //   data: [],
  //   originalColumns: [
  //     { prop: "category", label: "货币", minWidth: "120" },
  //   ],
  // },
  {
    title: "投资风格",
    value: "category=EQUITY:styleAttribute",
    data: [],
    originalColumns: [
      { prop: "category", label: "投资风格", minWidth: "120" },
    ],
  },
  {
    title: "市值属性",
    value: "category=EQUITY:compMarketCap",
    data: [],
    originalColumns: [
      { prop: "category", label: "投资风格", minWidth: "120" },
    ],
  },
  {
    title: "风格属性",
    value: "category=EQUITY:styleAttribute",
    data: [],
    originalColumns: [
      { prop: "category", label: "风格属性", minWidth: "120" },
    ],
  },
  {
    title: "市值-风格属性",
    value: "category=EQUITY:investStrategy",
    data: [],
    originalColumns: [
      { prop: "category", label: "市值-风格属性", minWidth: "120" },
    ],
  },
  {
    title: "发行人",
    value: "fundMgrs",
    data: [],
    originalColumns: [
      { prop: "category", label: "发行人", minWidth: "120" },
    ],
  },
]);

const tabs = [
  { label: "A to Z", value: "A to Z",columns: [
      { prop: "totalCount", label: "ETF 数量", minWidth: "120" },
      { prop: "topFundMgr", label: "数量最多发行人", minWidth: "180" },
    ], },
  { label: "资产规模", value: "AUM",columns: [
    { prop: "fundFlowRank", label: "资产规模排名", minWidth: "120" },
    { prop: "dataValue", label: "资产规模(百万元)", minWidth: "120", unit: "million" },
    { prop: "topFundMgr", label: "发行人", minWidth: "180" },
  ], },
  { label: "资金流动", value: "Fund Flow",columns: [
      { prop: "fundFlowRank", label: "资金流动排名", minWidth: "120" },
      { prop: "dataValue", label: "过去三个月的资金净流入额(百万元)", minWidth: "120", unit: "million" },
      { prop: "topFundMgr", label: "发行人", minWidth: "180" },
    ], },
  { label: "收益", value: "Return",columns: [
      { prop: "fundFlowRank", label: "收益排名", minWidth: "120" },
      { prop: "dataValue", label: "过去三个月的平均收益(%)", minWidth: "120" },
      { prop: "topFundMgr", label: "发行人", minWidth: "180" },
    ], },
  { label: "费用", value: "Expense",columns: [
      { prop: "fundFlowRank", label: "费用排名", minWidth: "120" },
      { prop: "dataValue", label: "平均费率(%)", minWidth: "120" },
      { prop: "topFundMgr", label: "发行人", minWidth: "180" },
    ], },
  { label: "分红", value: "Dividend",columns: [
      { prop: "fundFlowRank", label: "分红排名", minWidth: "120" },
      { prop: "dataValue", label: "平均分红率(%)", minWidth: "120" },
      { prop: "topFundMgr", label: "发行人", minWidth: "180" },
    ], },
  { label: "发行人收入", value: "Issuer Revenue",columns: [
      { prop: "topFundMgr", label: "收入最高的发行人", minWidth: "120" }
    ], },
];
const activeTab = ref("A to Z");
updateColumns()

 function updateColumns() {
  const selectedTab = tabs.find(tab => tab.value === activeTab.value)
  if (selectedTab) {
    tableList.value.forEach(table => {
      // 合并原始列 + 当前 tab 的列
      table.currentColumns = [
        ...table.originalColumns, // 原始定义的列
        ...selectedTab.columns   // 当前 tab 的列
      ]
      if(table.value === "fundMgrs") {
        table.currentColumns.pop()
        if(selectedTab.value === "Issuer Revenue") {
          table.currentColumns.push({ prop: "fundFlowRank", label: "发行人收入排名", minWidth: "120" })
          table.currentColumns.push({ prop: "dataValue", label: "发行人收入(百万元)", unit: "million", minWidth: "120" })
        }

      }
    })
    const setTableData = (data: any) => {
      tableList.value.map(table => {
        const arr = data.filter((item: any) => item.typeName === table.value)
        table.data = arr[0]?.data || []
      })
    }
    if(selectedTab.value === "A to Z") {
      getETFAtoZApi()
      .then(res => {
        console.log(res,1111)
        setTableData(res)
      })
    }
    if(selectedTab.value === "Fund Flow") {
      getETFFundFlowApi()
      .then(res => {
        setTableData(res)
      })
    }
    if(selectedTab.value === "Return") {
      getETFReturnApi()
      .then(res => {
        setTableData(res)
      })
    }
    if(selectedTab.value === "AUM") {
      getETFAumApi()
      .then(res => {
        setTableData(res)
      })
    }
    if(selectedTab.value === "Expense") {
      getETFExpenseApi()
      .then(res => {
        setTableData(res)
      })
    }
    if(selectedTab.value === "Dividend") {
      getETFDividendApi()
      .then(res => {
        setTableData(res)
      })
    }
    if(selectedTab.value === "Issuer Revenue") {
      getETFIssuerRevenueApi()
      .then(res => {
        setTableData(res)
      })
    }
  }
}

const activeTabChange = (value: string) => {
  activeTab.value = value
  updateColumns()
}



// 控制每个表格的展开状态，类型安全
const expanded = reactive<Record<number, boolean>>({});
tableList.value.forEach((_, idx) => (expanded[idx] = false));

const columnClick = (row: any, prop: string, unit?: string) => {
  console.log(row, prop, unit);
  router.push({
    name: "etfs-list",
    query: {
      theme: JSON.stringify(row),
    },
  });
};
const categoryList = ref([
  { label: "股票", value: "EQUITY" },
  { label: "债券", value: "BOND" },
  { label: "商品", value: "GOODS" },
  { label: "货币", value: "CURRENCY" },
  { label: "跨境", value: "CROSS_BOUNDARY" },
])
</script>

<template>
  <div class="etf-directory-container">
    <h1>ETF 类型</h1>
    <p class="etf-desc">
      随着 ETF 领域的持续拓展，可利用下方表格筛选感兴趣的 ETF类型。ETF
      产品涵盖广泛的资产类别、行业领域、发行人及投资风格。一只ETF产品根据不同维度可同时归属于多种类型；例如，一只名称为 “嘉实中证机器人
      ETF”（产品代码：159526）的主题类 ETF 产品，
      可同时归类为：资产类型为“股票”，行业类型为“工业”，市值风格为
      “小盘”且投资风格属于“成长”。
    </p>
    <div class="etf-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTabChange(tab.value)"
        :class="[
          'etf-tab-btn',
          { active: activeTab === tab.value },
          tabs.indexOf(tab) === 0 ? 'first' : '',
          tabs.indexOf(tab) === tabs.length - 1 ? 'last' : '',
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <section
      v-for="(table, idx) in tableList"
      :key="table.title"
      class="etf-table-section">
      <h2 class="etf-table-title">{{ table.title }}</h2>
      <el-table
        :data="
          expanded[idx] || table.data.length <= 3
            ? table.data
            : table.data.slice(0, 3)
        "
        class="etf-el-table"
        :header-cell-style="{
          background: '#f5f5fa',
          color: '#4B2994',
          fontWeight: 'bold',
          fontSize: '1rem',
        }"
        :cell-style="{ fontSize: '1rem', padding: '0.7rem' }"
      >
        <template v-if="table.value === 'category'">
          <el-table-column
            v-for="col in table.currentColumns"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label">
            <template #default="scope">
              <template v-if="col.prop === 'category'">
                <span
                  class="etf-issuer"
                  @click="columnClick(scope.row, col.prop)">
                  {{ categoryList.find(item => item.value === scope.row[col.prop])?.label }}
                </span>
              </template>
              <template v-else>
                <span
                  class="etf-issuer"
                  @click="columnClick(scope.row, col.prop)">
                  {{ formatValue(scope.row[col.prop], col?.unit) }}
                </span>
              </template>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column
            v-for="col in table.currentColumns"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label">
            <template #default="scope">
              <span
                class="etf-issuer"
                @click="columnClick(scope.row, col.prop)"
                >{{ formatValue(scope.row[col.prop], col?.unit) }}</span
              >
            </template>
          </el-table-column>
        </template>
      </el-table>
      <div
        v-if="table.data.length > 3"
        class="etf-table-more"
        @click="expanded[idx] = !expanded[idx]"
      >
        <template v-if="!expanded[idx]">
          展开剩余 {{ table.data.length - 3 }} 个 {{ table.title }}
          <span class="arrow">▼</span>
        </template>
        <template v-else> 收起 <span class="arrow">▲</span> </template>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

$gray-bg: #eee;
$gray-text: #222;
$desc-color: #444;

.etf-directory-container {
  width: 100%;
  padding: 20px;
  font-family: "Segoe UI", Arial, sans-serif;
  box-sizing: border-box;

  .etf-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  .etf-desc {
    color: $desc-color;
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
  .etf-tabs {
    display: flex;
    margin-bottom: 2rem;
    .etf-tab-btn {
      flex: 1;
      padding: 0.7rem;
      font-weight: 500;
      font-size: 1rem;
      height: 44px;
      // background: $gray-bg;
      color: $gray-text;
      border: 1px solid #e5e5e5;
      border-right: none;
      border-bottom: none;
      border-radius: 0;
      // transition: background 0.2s, color 0.2s;
      cursor: pointer;
      &.first {
        border-radius: 4px 0 0 4px;
      }
      &.last {
        border-radius: 0 4px 4px 0;
      }
      &.active {
        background: $theme-purple;
        color: #fff;
      }
    }
  }
  .etf-table-section {
    margin-bottom: 2.5rem;
    .etf-table-title {
      color: $theme-purple;
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }
    .etf-el-table {
      width: 100%;
      margin-bottom: 0.5rem;
      // 让表格在小屏幕下可横向滚动
      overflow-x: auto;
      :deep(.el-table__body-wrapper),
      :deep(.el-table__header-wrapper) {
        overflow-x: auto !important;
      }
    }
    .etf-issuer {
      color: $theme-purple;
      font-weight: 500;
      cursor: pointer;
    }
    .etf-table-more {
      color: $theme-purple;
      font-size: 0.95rem;
      cursor: pointer;
      user-select: none;
      text-align: center;
      margin-top: 2px;
      .arrow {
        font-size: 1.1em;
      }
    }
  }

  // 移动端适配
  @media (max-width: 768px) {
    padding: 8px;
    .etf-title {
      font-size: 1.5rem;
      margin-bottom: 0.3rem;
    }
    .etf-desc {
      font-size: 0.95rem;
      margin-bottom: 1rem;
    }
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
