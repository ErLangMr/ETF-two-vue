<template>
  <div class="trade_container">
    <el-table
      :data="tableData"
      :header-cell-style="{ background: '#d7d9dc', color: '#333' }"
      style="width: 100%"
    >
      <el-table-column prop="tradingDate" label="交易日期" width="120" />
      <!-- <el-table-column prop="openPrice" label="开盘点位" width="100" />
      <el-table-column prop="highPrice" label="最高点位" width="100" />
      <el-table-column prop="lowPrice" label="最低点位" width="100" /> -->
      <el-table-column prop="closePrice" label="收盘价" width="100" />
      <el-table-column prop="change" label="涨跌" width="80">
        <template #default="{ row }">
          <span :style="{ color: row.change >= 0 ? 'red' : 'green' }">
            {{ row.change }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="changePercent" label="涨跌幅(%)" width="100">
        <template #default="{ row }">
          <span :style="{ color: row.change >= 0 ? 'red' : 'green' }">
            {{ row.changePercent }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="openDateChange" label="开始日累计涨跌" width="130" />
      <el-table-column prop="openDateChangePercent" label="开始日累计涨跌幅" width="150" />
      <el-table-column prop="volume" label="成交量(万股)" width="140" />
      <el-table-column prop="turnover" label="成交额(万元)" width="150" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 定义表格数据接口
interface TradeDataItem {
  tradingDate: string;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  change: number;
  changePercent: string;
  openDateChange: number;
  openDateChangePercent: string;
  volume: string;
  turnover: string;
}

const tableData = ref<TradeDataItem[]>([
  {
    tradingDate: '2025-09-19',
    openPrice: 4499.09,
    highPrice: 4533.09,
    lowPrice: 4491.84,
    closePrice: 4501.92,
    change: 3.81,
    changePercent: '0.08%',
    openDateChange: -189.51,
    openDateChangePercent: '-4.04%',
    volume: '2,250,440.00',
    turnover: '60,388,705.98'
  },
  {
    tradingDate: '2025-09-18',
    openPrice: 4546.03,
    highPrice: 4573.83,
    lowPrice: 4454.99,
    closePrice: 4498.11,
    change: -52.91,
    changePercent: '-1.16%',
    openDateChange: -193.32,
    openDateChangePercent: '-4.12%',
    volume: '3,098,598.26',
    turnover: '83,998,712.74'
  },
  {
    tradingDate: '2025-09-17',
    openPrice: 4517.29,
    highPrice: 4556.03,
    lowPrice: 4503.80,
    closePrice: 4551.02,
    change: 27.69,
    changePercent: '0.61%',
    openDateChange: -140.41,
    openDateChangePercent: '-2.99%',
    volume: '2,357,164.72',
    turnover: '60,845,420.05'
  },
  {
    tradingDate: '2025-09-16',
    openPrice: 4539.92,
    highPrice: 4552.42,
    lowPrice: 4494.79,
    closePrice: 4523.34,
    change: -9.72,
    changePercent: '-0.21%',
    openDateChange: -168.09,
    openDateChangePercent: '-3.58%',
    volume: '2,492,692.06',
    turnover: '61,372,833.48'
  },
  {
    tradingDate: '2025-09-15',
    openPrice: 4534.89,
    highPrice: 4566.91,
    lowPrice: 4522.50,
    closePrice: 4533.06,
    change: 11.06,
    changePercent: '0.24%',
    openDateChange: -158.37,
    openDateChangePercent: '-3.38%',
    volume: '2,318,856.78',
    turnover: '61,331,465.24'
  },
  {
    tradingDate: '2025-09-12',
    openPrice: 4544.59,
    highPrice: 4564.67,
    lowPrice: 4517.79,
    closePrice: 4522.00,
    change: -26.04,
    changePercent: '-0.57%',
    openDateChange: -169.43,
    openDateChangePercent: '-3.61%',
    volume: '2,664,420.03',
    turnover: '68,957,607.57'
  },
  {
    tradingDate: '2025-09-11',
    openPrice: 4438.84,
    highPrice: 4548.03,
    lowPrice: 4427.92,
    closePrice: 4548.03,
    change: 102.67,
    changePercent: '2.31%',
    openDateChange: -143.39,
    openDateChangePercent: '-3.06%',
    volume: '2,532,640.51',
    turnover: '69,315,667.14'
  },
  {
    tradingDate: '2025-09-10',
    openPrice: 4438.30,
    highPrice: 4466.63,
    lowPrice: 4414.59,
    closePrice: 4445.36,
    change: 9.11,
    changePercent: '0.21%',
    openDateChange: -246.06,
    openDateChangePercent: '-5.24%',
    volume: '2,035,976.46',
    turnover: '53,553,934.95'
  },
  {
    tradingDate: '2025-09-09',
    openPrice: 4448.74,
    highPrice: 4472.09,
    lowPrice: 4412.69,
    closePrice: 4436.26,
    change: -31.31,
    changePercent: '-0.70%',
    openDateChange: -255.17,
    openDateChangePercent: '-5.44%',
    volume: '2,213,754.60',
    turnover: '56,286,110.40'
  },
  {
    tradingDate: '2025-09-08',
    openPrice: 4467.17,
    highPrice: 4482.76,
    lowPrice: 4438.07,
    closePrice: 4467.57,
    change: 7.25,
    changePercent: '0.16%',
    openDateChange: -223.85,
    openDateChangePercent: '-4.77%',
    volume: '2,676,383.82',
    turnover: '68,363,087.98'
  },
  {
    tradingDate: '2025-09-05',
    openPrice: 4365.61,
    highPrice: 4466.56,
    lowPrice: 4350.30,
    closePrice: 4460.32,
    change: 95.12,
    changePercent: '2.18%',
    openDateChange: -231.10,
    openDateChangePercent: '-4.93%',
    volume: '2,496,256.57',
    turnover: '66,416,697.09'
  },
  {
    tradingDate: '2025-09-04',
    openPrice: 4461.25,
    highPrice: 4465.50,
    lowPrice: 4327.51,
    closePrice: 4365.21,
    change: -94.62,
    changePercent: '-2.12%',
    openDateChange: -326.22,
    openDateChangePercent: '-6.95%',
    volume: '3,079,346.09',
    turnover: '77,312,459.70'
  },
  {
    tradingDate: '2025-09-03',
    openPrice: 4501.34,
    highPrice: 4510.73,
    lowPrice: 4427.52,
    closePrice: 4459.83,
    change: -30.62,
    changePercent: '-0.68%',
    openDateChange: -231.60,
    openDateChangePercent: '-4.94%',
    volume: '2,543,202.17',
    turnover: '65,569,711.67'
  },
  {
    tradingDate: '2025-09-02',
    openPrice: 4521.98,
    highPrice: 4548.89,
    lowPrice: 4454.42,
    closePrice: 4490.45,
    change: -33.26,
    changePercent: '-0.74%',
    openDateChange: -200.98,
    openDateChangePercent: '-4.28%',
    volume: '3,039,325.66',
    turnover: '77,799,929.80'
  },
  {
    tradingDate: '2025-09-01',
    openPrice: 4516.88,
    highPrice: 4528.13,
    lowPrice: 4487.53,
    closePrice: 4523.71,
    change: 26.95,
    changePercent: '0.60%',
    openDateChange: -167.72,
    openDateChangePercent: '-3.57%',
    volume: '3,203,667.08',
    turnover: '77,037,828.81'
  },
  {
    tradingDate: '2025-08-29',
    openPrice: 4455.80,
    highPrice: 4516.84,
    lowPrice: 4452.36,
    closePrice: 4496.76,
    change: 32.98,
    changePercent: '0.74%',
    openDateChange: -194.67,
    openDateChangePercent: '-4.15%',
    volume: '3,519,389.47',
    turnover: '83,119,406.62'
  },
  {
    tradingDate: '2025-08-28',
    openPrice: 4378.04,
    highPrice: 4464.80,
    lowPrice: 4364.17,
    closePrice: 4463.78,
    change: 77.66,
    changePercent: '1.77%',
    openDateChange: -227.65,
    openDateChangePercent: '-4.85%',
    volume: '2,968,345.36',
    turnover: '73,942,360.22'
  },
  {
    tradingDate: '2025-08-27',
    openPrice: 4458.84,
    highPrice: 4494.91,
    lowPrice: 4386.13,
    closePrice: 4386.13,
    change: -66.46,
    changePercent: '-1.49%',
    openDateChange: -305.30,
    openDateChangePercent: '-6.51%',
    volume: '3,331,338.98',
    turnover: '78,509,848.30'
  },
  {
    tradingDate: '2025-08-26',
    openPrice: 4453.35,
    highPrice: 4476.80,
    lowPrice: 4435.53,
    closePrice: 4452.59,
    change: -16.63,
    changePercent: '-0.37%',
    openDateChange: -238.84,
    openDateChangePercent: '-5.09%',
    volume: '2,706,213.95',
    turnover: '62,795,045.02'
  },
  {
    tradingDate: '2025-08-25',
    openPrice: 4416.29,
    highPrice: 4472.65,
    lowPrice: 4404.78,
    closePrice: 4469.22,
    change: 91.22,
    changePercent: '2.08%',
    openDateChange: -222.21,
    openDateChangePercent: '-4.74%',
    volume: '3,580,900.06',
    turnover: '82,368,196.45'
  }
]);
</script>

<style lang="scss" scoped>
.trade_container {
  width: 100%;
  height: 100%;
}
</style>
