/**
 * 工具函数集合
 */

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait, immediate = false) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 限制时间（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle(func, limit) {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的文件大小
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 格式化时间
 * @param {Date|string|number} date - 日期
 * @param {string} format - 格式字符串
 * @returns {string} 格式化后的时间
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  const d = new Date(date)

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 生成UUID
 * @returns {string} UUID字符串
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 深拷贝对象
 * @param {any} obj - 要拷贝的对象
 * @returns {any} 拷贝后的对象
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证手机号格式
 * @param {string} phone - 手机号
 * @returns {boolean} 是否有效
 */
export function isValidPhone(phone) {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 本地存储工具
 */
export const storage = {
  /**
   * 设置存储
   * @param {string} key - 键名
   * @param {any} value - 值
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('存储失败:', error)
    }
  },

  /**
   * 获取存储
   * @param {string} key - 键名
   * @param {any} defaultValue - 默认值
   * @returns {any} 存储的值
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('读取存储失败:', error)
      return defaultValue
    }
  },

  /**
   * 删除存储
   * @param {string} key - 键名
   */
  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('删除存储失败:', error)
    }
  },

  /**
   * 清空所有存储
   */
  clear() {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('清空存储失败:', error)
    }
  },
}

/**
 * 下载文件
 * @param {string} url - 文件URL
 * @param {string} filename - 文件名
 */
export function downloadFile(url, filename) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 是否复制成功
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    }
  } catch (error) {
    console.error('复制失败:', error)
    return false
  }
}

export const generateMockVideoList = (count = 10) => {
  const list = []
  for (let i = 0; i < count; i++) {
    const randomWidth = 400 + Math.floor(Math.random() * 100)
    const randomHeight = 225 + Math.floor(Math.random() * 50)
    list.push({
      id: generateUUID(),
      author: {
        avatar: 'https://via.placeholder.com/48',
        is_follow: Math.random() > 0.5,
      },
      url: 'http://vjs.zencdn.net/v/oceans.mp4', // Placeholder video URL
      cover_url: `https://picsum.photos/${randomWidth}/${randomHeight}?random=${i}`,
      title: `这是一个很长很长很长很长的视频标题用来测试省略号是否正常工作 ${
        i + 1
      }`,
      favorite_count: Math.floor(Math.random() * 1000),
      comment_count: Math.floor(Math.random() * 500),
      is_favorite: Math.random() > 0.5,
      publish_date: new Date(
        Date.now() - Math.random() * 1000 * 3600 * 24 * 30,
      ).toISOString(),
      duration: `${Math.floor(Math.random() * 60)}:${Math.floor(
        Math.random() * 60,
      )
        .toString()
        .padStart(2, '0')}`,
    })
  }
  return list
}

// Create a static list of mock videos to ensure data consistency across API calls
const mockVideoData = generateMockVideoList(50)

export const getMockFeed = (count = 10) => {
  // In a real scenario, latest_time would be used for pagination.
  // Here we just return a slice of the mock data.
  // This is a simplified example.
  const startIndex = Math.floor(Math.random() * (mockVideoData.length - count))
  return mockVideoData.slice(startIndex, startIndex + count)
}

export const getMockVideoById = id => {
  return mockVideoData.find(video => video.id === id) || null
}

let mockComments = []

export const generateMockComments = (videoId, count = 10) => {
  const comments = []
  for (let i = 0; i < count; i++) {
    comments.push({
      id: generateUUID(),
      user: {
        id: `user_${i}`,
        nickname: `路人甲${i}`,
        avatar: `https://i.pravatar.cc/40?u=user${i}`,
      },
      content: '这是一个非常棒的评论！'.repeat(Math.ceil(Math.random() * 3)),
      create_date: new Date(
        Date.now() - Math.random() * 1000 * 3600 * 24 * 5,
      ).toLocaleDateString(),
    })
  }
  mockComments = comments
  return comments
}

export const addMockComment = (videoId, content) => {
  const newComment = {
    id: generateUUID(),
    user: {
      id: 'user_current',
      nickname: '我',
      avatar: `https://i.pravatar.cc/40?u=user_current`,
    },
    content: content,
    create_date: new Date().toLocaleDateString(),
  }
  mockComments.unshift(newComment)
  return newComment
}

export const removeMockComment = commentId => {
  mockComments = mockComments.filter(comment => comment.id !== commentId)
}
