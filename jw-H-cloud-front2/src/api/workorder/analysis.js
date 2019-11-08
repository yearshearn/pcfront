import request from '@/utils/request'

// 工时分析
export function timeAnalysis(params) {
  return request({
    url: '/wr/timeAnalysis',
    method: 'get',
    params
  })
}

// 工时详情
export function performanceDetails(params) {
  return request({
    url: '/wr/performanceDetails',
    method: 'get',
    params
  })
}
