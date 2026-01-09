<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from "vue";
import ScreenerFilter from "@/components/ScreenerFilter.vue";
import ScreenerFilterV2 from "@/components/ScreenerFilterV2.vue";
import type { FilterItem } from "@/components/ScreenerFilter.vue";
import ScreenerTable from "@/components/ScreenerTable.vue";
import { useDevice } from "@/utils/device";
import { Operation } from "@element-plus/icons-vue";
import { getFilterTableApi, getEtfFilterDataApi, getEtfOverviewPageApi, getEtfNetValuePageApi, getEtfFundFlowPageApi, getEtfFeePageApi, getEtfTradingEfficiencyPageApi, getEtfDividendPageApi, getEtfRiskPageApi, getEtfHoldingFeaturePageApi, getEtfValuationPageApi } from "@/api/filterTable";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { usePortfolioSimulatorStore } from "@/store/portfolioSimulator";
// import responseData from "@/components/response_1763022495540.json";

const portfolioSimulatorStore = usePortfolioSimulatorStore();

const router = useRouter()
const { isMobile } = useDevice();
const mobileFilterRef = ref();
// 控制使用哪个版本的筛选器 (true: 新版, false: 旧版)
const useNewFilter = ref(true);
// 单选的值（一级分类）
const selectedChild = ref("");
// 多选的值（二级分类）
const selectedItems = ref<string[]>([]);
// 滑块的值
const sliderItems = ref<{ [key: string]: number }>({});
// 滑块的值（滑块的值）
let sliderValue:Record<string, any>[] = []
let paramsObj: Record<string, any> = {}

onMounted(() => {
  getFilterData()
  getEtfTableData()
});

// 获取筛选数据
const responseData = ref<any>([]);
function getFilterData() {
  getEtfFilterDataApi().then((res: any) => {
    responseData.value = res
  });
}

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
  page.value = 1
  getEtfTableData(params);
}, 300);

watch(selectedChild, (newVal) => {
  console.log(newVal, 11111);
  if(newVal) {
    // 单选时，如果 selectedItems 为空或者是刚刚被清空，才调用接口
    // 避免与 selectedItems 的 watch 重复调用
    if (!selectedItems.value.length) {
      paramsObj.category = newVal
      paramsObj.codes = null
      page.value = 1
      // 使用 nextTick 确保 selectedItems 的 watch 先执行
      nextTick(() => {
        if (!selectedItems.value.length) {
          getEtfTableData(paramsObj)
        }
      })
    }
  }
});

watch(
  selectedItems,
  (newVal) => {
    console.log('selectedItems changed:', newVal);
    // 如果是重置操作，直接清空参数并请求
    if (newVal.length === 0 && !selectedChild.value) {
      paramsObj.codes = null;
      paramsObj.category = null;
      page.value = 1;
      getEtfTableData(paramsObj);
      return;
    }

    // 正常筛选逻辑
    if (newVal.length > 0) {
      paramsObj.codes = newVal;
      paramsObj.category = null;
      page.value = 1;
      getEtfTableData(paramsObj);
    }
    // 删除 else if 分支，避免重复调用
  },
  { deep: true }
);

watch(sliderItems, (newVal) => {
  console.log(newVal,newVal.length, 33333);
  if(Object.keys(newVal).length > 0) {
    const index = sliderValue.findIndex(item => Object.keys(item).toString() === Object.keys(newVal).toString());
    if (index > -1) {
      sliderValue.splice(index, 1);
    }
    sliderValue.push(newVal);
    const obj: Record<string, any> = {}
    sliderValue.forEach(item => {
      Object.keys(item).forEach(key => {
        obj[key] = item[key]
      })
    })
    Object.assign(paramsObj, obj)
    page.value = 1
    getEtfTableData(paramsObj)
  }else{
    sliderValue = []
    paramsObj = {}
    page.value = 1
    getEtfTableData()
  }
}, { deep: true });

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
function handlePageChange(val: number) {
  page.value = val
  getEtfTableData(paramsObj)
}
function getFilterTableData(params?: Record<string, any>) {
  const obj = {
    page: page.value,
    pageSize: pageSize.value,
    ...params
  }
  getFilterTableApi(obj).then((res: any) => {
    etfList.value = res.content
    total.value = res.totalElements
  });
}

// 顶部筛选Tab变化，获取表格数据
const tableFilterTab = ref("overview");
function handleTableFilterTab(tab: string) {
  tableFilterTab.value = tab;
  getEtfTableData(paramsObj)
}

function getEtfTableData(params?: Record<string, any>) {
  const obj = {
    page: page.value,
    size: pageSize.value,
    ...params
  }
  if( tableFilterTab.value === 'overview'){
    getEtfOverviewPageApi(obj).then((res: any) => {
      etfList.value = res.content
      total.value = res.totalElements
    }).catch((err: any) => {
      etfList.value = []
      total.value = 0
    });
    return
  } else if( tableFilterTab.value === 'returns'){
    getEtfNetValuePageApi(obj).then((res: any) => {
      etfList.value = res.content
      total.value = res.totalElements
    }).catch((err: any) => {
      etfList.value = []
      total.value = 0
    });
    return
  } else if( tableFilterTab.value === 'fundFlows'){
    getEtfFundFlowPageApi(obj).then((res: any) => {
      etfList.value = res.content
      total.value = res.totalElements
    }).catch((err: any) => {
      etfList.value = []
      total.value = 0
    });
    return
  }else if( tableFilterTab.value === 'expenses'){
    getEtfFeePageApi(obj).then((res: any) => {
      etfList.value = res.content
      total.value = res.totalElements
    }).catch((err: any) => {
      etfList.value = []
      total.value = 0
    });
    return
  } else if( tableFilterTab.value === 'efficiency'){
    getEtfTradingEfficiencyPageApi(obj).then((res: any) => {
      etfList.value = res.content
      total.value = res.totalElements
    }).catch((err: any) => {
      etfList.value = []
      total.value = 0
    });
    return
  } else if( tableFilterTab.value === 'dividends'){
    getEtfDividendPageApi(obj).then((res: any) => {
      etfList.value = res.content
      total.value = res.totalElements
    }).catch((err: any) => {
      etfList.value = []
      total.value = 0
    });
    return
  } else if( tableFilterTab.value === 'risk'){
    getEtfRiskPageApi(obj).then((res: any) => {
      etfList.value = res.content
      total.value = res.totalElements
    }).catch((err: any) => {
      etfList.value = []
      total.value = 0
    });
    return
  } else if( tableFilterTab.value === 'holdings'){
    getEtfHoldingFeaturePageApi(obj).then((res: any) => {
      etfList.value = res.content
      total.value = res.totalElements
    }).catch((err: any) => {
      etfList.value = []
      total.value = 0
    });
  } else if( tableFilterTab.value === 'valuation'){
    getEtfValuationPageApi(obj).then((res: any) => {
      etfList.value = res.content
      total.value = res.totalElements
    }).catch((err: any) => {
      etfList.value = []
      total.value = 0
    });
  }
}

const etfList = ref<any[]>([]);

const showMobileFilter = ref(false);
function openMobileFilter() {
  showMobileFilter.value = true;
}
function closeMobileFilter() {
  showMobileFilter.value = false;
}

// 分析、对比、深度对比
const tableSelestValue = ref<string[]>([])
const selectEtfList = ref([]);
function handleTableSelect(val: string[], row: any) {
  console.log(val, row, "handleTableSelect")
  tableSelestValue.value = val
  selectEtfList.value = row
}
function handleAnalysis() {
  if(tableSelestValue.value.length === 0) {
    ElMessage({
      message: '请先选择需要分析的ETF',
      type: 'warning',
    })
    return
  }else if(tableSelestValue.value.length === 1){
    ElMessage({
      message: '请至少选择两个需要对比的ETF',
      type: 'warning',
    })
    return
  }
  portfolioSimulatorStore.selectETFList = selectEtfList.value
  router.push({name: "PortfolioSimulator"})
}
function handleCompare() {
  if(tableSelestValue.value.length === 0) {
    ElMessage({
      message: '请先选择需要对比的ETF',
      type: 'warning',
    })
    return
  }else if(tableSelestValue.value.length === 1){
    ElMessage({
      message: '请至少选择两个需要对比的ETF',
      type: 'warning',
    })
    return
  }
  router.push({
    name: "ComparisonTool",
    query: {
      ETFCodes: tableSelestValue.value.join(",")
    }
  })
}
function handleDeepCompare() {
  if(tableSelestValue.value.length === 0) {
    ElMessage({
      message: '请先选择需要对比的ETF',
      type: 'warning',
    })
    return
  }else if(tableSelestValue.value.length === 1 || tableSelestValue.value.length > 2){
    ElMessage({
      message: '请选择两个需要深度对比的ETF',
      type: 'warning',
    })
    return
  }
  nextTick(() => {
    router.push({
      name: "DeepCompare",
      query: {
        codes: tableSelestValue.value.join(",")
      }
    })
  })
}
</script>

<template>
  <div>
    <div class="screener-header">
      <h1 class="screener-title">ETF筛选器</h1>
    </div>
  </div>
  <div class="screener-pc">
    <!-- 移动端 Filter 按钮 -->
    <button
      class="mobile-filter-btn"
      @click="openMobileFilter"
      v-show="isMobile()"
    >
      <Operation />筛选
    </button>

    <el-button class="theme-button" style="position: absolute; right: 250px;top: -20px;" @click="handleAnalysis">组合分析</el-button>
    <el-button class="theme-button" style="position: absolute; right: 150px;top: -20px;" @click="handleCompare">ETF对比</el-button>
    <el-button class="theme-button" style="position: absolute; right: 20px;top: -20px;" @click="handleDeepCompare">ETF深度对比</el-button>
    <!-- PC端筛选器 -->
    <div class="filter-left pc-filter" v-show="!isMobile()">
      <!-- 切换按钮 -->
      <!-- <el-button
        @click="useNewFilter = !useNewFilter"
        size="small"
        style="margin-bottom: 10px; width: 100%;"
      >
        {{ useNewFilter ? '切换到旧版筛选器' : '切换到新版筛选器' }}
      </el-button> -->

      <!-- 旧版筛选器 -->
      <ScreenerFilter
        v-if="!useNewFilter"
        v-model:selected-child="selectedChild"
        v-model:selected-items="selectedItems"
        v-model:slider-items="sliderItems"
      />

      <!-- 新版筛选器 -->
      <ScreenerFilterV2
        v-else
        :api-data="responseData"
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
          <!-- 移动端也支持切换 -->
          <!-- <el-button
            @click="useNewFilter = !useNewFilter"
            size="small"
            style="margin: 10px 20px; width: calc(100% - 40px);"
          >
            {{ useNewFilter ? '切换到旧版筛选器' : '切换到新版筛选器' }}
          </el-button> -->

          <ScreenerFilter
            v-if="!useNewFilter"
            ref="mobileFilterRef"
            v-model:selected-child="selectedChild"
            v-model:selected-items="selectedItems"
            v-model:slider-items="sliderItems"
          />

          <ScreenerFilterV2
            v-else
            ref="mobileFilterRef"
            :api-data="responseData"
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
      @tableSelect="handleTableSelect"
      @tableFilterTab="handleTableFilterTab"
    >
      <template #table-pagination>
        <el-pagination
        v-model:current-page="page"
        layout="total, prev, pager, next"
        :pager-count="!isMobile() ? 7 : 3"
        :total="total"
        :page-size="pageSize"
        @current-change="handlePageChange" />
      </template>
    </ScreenerTable>
  </div>
</template>

<style scoped lang="scss">
.screener-header {
  width: 100%;
  padding: 20px;
  padding-bottom: 0;
  background: #fff;
}
.screener-pc {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  min-height: 100vh;
  padding: 20px;
  background: #ffffff;
  position: relative;
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
</style>
