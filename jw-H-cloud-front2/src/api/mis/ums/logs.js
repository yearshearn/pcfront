import request from '@/utils/request'

export function updateLogConfig(data) {
  return request({
    url: 'http://192.168.0.116:8765/setting',
    method: 'post',
    data
  })
}

export function getLogConfig() {
  return request({
    url: 'http://192.168.0.116:8765/state',
    method: 'get'

  })
}

export function getExceptionLogs(params) {
  return request({
    url: 'http://192.168.0.116:8765/search/exception',
    method: 'get',
    params
  })
}

export function getOperationLogs(params) {
  return request({
    url: 'http://192.168.0.116:8765/search/operation',
    method: 'get',
    params
  })
}

export function getExceptionStackMsg(params) {
  return request({
    url: 'http://192.168.0.116:8765/find',
    method: 'get',
    params
  })
}

export function addQueType(data) {
  return request({
    url: 'user/problem/sort/add',
    method: 'post',
    data
  })
}
