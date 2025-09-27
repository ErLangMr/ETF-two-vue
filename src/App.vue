<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref } from 'vue'
import { Search, Menu } from '@element-plus/icons-vue'
import { useDevice } from '@/utils/device'
import Breadcrumb from '@/components/Breadcrumb.vue'

const searchValue = ref('')
const isMenuOpen = ref(false)
const { isMobile } = useDevice()

const searchOptions = [
  { value: 'etf', label: 'ETF' },
  { value: 'stock', label: 'Stock' },
  { value: 'bond', label: 'Bond' }
]

const handleSearch = (item: Record<string, any>) => {
  console.log('搜索:', item.label)
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const router = useRouter()
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <div class="left-section">
          <div class="logo" @click="router.push('/')">
            <img src="@/assets/logo.png" alt="Logo" />
          </div>
          <nav class="nav desktop-nav" v-if="!isMobile()">
            <RouterLink to="/screener" class="nav-item">ETF筛选器</RouterLink>
            <RouterLink to="/etfs" class="nav-item">ETF类型</RouterLink>
            <RouterLink to="/tool" class="nav-item">ETF跟踪指数</RouterLink>
            <RouterLink to="/issuers" class="nav-item">ETF发行人</RouterLink>
          </nav>
        </div>
        <div class="right-section">
          <!-- <el-autocomplete
            v-if="!isMobile()"
            v-model="searchValue"
            :fetch-suggestions="(query, callback) => {
              callback(searchOptions.filter(item =>
                item.label.toLowerCase().includes(query.toLowerCase())
              ))
            }"
            placeholder="搜索..."
            class="search-input desktop-search"
            :prefix-icon="Search"
            @select="handleSearch"
          >
            <template #default="{ item }">
              <div class="search-item">
                <el-icon><Search /></el-icon>
                <span>{{ item.label }}</span>
              </div>
            </template>
          </el-autocomplete> -->
          <el-button v-if="isMobile()" class="menu-button" @click="toggleMenu">
            <el-icon><Menu /></el-icon>
          </el-button>
        </div>
      </div>
    </header>

    <!-- 移动端导航菜单 -->
    <div class="mobile-menu" :class="{ 'is-open': isMenuOpen }">
      <div class="mobile-search">
        <!-- <el-autocomplete
          v-model="searchValue"
          :fetch-suggestions="(query, callback) => {
            callback(searchOptions.filter(item =>
              item.label.toLowerCase().includes(query.toLowerCase())
            ))
          }"
          placeholder="搜索..."
          class="search-input"
          :prefix-icon="Search"
          @select="handleSearch"
        >
          <template #default="{ item }">
            <div class="search-item">
              <el-icon><Search /></el-icon>
              <span>{{ item.label }}</span>
            </div>
          </template>
        </el-autocomplete> -->
      </div>
      <nav class="mobile-nav">
        <RouterLink to="/screener" class="nav-item" @click="toggleMenu">ETF筛选器</RouterLink>
        <RouterLink to="/etfs" class="nav-item" @click="toggleMenu">ETF类型</RouterLink>
        <RouterLink to="/tool" class="nav-item" @click="toggleMenu">ETF跟踪指数</RouterLink>
        <RouterLink to="/issuers" class="nav-item" @click="toggleMenu">ETF发行人</RouterLink>
      </nav>
    </div>

    <main class="main">
      <Breadcrumb />
      <div class="main-content">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.app {
  height: calc(100vh - 20px);
  display: flex;
  flex-direction: column;
  background-color: white;
  overflow-y: auto;
  color: $text-primary;
}

.header {
  background: #fff;
  box-shadow: $box-shadow-light;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-content {
  width: 85%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 $spacing-base;
  height: $header-height;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include mobile {
    width: 100%;
    height: $header-height-mobile;
    padding: 0 $spacing-small;
  }
}

.left-section {
  display: flex;
  align-items: center;
  gap: $spacing-extra-large;

  @include mobile {
    gap: $spacing-base;
    width: 100%;
    justify-content: center;
  }
}

.logo {
  height: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;

  @include mobile {
    height: 32px;
  }

  img {
    height: 100%;
    width: auto;
  }
}

.nav {
  display: flex;
  align-items: center;
  gap: $spacing-extra-large;
}

.nav-item {
  color: $text-primary;
  text-decoration: none;
  font-size: var(--font-size-medium);
  font-weight: 500;
  transition: color $transition-duration;

  &:hover {
    color: var(--theme-purple);
  }

  &.router-link-active {
    color: var(--theme-purple);
  }
}

.right-section {
  display: flex;
  align-items: center;
  gap: $spacing-base;
}

.search-input {
  width: 200px;
}

.search-item {
  display: flex;
  align-items: center;
  gap: $spacing-small;
  padding: $spacing-mini 0;

  .el-icon {
    color: $text-secondary;
  }
}

.main {
  flex: 1;
  width: 85%;
  max-width: 1600px;
  margin: 0 auto;
  margin-top: $header-height;
  background: $background-color-white;
  height: calc(100% - $header-height);

  margin-bottom: 20px;
  @include mobile {
    width: 100%;
    margin-top: $header-height-mobile;
  }
  .main-content {
    height: calc(100% - 42px);
  }
}

.mobile-menu {
  position: fixed;
  top: $header-height-mobile;
  left: 0;
  right: 0;
  background: #fff;
  padding: $spacing-base;
  box-shadow: $box-shadow-light;
  transform: translateY(-100%);
  opacity: 0;
  transition: transform $transition-duration, opacity $transition-duration;
  z-index: 99;

  &.is-open {
    transform: translateY(0);
    opacity: 1;
  }
}

.mobile-search {
  margin-bottom: $spacing-base;

  .search-input {
    width: 100%;
  }
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: $spacing-base;

  .nav-item {
    padding: $spacing-small 0;
    border-bottom: 1px solid $border-color-lighter;
  }
}

:deep(.el-input__wrapper) {
  box-shadow: none !important;
  border: 1px solid $border-color-base;

  &:hover {
    border-color: $primary-color;
  }

  &.is-focus {
    border-color: $primary-color;
  }
}
</style>
