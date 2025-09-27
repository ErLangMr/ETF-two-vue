<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 复用PC端的表头和数据结构
const etfList = ref([
  {
    symbol: "VOO",
    name: "Vanguard S&P 500 ETF",
    asset: "Equity",
    total: "$650,164",
    ytd: "1.73%",
    volume: "8,612,705",
    price: "$546.26",
  },
  {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    asset: "Equity",
    total: "$601,593",
    ytd: "1.69%",
    volume: "77,763,039",
    price: "$594.20",
  },
  {
    symbol: "IVV",
    name: "iShares Core S&P 500 ETF",
    asset: "Equity",
    total: "$587,929",
    ytd: "1.73%",
    volume: "7,701,319",
    price: "$597.04",
  },
  {
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    asset: "Equity",
    total: "$471,269",
    ytd: "1.31%",
    volume: "4,462,734",
    price: "$292.58",
  },
  {
    symbol: "QQQ",
    name: "Invesco QQQ Trust Series I",
    asset: "Equity",
    total: "$328,042",
    ytd: "2.16%",
    volume: "49,937,926",
    price: "$521.51",
  },
  {
    symbol: "VUG",
    name: "Vanguard Growth ETF",
    asset: "Equity",
    total: "$164,367",
    ytd: "1.33%",
    volume: "1,756,252",
    price: "$415.34",
  },
  {
    symbol: "VEA",
    name: "Vanguard FTSE Developed Markets ETF",
    asset: "Equity",
    total: "$153,104",
    ytd: "14.49%",
    volume: "14,098,162",
    price: "$54.50",
  },
  {
    symbol: "IEFA",
    name: "iShares Core MSCI EAFE ETF",
    asset: "Equity",
    total: "$135,135",
    ytd: "15.37%",
    volume: "12,890,638",
    price: "$81.08",
  },
  {
    symbol: "VTV",
    name: "Vanguard Value ETF",
    asset: "Equity",
    total: "$131,750",
    ytd: "2.84%",
    volume: "3,178,900",
    price: "$173.10",
  },
  {
    symbol: "BND",
    name: "Vanguard Total Bond Market ETF",
    asset: "Bond",
    total: "$125,200",
    ytd: "2.08%",
    volume: "7,049,948",
    price: "$72.48",
  },
  {
    symbol: "AGG",
    name: "iShares Core U.S. Aggregate Bond ETF",
    asset: "Bond",
    total: "$122,113",
    ytd: "2.09%",
    volume: "9,038,564",
    price: "$97.66",
  },
  {
    symbol: "IWF",
    name: "iShares Russell 1000 Growth ETF",
    asset: "Equity",
    total: "$106,095",
    ytd: "0.05%",
    volume: "1,946,636",
    price: "$401.35",
  },
  {
    symbol: "GLD",
    name: "SPDR Gold Shares",
    asset: "Commodity",
    total: "$95,181",
    ytd: "21.52%",
    volume: "11,908,276",
    price: "$294.24",
  },
  {
    symbol: "IJH",
    name: "iShares Core S&P Mid-Cap ETF",
    asset: "Equity",
    total: "$93,025",
    ytd: "-0.52%",
    volume: "11,599,748",
    price: "$61.82",
  },
  {
    symbol: "VXUS",
    name: "Vanguard Total International Stock ETF",
    asset: "Equity",
    total: "$89,470",
    ytd: "12.82%",
    volume: "4,662,922",
    price: "$66.29",
  },
  {
    symbol: "IEMG",
    name: "iShares Core MSCI Emerging Markets ETF",
    asset: "Equity",
    total: "$88,572",
    ytd: "9.75%",
    volume: "11,394,544",
    price: "$57.31",
  },
]);

const tableHeaders = [
  { label: "Symbol", prop: "symbol",type:'link',url:'/details' },
  { label: "ETF Name", prop: "name",type:'link',url:'/details' },
  { label: "Asset Class", prop: "asset" },
  { label: "Total Assets ($MM)", prop: "total" },
  { label: "YTD Price Change", prop: "ytd" },
  { label: "Avg. Daily Share Volume (3mo)", prop: "volume" },
  { label: "Previous Closing Price", prop: "price" },
];

const expanded = ref<string | null>(null);
const toggleExpand = (symbol: string) => {
  expanded.value = expanded.value === symbol ? null : symbol;
};
</script>

<template>
  <div class="mobile-etf-list">
    <div v-for="etf in etfList" :key="etf.symbol" class="etf-row-card">
      <div class="etf-row-summary" @click="toggleExpand(etf.symbol)">
        <span class="symbol">{{ etf.symbol }}</span>
        <span class="symbol-divider">-</span>
        <span class="name">{{ etf.name }}</span>
        <span class="arrow" :class="{ expanded: expanded === etf.symbol }">
          <van-icon name="arrow" />
        </span>
      </div>
      <transition name="fade">
        <div v-if="expanded === etf.symbol" class="etf-row-detail">
          <div
            v-for="header in tableHeaders"
            :key="header.prop"
            class="etf-detail-item"
          >
            <span class="label">{{ header.label }}：</span>
            <span
              class="value linkStyle"
              v-if="header.type === 'link'"
              @click="router.push(header.url)"
              >{{ etf[header.prop as keyof typeof etf] }}</span
            >
            <span class="value" v-else>{{
              etf[header.prop as keyof typeof etf]
            }}</span>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mobile-etf-list {
  padding: 8px;
  .etf-row-card {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border-left: 4px solid #e8e8f5;
    border-right: 4px solid #e8e8f5;
    border-top: 4px solid #e8e8f5;
    border-bottom: 2px solid #e8e8f5;
    box-sizing: border-box;
    // margin-bottom: 12px;
    overflow: hidden;
    transition: box-shadow 0.2s;
    &:active,
    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
    .etf-row-summary {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      cursor: pointer;
      font-size: var(--font-size-base);
      border-bottom: 1px solid #f0f0f0;
      .symbol-divider {
        margin: 0 3px;
      }
      .name {
        flex: 1;
        margin-right: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .arrow {
        font-size: var(--font-size-medium);
        font-weight: 600;
        transition: transform 0.2s;
        color: var(--theme-purple);
        &.expanded {
          transform: rotate(90deg);
        }
      }
    }
    .etf-row-detail {
      padding: 10px 14px 14px 14px;
      background: #f9f9fb;
      .etf-detail-item {
        display: flex;
        font-size: var(--font-size-base);
        padding: 6px 0;
        justify-content: space-between;
        border-bottom: 1px solid #f0f0f0;
        &:last-child {
          border-bottom: none;
        }
        .label {
          color: #888;
          min-width: 140px;
          flex-shrink: 0;
        }
        .value {
          color: #222;
          font-weight: 500;
          word-break: break-all;
        }
      }
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
@media (max-width: 768px) {
  .mobile-etf-list {
    padding: 0;
    .etf-row-card {
      border-radius: 0;
      // margin-bottom: 8px;
    }
  }
}
</style>
