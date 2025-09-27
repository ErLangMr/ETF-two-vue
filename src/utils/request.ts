import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

// 根据环境设置基础URL
const getBaseUrl = () => {
  const mode = import.meta.env.MODE
  switch (mode) {
    case 'development':
      return '/api' // 开发环境使用代理
    case 'production':
      return 'http://47.76.221.169:8899' // 生产环境
    default:
      return '/'
  }
}

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: getBaseUrl(), // 使用环境判断的 baseURL
  // timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    return res
    // 这里可以根据后端的响应结构定制
    if (res.code !== 200) {
      ElMessage({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5 * 1000
      })

      // 处理特定的错误码
      if (res.code === 401) {
        // 未授权，跳转到登录页
        // router.push('/login')
      }

      return Promise.reject(new Error(res.message || '请求失败'))
    } else {
      return res
    }
  },
  (error) => {
    console.error('响应错误：', error)
    ElMessage({
      message: error.message || '请求失败',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// 封装 GET 请求
export function get<T>(url: string, params?: any): Promise<T> {
  return service.get(url, { params })
}

// 封装 POST 请求
export function post<T>(url: string, data?: any): Promise<T> {
  return service.post(url, data)
}

// 封装 PUT 请求
export function put<T>(url: string, data?: any): Promise<T> {
  return service.put(url, data)
}

// 封装 DELETE 请求
export function del<T>(url: string, params?: any): Promise<T> {
  return service.delete(url, { params })
}

export default service
