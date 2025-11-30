<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import RecursiveFilterItem from "./RecursiveFilterItem.vue";

// 定义组件事件
const emit = defineEmits([
  "update:selectedItems",
  "update:selectedChild",
  "update:sliderItems",
]);

// Props定义
const props = defineProps<{
  // 从JSON加载的动态数据
  apiData?: any[];
}>();

// 当前激活的折叠面板
const activeNames = ref("");
// 选中的第一层子项（单选）
const selectedChild = ref("");
// 选中的codes数组
const selectedCodes = ref<string[]>([]);
// 滑块值
const sliderValues = ref<Record<string, [number, number]>>({});
const dateValues = ref<Record<string, [string, string]>>({});

// 从JSON解析的筛选数据
// const filterData = ref<any[]>([]);
const filterData = computed(() => {
  console.log("props.apiData", props.apiData);
  return props.apiData;
});

// 滑块配置（保持原有逻辑不变）
const sliderConfig = [
  {
    label: "费率和分红",
    value: "expenses",
    type: "slider",
    children: [
      {
        label: "费率(%)",
        type: "slider",
        paramKeys: ["feeStart", "feeEnd"],
        range: [0, 19],
      },
      {
        label: "分红率(%)",
        type: "slider",
        paramKeys: ["divYieldStart", "divYieldEnd"],
        range: [0, 782],
      },
    ],
  },
  {
    label: "流动性和成立日",
    value: "liquidityAndEstablishmentDate",
    type: "slider",
    children: [
      {
        label: "日均成交量(百万股)",
        type: "slider",
        paramKeys: ["avgDailyVolumeStart", "avgDailyVolumeEnd"],
        unit: "百万",
        range: [0, 1000],
      },
      {
        label: "日均成交额(百万元)",
        type: "slider",
        paramKeys: ["avgDailyVolumeForYearStart", "avgDailyVolumeForYearEnd"],
        unit: "百万",
        range: [0, 1000],
      },
      {
        label: "交易价格(元)",
        type: "slider",
        paramKeys: ["currentCloseStart", "currentCloseEnd"],
        unit: "元",
        range: [0, 500],
      },
      {
        label: "资产规模(百万元)",
        type: "slider",
        paramKeys: ["totalMarketValueStart", "totalMarketValueEnd"],
        unit: "百万",
        range: [0, 700000],
      },
      {
        label: "成立日期",
        type: "date",
        paramKeys: ["setupDateStart", "setupDateEnd"],
        date: ["", ""],
      },
    ],
  },
  {
    label: "收益",
    value: "return",
    type: "slider",
    children: [
      {
        label: "近一周收益(%)",
        type: "slider",
        paramKeys: ["weeklyReturnsStart", "weeklyReturnsEnd"],
        range: [-100, 25],
      },
      {
        label: "近一月收益(%)",
        type: "slider",
        paramKeys: ["monthlyReturnsStart", "monthlyReturnsEnd"],
        range: [-1000, 130],
      },
      {
        label: "今年以来收益(%)",
        type: "slider",
        paramKeys: ["ytdReturnsStart", "ytdReturnsEnd"],
        range: [-100, 200],
      },
      {
        label: "近一年收益(%)",
        type: "slider",
        paramKeys: ["yearlyReturnsStart", "yearlyReturnsEnd"],
        range: [-100, 750],
      },
      {
        label: "近三年收益(%)",
        type: "slider",
        paramKeys: ["threeYearReturnsStart", "threeYearReturnsEnd"],
        range: [-100, 100],
      },
      {
        label: "近五年收益(%)",
        type: "slider",
        paramKeys: ["fiveYearReturnsStart", "fiveYearReturnsEnd"],
        range: [-100, 100],
      },
    ],
  },
  {
    label: "ESG",
    value: "esg",
    type: "slider",
    children: [
      {
        label: "基金Wind ESG综合得分",
        type: "slider",
        paramKeys: ["esgScoreStart", "esgScoreEnd"],
        range: [0, 100],
      },
    ],
  },
  {
    label: "资金流",
    value: "FundFlows",
    type: "slider",
    children: [
      {
        label: "近 1 周净流入额(百万元)",
        type: "slider",
        paramKeys: ["weeklyNetInflowsStart", "weeklyNetInflowsEnd"],
        unit: "百万",
        range: [-70, 600],
      },
      {
        label: "近 1 月净流入额(百万元)",
        type: "slider",
        paramKeys: ["monthlyNetInflowsStart", "monthlyNetInflowsEnd"],
        unit: "百万",
        range: [-50, 800],
      },
      {
        label: "近 3 月净流入额(百万元)",
        type: "slider",
        paramKeys: ["threeMonthNetInflowsStart", "threeMonthNetInflowsEnd"],
        unit: "百万",
        range: [-120, 2400],
      },
      {
        label: "今年以来净流入额(百万元)",
        type: "slider",
        paramKeys: ["ytdNetInflowsStart", "ytdNetInflowsEnd"],
        unit: "百万",
        range: [-2100, 10000],
      },
      {
        label: "近 1 年净流入额(百万元)",
        type: "slider",
        paramKeys: ["yearlyNetInflowsStart", "yearlyNetInflowsEnd"],
        unit: "百万",
        range: [-10000, 21000],
      },
      {
        label: "近 3 年净流入额(百万元)",
        type: "slider",
        paramKeys: ["threeYearNetInflowsStart", "threeYearNetInflowsEnd"],
        unit: "百万",
        range: [-10000, 36000],
      },
    ],
  },
  {
    label: "风险度量",
    value: "RiskMetrics",
    type: "slider",
    children: [
      {
        label: "近一月收益标准差(%)",
        type: "slider",
        paramKeys: ["std4WeekStart", "std4WeekEnd"],
        range: [0, 110],
      },
      {
        label: "近三月收益标准差(%)",
        type: "slider",
        paramKeys: ["std12WeekStart", "std12WeekEnd"],
        range: [0, 120],
      },
      {
        label: "近一年收益标准差(%)",
        type: "slider",
        paramKeys: ["std52WeekStart", "std52WeekEnd"],
        range: [0, 130],
      },
      {
        label: "Beta值",
        type: "slider",
        paramKeys: ["beta52WeekStart", "beta52WeekEnd"],
        range: [-10, 10],
      },
      {
        label: "近一月年化波动率(%)",
        type: "slider",
        paramKeys: ["volatility20DayStart", "volatility20DayEnd"],
        range: [0, 150],
      },
      {
        label: "近三月年化波动率(%)",
        type: "slider",
        paramKeys: ["volatility50DayStart", "volatility50DayEnd"],
        range: [0, 100],
      },
      {
        label: "近一年年化波动率(%)",
        type: "slider",
        paramKeys: ["volatility200DayStart", "volatility200DayEnd"],
        range: [0, 80],
      },
      {
        label: "最大回撤(%)",
        type: "slider",
        paramKeys: ["maxDownSideStart", "maxDownSideEnd"],
        range: [0, 300],
      },
    ],
  },
  {
    label: "持仓",
    value: "Holdings",
    type: "slider",
    children: [
      {
        label: "持股数量(只)",
        type: "slider",
        paramKeys: ["stockHoldingsStart", "stockHoldingsEnd"],
        range: [0, 1000000],
      },
      {
        label: "前五大持仓占比(%)",
        type: "slider",
        paramKeys: ["top5ConcentrationStart", "top5ConcentrationEnd"],
        range: [0, 100],
      },
      {
        label: "前十大持仓占比(%)",
        type: "slider",
        paramKeys: ["top10ConcentrationStart", "top10ConcentrationEnd"],
        range: [0, 100],
      },
      {
        label: "前十五大持仓占比(%)",
        type: "slider",
        paramKeys: ["top15ConcentrationStart", "top15ConcentrationEnd"],
        range: [0, 100],
      },
      {
        label: "前五十大持仓占比(%)",
        type: "slider",
        paramKeys: ["top50ConcentrationStart", "top50ConcentrationEnd"],
        range: [0, 100],
      },
    ],
  },
];

// 初始化滑块值
function initSliderValues() {
  sliderConfig.forEach((item) => {
    if (item.type === "slider" && item.children) {
      item.children.forEach((child) => {
        const key = `${item.value}_${child.paramKeys[0]}`;
        if (child.type === "slider" && child.range) {
          sliderValues.value[key] = [...child.range] as [number, number];
        }
        if (child.type === "date" && (child as any).date) {
          dateValues.value[key] = [(child as any).date[0], (child as any).date[1]];
        }
      });
    }
  });
}

// 重置所有筛选条件
function resetFilters() {
  activeNames.value = "";
  selectedChild.value = "";
  selectedCodes.value = [];
  sliderValues.value = {};
  dateValues.value = {};

  emit("update:selectedItems", []);
  emit("update:selectedChild", "");
  emit("update:sliderItems", {});

  initSliderValues();
}

// 处理复选框变化（用于多选和单选）
function handleCheckboxChange(item: any, checked: boolean, isRadio: boolean = false) {
  if (isRadio) {
    // 第一层单选逻辑
    selectedChild.value = item.value;
    selectedCodes.value = [];

    // 如果单选项有codes，也应该传递
    if (item.codes && item.codes.length > 0) {
      emit("update:selectedChild", item.value);
      emit("update:selectedItems", item.codes);
    } else {
      emit("update:selectedChild", item.value);
      emit("update:selectedItems", []);
    }
  } else {
    // 其他层级多选逻辑
    if (item.codes && item.codes.length > 0) {
      if (checked) {
        // 添加codes
        const newCodes = [...selectedCodes.value];
        item.codes.forEach((code: string) => {
          if (!newCodes.includes(code)) {
            newCodes.push(code);
          }
        });
        selectedCodes.value = newCodes;
      } else {
        // 移除codes
        selectedCodes.value = selectedCodes.value.filter(
          (code) => !item.codes.includes(code)
        );
      }
      emit("update:selectedItems", selectedCodes.value);
    }
  }
}

// 修改滑块值处理函数（保持原有逻辑）
function handleRangeChange(
  value: number[],
  filterValue: string,
  paramKeys: string[],
  unit?: string
) {
  const key = `${filterValue}_${paramKeys[0]}`;
  if (!sliderValues.value[key]) {
    sliderValues.value[key] = [0, 0];
  }
  let val = value;
  if (unit === "百万") {
    val = [value[0] * 1000000, value[1] * 1000000] as [number, number];
  } else {
    val = [value[0], value[1]] as [number, number];
  }
  sliderValues.value[key] = [value[0], value[1]] as [number, number];
  const newSliderItems = {
    [paramKeys[0]]: val[0],
    [paramKeys[1]]: val[1],
  };
  emit("update:sliderItems", newSliderItems);
}

// 修改日期处理函数（保持原有逻辑）
function handleSingleDateChange(
  val: string,
  filterValue: string,
  paramKeys: string[],
  pos: 0 | 1
) {
  const key = `${filterValue}_${paramKeys[0]}`;
  if (!dateValues.value[key]) {
    dateValues.value[key] = ["", ""];
  }
  dateValues.value[key][pos] = val;
  emit("update:sliderItems", {
    [paramKeys[0]]: dateValues.value[key][0] || "",
    [paramKeys[1]]: dateValues.value[key][1] || "",
  });
}

// 修改范围输入处理函数（保持原有逻辑）
function handleRangeInputChange(
  value: string | number,
  filterValue: string,
  paramKeys: string[],
  position: 0 | 1,
  unit?: string
) {
  const key = `${filterValue}_${paramKeys[0]}`;
  if (!sliderValues.value[key]) {
    sliderValues.value[key] = [0, 0];
  }
  const numValue = Number(value);
  let val = numValue;
  if (unit === "百万") {
    val = numValue * 1000000;
  }
  if (!isNaN(Number(value))) {
    sliderValues.value[key][position] = numValue;
    emit("update:sliderItems", {
      [paramKeys[position]]: val,
    });
  }
}

// 组件挂载时初始化
onMounted(() => {
  initSliderValues();
  // 从props加载API数据
  // if (props.apiData && props.apiData.length > 0) {
  //   filterData.value = props.apiData;
  // }
});

// 暴露重置方法
defineExpose({ resetFilters });
</script>

<template>
  <div class="filters">
    <!-- 筛选器头部 -->
    <div class="filters-header">
      <h2>过滤器</h2>
      <button class="reset-btn" @click="resetFilters">重置</button>
    </div>

    <!-- 主折叠面板 -->
    <van-collapse v-model="activeNames" accordion class="main-collapse">
      <!-- 动态数据部分 -->
      <van-collapse-item
        v-for="filter in filterData"
        :key="filter.value"
        :name="filter.value"
        :title="filter.label"
      >
        <!-- 递归渲染多层级数据 -->
        <template v-if="filter.children && filter.children.length > 0">
          <recursive-filter-item
            :items="filter.children"
            :level="0"
            :parent-value="filter.value"
            :selected-child="selectedChild"
            :selected-codes="selectedCodes"
            @radio-change="(value) => handleCheckboxChange(value, true, true)"
            @checkbox-change="handleCheckboxChange"
          />
        </template>
      </van-collapse-item>

      <!-- 滑块配置部分（保持原有逻辑） -->
      <van-collapse-item
        v-for="filter in sliderConfig"
        :key="filter.value"
        :name="filter.value"
        :title="filter.label"
      >
        <div class="range-list">
          <div
            v-for="(item, index) in filter.children"
            :key="index"
            class="range-item"
          >
            <!-- 数字范围滑块 -->
            <template v-if="item.type === 'slider'">
              <div class="range-label">{{ item.label }}</div>
              <el-slider
                v-model="sliderValues[`${filter.value}_${item.paramKeys[0]}`]"
                :min="item.range?.[0] || 0"
                :max="item.range?.[1] || 100"
                :step="0.1"
                range
                @change="(val: number[] | number) => handleRangeChange(Array.isArray(val) ? val : [val, val], filter.value, item.paramKeys, (item as any).unit)"
              />
              <div class="range-inputs">
                <el-input-number
                  v-model="sliderValues[`${filter.value}_${item.paramKeys[0]}`][0]"
                  :controls="false"
                  size="default"
                  @change="(val) => handleRangeInputChange(val ?? 0, filter.value, item.paramKeys, 0, (item as any).unit)"
                />
                <span class="range-separator">-</span>
                <el-input-number
                  v-model="sliderValues[`${filter.value}_${item.paramKeys[0]}`][1]"
                  :controls="false"
                  size="default"
                  @change="(val) => handleRangeInputChange(val ?? 0, filter.value, item.paramKeys, 1, (item as any).unit)"
                />
              </div>
            </template>

            <!-- 日期范围选择器 -->
            <template v-if="item.type === 'date'">
              <div class="range-label">{{ item.label }}</div>
              <div class="date-range-inputs">
                <el-date-picker
                  v-model="dateValues[`${filter.value}_${item.paramKeys[0]}`][0]"
                  type="date"
                  value-format="YYYY-MM-DD"
                  placeholder="开始日期"
                  style="width: 43%; margin-right: 10px"
                  @change="(val: string) => handleSingleDateChange(val, filter.value, item.paramKeys, 0)"
                />
                <span class="range-separator">至</span>
                <el-date-picker
                  v-model="dateValues[`${filter.value}_${item.paramKeys[0]}`][1]"
                  type="date"
                  value-format="YYYY-MM-DD"
                  placeholder="结束日期"
                  style="width: 43%; margin-left: 10px"
                  @change="(val: string) => handleSingleDateChange(val, filter.value, item.paramKeys, 1)"
                />
              </div>
            </template>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<style scoped lang="scss">
// 筛选器容器样式
.filters {
  width: 320px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  min-width: 260px;
  padding: 0;
  overflow: hidden;

  // 头部样式
  .filters-header {
    padding: 18px 16px 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    h2 {
      font-size: var(--font-size-extra-large);
      margin: 0;
      font-weight: 600;
    }

    .reset-btn {
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
  }

  // 折叠面板样式
  :deep(.van-collapse) {
    background: #fff;
    border-radius: 8px;
    border: none;
    margin: 0;
  }

  :deep(.van-collapse-item) {
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }
  }

  :deep(.van-collapse-item__title) {
    background: #f5f5f5;
    border-radius: 0;
    font-weight: 500;
    font-size: var(--font-size-base);
    color: #222;
    border-bottom: 1px solid #e0e0e0;
    padding: 0 16px;
    min-height: 44px;
    display: flex;
    align-items: center;
  }

  :deep(.van-collapse-item__content) {
    background: #fff;
    padding: 0;
    max-height: 800px;
    overflow-y: auto;

    // 有内容时才添加底部间距
    &:not(:empty) {
      padding-bottom: 8px;
    }

    // 美化滚动条
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f5f5f5;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #c0c0c0;
      border-radius: 3px;

      &:hover {
        background: #a0a0a0;
      }
    }
  }

  // 范围列表样式（保持原有样式）
  .range-list {
    padding: 16px;

    .range-item {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .range-label {
      margin-bottom: 8px;
      color: #333;
      font-size: var(--font-size-base);
    }

    .range-inputs {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;

      .el-input {
        width: 100px;
      }

      .range-separator {
        color: #999;
      }
    }
  }

  :deep(.el-slider__bar) {
    background-color: var(--theme-purple);
  }

  :deep(.el-slider__button) {
    border-color: var(--theme-purple);
  }
}

@media (max-width: 768px) {
  .filters {
    width: 100vw !important;
    min-width: 0 !important;
    border-radius: 0 !important;
    border: none !important;
    box-shadow: none !important;
  }
}
</style>
