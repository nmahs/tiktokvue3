import { request } from '@/until/request'

// 获取互关列表函数
export async function getMutualFriends(pageNum = 1, pageSize = 5) {
  try {
    const response = await request.get('/v1/friend/list', {
      params: {
        page_num: pageNum,
        page_size: pageSize,
      },
    })
    console.log('互关列表数据:', response.data) // 接口成功返回的数据
    return response.data
  } catch (error) {
    console.error('获取互关列表失败:', error)
    throw error
  }
}

// 获取关注者列表
export async function getFollowerList(pageNum = 1, pageSize = 5) {
  try {
    const response = await request.get('/v1/follower/list', {
      params: {
        page_num: pageNum,
        page_size: pageSize,
      },
    })
    console.log('关注者列表:', response.data) // 打印接口返回数据
    return response.data // 返回数据给调用方
  } catch (error) {
    console.error('获取关注者列表失败:', error)
    throw error // 抛出错误以便调用方处理
  }
}

// 获取关注列表
export async function getFollowingList(pageNum = 1, pageSize = 5) {
  try {
    const response = await request.get('/v1/following/list', {
      params: {
        page_num: pageNum,
        page_size: pageSize,
      },
    })
    console.log('关注列表:', response.data) // 打印接口返回数据
    return response.data // 返回数据给调用方
  } catch (error) {
    console.error('获取关注列表失败:', error)
    throw error // 抛出错误以便调用方处理
  }
}
/**
 * 执行关注或取消关注操作
 * @param {number} actionType - 操作类型，1 表示关注，0 表示取消关注
 * @param {number} toUserId - 被操作的用户 ID
 * @returns {Promise<object>} 接口返回数据
 */
export async function followAction(actionType, toUserId) {
  try {
    const response = await request.post('/v1/relation/action', {
      action_type: actionType,
      to_user_id: toUserId,
    })
    console.log('操作成功:', response.data)
    return response.data // 返回接口数据
  } catch (error) {
    console.error('操作失败:', error)
    throw error // 抛出错误以便调用方处理
  }
}

/**
 * 添加视频到收藏夹
 * @param {string} favoriteId - 收藏夹的 ID
 * @param {string} videoId - 要收藏的视频 ID
 * @returns {Promise<object>} 返回接口响应数据
 */
export async function addVideoToFavorite(favoriteId, videoId) {
  try {
    const response = await request.post('/v1/favorite/video/add', {
      favorite_id: favoriteId,
      video_id: videoId,
    })
    console.log('视频添加到收藏夹成功:', response.data)
    return response.data // 返回接口数据
  } catch (error) {
    console.error('添加视频到收藏夹失败:', error)
    throw error // 抛出错误以便调用方处理
  }
}
/**
 * 搜索视频接口
 * @param {Object} params - 搜索参数
 * @param {string} params.keyword - 搜索关键词
 * @param {number} params.page_size - 每页显示数量
 * @param {number} params.page_num - 当前页码
 * @param {string} [params.from_date] - 搜索起始时间（可选）
 * @param {string} [params.to_date] - 搜索结束时间（可选）
 * @returns {Promise} 返回后端响应数据
 */
export async function searchVideos(params) {
  try {
    const response = await request.post('/v1/video/search', params)
    console.log('视频搜索结果:', response.data) // 打印搜索结果
    return response.data // 返回搜索数据
  } catch (error) {
    console.error('搜索视频失败:', error)
    throw error // 抛出错误以便调用方处理
  }
}
