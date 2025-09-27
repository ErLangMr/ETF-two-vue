<template>
  <div class="equities-container">
    <div class="equities-header">
      <h1 class="equities-title">Asia Pacific Equities ETFs</h1>
      <p class="equities-desc">
        Asia-Pacific ETFs are funds that invest primarily companies based in the
        Asia-Pacific region. These companies typically are based in Hong Kong,
        South Korea and Japan.
      </p>
    </div>
    <QuickFacts :facts="facts" title="Quick Category Facts"></QuickFacts>
    <div class="issuers-table-block">
      <div class="issuers-title">Top Issuers by AUM</div>
      <div class="issuers-table-wrap">
        <table class="issuers-table">
          <thead>
            <tr>
              <th></th>
              <th>AUM ($,B)</th>
              <th># Of Funds</th>
              <th>Average ER %</th>
              <th>Average 1YR Return</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="issuer in issuers" :key="issuer.name">
              <td class="linkStyle" @click="router.push(`/proshares?issuer=${issuer.name}`)">{{ issuer.name }}</td>
              <td>{{ issuer.aum }}</td>
              <td>{{ issuer.funds }}</td>
              <td>{{ issuer.er }}</td>
              <td>{{ issuer.return }}</td>
            </tr>
          </tbody>
        </table>
        <div class="issuers-link-row">
          <div class="issuers-link-row">
            <a class="issuers-link" href="javascript:;" @click="toggleShowAll">
              {{
                showAll ? "See Less" : "See All Issuers Within This Category"
              }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="list-container">
      <h2>Definitive List Of Asia Pacific Equities ETFs</h2>
      <div class="list-box">
        <ScreenerTable
          :table-columns="tableColumns"
          :table-data="etfList"
          :filter-tabs="filterTabs"
          :active-tab="activeTab"
          @update:activeTab="activeTab = $event"
          :description="description"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import ScreenerTable from '@/components/ScreenerTable.vue';
import QuickFacts from '@/components/QuickFacts.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const facts = ref([
  { label: "# of Funds", value: 50 },
  { label: "Total AUM ($,M)", value: "$54,303.11" },
  { label: "Average Expense Ratio", value: "0.53%" },
  { label: "Average 1YR Return", value: "7.76%" },
]);
const allIssuers = ref([
  {
    name: "BlackRock, Inc.",
    aum: "34.11",
    funds: 22,
    er: "0.55%",
    return: "8.90%",
  },
  {
    name: "Vanguard",
    aum: "7.31",
    funds: 1,
    er: "0.07%",
    return: "7.44%",
  },
  {
    name: "JPMorgan Chase",
    aum: "4.87",
    funds: 1,
    er: "0.19%",
    return: "10.01%",
  },
  {
    name: "WisdomTree, Inc.",
    aum: "3.12",
    funds: 2,
    er: "0.67%",
    return: "4.84%",
  },
  {
    name: "Franklin Templeton",
    aum: "2.78",
    funds: 6,
    er: "0.14%",
    return: "5.96%",
  },
  { name: "Invesco", aum: "2.50", funds: 3, er: "0.20%", return: "6.12%" },
  { name: "State Street", aum: "2.10", funds: 2, er: "0.18%", return: "5.80%" },
]);
const showAll = ref(false);
const issuers = computed(() =>
  showAll.value ? allIssuers.value : allIssuers.value.slice(0, 5)
);

function toggleShowAll() {
  showAll.value = !showAll.value;
}

const description = 'This is a list of all US-traded ETFs that are currently included in the Asia Pacific Equities ETF Database Category by the ETF Database staff. Each ETF is placed in a single “best fit” ETF Database Category; if you want to browse ETFs with more flexible selection criteria, visit our screener. To see more information of the Asia Pacific Equities ETFs, click on one of the tabs above.'
// 表头配置
const tableColumns = ref([
  { prop: 'symbol', label: 'Symbol',type:'link',url:'/details' },
  { prop: 'name', label: 'ETF Name',type:'link',url:'/details' },
  { prop: 'asset', label: 'Asset Class' },
  { prop: 'total', label: 'Total Assets ($MM)' },
  { prop: 'ytd', label: 'YTD Price Change' },
  { prop: 'volume', label: 'Avg. Daily Share Volume (3mo)' },
  { prop: 'price', label: 'Previous Closing Price' },
])

const etfList = ref([
  { symbol: 'FTLS', name: 'First Trust Long/Short Equity ETF', asset: 'Alternatives', total: '$1,951', ytd: '-2.91%', volume: '162,536', price: '$63.75' },
  { symbol: 'DBMF', name: 'iMGP DBi Managed Futures Strategy ETF', asset: 'Alternatives', total: '$1,191', ytd: '-2.58%', volume: '778,684', price: '$25.31' },
  { symbol: 'CTA', name: 'Simplify Managed Futures Strategy ETF', asset: 'Alternatives', total: '$1,034', ytd: '-0.25%', volume: '638,084', price: '$27.71' },
  { symbol: 'QAI', name: 'NYLI Hedge Multi-Strategy Tracker ETF', asset: 'Alternatives', total: '$692', ytd: '0.25%', volume: '69,002', price: '$31.49' },
  { symbol: 'RLY', name: 'SPDR SSgA Multi-Asset Real Return ETF', asset: 'Alternatives', total: '$477', ytd: '4.52%', volume: '84,514', price: '$28.24' },
  { symbol: 'BTAL', name: 'AGF U.S. Market Neutral Anti-Beta Fund', asset: 'Alternatives', total: '$389', ytd: '6.11%', volume: '945,519', price: '$19.61' },
  { symbol: 'FLSP', name: 'Franklin Systematic Style Premia ETF', asset: 'Alternatives', total: '$337', ytd: '0.84%', volume: '55,541', price: '$24.11' },
  { symbol: 'MNA', name: 'NYLI Merger Arbitrage ETF', asset: 'Alternatives', total: '$234', ytd: '5.43%', volume: '39,944', price: '$34.75' },
  { symbol: 'KMLM', name: 'KFA Mount Lucas Managed Futures Index Strategy ETF', asset: 'Alternatives', total: '$194', ytd: '-6.37%', volume: '164,363', price: '$26.31' },
  { symbol: 'CLSE', name: 'Convergence Long/Short Equity ETF', asset: 'Alternatives', total: '$172', ytd: '-3.71%', volume: '116,822', price: '$22.06' },
  { symbol: 'WTMF', name: 'WisdomTree Managed Futures Strategy Fund', asset: 'Alternatives', total: '$158', ytd: '-1.23%', volume: '27,181', price: '$34.50' },
  { symbol: 'FMF', name: 'First Trust Managed Futures Strategy Fund', asset: 'Alternatives', total: '$151', ytd: '-4.02%', volume: '25,977', price: '$45.43' },
])

const filterTabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Returns', value: 'returns' },
  { label: 'Fund Flows', value: 'fund-flows' },
  { label: 'Expenses', value: 'expenses' },
  { label: 'ESG', value: 'esg', icon: true },
  { label: 'Dividends', value: 'dividends' },
  { label: 'Risk', value: 'risk' },
  { label: 'Holdings', value: 'holdings' },
  { label: 'Taxes', value: 'taxes' },
  { label: 'Technicals', value: 'technicals' },
  { label: 'Analysis', value: 'analysis' },
  { label: 'Realtime Ratings', value: 'realtime-ratings' },
]
const activeTab = ref('overview')
</script>

<style scoped lang="scss">
.equities-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  .equities-header {
    .equities-title {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }
    .equities-desc {
      font-size: 1.08rem;
      color: #222;
      margin-bottom: 1.1rem;
      line-height: 1.7;
    }
  }
  .list-box{
  //  border: 1px solid #ccc;
   border-radius: 5px;
  }
}

.issuers-table-block {
  margin: 36px 0;
}
.issuers-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 18px;
}
.issuers-table-wrap {
  background: #fff;
  border-radius: 6px;
  box-shadow: none;
  padding: 0;
  overflow-x: auto;
}
.issuers-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
  background: transparent;
}
.issuers-table thead th {
  color: #666;
  font-weight: 400;
  border-bottom: 1.5px solid #e0e0e0;
  padding: 8px 0 10px 0;
  text-align: left;
  font-size: 1rem;
}
.issuers-table tbody td {
  font-size: 1rem;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
  text-align: left;
}
.issuers-table tbody tr:last-child td {
  border-bottom: none;
}
.issuers-link-row {
  border-top: 1.5px solid #e0e0e0;
  text-align: center;
  margin-top: 0;
  padding-top: 10px;
  padding-bottom: 2px;
}
.issuers-link {
  color: var(--theme-purple);
  font-size: 1rem;
  text-decoration: none;
  font-weight: 400;
  transition: color 0.2s;
}
.issuers-link:hover {
  color: var(--theme-purple);
  text-decoration: underline;
}
.issuers-date {
  color: #666;
  font-size: 0.95rem;
  margin-top: 8px;
  margin-left: 2px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .issuers-title {
    font-size: 1.3rem;
    text-align: center;
  }
  .issuers-table-wrap {
    padding: 0;
  }
  .issuers-table thead th,
  .issuers-table tbody td {
    font-size: 0.95rem;
    padding-left: 6px;
    padding-right: 6px;
  }
  .issuer-name {
    min-width: 100px;
    font-size: 0.98rem;
  }
}
</style>
