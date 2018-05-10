import axios from 'axios'
import cookie from '../../static/js/cookie'


// const HOST = 'http://em.gengwenhao.com'
const HOST = 'http://localhost:8000'

let headers = {
  'Authorization': 'JWT ' + cookie.getCookie('token'),
}

// 获取用户留言
export const getUserMsg = page => {
  return axios.get(`${HOST}/message_profile/`, {params: {page}, headers})
}

// 获取用户信息
export const getUserInfo = params => {
  return axios.get(`${HOST}/api/userinfo/`)
}

// 获取用户详细信息列表
export const getUserProfile = params => {
  return axios.get(`${HOST}/user_profile/`, {params, headers})
}

// 添加用户留言
export const postUserMsg = content => {
  return axios.post(`${HOST}/message_profile/`, {content}, {headers})
}

// 发送全站通知
export const postBoardContent = (content, type, target_id) => {
  return axios.post(`${HOST}/board/`, {content, type, target_id}, {headers})
}

// 获取全站通知
export const getBoardMessage = page => {
  return axios.get(`${HOST}/board/`, {params: {page}, headers})
}

// 登陆验证
export const login = (username, password) => {
  return axios.post(`${HOST}/login/`, {username, password})
}

// 获取机构列表
export const getOrgProfile = params => {
  return axios.get(`${HOST}/org_profile/`, {params, headers})
}

// 获取机构信息
export const getOrgInfo = params => {
  return axios.get(`${HOST}/api/orginfo/`)
}

// 密码更新
export const changePassword = new_password => {
  return axios.put(`${HOST}/change_password/1/`, {new_password}, {headers})
}
