/**
 * Pinia Store vs Composables (Hooks) 对比示例
 *
 * 核心区别：
 * - Composables: 每次调用创建新实例，状态不共享
 * - Pinia Store: 单例模式，全局共享状态
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ==================== 1. Pinia Store（全局共享状态） ====================
/**
 * Pinia Store 特点：
 * ✅ 单例模式 - 所有组件共享同一份数据
 * ✅ 状态持久化 - 刷新页面前的状态可以保留
 * ✅ 开发工具支持 - Vue DevTools 可以追踪
 * ✅ 服务端渲染友好
 */
export const usePortfolioStore = defineStore('portfolio', () => {
  // State
  const etfList = ref([
    { code: 'QQQ', ratio: 50 },
    { code: 'SPY', ratio: 50 }
  ])
  const totalAmount = ref(10000)

  // Getters
  const totalRatio = computed(() => {
    return etfList.value.reduce((sum, etf) => sum + etf.ratio, 0)
  })

  const isValid = computed(() => totalRatio.value === 100)

  // Actions
  function updateRatio(index: number, newRatio: number) {
    etfList.value[index].ratio = newRatio
  }

  function addETF(code: string, ratio: number) {
    etfList.value.push({ code, ratio })
  }

  function removeETF(index: number) {
    etfList.value.splice(index, 1)
  }

  return {
    etfList,
    totalAmount,
    totalRatio,
    isValid,
    updateRatio,
    addETF,
    removeETF
  }
})


// ==================== 2. Composable（独立实例，不共享） ====================
/**
 * Composable 特点：
 * ✅ 每次调用创建新实例 - 状态独立
 * ✅ 轻量级 - 适合封装可复用逻辑
 * ✅ 灵活性强 - 可以接收参数
 * ❌ 不适合跨组件状态管理
 */
export function usePortfolioComposable() {
  // ⚠️ 注意：每次调用这个函数，都会创建全新的 ref
  const etfList = ref([
    { code: 'QQQ', ratio: 50 },
    { code: 'SPY', ratio: 50 }
  ])
  const totalAmount = ref(10000)

  const totalRatio = computed(() => {
    return etfList.value.reduce((sum, etf) => sum + etf.ratio, 0)
  })

  const isValid = computed(() => totalRatio.value === 100)

  function updateRatio(index: number, newRatio: number) {
    etfList.value[index].ratio = newRatio
  }

  function addETF(code: string, ratio: number) {
    etfList.value.push({ code, ratio })
  }

  function removeETF(index: number) {
    etfList.value.splice(index, 1)
  }

  return {
    etfList,
    totalAmount,
    totalRatio,
    isValid,
    updateRatio,
    addETF,
    removeETF
  }
}


// ==================== 3. 实际使用对比 ====================
/**
 * 在组件中使用：
 *
 * ========== Pinia Store（推荐用于全局状态） ==========
 *
 * // ComponentA.vue
 * <script setup>
 * import { usePortfolioStore } from '@/store/comparison'
 * import { storeToRefs } from 'pinia'
 *
 * const portfolioStore = usePortfolioStore()
 * const { etfList, totalRatio } = storeToRefs(portfolioStore)
 *
 * // 修改数据
 * portfolioStore.addETF('VOO', 30)
 * </script>
 *
 * // ComponentB.vue
 * <script setup>
 * import { usePortfolioStore } from '@/store/comparison'
 * import { storeToRefs } from 'pinia'
 *
 * const portfolioStore = usePortfolioStore() // ✅ 获取的是同一个实例
 * const { etfList } = storeToRefs(portfolioStore)
 *
 * // ✅ ComponentB 能看到 ComponentA 添加的 'VOO'
 * console.log(etfList.value) // [{ code: 'QQQ', ratio: 50 }, { code: 'SPY', ratio: 50 }, { code: 'VOO', ratio: 30 }]
 * </script>
 *
 *
 * ========== Composable（推荐用于独立逻辑） ==========
 *
 * // ComponentA.vue
 * <script setup>
 * import { usePortfolioComposable } from '@/store/comparison'
 *
 * const { etfList, addETF } = usePortfolioComposable() // ⚠️ 创建实例 A
 * addETF('VOO', 30)
 * </script>
 *
 * // ComponentB.vue
 * <script setup>
 * import { usePortfolioComposable } from '@/store/comparison'
 *
 * const { etfList } = usePortfolioComposable() // ⚠️ 创建实例 B（全新的）
 *
 * // ❌ ComponentB 看不到 ComponentA 添加的 'VOO'
 * console.log(etfList.value) // [{ code: 'QQQ', ratio: 50 }, { code: 'SPY', ratio: 50 }]
 * </script>
 */


// ==================== 4. 如何让 Composable 也能共享状态？ ====================
/**
 * 方法：在 Composable 外部定义状态（模块级别）
 * ⚠️ 但这种方式有局限性，不推荐用于复杂场景
 */

// 在函数外部定义（模块级别）
const sharedETFList = ref([
  { code: 'QQQ', ratio: 50 },
  { code: 'SPY', ratio: 50 }
])

export function useSharedPortfolioComposable() {
  // 使用外部定义的 ref，所有组件共享
  const totalRatio = computed(() => {
    return sharedETFList.value.reduce((sum, etf) => sum + etf.ratio, 0)
  })

  function addETF(code: string, ratio: number) {
    sharedETFList.value.push({ code, ratio })
  }

  return {
    etfList: sharedETFList, // 共享的状态
    totalRatio,
    addETF
  }
}

/**
 * ⚠️ 模块级别状态的问题：
 * 1. 无法在 DevTools 中追踪
 * 2. 服务端渲染时可能出现状态污染
 * 3. 无法享受 Pinia 的插件生态（如持久化）
 * 4. 无法使用 $reset、$patch 等便捷方法
 *
 * 👉 所以，如果需要共享状态，直接用 Pinia Store！
 */


// ==================== 5. 最佳实践建议 ====================
/**
 * 📌 使用 Pinia Store 的场景：
 * ✅ 跨组件共享状态（如用户信息、购物车、全局配置）
 * ✅ 需要持久化的数据（配合插件）
 * ✅ 需要在 DevTools 中调试的状态
 * ✅ 复杂的业务状态管理
 *
 * 📌 使用 Composable 的场景：
 * ✅ 封装可复用的逻辑（如表单验证、防抖节流）
 * ✅ 与 DOM 相关的操作（如监听滚动、窗口大小）
 * ✅ 第三方库的封装（如 ECharts、地图）
 * ✅ 工具函数的响应式封装
 *
 * 📌 组合使用：
 * 可以在 Pinia Store 内部调用 Composable！
 * 例如：在 Store 的 action 中使用 useRouter、useRoute 等
 */


// ==================== 6. 实际案例：组合使用 ====================
/**
 * 在 Pinia Store 中使用 Composable
 */
import { useRouter } from 'vue-router'

export const useNavigationStore = defineStore('navigation', () => {
  // ✅ 可以在 Store 中使用 Composable
  // 但必须在组件中首次调用 store 时才能访问 router

  const currentPath = ref('/')
  const history = ref<string[]>([])

  function navigateTo(path: string) {
    // ⚠️ 注意：useRouter 只能在组件中调用
    // 这里仅作示例，实际应该在组件中调用 router
    currentPath.value = path
    history.value.push(path)
  }

  function goBack() {
    if (history.value.length > 1) {
      history.value.pop()
      currentPath.value = history.value[history.value.length - 1]
    }
  }

  return {
    currentPath,
    history,
    navigateTo,
    goBack
  }
})


// ==================== 总结 ====================
/**
 * 📝 核心要点：
 *
 * 1. Setup Store 和 Composable 语法相似，但用途不同
 * 2. Setup Store = 全局单例，所有组件共享
 * 3. Composable = 每次调用创建新实例，状态独立
 * 4. 需要共享状态？用 Pinia Store
 * 5. 需要封装逻辑？用 Composable
 * 6. 可以组合使用，Store 中可以调用 Composable
 *
 * 🎯 记忆口诀：
 * - 共享用 Store（单例）
 * - 逻辑用 Composable（可复用）
 */
