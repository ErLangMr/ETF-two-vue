<template>
  <div class="stock-locator">
    <div class="page-header">
      <h1>股票定位器</h1>
      <p class="page-desc">
        只需在下方搜索框中输入股票代码或名称（例如GOOG），ETF股票持仓工具就会为您找到持有该股票较多的ETF。
      </p>
    </div>
    <div class="search-box">
      <el-input
        v-model="ETFSearch"
        style="width: 500px"
        placeholder="请输入股票代码或名称"
      >
        <template #append><el-button :icon="Search" /></template>
      </el-input>
    </div>
    <div class="divider"></div>
    <p class="titleP">最受欢迎的145只股票及其ETF替代方案</p>
    <el-table
      :data="tableData"
      :header-cell-style="{
        background: '#f5f5fa',
        color: '#333',
        fontWeight: 'bold',
        fontSize: '1rem',
      }"
    >
      <el-table-column prop="stockCode" label="股票代码" width="">
        <template #default="scope">
          <span class="tableLink" @click="toEtfLocator(scope.row)">{{ scope.row.stockCode }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stockName" label="股票名称" width=""></el-table-column>
      <el-table-column prop="etfName" label="ETF替代方案" width="">
        <template #default="scope">
          <span class="tableLink" @click="toEtfLocator(scope.row)">{{ scope.row.etfName }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter();
const ETFSearch = ref("");
const tableData = ref([
  { stockCode: "000001", stockName: "股票1", etfName: "ETF1" }
]);

const toEtfLocator = (row: any) => {
  console.log(row);
  router.push({
    name: 'StockLocatorDetails',
    query: { etf: JSON.stringify(row) },
  });
};
</script>

<style lang="scss" scoped>
.stock-locator {
  width: 100%;
  height: 100%;
  .search-box {
    padding: 20px;
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
