import { request } from '@/until/request'
import { ElMessage } from 'element-plus'

/**
 * 创建收藏夹
 * @param {string} name 收藏夹名称
 * @param {string} description 收藏夹描述
 * @param {string} coverUrl 收藏夹封面 URL
 * @returns {Promise<object>} 接口返回的数据
 */
export async function createFavorite(name, description, coverUrl) {
  try {
    const response = await request.post('/v1/favorite/create', {
      name,
      description,
      cover_url: coverUrl,
    })
    ElMessage.success('收藏夹创建成功')
    return response.data // 返回接口响应数据
  } catch (error) {
    console.error('创建收藏夹失败:', error)
    ElMessage.error('创建收藏夹失败，请稍后再试')
    throw error
  }
}

/**
 * 获取收藏夹列表
 * @param {number} pageNum 页码
 * @param {number} pageSize 每页显示数量
 * @returns {Promise<object>} 接口返回的数据
 */
export async function getFavoriteList(pageNum = 1, pageSize = 10) {
  try {
    const response = await request.get('/v1/favorite/list', {
      params: {
        page_num: pageNum, // 页码
        page_size: pageSize, // 每页数量
      },
    })
    console.log('收藏夹列表:', response.data) // 打印接口返回数据
    return response.data
  } catch (error) {
    console.error('获取收藏夹列表失败:', error)
    ElMessage.error('获取收藏夹列表失败，请稍后重试')
    throw error
  }
}
//删除收藏夹
export async function deleteFavorite(favoriteId) {
  return request.delete('/v1/favorite/delete', {
    data: {
      favorite_id: favoriteId,
    },
  })
}
// 获取收藏夹内视频列表
export async function getFavoriteVideos(favoriteId, pageNum, pageSize) {
  return request.get('/v1/favorite/video/list', {
    params: {
      favorite_id: favoriteId,
      page_num: pageNum,
      page_size: pageSize,
    },
  })
}
// 删除收藏夹中的视频
export const deleteVideoFromFavorite = (favoriteId, videoId) => {
  return request({
    url: '/v1/favorite/video/delete', // 接口地址，根据你的文档
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded', // 根据接口文档选择请求类型
    },
    data: new URLSearchParams({
      favorite_id: favoriteId,
      video_id: videoId,
    }).toString(),
  })
}
