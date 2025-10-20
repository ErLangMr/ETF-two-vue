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

// 面包屑存储键名
const BREADCRUMB_KEY = 'app_breadcrumb_trail'

// 从 sessionStorage 获取面包屑路径
const getBreadcrumbTrail = (): BreadcrumbItem[] => {
  const trail = sessionStorage.getItem(BREADCRUMB_KEY)
  return trail ? JSON.parse(trail) : []
}

// 保存面包屑路径到 sessionStorage
const saveBreadcrumbTrail = (items: BreadcrumbItem[]) => {
  sessionStorage.setItem(BREADCRUMB_KEY, JSON.stringify(items))
}

// 生成面包屑数据
const generateBreadcrumbs = () => {
  const currentPath = route.path
  const currentTitle = route.meta.title as string || route.name as string || '未命名'
  const currentQuery = { ...route.query }

  // 如果是首页，清空面包屑
  if (currentPath === '/') {
    breadcrumbs.value = [{
      path: '/',
      title: '首页'
    }]
    saveBreadcrumbTrail([])
    return
  }

  // 获取历史面包屑路径
  let trail = getBreadcrumbTrail()

  // 查找当前页面是否已在路径中
  const existingIndex = trail.findIndex(item => item.path === currentPath)

  if (existingIndex !== -1) {
    // 如果已存在，截断到该位置（表示返回到某个页面）
    trail = trail.slice(0, existingIndex + 1)
    // 更新该页面的 query 参数
    trail[existingIndex].query = currentQuery
  } else {
    // 如果是新页面，添加到路径末尾
    trail.push({
      path: currentPath,
      title: currentTitle,
      query: currentQuery
    })
  }

  // 保存更新后的路径
  saveBreadcrumbTrail(trail)

  // 构建完整面包屑（首页 + 路径）
  breadcrumbs.value = [
    { path: '/', title: '首页' },
    ...trail
  ]
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
  if (item.path === route.path) return // 如果点击当前路径，不进行跳转

  // 点击面包屑时，会触发路由变化，generateBreadcrumbs 会自动截断路径
  router.push({ path: item.path, query: item.query })
}

// 判断是否为首页
const isHome = (path: string) => path === '/'
</script>

<template>
  <div class="breadcrumb-container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbs"
        :key="item.path + index"
        @click="handleClick(item)"
      >
        <template v-if="isHome(item.path)">
          <el-icon class="breadcrumb-icon"><HomeFilled /></el-icon>
          首页
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
</style>
