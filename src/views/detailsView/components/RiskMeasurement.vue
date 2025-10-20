<template>
  <div class="risk-measurement-container">
    <div class="block">
      <div class="section-title">波动率</div>
      <div class="info-list">
        <div class="info-row">
          <span>过去5日波动率</span
          ><span class="linkStyle">{{
            "val"
          }}</span>
        </div>
        <div class="info-row">
          <span>过去20日波动率</span
          ><span class="linkStyle">{{
            "val"
          }}</span>
        </div>
        <div class="info-row">
          <span>过去50日波动率</span>
          <span>{{ formatValue(29.9999, "percent") }}</span>
        </div>
        <div class="info-row">
          <span>过去200日波动率</span>
          <span>{{ "val" }}</span>
        </div>
        <div class="info-row">
          <span>Beta</span>
          <span>{{ "val" }}</span>
        </div>
        <div class="info-row">
          <span>标准差</span>
          <span>{{ "val" }}</span>
        </div>
        <div class="info-row">
          <span>夏普比率</span>
          <span>{{ "val" }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatValue } from "@/utils/formatValue";

</script>

<style lang="scss" scoped>
.risk-measurement-container {
  width: 100%;
}
</style>
