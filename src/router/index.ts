import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: '首页'
      }
    },
    {
      path: '/screener',
      name: 'screener',
      component: () => import('../views/screenerView/index.vue'),
      meta: {
        title: '筛选器'
      }
    },
    {
      path: '/etfs',
      name: 'etfs',
      component: () => import('../views/etfsView/index.vue'),
      meta: {
        title: 'ETF 类型'
      }
    },
    {
      path: '/tool',
      name: 'tool',
      component: () => import('../views/toolView/index.vue'),
      meta: {
        title: 'ETF 跟踪指数'
      }
    },
    {
      path: '/tool-etf-list',
      name: 'tool-etf-list',
      component: () => import('../views/toolView/toolETFList.vue'),
      meta: {
        title: '指数详情'
      }
    },
    {
      path: '/issuers',
      name: 'issuers',
      component: () => import('../views/issuersView/index.vue'),
      meta: {
        title: '发行人'
      }
    },
    {
      path: '/etfs-list',
      name: 'etfs-list',
      component: () => import('../views/etfsListView/index.vue'),
      meta: {
        title: 'ETF 列表'
      }
    },
    {
      path: '/exposure',
      name: 'exposure',
      component: () => import('../views/toolView/Exposure.vue'),
      meta: {
        title: 'Exposure'
      }
    },
    {
      path: '/equities',
      name: 'equities',
      component: () => import('../views/toolView/Equities.vue'),
      meta: {
        title: '股票'
      }
    },
    {
      path: '/proshares',
      name: 'proshares',
      component: () => import('../views/issuersView/proshares.vue'),
      meta: {
        title: '发行人详情'
      }
    },
    {
      path: '/details',
      name: 'details',
      component: () => import('../views/detailsView/index.vue'),
      meta: {
        title: '详情'
      }
    },
  ],
})

export default router
