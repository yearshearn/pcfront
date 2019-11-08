import request from '@/utils/request'
// 新增页面
// 获取用户列表
export function userName(params) {
  return request({
    url: 'http://192.168.0.253:8769/sla/getUserList',
    method: 'get',
    params
  })
}

// 获取合同列表
export function contract(params) {
  return request({
    url: 'http://192.168.0.253:8769/sla/getContactList',
    method: 'get',
    params
  })
}

// 获取设备列表

export function getEqList(params) {
  return request({
    url: 'http://192.168.0.253:8769/sla/getEquipmentList',
    method: 'get',
    params
  })
}

// 获取问题类型列表
export function getProblemList(params) {
  return request({
    url: 'http://192.168.0.253:8769/sla/getProblemTypeList',
    method: 'get',
    params
  })
}

// 分级获取街区大厦楼层房间号
export function getLocation(params) {
  return request({
    url: 'http://192.168.0.253:8769/sla/getPlaceList',
    method: 'get',
    params
  })
}

// 新增SLA
export function addSLAdata(data) {
  return request({
    url: 'http://192.168.0.253:8769/sla/addSLA',
    method: 'post',
    data
  })
}

// 修改SLA
export function modifySLAdata(data) {
  return request({
    url: 'http://192.168.0.253:8769/sla/modifySLA',
    method: 'post',
    data
  })
}

// 获取SLA列表的数据
export function getSLAList(data) {
  return request({
    url: 'http://192.168.0.253:8769/sla/getSLAList',
    method: 'post',
    data
  })
}

// 删除SLA
export function delectSLA(data) {
  return request({
    url: 'http://192.168.0.253:8769/sla/updateSLAStatus',
    method: 'post',
    data
  })
}

// 单条查询编辑跳到详情页面
export function findSLAdata(params) {
  return request({
    url: 'http://192.168.0.253:8769/sla/getSLA?slaId=1',
    method: 'get',
    params
  })
}

// 上下移动接口
export function moveSLA(data) {
  return request({
    url: 'http://192.168.0.253:8769/sla/moveSla',
    method: 'post',
    data
  })
}

// SLA历史列表
export function evntList(params) {
  return request({
    url: 'http://192.168.0.253:8769/sla/querySlaEventList',
    method: 'get',
    params
  })
}
