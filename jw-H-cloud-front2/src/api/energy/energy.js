import request from '@/utils/request'

// 地点树
export function locTree(params) {
  return request({
    url: 'http://192.168.0.116:8781/ey/tree',
    method: 'get',
    params
  })
}

export function locEy(data) {
  return request({
    url: 'http://192.168.0.116:8781/ey/loc',
    method: 'post',
    data
  })
}

// 能耗总页面
// 卡片面积和人数
export function energyAreaPerson(params) {
  return request({
    url: 'http://192.168.0.116:8781/area',
    method: 'get',
    params
  })
}
// 条形图数据表
export function topData(params) {
  return request({
    url: 'http://192.168.0.116:8781/ey/top/fl',
    method: 'get',
    params
  })
}
// 列表中楼层能耗信息列表
export function locFloorData(params) {
  return request({
    url: 'http://192.168.0.116:8781/ey/real/fl',
    method: 'get',
    params
  })
}
// 列表数据
export function energyListData(params) {
  return request({
    url: 'http://192.168.0.116:8781/ey/real',
    method: 'get',
    params
  })
}
// 卡片问题列表
export function energyErr(params) {
  return request({
    url: 'http://192.168.0.116:8781/e',
    method: 'get',
    params
  })
}
// 卡片总电耗
export function energySum(params) {
  return request({
    url: 'http://192.168.0.116:8781/c',
    method: 'get',
    params
  })
}
// 实时能耗
// 实时页面
export function energyReal(data) {
  return request({
    url: 'http://192.168.0.116:8781/ey/data/actual',
    method: 'post',
    data
  })
}

// 设备报表
export function energyEq(data) {
  return request({
    url: 'http://192.168.0.116:8781/ey/eq',
    method: 'post',
    data
  })
}

// 设置能耗的参数
export function eyParameter(data) {
  return request({
    url: 'http://192.168.0.116:8781/sys/setting',
    method: 'post',
    data
  })
}

// 卡片弹框水表电表设备
export function eqCardList(data) {
  return request({
    url: 'http://192.168.0.116:8781/e/list',
    method: 'post',
    data
  })
}

// 参数默认值

export function eyParamData(params) {
  return request({
    url: 'http://192.168.0.116:8781/sys/read',
    method: 'get',
    params
  })
}
