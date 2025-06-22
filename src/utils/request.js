import axios from 'axios'
import { useUserStore } from '@/stores/user.js'
import { ElMessage } from 'element-plus'

// 配置常量
const CONFIG = {
  baseURL: '/api', // 通过代理转发到 http://localhost:8888
  timeout: 10000,
  retryTimes: 3,
  retryDelay: 1000,
}

// 创建axios实例
const instance = axios.create({
  baseURL: CONFIG.baseURL,
  timeout: CONFIG.timeout,
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 添加token到请求头
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
      // 保持向后兼容
      config.headers.token = userStore.token
    }

    // 添加请求时间戳
    config.metadata = { startTime: new Date() }

    return config
  },
  error => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 计算请求耗时
    const endTime = new Date()
    const startTime = response.config.metadata?.startTime
    const duration = startTime ? endTime - startTime : 0

    console.log(`请求 ${response.config.url} 完成，耗时: ${duration}ms`)

    // 检查响应状态
    if (response.status === 200) {
      return response
    }

    // 处理非200状态码
    ElMessage.error(`请求失败: ${response.status}`)
    return Promise.reject(new Error(`HTTP ${response.status}`))
  },
  error => {
    // 处理网络错误
    if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请检查网络连接')
    } else if (error.response) {
      // 服务器返回错误状态码
      const { status } = error.response
      switch (status) {
        case 401:
          ElMessage.error('未授权，请重新登录')
          // 可以在这里清除token并跳转到登录页
          break
        case 403:
          ElMessage.error('权限不足')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(`请求失败: ${status}`)
      }
    } else {
      ElMessage.error('网络错误，请检查网络连接')
    }

    console.error('响应拦截器错误:', error)
    return Promise.reject(error)
  },
)

// 导出实例和配置
export default instance
export { baseURL, instance as request }

const { baseURL } = CONFIG
