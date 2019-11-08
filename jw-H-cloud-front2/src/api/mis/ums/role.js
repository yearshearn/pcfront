import request from '@/utils/request'

export function getRoleList(params) {
  return request({
    url: '/auth/role/list',
    method: 'get',
    params
  })
}

export function getPermissionList(params) {
  return request({
    url: '/auth/url/options',
    method: 'get',
    params
  })
}

export function addRole(data) {
  return request({
    url: '/auth/role/add',
    method: 'post',
    data
  })
}

export function updateRoleState(data) {
  return request({
    url: '/auth/role/state/modify',
    method: 'post',
    data
  })
}

export function getRoleDetails(params) {
  return request({
    url: '/auth/role/find',
    method: 'get',
    params
  })
}

export function updateRole(data) {
  return request({
    url: '/auth/role/modify',
    method: 'post',
    data
  })
}
