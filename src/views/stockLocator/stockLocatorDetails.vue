<template>
  <div class="stock-locator-details">
    <div class="page-header">
      <h1>
        包含{{ etfData.stockName }}（{{
          etfData.stockCode
        }}）持仓的交易所交易基金ETF
      </h1>
      <p style="margin-top: 10px">
        以下交易所交易基金（ETF）保持对{{ etfData.stockName }}（{{
          etfData.stockCode
        }}）的持仓。ETF持仓数据每日更新一次，且可能发生变化。
      </p>
      <p class="page-desc">
        若要查看下表中任何ETF的完整明细（包括行业、市值和国家配置），请点击其股票代码。
      </p>
      <h4>
        如下所示，有1只交易所交易基金（ETF）将{{ etfData.stockName }}纳入其前15大持仓。
      </h4>
    </div>
    <div style="padding: 20px;">
      <el-table
        :data="tableData"
        :header-cell-style="{
          background: '#f5f5fa',
          color: '#333',
          fontWeight: 'bold',
          fontSize: '1rem',
        }"
      >
        <el-table-column prop="etfName" label="ETF名称" width="">
          <template #default="scope">
            <span class="tableLink" @click="toEtfDetail(scope.row)">{{
              scope.row.etfName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="etfType"
          label="所属类型"
          width=""
        ></el-table-column>
        <el-table-column prop="rate" label="费率" width=""></el-table-column>
        <el-table-column
          prop="holdingWeight"
          label="持仓权重"
          width=""
        ></el-table-column>
        <el-table-column
          prop="specificWeight"
          label="具体权重"
          sortable
          width=""
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const route = useRoute();
const router = useRouter();
const etfData = route.query.etf ? JSON.parse(route.query.etf as string) : null;
const tableData = ref<any[]>([
  {
    etfName: "ETF1",
    etfType: "Type1",
    rate: "0.01",
    holdingWeight: "0.1%",
    specificWeight: "0.05%",
  },
]);
function toEtfDetail(etf: any) {
  router.push({
    path: "/details",
    query: { code: "159395.SZ" },
  });
}
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
