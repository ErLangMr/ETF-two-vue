<template>
  <div class="exposure-view-container">
    <h1 class="tool-view-title">ETFs with {{ country }} Exposure</h1>
      <p class="tool-view-desc">
        The table below displays all U.S. listed equity ETFs that maintain significant exposure to stocks listed in Oman. Note that ETFs that do not include Oman within the top 10 country allocations may not be included below.
      </p>
      <ScreenerTable
          class="table-area"
          :table-columns="tableColumns"
          :table-data="etfList"
        />
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
import ScreenerTable from '@/components/ScreenerTable.vue';
import { ref } from 'vue';
const route = useRoute();
const country = route.query.country as string;
const etfList = ref([
  {
    Ticker: 'SPY',
    ETf: 'SPDR S&P 500 ETF Trust',
    'ETF Database Category': 'Large Cap Blend Equities',
    'Expense Ratio': '0.0945%',
    'Weighting': '85.66%'
  },
  {
    Ticker: 'QQQ',
    ETf: 'Invesco QQQ Trust',
    'ETF Database Category': 'Large Cap Growth Equities',
    'Expense Ratio': '0.20%',
    'Weighting': '85.66%'
  },
  {
    Ticker: 'VTI',
    ETf: 'Vanguard Total Stock Market ETF',
    'ETF Database Category': 'Total Market Equities',
    'Expense Ratio': '0.03%',
    'Weighting': '85.66%'
  },
  {
    Ticker: 'VEA',
    ETf: 'Vanguard FTSE Developed Markets ETF',
    'ETF Database Category': 'Foreign Large Cap Equities',
    'Expense Ratio': '0.05%',
    'Weighting': '85.66%'
  },
  {
    Ticker: 'AGG',
    ETf: 'iShares Core U.S. Aggregate Bond ETF',
    'ETF Database Category': 'Total Bond Market',
    'Expense Ratio': '0.03%',
    'Weighting': '15.66%'
  },
  {
    Ticker: 'VWO',
    ETf: 'Vanguard FTSE Emerging Markets ETF',
    'ETF Database Category': 'Diversified Emerging Mkts',
    'Expense Ratio': '0.08%',
    'Weighting': '35.36%'
  },
  {
    Ticker: 'IEFA',
    ETf: 'iShares Core MSCI EAFE ETF',
    'ETF Database Category': 'Foreign Large Cap Equities',
    'Expense Ratio': '0.07%',
    'Weighting': '25.61%'
  },
  {
    Ticker: 'BND',
    ETf: 'Vanguard Total Bond Market ETF',
    'ETF Database Category': 'Total Bond Market',
    'Expense Ratio': '0.03%',
    'Weighting': '85.66%'
  }
])

// 表头配置
const tableColumns = ref([
  { prop: 'Ticker', label: 'Ticker',type:'link',url:'/details' },
  { prop: 'ETf', label: 'ETF',type:'link',url:'/details' },
  { prop: 'ETF Database Category', label: 'ETF Database Category',type:'link',url:'/equities' },
  { prop: 'Expense Ratio', label: 'Expense Ratio' },
  { prop: 'Weighting', label: 'Weighting' }
])
</script>

<style scoped lang="scss">
.exposure-view-container {
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
</style>
