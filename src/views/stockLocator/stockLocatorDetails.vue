<template>
  <div class="stock-locator-details">
    <div class="page-header">
      <h1>
        包含{{ etfData }}持仓的交易所交易基金ETF
      </h1>
      <p style="margin-top: 10px">
        以下交易所交易基金（ETF）保持对{{ etfData }}的持仓。ETF持仓数据每日更新一次，且可能发生变化。
      </p>
      <p class="page-desc">
        若要查看下表中任何ETF的完整明细（包括行业、市值和国家配置），请点击其股票代码。
      </p>
      <div style="display: flex; align-items: center;justify-content: space-between;">
        <h4>
          如下所示，有{{total}}只交易所交易基金（ETF）将{{
            etfData
          }}纳入其前15大持仓。
        </h4>
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
    </div>
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
          <span class="tableLink" @click="toEtfLocator(scope.row)">{{
            scope.row.stkCode
          }}</span>
        </template> -->
      </el-table-column>
      <el-table-column
        prop="stkName"
        label="股票名称"
        min-width="150"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="etfCode" label="ETF代码" min-width="120">
        <template #default="scope">
          <span class="tableLink" @click="toEtfDetails(scope.row)">{{
            scope.row.etfCode
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="etfName"
        label="ETF名称"
        min-width="150"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="holdMv"
        label="持有股票市值"
        min-width="130"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="holdNum"
        label="持有股票数量"
        min-width="130"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="port"
        label="占ETF净值比"
        min-width="130"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="rank"
        label="占ETF净值比排序"
        min-width="150"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="reportType"
        label="定期报告类型"
        min-width="150"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="w1"
        label="占股票总市值比"
        min-width="150"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="w2"
        label="占股票流通A股市值比"
        min-width="180"
        :show-overflow-tooltip="true"
      />
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
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getStockList1Api } from "@/api/stockLocator";
import PeriodSelector from "@/components/PeriodSelector.vue";

const route = useRoute();
const etfData = route.query.etf || null;

const tableLoading = ref(false);
const router = useRouter();
const total = ref(0);
const pageSize = ref(10);
const page = ref(1);
onMounted(() => {
  yearValue.value = "2025";
  getStockList1();
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
  getStockList1();
};
const tableData = ref<any[]>([]);
const handlePageChange = (val: number) => {
  page.value = val;
  getStockList1();
};
function getStockList1() {
  tableLoading.value = true;
  const params = {
    date: yearValue.value + activeBtn.value,
    req: etfData,
    page: page.value,
    size: pageSize.value,
  };
  getStockList1Api(params)
    .then((res: any) => {
      // loading.value = false;
      // options.value = res.content.map((item: any) => {
      //   return { value: item.stkCode, label: item.etfName };
      // });
      tableData.value = res.content;
      total.value = res.totalElements;
    })
    .finally(() => {
      tableLoading.value = false;
    });
}
const toEtfDetails = (row: any) => {
  router.push({
    path: "/details",
    query: { code: row.etfCode, name: row.etfName },
  });
};
</script>

<style lang="scss" scoped>
.stock-locator-details {
  width: 100%;
  height: 100%;
  padding: 20px;
  .tableLink {
    color: var(--theme-purple);
    text-decoration: none;
    cursor: pointer;
  }
}
</style>
