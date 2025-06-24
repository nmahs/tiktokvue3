import { generateMockVideoList, getMockVideoById } from '@/utils'

// Mock data
let mockFavoriteFolders = [
  {
    id: 1,
    name: '我的收藏夹',
    description: '默认收藏夹',
    coverUrl: 'https://picsum.photos/200/150?random=1',
  },
  {
    id: 2,
    name: '学习资料',
    description: '编程与设计',
    coverUrl: 'https://picsum.photos/200/150?random=2',
  },
]

// { favoriteId: [videoId1, videoId2, ...] }
// Let's create a flat array of video IDs for each favorite folder
let mockFavoriteVideos = {
  1: generateMockVideoList(5).map(v => v.id),
  2: generateMockVideoList(3).map(v => v.id),
}

/**
 * @description 获取收藏夹列表
 */
export function getFavoriteList() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ data: mockFavoriteFolders })
    }, 300)
  })
}

/**
 * @description 创建收藏夹
 */
export function createFavorite(name, description, coverUrl) {
  return new Promise(resolve => {
    setTimeout(() => {
      const newFolder = {
        id: Math.max(0, ...mockFavoriteFolders.map(f => f.id)) + 1,
        name,
        description,
        coverUrl,
      }
      mockFavoriteFolders.push(newFolder)
      resolve({ data: newFolder })
    }, 300)
  })
}

/**
 * @description 删除收藏夹
 */
export function deleteFavorite(favoriteId) {
  return new Promise(resolve => {
    setTimeout(() => {
      mockFavoriteFolders = mockFavoriteFolders.filter(f => f.id !== favoriteId)
      delete mockFavoriteVideos[favoriteId]
      resolve({ status_code: 0 })
    }, 300)
  })
}

/**
 * @description 获取收藏夹内的视频
 */
export function getFavoriteVideos(favoriteId) {
  return new Promise(resolve => {
    setTimeout(() => {
      const videoIds = mockFavoriteVideos[favoriteId] || []
      // In a real app, you'd fetch video details by IDs from the main video list.
      const videos = videoIds.map(id => getMockVideoById(id)).filter(Boolean)
      resolve({ data: { data: videos } })
    }, 300)
  })
}

/**
 * @description 从收藏夹移除视频
 */
export function removeVideoFromFavorite(favoriteId, videoId) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (mockFavoriteVideos[favoriteId]) {
        mockFavoriteVideos[favoriteId] = mockFavoriteVideos[favoriteId].filter(
          id => id !== videoId,
        )
      }
      resolve({ status_code: 0 })
    }, 300)
  })
}
