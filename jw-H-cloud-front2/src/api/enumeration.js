import request from '@/utils/request'

// 获取所有大楼信息 根据传的参数不通 获取不同的信息
export function getAllBuildingDataById(params) {
  return request({
    url: '/wr/findPlace',
    method: 'get',
    params
  })
}

// 获取工种列表
export function getCfTypeList(params) {
  return request({
    url: '/mechanic/profession/options',
    method: 'get',
    params
  })
}

// 获取问题类型
export function getProblemOptions(params) {
  return request({
    url: 'mechanic/problem/type/options',
    method: 'get',
    params
  })
}
