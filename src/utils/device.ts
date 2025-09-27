import { ref, onMounted, onUnmounted } from 'vue'

// 定义断点
export const BREAKPOINTS = {
  mobile: 768
}

// 设备类型
export type DeviceType = 'mobile' | 'desktop'

// 创建响应式的设备类型
export const useDevice = () => {
  const deviceType = ref<DeviceType>('desktop')

  const checkDevice = () => {
    const width = window.innerWidth
    deviceType.value = width <= BREAKPOINTS.mobile ? 'mobile' : 'desktop'
  }

  onMounted(() => {
    checkDevice()
    window.addEventListener('resize', checkDevice)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkDevice)
  })

  return {
    deviceType,
    isMobile: () => deviceType.value === 'mobile',
    isDesktop: () => deviceType.value === 'desktop'
  }
} 