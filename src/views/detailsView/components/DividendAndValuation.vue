<template>
  <div class="dividend-and-valuation">
    <QuickFacts :facts="facts" title="BKLC Valuation"></QuickFacts>
    <div style="height: 40px"></div>
    <EtfCompareTable :title="title" :columns="columns" :data="data">
      <div class="description">
        <p>
          This section compares the dividend yield of this ETF to its peers.
        </p>
      </div>
    </EtfCompareTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import QuickFacts from "@/components/QuickFacts.vue";
import EtfCompareTable from "@/components/EtfCompareTable.vue";
const facts = ref([
  { title: "IVV", label: "P/E Ratio", value: "0.77%" },
  {
    title: "ETF Database Category Average",
    label: "P/E Ratio",
    value: "100.00%",
  },
  { title: "FactSet Segment Average", label: "P/E Ratio", value: "0.00%" },
]);
const title = ref("BKLC Valuation");
const columns = ref([
  { key: "name", label: "" },
  { key: "title", label: "Title" },
  { key: "label", label: "Label" },
  { key: "value", label: "Value" },
]);
const data = ref([
  { name: "IVV", title: "P/E Ratio", label: "P/E Ratio", value: "0.77%" },
  {
    name: "ETF Database Category Average",
    title: "P/E Ratio",
    label: "P/E Ratio",
    value: "100.00%",
  },
  {
    name: "FactSet Segment Average",
    title: "P/E Ratio",
    label: "P/E Ratio",
    value: "0.00%",
  },
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
