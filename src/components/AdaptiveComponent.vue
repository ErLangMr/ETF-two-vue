<template>
  <component
    :is="currentComponent"
    v-bind="validAttrs"
  >
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useDevice } from '../utils/device'

defineOptions({
  inheritAttrs: false
})

const props = defineProps<{
  mobileComponent: any
  desktopComponent: any
}>()

const { isMobile } = useDevice()
const attrs = useAttrs()

const currentComponent = computed(() => {
  return isMobile() ? props.mobileComponent : props.desktopComponent
})

// 过滤掉无效的属性名
const validAttrs = computed(() => {
  return Object.entries(attrs).reduce<Record<string, any>>((acc, [key, value]) => {
    if (!key.includes('"')) {
      acc[key] = value
    }
    return acc
  }, {})
})
</script>
