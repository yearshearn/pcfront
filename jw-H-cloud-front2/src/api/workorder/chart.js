import request from '@/utils/request'

// 工单状态图表
export function wrStaturChart(params) {
  return request({
    url: 'wr/wrStaturChart',
    method: 'get',
    params
  })
}

// 工单状态详情
export function wrStaturChartDetails(params) {
  return request({
    url: 'wr/wrStaturChartDetails',
    method: 'get',
    params
  })
}

// 维修类型图表
export function repairTypeChart(params) {
  return request({
    url: 'wr/repairTypeChart',
    method: 'get',
    params
  })
}

// 维修类型详情
export function repairTypeChartDetails(params) {
  return request({
    url: 'wr/repairTypeChartDetails',
    method: 'get',
    params
  })
}
