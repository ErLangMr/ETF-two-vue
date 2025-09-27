<script setup lang="ts">
// PC 端特有的逻辑和状态
import { ref, onMounted, nextTick, computed, watch } from "vue";
import ScreenerFilter from "@/components/ScreenerFilter.vue";
import type { FilterItem } from "@/components/ScreenerFilter.vue";
import ScreenerTable from "@/components/ScreenerTable.vue";
import { useDevice } from "@/utils/device";
import { Operation } from "@element-plus/icons-vue";
import { getFilterTableApi } from "@/api/filterTable";


const { isMobile } = useDevice();
const mobileFilterRef = ref();
// 单选的值（一级分类）
const selectedChild = ref("");
// 多选的值（二级分类）
const selectedItems = ref<string[]>([]);
// 滑块的值
const sliderItems = ref<{ [key: string]: number }>({});
// 滑块的值（滑块的值）
let sliderValue:Record<string, any>[] = []
let paramsObj: Record<string, any> = {}

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
  getFilterTableData(params);
}, 300);

watch(selectedChild, (newVal) => {
  console.log(newVal, 11111);
  if(newVal) {
    if (!selectedItems.value.length) {
      paramsObj.category = newVal
      paramsObj.codes = null
      page.value = 1
      getFilterTableData(paramsObj)
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
      getFilterTableData(paramsObj);
      return;
    }

    // 正常筛选逻辑
    if (newVal.length > 0) {
      paramsObj.codes = newVal;
      paramsObj.category = null;
      page.value = 1;
      getFilterTableData(paramsObj);
    } else if (selectedChild.value) {
      paramsObj.codes = null;
      paramsObj.category = selectedChild.value;
      page.value = 1;
      debouncedGetFilterTableData(paramsObj);
    }
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
    getFilterTableData(paramsObj)
  }else{
    sliderValue = []
    paramsObj = {}
    page.value = 1
    getFilterTableData()
  }
}, { deep: true });

const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
function handlePageChange(val: number) {
  page.value = val
  getFilterTableData(paramsObj)
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

const etfList = ref<any[]>([]);

const showMobileFilter = ref(false);
function openMobileFilter() {
  showMobileFilter.value = true;
}
function closeMobileFilter() {
  showMobileFilter.value = false;
}

onMounted(() => {
  getFilterTableData()
});
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
