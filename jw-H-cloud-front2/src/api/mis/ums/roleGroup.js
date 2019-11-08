import request from '@/utils/request'

export function getRoleGroupTreeList(params) {
  return request({
    url: '/auth/group/options',
    method: 'get',
    params
  })
}

export function getRoleGroupListByParentId(params) {
  return request({
    url: '/auth/group/list',
    method: 'get',
    params
  })
}

export function getRoleList(params) {
  return request({
    url: '/auth/role/options',
    method: 'get',
    params
  })
}

export function createRoleGroup(data) {
  return request({
    url: '/auth/group/add',
    method: 'post',
    data
  })
}

export function getRoleGroupDetails(params) {
  return request({
    url: '/auth/group/find',
    method: 'get',
    params
  })
}

export function updateRoleGroupStatus(data) {
  return request({
    url: '/auth/group/state/modify',
    method: 'post',
    data
  })
}

export function updateRoleGroup(data) {
  return request({
    url: '/auth/group/modify',
    method: 'post',
    data
  })
}

