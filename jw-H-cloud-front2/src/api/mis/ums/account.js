import request from '@/utils/request'

export function addAccount(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}
export function getRoleList(params) {
  return request({
    url: '/auth/role/options',
    method: 'get',
    params
  })
}

export function getUserList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

export function updateUserState(data) {
  return request({
    url: '/user/state/modify',
    method: 'post',
    data
  })
}

export function updateUserDetails(data) {
  return request({
    url: '/user/modify',
    method: 'post',
    data
  })
}

export function getUserDetails(params) {
  return request({
    url: '/user/find',
    method: 'get',
    params
  })
}

export function resetPassword(data) {
  return request({
    url: '/user/pwd/reset',
    method: 'post',
    data
  })
}

