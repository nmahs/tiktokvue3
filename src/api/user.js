import { baseURL, request } from '@/until/request'

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

export const uploadChunk = async formData => {
  const response = await axios.post(
    `${API_BASE_URL}/v1/publish/uploading`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
  return response.data
}

export const mergeChunks = async (token, uuid) => {
  const response = await axios.post(`${API_BASE_URL}/v1/publish/complete`, {
    token,
    uuid,
  })
  return response.data
}
