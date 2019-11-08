import request from '@/utils/request'
// import qs from 'querystring'

// 获取列表页面所需数据
export function getWorkorderListConfigData(params) {
  return request({
    url: 'workorder/list',
    method: 'get',
    params
  })
}

export function getEditWorkorderConfigData(params) {
  return request({
    url: 'workorder/list',
    method: 'get',
    params
  })
}

// 工单列表接口
export function getWorkorderList(params, data) {
  return request({
    // url: 'workorder/list',
    url: '/wr/findAllWr',
    method: 'get',
    params, data
  })
}

export function getWorkorderDetails(params) {
  return request({
    url: '/wr/findWrById',
    method: 'get',
    params
  })
}

export function createWorkorder(data) {
  return request({
    url: '/wr/createWr',
    method: 'post',
    data
  })
}

export function updateWorkorder(data) {
  return request({
    url: '/wr/updateWr',
    method: 'post',
    data
  })
}

// 根据工单ID 查询技工记录
export function getCfLogByWrId(params) {
  return request({
    url: '/wr/wrDetails',
    method: 'get',
    params
  })
}

export function getCfList() {
  return request({
    url: 'user/mechanic/options',
    method: 'get'
  })
}

export function deleteWrs(data) {
  return request({
    url: '/wr/deleteWr',
    method: 'post',
    data
  })
}
export function closeWrs(data) {
  return request({
    url: '/wr/manualCloseWr',
    method: 'post',
    data
  })
}

export function assignToCf(data) {
  return request({
    url: '/wr/assignWrCf',
    method: 'post',
    data
  })
}

