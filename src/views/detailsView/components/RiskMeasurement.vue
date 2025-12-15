<template>
  <div class="risk-measurement-container">
    <div style="text-align: right">
      <el-date-picker
        v-model="dateValue"
        value-format="YYYY-MM-DD"
        type="date"
        placeholder="选择日期"
        style="margin-bottom: 10px"
        @change="dateValueChange"
      />
    </div>
    <div style="display: flex; gap: 62px">
      <div class="block">
        <div class="section-title">日度收益</div>
        <div class="info-list">
          <div class="info-row">
            <span>近 1 月日度收益</span><span>{{ formatValue(riskIndicatorInfo.beta?.beta1) }}</span>
          </div>
          <div class="info-row">
            <span>近 3 月日度收益</span>
            <span>{{ formatValue(riskIndicatorInfo.beta?.beta3) }}</span>
          </div>
          <div class="info-row">
            <span>近 6 月日度收益</span>
            <span>{{ formatValue(riskIndicatorInfo.beta?.beta6) }}</span>
          </div>
          <div class="info-row">
            <span>近 1 年日度收益</span
            ><span>{{ formatValue(riskIndicatorInfo.beta?.beta2) }}</span>
          </div>
          <div class="info-row">
            <span>近 3 年日度收益</span>
            <span>{{ formatValue(riskIndicatorInfo.beta?.beta36) }}</span>
          </div>
          <div class="info-row">
            <span>近 5 年日度收益</span>
            <span>{{ formatValue(riskIndicatorInfo.beta?.beta60) }}</span>
          </div>
        </div>
      </div>
      <div class="block">
        <div class="section-title">夏普比率</div>
        <div class="info-list">
          <div class="info-row">
            <span>近 1 月夏普比率</span><span>{{ formatValue(riskIndicatorInfo.sharpeRatio?.sp1) }}</span>
          </div>
          <div class="info-row">
            <span>近 3 月夏普比率</span>
            <span>{{ formatValue(riskIndicatorInfo.sharpeRatio?.sp3) }}</span>
          </div>
          <div class="info-row">
            <span>近 6 月夏普比率</span>
            <span>{{ formatValue(riskIndicatorInfo.sharpeRatio?.sp6) }}</span>
          </div>
          <div class="info-row">
            <span>近 1 年夏普比率</span
            ><span>{{ formatValue(riskIndicatorInfo.sharpeRatio?.sp12) }}</span>
          </div>
          <div class="info-row">
            <span>近 3 年夏普比率</span>
            <span>{{ formatValue(riskIndicatorInfo.sharpeRatio?.sp36) }}</span>
          </div>
          <div class="info-row">
            <span>近 5 年夏普比率</span>
            <span>{{ formatValue(riskIndicatorInfo.sharpeRatio?.sp60) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="block" style="margin-top: 40px">
        <div class="section-title">年化波动率</div>
        <div class="info-list">
          <div class="info-row">
            <span>近 1 月年化波动率</span><span>{{ formatValue(riskIndicatorInfo.sharpeRatio?.yvol1) }}</span>
          </div>
          <div class="info-row">
            <span>近 3 月年化波动率</span>
            <span>{{ formatValue(riskIndicatorInfo.sharpeRatio?.yvol3) }}</span>
          </div>
          <div class="info-row">
            <span>近 6 月年化波动率</span>
            <span>{{ formatValue(riskIndicatorInfo.sharpeRatio?.yvol6) }}</span>
          </div>
          <div class="info-row">
            <span>近 1 年年化波动率</span
            ><span>{{ formatValue(riskIndicatorInfo.sharpeRatio?.yvol12) }}</span>
          </div>
          <div class="info-row">
            <span>近 3 年年化波动率</span>
            <span>{{ formatValue(riskIndicatorInfo.sharpeRatio?.yvol36) }}</span>
          </div>
          <div class="info-row">
            <span>近 5 年年化波动率</span>
            <span>{{ formatValue(riskIndicatorInfo.sharpeRatio?.yvol60) }}</span>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { formatValue } from "@/utils/formatValue";
import { getRiskIndicatorInfoApi } from "@/api/filterDetails";
import { ref, watch } from "vue";

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  tabActiveName: {
    type: String,
    required: true,
  },
});

watch(
  () => props.tabActiveName,
  (newVal) => {
    if (newVal === "RiskMeasurement") {
      getRiskIndicatorInfo();
    }
  }
);

const dateValue = ref<string>("");
const riskIndicatorInfo = ref<Record<string, any>>({
  beta: {},
  sharpeRatio: {}
});
function getRiskIndicatorInfo() {
  getRiskIndicatorInfoApi({
    etfCode: props.code,
    endDate: dateValue.value,
  }).then((res) => {
    riskIndicatorInfo.value = res;
  });
}
function dateValueChange() {
  getRiskIndicatorInfo();
}
</script>

<style lang="scss" scoped>
.risk-measurement-container {
  width: 100%;
}
</style>
