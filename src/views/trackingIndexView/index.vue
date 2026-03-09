<template>
  <div class="trackingIndex_container">
    <div>
      <div class="trackingIndex-header">
        <h1 class="screener-title">ETF跟踪指数</h1>
      </div>
    </div>
    <div class="trackingIndex-pc">
      <!-- 移动端 Filter 按钮 -->
      <button
        class="mobile-filter-btn"
        @click="openMobileFilter"
        v-show="isMobile()"
      >
        <Operation />筛选
      </button>
      <!-- PC端筛选器 -->
      <div class="filter-left pc-filter" v-show="!isMobile()">
        <ScreenerFilter
          v-model:selected-child="selectedChild"
          v-model:selected-items="selectedItems"
          v-model:slider-items="sliderItems"
        />
      </div>
      <!-- 移动端遮罩和弹窗 -->
      <div v-if="showMobileFilter" class="mobile-filter-mask">
        <div class="mobile-filter-panel">
          <div class="mobile-filter-header">
            <span>筛选器</span>
            <button class="reset-btn" @click="mobileFilterRef?.resetFilters()">
              重置
            </button>
            <span class="close-btn" @click="closeMobileFilter">×</span>
          </div>
          <div class="mobile-filter-content">
            <ScreenerFilter
              ref="mobileFilterRef"
              v-model:selected-child="selectedChild"
              v-model:selected-items="selectedItems"
              v-model:slider-items="sliderItems"
            />
          </div>
        </div>
      </div>
      <ScreenerTable
        class="table-area"
        :tableData="etfList"
        :hasTableFilter="true"
        :filterTabsProp="trankingTabs"
        :tableColumnListProp="trankingColumnList"
        @tableFilterTab="handleTableFilterTab"
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
import { ref, onMounted, nextTick, computed, watch } from "vue";
import ScreenerFilter from "@/components/ScreenerFilterV2.vue";
import type { FilterItem } from "@/components/ScreenerFilter.vue";
import ScreenerTable from "@/components/ScreenerTable.vue";
import { useDevice } from "@/utils/device";
import { Operation } from "@element-plus/icons-vue";
import { getOverviewPageApi, getNetValuePageApi, getDividendPageApi, getRiskPageApi, getHoldingFeaturePageApi, getValuationPageApi, getRelatedPageApi } from "@/api/trackingIndex";

const { isMobile } = useDevice();

interface TableColumn {
  prop: string;
  label: string;
  type?: string;
  url?: string | undefined;
  unit?: string;
  width?: number;
  showTooltip?: boolean;
}
const trankingTabs = [
  { label: "概览", value: "overview" },
  { label: "收益", value: "returns" },
  // { label: "资金流动", value: "fundFlows" },
  { label: "分红", value: "dividends" },
  { label: "风险指标", value: "risk" },
  { label: "持仓特征", value: "holdings" },
  { label: "估值", value: "valuation" },
  { label: "相关ETF", value: "relatedETF" },
]

const trankingColumnList: Record<string, TableColumn[]> = {
  overview: [
    { prop: "indexCode", label: "指数代码", type: "link", url: "/trackingIndexDetails", width: 110, showTooltip: false },
    { prop: "fyIndexCode", label: "全收益指数代码", width: 140, showTooltip: true },
    { prop: "indexName", label: "指数名称", type: "link", url: "/trackingIndexDetails", width: 120, showTooltip: true },
    { prop: "consNum", label: "成份证券个数", width: 130, showTooltip: false },
    { prop: "launchDate", label: "发布日期", width: 110, showTooltip: false },
    { prop: "baseDate", label: "基日", width: 110, showTooltip: false },
    { prop: "baseValue", label: "基点", width: 110, showTooltip: false },
    { prop: "indexIssuer", label: "发布机构", width: 160, showTooltip: true },
    { prop: "methodology", label: "加权方式", width: 170, showTooltip: true },
    { prop: "nyIndexCode", label: "净收益指数代码", width: 140, showTooltip: false },
    { prop: "returnType", label: "收益处理方式", width: 130, showTooltip: false },
    { prop: "typeI", label: "一级分类", width: 110, showTooltip: false },
    { prop: "typeII", label: "二级分类", width: 110, showTooltip: false },
  ],
  returns: [
    { prop: "indexCode", label: "指数代码", type: "link", url: "/trackingIndexDetails", width: 110, showTooltip: false },
    { prop: "indexName", label: "指数简称", type: "link", url: "/trackingIndexDetails", width: 120, showTooltip: true },
    { prop: "ret1", label: "近1月涨跌（%）", width: 160 },
    { prop: "ret3", label: "近3月涨跌（%）", width: 160 },
    { prop: "ret12", label: "近1年涨跌（%）", width: 160 },
    { prop: "ret36", label: "近3年涨跌（%）", width: 160 },
    { prop: "ret60", label: "近5年涨跌（%）", width: 160 },
    { prop: "retYTD", label: "今年以来涨跌（%）", width: 170 },
  ],
  fundFlows: [
    { prop: "code", label: "指数代码" },
    { prop: "shortName", label: "指数简称", type: "link", url: "/trackingIndexDetails" },
    { prop: "flow1M", label: "近1月" },
    { prop: "flow3M", label: "3月" },
    { prop: "flowYTD", label: "今年以来" },
    { prop: "flow1Y", label: "1年" },
    { prop: "flow3Y", label: "3年" },
    { prop: "flow5Y", label: "5年资金净流入" },
  ],
  dividends: [
    { prop: "indexCode", label: "指数代码", type: "link", url: "/trackingIndexDetails", width: 110, showTooltip: false },
    { prop: "indexName", label: "指数简称", type: "link", url: "/trackingIndexDetails", width: 120, showTooltip: true },
    { prop: "annualDividend", label: "年度分红(元)", width: 160 },
    { prop: "dividendYield", label: "股息率" },
  ],
  risk: [
    { prop: "indexCode", label: "指数代码", type: "link", url: "/trackingIndexDetails", width: 110, showTooltip: false },
    { prop: "indexName", label: "指数简称", type: "link", url: "/trackingIndexDetails", width: 120, showTooltip: true },
    { prop: "yvol1", label: "近1月波动率(%)", width: 160 },
    { prop: "yvol3", label: "3月波动率(%)", width: 160 },
    { prop: "yvol6", label: "今年以来波动率(%)", width: 170 },
    { prop: "yvol12", label: "1年波动率(%)", width: 160 },
    { prop: "yvol36", label: "3年波动率(%)", width: 160 },
    { prop: "yvol60", label: "5年波动率(%)", width: 160 },
  ],
  holdings: [
    { prop: "indexCode", label: "指数代码", type: "link", url: "/trackingIndexDetails", width: 110, showTooltip: false },
    { prop: "indexName", label: "指数简称", type: "link", url: "/trackingIndexDetails", width: 120, showTooltip: true },
    { prop: "stkNum", label: "样本数量", width: 110 },
    { prop: "tmv", label: "指数市值（亿元）", width: 160 },
    { prop: "aamv", label: "指数平均流通A股市值（亿元）", width: 260 },
    { prop: "mamv", label: "指数流通A股市值中位数（亿元）", width: 260 },
    { prop: "tamv", label: "指数流通A股市值（亿元）", width: 260 },
    { prop: "con5", label: "前五大权重之和(%)", width: 180 },
    { prop: "con10", label: "前十大权重之和(%)", width: 180 },
    { prop: "con20", label: "前二十大权重之和(%)", width: 180 },
  ],
  valuation: [
    { prop: "indexCode", label: "指数代码", type: "link", url: "/trackingIndexDetails", width: 110, showTooltip: false },
    { prop: "indexName", label: "指数简称", type: "link", url: "/trackingIndexDetails", width: 120, showTooltip: true },
    { prop: "pb10", label: "PB分位值-10年（%）", width: 180 },
    { prop: "pb3", label: "PB分位值-3年（%）", width: 180 },
    { prop: "pb5", label: "PB分位值-5年（%）", width: 180 },
    { prop: "pe10", label: "PE分位值-10年（%）", width: 180 },
    { prop: "pe3", label: "PE分位值-3年（%）", width: 180 },
    { prop: "pe5", label: "PE分位值-5年（%）", width: 180 },
    { prop: "tpb", label: "PB", width: 180 },
    { prop: "tpe", label: "PE", width: 180 },
  ],
  relatedETF: [
    { prop: "indexCode", label: "指数代码", type: "link", url: "/trackingIndexDetails", width: 110, showTooltip: false },
    { prop: "indexName", label: "指数简称", type: "link", url: "/trackingIndexDetails", width: 120, showTooltip: true },
    { prop: "etfNum", label: "相关ETF只数", width: 110 },
    { prop: "etfAUM", label: "相关ETF规模（亿元）", width: 160 }
  ],
}

const mobileFilterRef = ref();
// 单选的值（一级分类）
const selectedChild = ref("");
// 多选的值（二级分类）
const selectedItems = ref<string[]>([]);
// 滑块的值
const sliderItems = ref<{ [key: string]: number }>({});
// 滑块的值（滑块的值）
let sliderValue: Record<string, any>[] = [];
let paramsObj: Record<string, any> = {};

// 添加防抖函数
const debounce = (fn: Function, delay: number) => {
  let timer: number | null = null;
  return function (this: any, ...args: any[]) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

// 创建防抖后的请求函数
const debouncedGetFilterTableData = debounce((params?: Record<string, any>) => {
  page.value = 1;
  getTrackingIndexTableData(params);
}, 300);

watch(selectedChild, (newVal) => {
  if (newVal) {
    if (!selectedItems.value.length) {
      paramsObj.category = newVal;
      paramsObj.codes = null;
      page.value = 1;
      getTrackingIndexTableData(paramsObj);
    }
  }
});

watch(
  selectedItems,
  (newVal) => {
    // 如果是重置操作，直接清空参数并请求
    if (newVal.length === 0 && !selectedChild.value) {
      paramsObj.codes = null;
      paramsObj.category = null;
      page.value = 1;
      getTrackingIndexTableData(paramsObj);
      return;
    }

    // 正常筛选逻辑
    if (newVal.length > 0) {
      paramsObj.codes = newVal;
      paramsObj.category = null;
      page.value = 1;
      getTrackingIndexTableData(paramsObj);
    } else if (selectedChild.value) {
      paramsObj.codes = null;
      paramsObj.category = selectedChild.value;
      page.value = 1;
      debouncedGetFilterTableData(paramsObj);
    }
  },
  { deep: true }
);

watch(
  sliderItems,
  (newVal) => {
    console.log(newVal, newVal.length, 33333);
    if (Object.keys(newVal).length > 0) {
      const index = sliderValue.findIndex(
        (item) =>
          Object.keys(item).toString() === Object.keys(newVal).toString()
      );
      if (index > -1) {
        sliderValue.splice(index, 1);
      }
      sliderValue.push(newVal);
      const obj: Record<string, any> = {};
      sliderValue.forEach((item) => {
        Object.keys(item).forEach((key) => {
          obj[key] = item[key];
        });
      });
      Object.assign(paramsObj, obj);
      page.value = 1;
      getTrackingIndexTableData(paramsObj);
    } else {
      sliderValue = [];
      paramsObj = {};
      page.value = 1;
      getTrackingIndexTableData();
    }
  },
  { deep: true }
);

const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
function handlePageChange(val: number) {
  page.value = val;
  getTrackingIndexTableData(paramsObj);
}
// 顶部筛选Tab变化，获取表格数据
const tableFilterTab = ref("overview");
function handleTableFilterTab(tab: string) {
  tableFilterTab.value = tab;
  getTrackingIndexTableData(paramsObj)
}
function getTrackingIndexTableData(params?: Record<string, any>) {
  const obj = {
    page: page.value,
    size: pageSize.value,
    ...params,
  };
  if(tableFilterTab.value === "overview"){
    getOverviewPageApi(obj).then((res: any) => {
      etfList.value = res.content;
      total.value = res.totalElements;
    });
  } else if (tableFilterTab.value === "returns") {
    getNetValuePageApi(obj).then((res: any) => {
      etfList.value = res.content;
      total.value = res.totalElements;
    });
  }
  // else if (tableFilterTab.value === "fundFlows") {
  //   getFundFlowPageApi(obj).then((res: any) => {
  //     etfList.value = res.content;
  //     total.value = res.totalElements;
  //   });
  // }
  else if (tableFilterTab.value === "dividends") {
    getDividendPageApi(obj).then((res: any) => {
      etfList.value = res.content;
      total.value = res.totalElements;
    });
  } else if (tableFilterTab.value === "risk") {
    getRiskPageApi(obj).then((res: any) => {
      etfList.value = res.content;
      total.value = res.totalElements;
    });
  } else if (tableFilterTab.value === "holdings") {
    getHoldingFeaturePageApi(obj).then((res: any) => {
      etfList.value = res.content;
      total.value = res.totalElements;
    });
  } else if (tableFilterTab.value === "valuation") {
    getValuationPageApi(obj).then((res: any) => {
      etfList.value = res.content;
      total.value = res.totalElements;
    });
  } else if (tableFilterTab.value === "relatedETF") {
    getRelatedPageApi(obj).then((res: any) => {
      etfList.value = res.content;
      total.value = res.totalElements;
    });
  }
}
function getOverviewPage(params?: Record<string, any>) {
  const obj = {
    page: page.value,
    size: pageSize.value,
    ...params,
  };
  getOverviewPageApi(obj).then((res: any) => {
    etfList.value = res.content;
    total.value = res.totalElements;
  });
}

const etfList = ref<any[]>([]);

const showMobileFilter = ref(false);
function openMobileFilter() {
  showMobileFilter.value = true;
}
function closeMobileFilter() {
  showMobileFilter.value = false;
}

onMounted(() => {
  getOverviewPage();
});
</script>

<style lang="scss" scoped>
.trackingIndex_container {
  width: 100%;
  height: 100%;
  .trackingIndex-header {
    width: 100%;
    padding: 20px;
    padding-bottom: 0;
    background: #fff;
  }
  .trackingIndex-pc {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    min-height: 100vh;
    padding: 20px;
    background: #ffffff;
  }
  .filter-left {
    width: 320px;
    flex-shrink: 0;
  }
  .table-area {
    flex: 1;
    min-width: 0;
    margin-left: 20px;
  }
  // 移动端样式
  .mobile-filter-btn {
    display: none;
    position: fixed;
    top: 85px;
    right: calc(50% - 45px);
    z-index: 1001;
    background: var(--theme-purple);
    border: 1px solid var(--theme-purple);
    border-radius: 4px;
    padding: 5px 20px;
    font-size: var(--font-size-medium);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    color: #fff;
    svg {
      height: 18px;
      vertical-align: middle;
      margin-right: 4px;
      margin-bottom: 4px;
    }
  }
  .mobile-filter-mask {
    position: fixed;
    z-index: 2000;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: flex-end;
  }
  .mobile-filter-panel {
    background: #fff;
    width: 100vw;
    max-width: none;
    height: 100vh;
    display: flex;
    flex-direction: column;
    box-shadow: none;
    border: none;
  }
  .mobile-filter-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 18px 20px 12px 20px;
    font-size: var(--font-size-large);
    font-weight: 600;
    border-bottom: 1px solid #eee;
    background: #fff;
    position: relative;
    gap: 12px;
    span {
      font-weight: 600;
    }
    .reset-btn {
      margin-left: 12px;
      background: #f5f5f5;
      border: 1px solid #ddd;
      color: #888;
      cursor: pointer;
      font-size: var(--font-size-base);
      padding: 4px 12px;
      border-radius: 5px;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      gap: 4px;
      &:hover {
        background: #e6e6e6;
        color: #409eff;
        border-color: #409eff;
      }
    }
    .close-btn {
      font-size: 28px;
      cursor: pointer;
      line-height: 1;
      position: absolute;
      right: 20px;
      top: 16px;
    }
  }
  .mobile-filter-content {
    flex: 1;
    overflow-y: auto;
    padding: 0 0 24px 0;
  }
  // 响应式：移动端显示移动筛选，隐藏PC筛选
  @media (max-width: 768px) {
    :deep(.filters-header) {
      display: none !important;
    }
    .filter-left.pc-filter {
      display: none !important;
    }
    .mobile-filter-btn {
      display: block;
    }
    .table-area {
      margin-left: 0;
    }
    .mobile-filter-panel {
      width: 100vw;
      max-width: none;
      border-radius: 0;
    }
  }
}
</style>
