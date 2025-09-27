<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HomeFilled } from '@element-plus/icons-vue'

interface BreadcrumbItem {
  path: string
  title: string
  query?: Record<string, any>
}

const route = useRoute()
const router = useRouter()
const breadcrumbs = ref<BreadcrumbItem[]>([])

// 从 sessionStorage 获取访问历史
const getVisitHistory = (): BreadcrumbItem[] => {
  const history = sessionStorage.getItem('visitHistory')
  return history ? JSON.parse(history) : []
}

// 保存访问历史到 sessionStorage
const saveVisitHistory = (items: BreadcrumbItem[]) => {
  sessionStorage.setItem('visitHistory', JSON.stringify(items))
}

// 生成面包屑数据
const generateBreadcrumbs = () => {
  const history = getVisitHistory()
  const currentPath = route.path

  // 如果是首页，清空历史
  if (currentPath === '/') {
    breadcrumbs.value = [{
      path: '/',
      title: '首页'
    }]
    saveVisitHistory([])
    return
  }

  // 获取当前页面信息
  const currentTitle = route.meta.title as string || route.name as string || '未命名'
  const currentItem = {
    path: currentPath,
    title: currentTitle,
    query: route.query?.code ? { code: route.query.code } : route.query?.issuer ? { issuer: route.query.issuer } : route.query?.index ? { index: route.query.index } : {}
  }

  // 检查是否已经在历史记录中
  const existingIndex = history.findIndex(item => item.path === currentPath)

  if (existingIndex !== -1) {
    // 如果已存在，截取到该位置
    breadcrumbs.value = [
      { path: '/', title: '首页' },
      ...history.slice(0, existingIndex + 1)
    ]
  } else {
    // 如果是新页面，添加到历史记录
    breadcrumbs.value = [
      { path: '/', title: '首页' },
      ...history,
      currentItem
    ]
  }

  // 限制面包屑数量，最多显示4个
  if (breadcrumbs.value.length > 4) {
    breadcrumbs.value = [
      breadcrumbs.value[0], // 保留首页
      { path: '...', title: '...' }, // 添加省略号
      ...breadcrumbs.value.slice(-2) // 保留最后3个
    ]
  }

  // 保存当前历史记录（排除首页和省略号）
  saveVisitHistory(breadcrumbs.value.filter(item => item.path !== '/' && item.path !== '...'))
}

// 监听路由变化
watch(
  () => route.fullPath,
  () => {
    generateBreadcrumbs()
  }
)

// 组件挂载时初始化
onMounted(() => {
  generateBreadcrumbs()
})

// 点击面包屑项
const handleClick = (item: BreadcrumbItem) => {
  if (item.path === '...') return // 点击省略号不跳转
  if (item.path === route.path) return // 如果点击当前路径，不进行跳转
  router.push({path: item.path, query: item.query})
}

// 判断是否为首页
const isHome = (path: string) => path === '/'
</script>

<template>
  <div class="breadcrumb-container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbs"
        :key="item.path"
        @click="handleClick(item)"
      >
        <template v-if="isHome(item.path)">
          <el-icon class="breadcrumb-icon"><HomeFilled /></el-icon>
          首页
        </template>
        <template v-else-if="item.path === '...'">
          <span class="breadcrumb-ellipsis">...</span>
        </template>
        <template v-else>
          {{ item.title }}
        </template>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<style lang="scss" scoped>

.breadcrumb-container {
  padding: 12px 24px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.el-breadcrumb {
  font-size: var(--font-size-medium);

  :deep(.el-breadcrumb__item) {
    cursor: pointer;
    display: flex;
    align-items: center;

    &:hover {
      color: var(--el-color-primary);
    }

    .el-breadcrumb__inner {
      display: flex;
      align-items: center;
      font-weight: 500;
      color: var(--el-text-color-regular);
      transition: all 0.3s ease;

      &:hover {
        color: var(--el-color-primary);
      }
    }

    &:last-child {
      .el-breadcrumb__inner {
        color: var(--el-text-color-primary);
        font-weight: 600;
        cursor: default;

        &:hover {
          color: var(--el-text-color-primary);
        }
      }
    }
  }

  :deep(.el-breadcrumb__separator) {
    margin: 0 8px;
    color: var(--el-text-color-secondary);
  }
}

.breadcrumb-icon {
  font-size: var(--font-size-large);
  margin-right: 4px;
  color: var(--el-text-color-regular);
  transition: all 0.3s ease;

  &:hover {
    color: var(--el-color-primary);
  }
}

.breadcrumb-ellipsis {
  color: var(--el-text-color-secondary);
  cursor: default;
}
</style>
