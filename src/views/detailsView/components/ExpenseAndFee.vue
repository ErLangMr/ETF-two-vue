<template>
  <div class="expense-and-fee">
    <div class="section-title">Expense and Fee</div>
    <p class="description">
      This section compares the cost efficiency of this ETF to its peers.
    </p>
    <div class="expense-and-fee-container">
      <div class="quick-facts">
        <h3 class="quick-facts-title">Expenses Ratio Analysis</h3>
        <QuickFacts :facts="facts"></QuickFacts>
      </div>
      <div class="block">
        <div class="section-title">Tax Analysis</div>
        <div class="info-list">
          <div class="info-row"><span>Max ST Capital Gains Rate</span><span>0.00%</span></div>
          <div class="info-row"><span>Max LT Capital Gains Rate</span><span>0.00%</span></div>
          <div class="info-row"><span>Tax On Distributions</span><span>Qualified dividends</span></div>
          <div class="info-row"><span>Distributes K1</span><span>No</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import QuickFacts from "@/components/QuickFacts.vue";
import EtfCompareTable from "@/components/EtfCompareTable.vue";
const facts = ref([
  { title: "IVV", label: "Expense Ratio", value: "0.00%" },
  {
    title: "ETF Database Category Average",
    label: "Expense Ratio",
    value: "0.00%",
  },
  { title: "FactSet Segment Average", label: "Expense Ratio", value: "0.00%" },
]);
const data = ref([
  { name: "Max ST Capital Gains Rate", value: "0.00%" },
  { name: "Max LT Capital Gains Rate", value: "0.00%" },
  { name: "Tax On Distributions", value: "Qualified dividends" },
  { name: "Distributes K1", value: "No" },
]);
</script>

<style scoped lang="scss">
.expense-and-fee {
  background: #fff;
  .section-title {
    font-size: var(--font-size-title);
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
  }
  .description {
    font-size: var(--font-size-base);
    color: #333;
    margin-bottom: 20px;
  }
  .expense-and-fee-container {
    .quick-facts {
      .quick-facts-title {
        font-size: var(--font-size-large);
        margin-bottom: 10px;
      }
    }
    .block {
      .section-title {
        font-size: var(--font-size-large);
        margin-bottom: 10px;
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
        border-top: 1px solid #ececec;
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
        text-decoration: underline;
      }
    }
  }
}
</style>
