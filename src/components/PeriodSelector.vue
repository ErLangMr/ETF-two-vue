<template>
  <div class="period-selector">
    <span v-if="prefix">{{ prefix }}</span>
    <span
      v-for="option in options"
      :key="option.value"
      class="period-option"
      :class="{ active: modelValue === option.value }"
      @click="handleClick(option.value)"
    >
      {{ option.label }}
    </span>
    <span v-if="suffix">{{ suffix }}</span>
  </div>
</template>

<script setup lang="ts">
interface PeriodOption {
  label: string
  value: string
}

interface Props {
  options: [PeriodOption, PeriodOption, PeriodOption, PeriodOption, PeriodOption]
  modelValue?: string
  prefix?: string
  suffix?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  prefix: '',
  suffix: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()

const handleClick = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped lang="scss">
.period-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;

  .period-option {
    cursor: pointer;
    background: rgb(236, 234, 234);
    padding: 5px 10px;
    border-radius: 5px;
    transition: background 0.2s;
    user-select: none;

    &:hover {
      background: #d5d3d3;
    }

    &.active {
      background: #c9c6c6;
    }
  }
}

@media (max-width: 768px) {
  .period-selector {
    flex-wrap: wrap;

    .period-option {
      width: 60px;
      text-align: center;
    }
  }
}
</style>
