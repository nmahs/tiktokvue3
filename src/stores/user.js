import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块 token setToken removeToken
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('') // 定义 token
    const setToken = newToken => (token.value = newToken) // 设置 token
    const userInfo = ref({}) // 定义 userInfo
    const setUserInfo = newUserInfo => (userInfo.value = newUserInfo) // 设置 userInfo
    const clearUserInfo = () => {
      token.value = ''
      userInfo.value = {}
      // 如果您使用了持久化插件，也需要在这里清除本地存储
      // storage.removeItem('user-token')
      // storage.removeItem('user-info')
    }
    return { token, setToken, userInfo, setUserInfo, clearUserInfo }
  },
  {
    persist: true, // 持久化
  },
)
