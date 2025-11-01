/**
 * Pinia Store 模板文件 - 官方规范示例
 *
 * Pinia 官方推荐使用 Composition API 风格（Setup Store）
 * 也支持 Options API 风格（Option Store）
 */

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

// ==================== 方式一：Setup Store（官方推荐） ====================
/**
 * Setup Store 使用 Composition API 风格
 * 优点：
 * 1. 更灵活，可以使用任意组合式函数
 * 2. 代码组织更清晰
 * 3. TypeScript 类型推断更好
 * 4. 支持所有 Vue 3 Composition API 特性
 */
export const useExampleStore = defineStore('example', () => {
  // ============ State（状态） ============
  // 使用 ref() 定义响应式状态
  const count = ref(0)
  const userName = ref('张三')
  const userInfo = ref({
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com'
  })
  const etfList = ref<string[]>(['QQQ', 'SPY', 'VOO'])

  // ============ Getters（计算属性） ============
  // 使用 computed() 定义计算属性
  const doubleCount = computed(() => count.value * 2)

  const isLoggedIn = computed(() => userInfo.value.id > 0)

  const etfCount = computed(() => etfList.value.length)

  // 接收参数的 getter（返回函数）
  const getETFByIndex = computed(() => {
    return (index: number) => etfList.value[index]
  })

  // ============ Actions（方法） ============
  // 直接定义函数作为 actions

  // 同步 action
  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function setUserName(name: string) {
    userName.value = name
  }

  // 异步 action（支持 async/await）
  async function fetchUserInfo(userId: number) {
    try {
      // 模拟 API 请求
      const response = await fetch(`/api/user/${userId}`)
      const data = await response.json()
      userInfo.value = data
      return data
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  // 批量更新状态
  function updateMultipleStates(newCount: number, newName: string) {
    count.value = newCount
    userName.value = newName
  }

  // 重置状态（手动实现）
  function $reset() {
    count.value = 0
    userName.value = '张三'
    userInfo.value = {
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com'
    }
    etfList.value = ['QQQ', 'SPY', 'VOO']
  }

  // ============ 监听器（可选） ============
  // 可以在 store 内部使用 watch
  watch(count, (newVal, oldVal) => {
    console.log(`计数从 ${oldVal} 变为 ${newVal}`)
  })

  // ============ 导出（重要！） ============
  // 必须返回所有需要暴露的状态、getters 和 actions
  return {
    // State
    count,
    userName,
    userInfo,
    etfList,

    // Getters
    doubleCount,
    isLoggedIn,
    etfCount,
    getETFByIndex,

    // Actions
    increment,
    decrement,
    setUserName,
    fetchUserInfo,
    updateMultipleStates,
    $reset
  }
})


// ==================== 方式二：Option Store ====================
/**
 * Option Store 使用 Options API 风格（类似 Vuex）
 * 优点：
 * 1. 对于熟悉 Vuex 的开发者更容易上手
 * 2. 结构清晰，state/getters/actions 分离明确
 */
export const useCounterStore = defineStore('counter', {
  // ============ State ============
  state: () => ({
    count: 0,
    name: 'Counter Store',
    items: [] as string[]
  }),

  // ============ Getters ============
  getters: {
    // 自动类型推断
    doubleCount: (state) => state.count * 2,

    // 使用 this 访问其他 getters
    quadrupleCount(): number {
      return this.doubleCount * 2
    },

    // 返回函数的 getter（接收参数）
    getItemByIndex: (state) => {
      return (index: number) => state.items[index]
    }
  },

  // ============ Actions ============
  actions: {
    // 同步 action
    increment() {
      this.count++
    },

    decrement() {
      this.count--
    },

    // 异步 action
    async fetchData() {
      try {
        const response = await fetch('/api/data')
        const data = await response.json()
        this.items = data
      } catch (error) {
        console.error('获取数据失败:', error)
        throw error
      }
    },

    // 调用其他 store
    async syncWithOtherStore() {
      const exampleStore = useExampleStore()
      this.count = exampleStore.count
    }
  }
})


// ==================== 在组件中使用 Pinia Store ====================
/**
 * 使用示例（在 Vue 组件的 <script setup> 中）:
 *
 * import { useExampleStore } from '@/store/example'
 * import { storeToRefs } from 'pinia'
 *
 * // 1. 获取 store 实例
 * const exampleStore = useExampleStore()
 *
 * // 2. 访问 state（直接访问会失去响应式）
 * const count = exampleStore.count // ❌ 不推荐：失去响应式
 *
 * // 3. 使用 storeToRefs 保持响应式（推荐）
 * const { count, userName, userInfo } = storeToRefs(exampleStore)
 *
 * // 4. 解构 actions（不需要 storeToRefs）
 * const { increment, decrement, fetchUserInfo } = exampleStore
 *
 * // 5. 访问 getters
 * const { doubleCount, isLoggedIn } = storeToRefs(exampleStore)
 *
 * // 6. 调用 actions
 * increment()
 * await fetchUserInfo(123)
 *
 * // 7. 直接修改 state（Pinia 允许，但不推荐）
 * exampleStore.count++ // ✅ 可以工作，但推荐使用 action
 *
 * // 8. 批量修改 state（推荐）
 * exampleStore.$patch({
 *   count: 10,
 *   userName: '李四'
 * })
 *
 * // 9. 批量修改 state（函数式，适合复杂逻辑）
 * exampleStore.$patch((state) => {
 *   state.count += 10
 *   state.etfList.push('VTI')
 * })
 *
 * // 10. 重置 state（仅 Option Store 自动支持）
 * exampleStore.$reset()
 *
 * // 11. 订阅 state 变化
 * exampleStore.$subscribe((mutation, state) => {
 *   console.log('State 发生变化:', mutation, state)
 * })
 *
 * // 12. 订阅 actions
 * exampleStore.$onAction(({ name, args, after, onError }) => {
 *   console.log(`Action ${name} 被调用，参数:`, args)
 *   after((result) => {
 *     console.log('Action 执行完成，结果:', result)
 *   })
 *   onError((error) => {
 *     console.error('Action 执行失败:', error)
 *   })
 * })
 */


// ==================== TypeScript 类型定义示例 ====================
/**
 * 如果需要在组件外部使用 store 类型，可以这样定义：
 */
export type ExampleStore = ReturnType<typeof useExampleStore>
export type CounterStore = ReturnType<typeof useCounterStore>


// ==================== 持久化插件示例 ====================
/**
 * Pinia 支持插件，例如持久化存储
 * 需要安装: pnpm add pinia-plugin-persistedstate
 *
 * 在 main.ts 中配置:
 * import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
 * const pinia = createPinia()
 * pinia.use(piniaPluginPersistedstate)
 *
 * 在 store 中使用:
 * export const useUserStore = defineStore('user', {
 *   state: () => ({
 *     token: '',
 *     userInfo: null
 *   }),
 *   persist: true // 启用持久化
 * })
 *
 * 或者自定义持久化配置:
 * persist: {
 *   key: 'user-store',
 *   storage: sessionStorage,
 *   paths: ['token'] // 只持久化 token
 * }
 */
