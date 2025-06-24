import axios from 'axios'
import { useUserStore } from '@/stores/user.js'
import { ElMessage } from 'element-plus'
import router from '@/router'

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
    const endTime = Date.now()
    const startTime = response.config.metadata?.startTime
    const duration = startTime ? endTime - startTime : 0

    console.log(`请求 ${response.config.url} 完成，耗时: ${duration}ms`)

    // 检查响应状态
    if (response.status === 200) {
      // 处理业务成功响应
      if (response.data && response.data.status_code === 0) {
        return response
      }

      // 处理业务错误
      ElMessage.error(response.data?.status_msg || '请求失败')
      return Promise.reject(new Error(response.data?.status_msg || '请求失败'))
    }

    // 处理非200状态码
    ElMessage.error(`请求失败: ${response.status}`)
    return Promise.reject(new Error(`HTTP ${response.status}`))
  },
  error => {
    const endTime = Date.now()
    console.log(`请求耗时: ${endTime - (error.config?.startTime || endTime)}ms`)

    // 处理401未授权错误
    if (error.response?.status === 401) {
      const userStore = useUserStore()

      // 清除用户信息
      userStore.clearUserInfo()

      // 显示提示信息
      ElMessage.error('登录已过期，请重新登录')

      // 跳转到登录页
      router.push('/login')

      return Promise.reject(error)
    }

    // 处理其他HTTP错误
    const status = error.response?.status
    let message = '网络错误'

    switch (status) {
      case 400:
        message = '请求参数错误'
        break
      case 403:
        message = '没有权限访问'
        break
      case 404:
        message = '请求的资源不存在'
        break
      case 500:
        message = '服务器内部错误'
        break
      default:
        message = error.message || '网络连接失败'
    }

    ElMessage.error(message)
    return Promise.reject(error)
  },
)

// 导出实例和配置
export default instance
export { baseURL, instance as request }

const { baseURL } = CONFIG
