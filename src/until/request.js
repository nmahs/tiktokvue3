import axios from 'axios'
import { useUserStore } from '@/stores/user.js'
const baseURL = 'http://localhost:8888'
import { ElMessage } from 'element-plus'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000,
})

// 模拟数据
const mockResponses = {
  '/v1/user/login': {
    data: {
      token: 'mock_token_' + Date.now(),
      user_id: 1,
      message: '登录成功',
    },
  },
  '/v1/user/create': {
    data: {
      message: '注册成功',
    },
  },
  '/v1/user/sendcode': {
    data: {
      message: '验证码已发送',
    },
  },
  '/v1/user/verifycode': {
    data: {
      message: '验证码正确',
    },
  },
}

//请求拦截器
instance.interceptors.request.use(
  config => {
    // TODO 2. 携带token
    const useStore = useUserStore()
    if (useStore.token) {
      config.headers.token = useStore.token
    }
    return config
  },
  err => Promise.reject(err),
)
//响应拦截器
instance.interceptors.response.use(
  res => {
    if (res.status === 200) {
      return res
    }
    //失败
    ElMessage.error('服务异常')
    return Promise.reject(res.status)
  },
  err => {
    // 如果是网络错误，返回模拟数据
    if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
      const mockResponse = mockResponses[err.config.url]
      if (mockResponse) {
        return Promise.resolve(mockResponse)
      }
    }
    ElMessage.error('服务异常')
    return Promise.reject(err)
  },
)

export default instance
export { baseURL, instance as request }
