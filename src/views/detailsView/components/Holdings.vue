<template>
  <div class="holdings">
    <h3 class="h4">Top 15 Holdings</h3>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="Symbol" label="Symbol">
        <template #default="{ row }">
          <span class="linkStyle" @click="router.push(`/exposure?symbol=${row.Symbol}`)">{{ row.Symbol }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Holding" label="Holding" min-width="180" />
      <el-table-column prop="% Assets" label="% Assets" />
    </el-table>
    <div class="Analysis" style="margin-top: 40px">
      <h3 class="h4">Concentration Analysis</h3>
      <p>This section compares how balanced and deep this ETF is relative to its peers.</p>
      <div class="holdings-comparison">
        <h3 class="h4">Holdings Comparison</h3>
        <EtfCompareTable :columns="columns" :data="data"></EtfCompareTable>
        <h3 class="h4" style="margin-top: 30px">Size Comparison</h3>
        <EtfCompareTable :columns="columns" :data="data"></EtfCompareTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import EtfCompareTable from "@/components/EtfCompareTable.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const tableData = ref([
  {
    Symbol: "AAPL",
    Holding: "Apple Inc.",
    "% Assets": "10.00%",
  },
  {
    Symbol: "GOOGL",
    Holding: "Alphabet Inc.",
    "% Assets": "10.00%",
  },
  {
    Symbol: "MSFT",
    Holding: "Microsoft Corporation",
    "% Assets": "10.00%",
  },
  {
    Symbol: "AMZN",
    Holding: "Amazon.com Inc.",
    "% Assets": "10.00%",
  },
]);
const columns = ref([
  { key: "name", label: "" },
  { key: "IVV", label: "IVV" },
  { key: "ETF Database Category Average", label: "ETF Database Category Average" },
  { key: "FactSet Segment Average", label: "FactSet Segment Average" },
]);
const data = ref([
  { name: "Number of Holdings", IVV: "10.00%", "ETF Database Category Average": "10.00%", "FactSet Segment Average": "10.00%" },
  { name: "Number of Holdings", IVV: "10.00%", "ETF Database Category Average": "10.00%", "FactSet Segment Average": "10.00%" },
]);
</script>

<style scoped lang="scss">
.holdings {
  .h4 {
    font-size: var(--font-size-large);
    margin-bottom: 10px;
  }
  .holdings-comparison {
    margin-top: 20px;
    padding: 0 20px;
  }
}
</style>
