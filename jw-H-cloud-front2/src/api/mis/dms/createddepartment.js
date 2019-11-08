import request from '@/utils/request'

export function getdepartment(params) {
  return request({
    url: 'user/options',
    method: 'get',
    params
  })
}

export function getdepartlist(params) {
  return request({
    url: 'user/dept/options',
    method: 'get',
    params
  })
}

export function creaddepat(data) {
  return request({
    url: 'user/dept/add',
    method: 'post',
    data
  })
}
