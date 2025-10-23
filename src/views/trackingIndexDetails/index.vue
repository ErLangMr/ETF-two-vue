<template>
  <div class="trackingIndexDetails">
    <div class="details-header">
      <span class="details-symbol">{{ detailsTitle.code }}</span>
      <span class="details-title">{{ detailsTitle.shortName }}</span>
    </div>
    <div class="details-info">
      <div>
        <span class="details-info-label">收盘价:</span>
        {{ detailsTitle.close }}
        <el-icon><Top style="color: #1a7f37" /></el-icon>
      </div>
      <div>
        <span class="details-info-label">涨跌:</span>
        <span>￥{{ formatValue(detailsTitle.change) }}%</span>
      </div>
      <div>
        <span class="details-info-label">类型:</span>
        <span>{{
          categoryList.find((item) => item.value === detailsTitle.category)
            ?.label
        }}</span>
      </div>
      <div>
        <span class="details-info-label">最近更新日期:</span>
        <span>{{ detailsTitle.lastUpdated }}</span>
      </div>
    </div>
    <div class="details-content">
      <van-divider :style="{ borderColor: '#dedede' }" />
      <template v-if="!isMobile()">
        <el-tabs v-model="activeName" tab-position="left" class="details-tabs">
          <el-tab-pane
            v-for="(item, index) in tabList"
            :key="index"
            :label="item.label"
            :name="item.value"
          >
            <div class="tab-content">
              <component
                :is="item.component"
                :tabActiveName="activeName"
                :detailsData="detailsData"
                :code="route.query?.code"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
      <div v-if="isMobile()">
        <el-select
          v-model="mobildSelect"
          @change="handleChange"
          placeholder="Select"
          style="width: 100%; margin-bottom: 20px"
        >
          <el-option
            v-for="(item, index) in tabList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div class="tab-content">
          <component
            :is="
              tabList.find((tab) => tab.value === mobildSelect)?.component ||
              IndexSnapshot
            "
            :tabActiveName="componentName"
            :detailsData="detailsData"
            :code="route.query?.code"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw, shallowRef, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDevice } from "@/utils/device";
import IndexSnapshot from "./components/IndexSnapshot.vue";
import IndexFeature from "./components/IndexFeature.vue";
import Trade from "./components/Trade.vue";
import DividendAndValuation from "./components/DividendAndValuation.vue";
import { Top } from "@element-plus/icons-vue";
import { formatValue } from "@/utils/formatValue";
import { getOneDetailsDataApi } from "@/api/details";

const router = useRouter();
const route = useRoute();
const { isMobile } = useDevice();
const activeName = ref("IndexSnapshot");
const mobildSelect = ref("IndexSnapshot");
const componentName = ref("IndexSnapshot");

const categoryList = ref([
  { label: "股票", value: "EQUITY" },
  { label: "债券", value: "BOND" },
  { label: "商品", value: "GOODS" },
  { label: "货币", value: "CURRENCY" },
  { label: "跨境", value: "CROSS_BOUNDARY" },
]);

function handleChange(val: string) {
  const selectedTab = tabList.value.find((tab) => tab.value === val);
  componentName.value = selectedTab?.value as string;
}
const detailsData = ref({});
const detailsTitle = ref({
  code: "",
  shortName: "",
  close: "",
  change: "",
  category: "",
  lastUpdated: "",
});
watch(
  activeName,
  (newVal) => {
    if (newVal === "IndexSnapshot") {
      getOneDetailsDataApi(route.query.code as string).then((res) => {
        detailsTitle.value = {
          code: res.code,
          shortName: res.shortName,
          close: res.close,
          change: res.change,
          category: res.category,
          lastUpdated: res.lastUpdated,
        };
        detailsData.value = res;
      });
    }
  },
  { immediate: true }
);

const tabList = ref([
  {
    label: "指数快照",
    value: "IndexSnapshot",
    component: markRaw(IndexSnapshot),
  },
  {
    label: "指数特征",
    value: "IndexFeature",
    component: markRaw(IndexFeature),
  },
  {
    label: "交易",
    value: "Trade",
    component: markRaw(Trade),
  },
  {
    label: "分红和估值",
    value: "DividendAndValuation",
    component: markRaw(DividendAndValuation),
  },
]);
</script>

<style lang="scss" scoped>
.trackingIndexDetails {
  width: 100%;
  height: 100%;
  padding: 20px;
  .details-header {
    display: flex;
    align-items: flex-start;
    gap: 18px;
    .details-symbol {
      background: var(--theme-purple);
      color: #fff;
      border-radius: 4px;
      padding: 4px 12px;
      font-weight: 600;
      margin-top: 2px;
    }
    .details-title {
      font-size: 1.5rem;
      font-weight: bold;
      color: #23272b;
      margin-right: 24px;
      margin-top: 2px;
    }
  }
  .details-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 1rem;
    .details-info-label {
      color: #888;
      margin-right: 4px;
      display: inline-block;
      width: 110px;
      text-align: right;
    }
  }
  .details-content {
    margin-top: 20px;
    height: calc(100vh - 350px);
    .details-tabs {
      // height: 100%;
      :deep(.el-tabs__header) {
        height: 800px;
      }
      :deep(.el-tabs__item) {
        width: 175px;
        height: 50px;
        white-space: wrap;
        font-size: var(--font-size-medium);
      }
      :deep(.el-tabs__item.is-active) {
        position: relative;
        color: var(--theme-purple);
        font-weight: bold;
        background: #fff;
        z-index: 1;
        &::before {
          content: "";
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 2px;
          height: 50px;
          background: #e4e7ed;
        }
        &::after {
          content: "";
          position: absolute;
          right: -5px;
          top: 50%;
          transform: translateY(-50%);
          width: 17px;
          height: 20px;
          background: url('data:image/svg+xml;utf8,<svg width="17" height="20" viewBox="0 0 17 40" fill="none" xmlns="http://www.w3.org/2000/svg"><polyline points="16,1 1,20 16,39" stroke="%23e5e6eb" stroke-width="4" fill="white" stroke-linecap="round"/></svg>')
            no-repeat center/contain;
          z-index: 2;
          pointer-events: none;
        }
      }
      :deep(.el-tabs__active-bar) {
        display: none;
      }
      :deep(.el-tabs__item:hover) {
        color: var(--theme-purple);
      }
    }
    :deep(.row) {
      display: flex;
      gap: 62px;
    }
    :deep(.block) {
      flex: 1;
      min-width: 0;
      max-width: 70%;
      .section-title {
        font-weight: 600;
        font-size: var(--font-size-base);
        margin-bottom: 10px;
        color: #222;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .analyst-title-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .info-list {
        border-radius: 0;
        border: none;
        background: none;
        padding: 0;
      }
      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 7px 0;
        border-bottom: 1px solid #ececec;
        font-size: var(--font-size-base);
      }
      .info-row:last-child {
        border-bottom: none;
      }
      .info-row span:first-child {
        color: #333;
      }
      .info-row .link {
        color: var(--theme-purple);
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .tab-content {
    padding: 0 20px;
  }
  @media (max-width: 768px) {
    .trackingIndexDetails {
      padding: 0;
    }
    .tab-content {
      padding: 0;
    }
    .details-header {
      display: block;
      .details-symbol {
        margin-right: 10px;
      }
    }
  }
}
</style>
