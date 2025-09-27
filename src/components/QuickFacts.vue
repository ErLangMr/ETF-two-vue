<!-- 上下结构的多个块，每个块包含标题、描述和多个事实项 -->
<template>
  <div class="quick-facts">
      <div class="facts-title">{{ props.title }}</div>
      <slot name="description"></slot>
      <div class="facts-row">
        <div
          class="fact-item"
          v-for="(fact, idx) in props.facts"
          :key="fact.label"
          :class="{ last: idx === props.facts.length - 1 }"
        >
          <div class="fact-item-title">{{ fact.title }}</div>
          <div class="fact-item-label">{{ fact.label }}</div>
          <div class="fact-item-divider"></div>
          <div class="fact-item-value">{{ fact.value }}</div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  facts: { title?: string; label: string; value: string | number }[];
  title?: string;
}>();
</script>

<style scoped lang="scss">
.quick-facts {
    margin-top: 10px;
  }
  .facts-title {
    font-size: 2rem;
    font-weight: 400;
    margin-bottom: 18px;
  }
  .facts-row {
    display: flex;
    gap: 32px;
    justify-content: flex-start;
  }
  .fact-item {
    flex: 1;
    min-width: 120px;
    border-right: 1px solid #e0e0e0;
    padding: 0 16px;
    text-align: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .fact-item:last-child {
    border-right: none;
  }
  .fact-item-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .fact-item-label {
    color: #666;
    font-size: 1rem;
    margin-bottom: 8px;
    font-weight: 400;
  }
  .fact-item-divider {
    width: 100%;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 8px;
  }
  .fact-item-value {
    margin-top: 4px;
    font-size: 1.25rem;
    font-weight: 500;
    color: #222;
  }

  /* 移动端适配 */
  @media (max-width: 768px) {
    .facts-row {
      flex-direction: column;
      gap: 0;
    }
    .fact-item {
      border-right: none;
      border-bottom: 1px solid #e0e0e0;
      margin-bottom: 16px;
      padding: 12px 0;
      min-width: 0;
    }
    .fact-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
    .facts-title {
      font-size: 1.3rem;
      text-align: center;
    }
    .fact-item-divider {
      display: none;
    }
  }
</style>
