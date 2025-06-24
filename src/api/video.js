import { getMockFeed, getMockVideoById, generateMockVideoList } from '@/utils'

/**
 * @description 获取视频流
 * @param {number|null} latest_time - 可选参数，上次获取的最后时间戳，用于分页
 * @returns {Promise<object>}
 */
export function getFeed(latest_time = null) {
  // In a real app, this would make a request to the backend.
  // We're using a mock function to simulate this.
  return new Promise(resolve => {
    setTimeout(() => {
      const videos = getMockFeed(10, latest_time)
      resolve({
        data: {
          next_time: videos.length > 0 ? Date.now() : null,
          video_list: videos,
        },
        status_code: 0,
        status_msg: 'success',
      })
    }, 500)
  })
}

/**
 * @description 获取单个视频的详细信息
 * @param {string} videoId - 视频ID
 * @returns {Promise<object>}
 */
export function getVideoDetails(videoId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const video = getMockVideoById(videoId)
      if (video) {
        resolve({
          data: video,
          status_code: 0,
          status_msg: 'success',
        })
      } else {
        reject({
          status_code: -1,
          status_msg: 'Video not found',
        })
      }
    }, 300)
  })
}

/**
 * @description 获取指定用户的视频列表
 * @param {string} userId - 用户ID
 * @returns {Promise<object>}
 */
// 导出一个函数，用于获取用户视频
// 导出一个函数，用于获取用户视频
export function getUserVideos() {
  // 返回一个Promise对象
  return new Promise(resolve => {
    // 设置一个定时器，模拟异步操作
    setTimeout(() => {
      // 为了模拟，我们返回一个新的随机列表。
      // 在真实的应用中，这将获取特定用户的视频。
      const videos = generateMockVideoList(8)
      resolve({
        data: {
          video_list: videos,
        },
        status_code: 0,
      })
    }, 500)
  })
}

/**
 * @description 删除视频
 * @param {string} videoId - 视频ID
 * @returns {Promise<object>}
 */
export function deleteVideo(videoId) {
  return new Promise(resolve => {
    setTimeout(() => {
      // In a real app, you'd remove the video from the database.
      // Here we just simulate success.
      console.log(`Mock: Deleting video ${videoId}`)
      resolve({
        status_code: 0,
        status_msg: '删除成功',
      })
    }, 500)
  })
}

/**
 * @description 获取推荐视频
 * @param {string} videoId - 当前视频ID
 * @returns {Promise<object>}
 */
export function getRecommendedVideos(videoId) {
  return new Promise(resolve => {
    setTimeout(() => {
      // Mock: return a random list of videos, excluding the current one
      const videos = generateMockVideoList(10).filter(v => v.id !== videoId)
      resolve({
        data: {
          video_list: videos,
        },
      })
    }, 400)
  })
}
