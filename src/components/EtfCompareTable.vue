<!-- 自定义的表格组件 -->
<template>
  <div class="etf-compare-table">
    <div class="section-title" v-if="title">{{ title }}</div>
    <slot></slot>
    <div class="etf-table">
      <div class="table-header" :style="{ gridTemplateColumns: gridTemplateColumns }">
        <div v-for="col in columns" :key="col.key">{{ col.label }}</div>
      </div>
      <template v-if="data.length > 0">
        <div class="table-row" v-for="(row, idx) in data" :key="idx" :style="{ gridTemplateColumns: gridTemplateColumns }">
          <div v-for="col in columns" :key="col.key">
            <span
            v-if="col.isLink"
            class="link"
            @click="col.onClick ? col.onClick(row[col.key], row) : null"
          >{{ row[col.key] }}</span>
          <span v-else>{{ formatValue(row[col.key], col.unit) }}</span>
        </div>
      </div>
      </template>
      <template v-else>
        <div class="table-NoData">
          <div class="table-cell">暂无数据</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatValue } from "@/utils/formatValue";

const props = defineProps<{
  title?: string
  columns: Array<{ key: string, label: string, isLink?: boolean, onClick?: Function, unit?: string }>
  data: Array<Record<string, any>>
}>()
const gridTemplateColumns = computed(() => {
  return `repeat(${props.columns.length}, 1fr)`
})
</script>

<style scoped lang="scss">
.etf-compare-table {
  margin-bottom: 0;
}
.section-title {
  font-weight: 600;
  font-size: var(--font-size-title);
  margin-bottom: 10px;
  color: #333;
}
.etf-table {
  width: 100%;
  margin-top: 8px;
  border-collapse: collapse;
  font-size: var(--font-size-base);
}
.table-header, .table-row {
  display: grid;
  // grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr;
  // grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  align-items: center;
  div {
    padding: 0 10px;
  }
}
.table-header {
  font-weight: 600;
  color: #333;
  border-bottom: 1.5px solid #e0e0e0;
  padding: 6px 0;
  background: none;
}
.table-row {
  border-bottom: 1px solid #ececec;
  color: #222;
  padding: 6px 0;
  min-height: 36px;
}
.table-row:last-child {
  border-bottom: none;
}
.table-row .link {
  color: var(--theme-purple);
  cursor: pointer;
  text-decoration: underline;
}
.table-NoData {
  text-align: center;
  padding: 30px 0;
}
@media (max-width: 768px) {
  .etf-table {
    overflow-x: auto;
    .table-header, .table-row{
      min-width: 700px;
    }
  }
}
</style>
