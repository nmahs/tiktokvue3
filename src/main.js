import { createApp } from 'vue'
import pinia from './stores/index'
import App from './App.vue'
import router from './router/index'

console.log('开始创建 Vue 应用...')

try {
  const app = createApp(App)
  console.log('Vue 应用创建成功')

  app.use(pinia)
  console.log('Pinia 注册成功')

  app.use(router)
  console.log('Router 注册成功')

  app.mount('#app')
  console.log('应用挂载成功')
} catch (error) {
  console.error('应用启动失败:', error)
}
