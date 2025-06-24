import { baseURL, request } from '@/until/request'
import { generateMockVideoList } from '@/utils'

//注册接口部分
export const userRegisterService = ({ user_name, password, email, sex }) => {
  return request.post('/v1/user/create', {
    user_name,
    password,
    email,
    sex,
  })
}
//发送验证码
export const apiGetCode = ({ email }) => {
  return request.post('/v1/user/sendcode', {
    email,
  })
}
//检验验证码
export const apiCheckCode = ({ email, code }) => {
  return request.post('/v1/user/verifycode', {
    code,
    email,
  })
}

//登录接口
export const userLoginService = ({ user_name, password, email }) =>
  request.post('/v1/user/login', {
    user_name,
    password,
    email,
  })

//上传稿件准备阶段
export const ready_upvideo = ({
  token,
  title,
  description,
  chunk_total_number,
  lab_name,
  category,
  open,
}) => {
  request.post('/v1/publish/start', {
    token,
    title,
    description,
    chunk_total_number,
    lab_name,
    category,
    open,
  })
}
// 上传和合并端口
import axios from 'axios'
const API_BASE_URL = baseURL

/**
 * 上传文件分片
 * @param {FormData} formData - 包含文件分片、索引、uuid和token的表单数据
 * @returns {Promise} 上传结果
 */
export const uploadChunk = async formData => {
  try {
    const response = await request.post('/v1/publish/uploading', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('分片上传失败:', error)
    throw error
  }
}

export const mergeChunks = async (token, uuid) => {
  const response = await axios.post(`${API_BASE_URL}/v1/publish/complete`, {
    token,
    uuid,
  })
  return response.data
}

export function getUserProfile(userId) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: {
          id: userId,
          name: '测试用户',
          avatar: 'https://i.pravatar.cc/100?u=' + userId,
          is_follow: Math.random() > 0.5,
          following_count: Math.floor(Math.random() * 1000),
          follower_count: Math.floor(Math.random() * 5000),
          bio: '这是一个很有趣的个人简介，充满了探索和创造力。',
          videos: generateMockVideoList(12),
          liked_videos: generateMockVideoList(8),
        },
      })
    }, 500)
  })
}
