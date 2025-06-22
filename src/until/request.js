import axios from 'axios'
import { useUserStore } from '@/stores/user.js'
const baseURL = 'http://localhost:8888'
import { ElMessage } from 'element-plus'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000,
})
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
    ElMessage.error('服务异常')
    return Promise.reject(err)
  },
)

export default instance
export { baseURL, instance as request }
