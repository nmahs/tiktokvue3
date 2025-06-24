import {
  generateMockComments,
  addMockComment,
  removeMockComment,
} from '@/utils'

/**
 * @description 获取评论列表
 * @param {string} videoId
 * @param {number} page
 * @param {number} pageSize
 * @returns {Promise<object>}
 */
export function getCommentList(videoId, pageSize = 10) {
  return new Promise(resolve => {
    setTimeout(() => {
      const comments = generateMockComments(videoId, pageSize)
      resolve({
        data: {
          list: comments,
          total: 35, // Mock total
        },
        status_code: 0,
      })
    }, 300)
  })
}

/**
 * @description 发表评论
 * @param {string} videoId
 * @param {string} content
 * @returns {Promise<object>}
 */
export function createComment(videoId, content) {
  return new Promise(resolve => {
    setTimeout(() => {
      const newComment = addMockComment(videoId, content)
      resolve({
        data: newComment,
        status_code: 0,
      })
    }, 300)
  })
}

/**
 * @description 删除评论
 * @param {string} commentId
 * @returns {Promise<object>}
 */
export function deleteComment(commentId) {
  return new Promise(resolve => {
    setTimeout(() => {
      removeMockComment(commentId)
      resolve({
        data: {},
        status_code: 0,
        status_msg: '删除成功',
      })
    }, 300)
  })
}
