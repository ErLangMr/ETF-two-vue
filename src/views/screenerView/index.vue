<script setup lang="ts">
import { computed } from 'vue'
import { useDevice } from '@/utils/device'
import ScreenerPC from './pc.vue'
import ScreenerMobile from './mobile.vue'

const { isMobile } = useDevice()

// 根据设备类型选择要渲染的组件
const ScreenerComponent = computed(() => {
  return isMobile() ? ScreenerMobile : ScreenerPC
})
</script>

<template>
  <!-- <component :is="ScreenerComponent" /> -->
   <ScreenerPC />
</template>

<style scoped lang="scss">
// 可以添加一些共享的样式
</style>