<template>
  <div class="dividend-and-valuation">
    <!-- <QuickFacts :facts="facts" title="BKLC Valuation"></QuickFacts> -->
    <div style="height: 40px"></div>
    <div style="display: flex; gap: 62px">
      <div class="block">
        <div class="section-title">分红和估值</div>
        <div class="info-list">
          <div class="info-row">
            <span>单位累计分红(元)</span><span>{{ formatValue(infoData.cumD) }}</span>
          </div>
          <div class="info-row">
            <span>数据日期</span><span>{{ infoData.date }}</span>
          </div>
          <div class="info-row">
            <span>年度股息率 (%)</span>
            <span>{{ formatValue(infoData.dp) }}</span>
          </div>
          <div class="info-row">
            <span>份额净资产（元）</span>
            <span>{{ formatValue(infoData.etfBe) }}</span>
          </div>
          <div class="info-row">
            <span>ETF价格/份额净值</span>
            <span>{{ formatValue(infoData.etfPe) }}</span>
          </div>
          <div class="info-row">
            <span>ETF价格/份额销售收入</span>
            <span>{{ formatValue(infoData.etfPs) }}</span>
          </div>
          <div class="info-row">
            <span>份额销售收入（元）</span>
            <span>{{ formatValue(infoData.etfYs) }}</span>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="section-title"> </div>
        <div class="info-list">
          <div class="info-row">
            <span>份额分红（元）</span><span>{{ formatValue(infoData.etfD) }}</span>
          </div>
          <div class="info-row">
            <span>份额分红/ETF价格（百分比）</span><span>{{ formatValue(infoData.etfDp) }}</span>
          </div>
          <div class="info-row">
            <span>份额盈利（元）</span>
            <span>{{ formatValue(infoData.etfNp) }}</span>
          </div>
          <div class="info-row">
            <span>ETF价格/份额盈利</span>
            <span>{{ formatValue(infoData.etfPb) }}</span>
          </div>
          <div class="info-row">
            <span>ETF价格/份额现金流</span>
            <span>{{ formatValue(infoData.etfPcf) }}</span>
          </div>
          <div class="info-row">
            <span>上一年度单位分红（元）</span>
            <span>{{ formatValue(infoData.lyD) }}</span>
          </div>
          <div class="info-row">
            <span>今年以来单位分红（元）</span>
            <span>{{ formatValue(infoData.ytdD) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import QuickFacts from "@/components/QuickFacts.vue";
import { formatValue } from "@/utils/formatValue";
import { getDividendAndValuationApi } from "@/api/filterDetails";
// const facts = ref([
//   { title: "IVV", label: "P/E Ratio", value: "0.77%" },
//   {
//     title: "ETF Database Category Average",
//     label: "P/E Ratio",
//     value: "100.00%",
//   },
//   { title: "FactSet Segment Average", label: "P/E Ratio", value: "0.00%" },
// ]);
const props = defineProps({
  tabActiveName: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});
const infoData = ref<Record<string, any>>({});
watch(
  () => props.tabActiveName,
  (newVal) => {
    if (newVal === "DividendAndValuation") {
      getDividendAndValuationApi({
        code: props.code,
      }).then((res) => {
        console.log(res);
        infoData.value = res;
      });
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.dividend-and-valuation {
  background: #fff;
  padding: 0 20px;
  color: #333;
  font-size: var(--font-size-base);
}
</style>
