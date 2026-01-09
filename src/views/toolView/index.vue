<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, ref } from 'vue';
import { getPopularIndicesApi } from "@/api/tool";
import { formatValue } from "@/utils/formatValue";

const router = useRouter();
const indexList = ref<any[]>([]);
const filterTabs = [
  { label: '日涨幅', value: 'day', gray: false },
  { label: '近1周', value: 'weekly', gray: false },
  { label: '近1月', value: 'monthly', gray: false },
  { label: '近3月', value: 'threeMonth', gray: false },
  { label: '近6月', value: 'sixMonth', gray: false },
  { label: '近1年', value: 'yearly', gray: false },
];
const activeTab = ref('weekly');

const categoryList = ref([
  { label: "股票", value: "EQUITY" },
  { label: "跨境", value: "CROSS_BOUNDARY" },
  { label: "债券", value: "BOND" },
  { label: "商品", value: "GOODS" },
]);

const categoryOrder: Record<string, number> = {
  EQUITY: 1,
  CROSS_BOUNDARY: 2,
  BOND: 3,
  GOODS: 4
};

const activeCategory = ref('EQUITY');

const getCurrentCategoryData = (categoryValue: string) => {
  const group = indexList.value.find((item: any) => item.category === categoryValue);
  return group?.data || [];
};

const setActiveTab = (val: string) => {
  loading.value = true;
  activeTab.value = val;
  getPopularIndicesApi(activeTab.value).then((res) => {
    const data = res as any;
    if (data && data.length > 0) {
      const filteredData = data.filter((item: any) => item.category !== 'CURRENCY');
      filteredData.sort((a: any, b: any) => {
        const orderA = categoryOrder[a.category] || 999;
        const orderB = categoryOrder[b.category] || 999;
        return orderA - orderB;
      });
      indexList.value = filteredData;
    } else {
      indexList.value = [];
    }
  }).finally(() => {
    loading.value = false;
  });
};
const handleIndexClick = (item: any) => {
    router.push({
      path: "/tool-etf-list",
      query: {
        index: JSON.stringify(item),
      },
    });
};

const loading = ref(false);

onMounted(() => {
  loading.value = true;
  getPopularIndicesApi(activeTab.value).then((res) => {
    const data = res as any;
    if (data && data.length > 0) {
      const filteredData = data.filter((item: any) => item.category !== 'CURRENCY');
      filteredData.sort((a: any, b: any) => {
        const orderA = categoryOrder[a.category] || 999;
        const orderB = categoryOrder[b.category] || 999;
        return orderA - orderB;
      });
      indexList.value = filteredData;
    } else {
      indexList.value = [];
    }
  }).finally(() => {
    loading.value = false;
  });
});
</script>

<template>
  <div class="tool-view-container">
    <div class="tool-view-header">
      <h1>ETF 跟踪指数</h1>
      <!-- <p class="tool-view-desc">
        How It Works: Use either the map tool or drop down box to find the equity ETFs with exposure to a particular country. Once a country is selected, click the icon to see all ETFs with exposure to that country.
      </p> -->
    </div>
    <div class="tool-filter">
      <span class="tool-filter-label">阶段涨幅：</span>
      <span
        v-for="(tab, idx) in filterTabs"
        :key="tab.value"
        :class="['tool-filter-tab', { active: activeTab === tab.value }]"
        @click="setActiveTab(tab.value)"
      >
        {{ tab.label }}
      </span>
    </div>
    <div v-loading="loading" element-loading-text="加载中..." class="tool-content">
      <el-tabs v-model="activeCategory" class="category-tabs">
        <el-tab-pane
          v-for="category in categoryList"
          :key="category.value"
          :label="category.label"
          :name="category.value"
        >
          <template v-if="getCurrentCategoryData(category.value).length > 0">
            <div class="index-card-list">
              <div
                v-for="item in getCurrentCategoryData(category.value)"
                :key="item.trackIndexName"
                class="index-card"
                @click="handleIndexClick(item)"
              >
                <div class="index-card-title-row">
                  <span class="index-card-title">{{ item.trackIndexName }}</span>
                  <span class="index-card-value">{{ item.currentClose }}</span>
                </div>
                <div class="index-card-info-row" v-if="activeTab === 'day'">
                  <span class="index-card-period">日涨幅</span>
                  <span class="index-card-rate">{{ formatValue(item.change) }}<span class="index-card-rate-percent">%</span></span>
                </div>
                <div class="index-card-info-row" v-if="activeTab === 'weekly'">
                  <span class="index-card-period">近1周</span>
                  <span class="index-card-rate">{{ formatValue(item.weeklyChange) }}<span class="index-card-rate-percent">%</span></span>
                </div>
                <div class="index-card-info-row" v-if="activeTab === 'monthly'">
                  <span class="index-card-period">近1月</span>
                  <span class="index-card-rate">{{ formatValue(item.monthlyChange) }}<span class="index-card-rate-percent">%</span></span>
                </div>
                <div class="index-card-info-row" v-if="activeTab === 'threeMonth'">
                  <span class="index-card-period">近3月</span>
                  <span class="index-card-rate">{{ formatValue(item.threeMonthChange) }}<span class="index-card-rate-percent">%</span></span>
                </div>
                <div class="index-card-info-row" v-if="activeTab === 'sixMonth'">
                  <span class="index-card-period">近6月</span>
                  <span class="index-card-rate">{{ formatValue(item.sixMonthChange) }}<span class="index-card-rate-percent">%</span></span>
                </div>
                <div class="index-card-info-row" v-if="activeTab === 'yearly'">
                  <span class="index-card-period">近1年</span>
                  <span class="index-card-rate">{{ formatValue(item.yearlyChange) }}<span class="index-card-rate-percent">%</span></span>
                </div>
                <div class="index-card-link-row">
                  <span class="index-card-link">
                    查看<span style="color: #e53935">{{ item.count }}</span>只指数相关ETF
                  </span>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <el-empty description="暂无数据" />
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.tool-view-container {
  width: 100%;
  padding: 20px;
  .tool-view-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  .tool-view-desc {
    font-size: 1.08rem;
    color: #222;
    margin-bottom: 1.1rem;
    line-height: 1.7;
  }
}
.tool-content {
  margin-top: 20px;
}
.category-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 20px;
  }
  :deep(.el-tabs__nav-wrap::after) {
    height: 1px;
  }
  :deep(.el-tabs__item) {
    font-size: 1.1rem;
    font-weight: 500;
    color: #666;
    padding: 0 24px;
    &.is-active {
      color: #ff5722;
      font-weight: 600;
    }
    &:hover {
      color: #ff5722;
    }
  }
  :deep(.el-tabs__active-bar) {
    background-color: #ff5722;
    height: 3px;
  }
}
.index-card-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 18px 18px;
  margin-top: 10px;
}
.index-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  padding: 18px 16px 10px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 90px;
  transition: box-shadow 0.2s;
  cursor: pointer;
  border: 1px solid #f2f2f2;
  &:hover {
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
    border-color: #e0e0e0;
  }
}
.index-card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.index-card-title {
  font-size: 1.1rem;
  color: #222;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.index-card-value {
  font-size: 1rem;
  color: #b0b0b0;
  font-weight: 500;
}
.index-card-info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 8px;
}
.index-card-period {
  font-size: 0.95rem;
  color: #888;
}
.index-card-rate {
  font-size: 1.35rem;
  color: #e53935;
  font-weight: 700;
}
.index-card-rate-percent {
  font-size: 1rem;
  margin-left: 1px;
}
.index-card-link-row {
  text-align: center;
}
.index-card-link {
  font-size: 0.95rem;
  color: #888;
  cursor: pointer;
  &:hover {
    color: #222;
    text-decoration: underline;
  }
}
@media (max-width: 1200px) {
  .index-card-list {
    grid-template-columns: repeat(4, 1fr);
  }
  .index-card-title {
    max-width: 250px;
  }
}
@media (max-width: 900px) {
  .index-card-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .index-card-list {
    grid-template-columns: 1fr;
  }
}
.tool-filter {
  margin: 30px 0 18px 0;
  font-size: var(--font-size-medium);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  .tool-filter-label {
    color: #8a8787;
    margin-right: 6px;
    font-size: var(--font-size-medium);
  }
  .tool-filter-tab {
    margin-right: 12px;
    color: #222;
    cursor: pointer;
    font-size: var(--font-size-medium);
    transition: color 0.2s;
    &.active {
      color: #ff5722;
      font-weight: 500;
    }
    &.gray {
      color: #bdbdbd;
      cursor: default;
    }
    &:hover:not(.active):not(.gray) {
      color: #ff5722;
    }
  }
}

@media (max-width: 768px) {
  .tool-filter {
    margin: 20px 0 12px 0;
    .tool-filter-label {
      width: 100%;
      margin-bottom: 8px;
    }
    .tool-filter-tab {
      margin-right: 8px;
      font-size: 14px;
      padding: 4px 8px;
      background: #f5f5f5;
      border-radius: 4px;
      &.active {
        background: #fff0eb;
      }
    }
  }
}

@media (max-width: 480px) {
  .tool-filter {
    .tool-filter-tab {
      margin-right: 6px;
      font-size: 13px;
      padding: 3px 6px;
    }
  }
}
</style>
