<template>
  <div class="dividend-and-valuation">
    <QuickFacts :facts="facts" title="BKLC Valuation"></QuickFacts>
    <div style="height: 40px"></div>
    <div style="display: flex; gap: 62px">
      <div class="block">
        <div class="section-title">基本面</div>
        <div class="info-list">
          <div class="info-row">
            <span>份额净值</span
            ><span class="linkStyle">{{
              "val"
            }}</span>
          </div>
          <div class="info-row">
            <span>份额盈利</span
            ><span class="linkStyle">{{
              "val"
            }}</span>
          </div>
          <div class="info-row">
            <span>份额销售收入</span>
            <span>{{ formatValue(29.9999, "percent") }}</span>
          </div>
          <div class="info-row">
            <span>份额自由现金流</span>
            <span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>份额分红</span>
            <span>{{ "val" }}</span>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="section-title">估值</div>
        <div class="info-list">
          <div class="info-row">
            <span>ETF P/B</span
            ><span class="linkStyle">{{
              "val"
            }}</span>
          </div>
          <div class="info-row">
            <span>ETF P/E</span
            ><span class="linkStyle">{{
              "val"
            }}</span>
          </div>
          <div class="info-row">
            <span>ETF P/S</span>
            <span>{{ formatValue(29.9999, "percent") }}</span>
          </div>
          <div class="info-row">
            <span>ETF P/CF</span>
            <span>{{ "val" }}</span>
          </div>
          <div class="info-row">
            <span>D/P</span>
            <span>{{ "val" }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import QuickFacts from "@/components/QuickFacts.vue";
import { formatValue } from "@/utils/formatValue";
const facts = ref([
  { title: "IVV", label: "P/E Ratio", value: "0.77%" },
  {
    title: "ETF Database Category Average",
    label: "P/E Ratio",
    value: "100.00%",
  },
  { title: "FactSet Segment Average", label: "P/E Ratio", value: "0.00%" },
]);
</script>

<style scoped lang="scss">
.dividend-and-valuation {
  background: #fff;
  padding: 0 20px;
  color: #333;
  font-size: var(--font-size-base);
}
</style>
