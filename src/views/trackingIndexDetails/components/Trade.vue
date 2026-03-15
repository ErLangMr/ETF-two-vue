<template>
  <div class="trade_container">
    <div style="text-align: right;margin-bottom: 10px;">
       <el-date-picker
        v-model="dateValue"
        type="daterange"
        range-separator="To"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
        @change="handleDateChange"
      />
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{ background: '#d7d9dc', color: '#333' }"
      v-loading="loading"
      style="width: 100%"
    >
      <el-table-column prop="indexCode" label="指数代码" />
      <el-table-column prop="indexName" label="指数名称" />
      <el-table-column prop="date" label="交易日期" />
      <!-- <el-table-column prop="openPrice" label="开盘点位" width="100" />
      <el-table-column prop="highPrice" label="最高点位" width="100" />
      <el-table-column prop="lowPrice" label="最低点位" width="100" /> -->
      <el-table-column prop="indexClose" label="收盘价" />
      <!-- <el-table-column prop="change" label="涨跌">
        <template #default="{ row }">
          <span :style="{ color: row.change >= 0 ? 'red' : 'green' }">
            {{ row.change }}
          </span>
        </template>
      </el-table-column> -->
      <el-table-column prop="indexChange" label="涨跌幅(%)">
        <template #default="{ row }">
          <span :style="{ color: row.indexChange >= 0 ? 'red' : 'green' }">
            {{ (row.indexChange).toFixed(4) }}
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="openDateChange" label="开始日累计涨跌" />
      <el-table-column prop="openDateChangePercent" label="开始日累计涨跌幅" /> -->
      <el-table-column prop="indexVolume" label="成交量(万股)" />
      <el-table-column prop="indexAmount" label="成交额(万元)" />
    </el-table>
    <div style="display: flex;justify-content: flex-end;margin-top: 20px;">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { getIndexTransactionApi } from "@/api/trackingIndex";

const props = defineProps<{
  tabActiveName: string
  code: string
}>()

watch(() => props.tabActiveName, (newVal) => {
  if (newVal === "Trade") {
    getTradeData();
  }
});
const dateValue = ref(['2025-09-26', '2025-09-30']);
function handleDateChange(val: string) {
  getTradeData();
}
const loading = ref(false);
function getTradeData() {
  loading.value = true;
  getIndexTransactionApi({
    indexCode: props.code,
    start: dateValue.value[0],
    end: dateValue.value[1],
    pageNum: currentPage.value,
    pageSize: pageSize.value,
  }).then((res) => {
    tableData.value = res.content;
    total.value = res.totalElements;
  }).finally(() => {
    loading.value = false;
  });
}

// 分页相关
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
function handleSizeChange(val: number) {
  pageSize.value = val;
  getTradeData();
}
function handleCurrentChange(val: number) {
  currentPage.value = val;
  getTradeData();
}

// 定义表格数据接口
interface TradeDataItem {
  indexCode: string;
  indexName: string;
  date: string;
  indexClose: number;
  indexChange: number;
  indexVolume: string;
  indexAmount: string;
}

const tableData = ref<TradeDataItem[]>([]);
</script>

<style lang="scss" scoped>
.trade_container {
  width: 100%;
  height: 100%;
}
</style>
