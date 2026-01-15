<template>
  <div class="stock-locator">
    <div class="page-header">
      <h1>股票定位器</h1>
      <p class="page-desc">
        只需在下方搜索框中输入股票代码或名称（例如GOOG），ETF股票持仓工具就会为您找到持有该股票较多的ETF。
      </p>
    </div>
    <div class="search-box">
      <!-- <el-select
        v-model="ETFSearch"
        filterable
        remote
        reserve-keyword
        placeholder="请输入股票代码或名称"
        :remote-method="remoteMethod"
        :loading="loading"
        style="width: 240px"
        @change="searchChange"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select> -->
      <el-input
        v-model="ETFSearch"
        style="width: 300px"
        placeholder="请输入股票代码或名称"
        class="input-with-select"
        @keyup.enter="searchChange(ETFSearch)"
        clearable
      >
        <template #append>
          <el-button @click="searchChange(ETFSearch)" :icon="Search" />
        </template>
      </el-input>
    </div>
    <div class="divider"></div>
    <div style="display: flex; align-items: center;justify-content: space-between">
      <p class="titleP">最受欢迎的{{ total }}只股票及其ETF替代方案</p>
      <div style="display: flex; align-items: center">
          <el-date-picker
            v-model="yearValue"
            type="year"
            value-format="YYYY"
            placeholder="选择年份"
            style="margin-right: 5px;width: 120px;"
            @change="periodChange"
          />
          <PeriodSelector
            v-model="activeBtn"
            :options="periodOptions"
            prefix=""
            suffix=""
            @change="periodChange"
          />
        </div>
    </div>
  <div style="padding: 20px">
      <el-table
        :data="tableData"
        v-loading="tableLoading"
        element-loading-text="加载中..."
        :header-cell-style="{
          background: '#f5f5fa',
          color: '#333',
          fontWeight: 'bold',
          fontSize: '1rem',
        }"
      >
        <el-table-column prop="stkCode" label="股票代码" min-width="120">
          <!-- <template #default="scope">
            <span class="tableLink" @click="toEtfDetail(scope.row)">{{
              scope.row.stkCode
            }}</span>
          </template> -->
        </el-table-column>
        <el-table-column
          prop="stkName"
          label="股票名称"
          min-width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="date"
          label="日期"
          min-width="120"
        ></el-table-column>
        <el-table-column
          prop="stkHn"
          label="ETF持有数量"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="stkHv"
          label="ETF持有市值"
          min-width="120"
        ></el-table-column>
        <el-table-column
          prop="stkHvAmv"
          label="ETF持有市值占股票流通A股市值比"
          min-width="250"
        ></el-table-column>
        <el-table-column
          prop="stkHvTmv"
          label="ETF持有市值占股票总市值比"
          min-width="210"
        ></el-table-column>
        <el-table-column
          prop="rank"
          label="ETF持有市值排序"
          min-width="200"
          sortable
        ></el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="page"
        layout="total, prev, pager, next"
        :total="total"
        :page-size="pageSize"
        style="justify-content: flex-end; margin-top: 20px"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getStockList1Api, getStockList2Api } from "@/api/stockLocator";
import PeriodSelector from "@/components/PeriodSelector.vue";
import { Search } from "@element-plus/icons-vue";

const router = useRouter();
const ETFSearch = ref("");
const tableData = ref([]);
const total = ref(0);
const pageSize = ref(10);
const page = ref(1);
onMounted(() => {
  yearValue.value = "2025";
  getStockList2();
});
interface PeriodOption {
  label: string;
  value: string;
}
const yearValue = ref("");
const activeBtn = ref("-06-30");
const periodOptions: PeriodOption[] = [
  { label: "Q1", value: "-03-31" },
  { label: "Q2", value: "-06-30" },
  { label: "Q3", value: "-09-30" },
  { label: "Q4", value: "-12-31" },
];
const periodValue = ref("");
const periodChange = (value: string) => {
  periodValue.value = yearValue.value + activeBtn.value;
  getStockList2();
};

// const loading = ref(false);
const tableLoading = ref(false);
// const options = ref<{ value: string; label: string }[]>([]);

// function remoteMethod(query: string) {
//   if (query) {
//     loading.value = true;
//     getStockSelect(query);
//   } else {
//     options.value = [];
//   }
// }

function searchChange(value: string) {
    router.push({
    name: "StockLocatorDetails",
    query: { etf: value },
  });
}

function toEtfDetail(etf: any) {
  router.push({
    path: "/details",
    query: { code: "159395.SZ" },
  });
}

function getStockList2() {
  tableLoading.value = true;
  const params = {
    date: yearValue.value + activeBtn.value,
    page: page.value,
    size: pageSize.value,
  };
  getStockList2Api(params)
    .then((res: any) => {
      tableData.value = res.content;
      total.value = res.totalElements;
    })
    .finally(() => {
      tableLoading.value = false;
    });
}
const handlePageChange = (val: number) => {
  page.value = val;
  getStockList2();
};

</script>

<style lang="scss" scoped>
.stock-locator {
  width: 100%;
  height: 100%;
  .search-box {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .divider {
    width: 100%;
    height: 4px;
    background: var(--theme-purple);
    margin: 20px 0;
  }
  .titleP {
    font-size: 18px;
    font-weight: bold;
    padding-left: 20px;
    color: var(--theme-purple);
  }
  .tableLink {
    color: var(--theme-purple);
    text-decoration: none;
    cursor: pointer;
  }
}
</style>
