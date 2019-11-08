import request from '@/utils/request'

// 备件出入库图表
export function partTransRecordChart(params) {
  return request({
    url: 'part/chart/partTransRecordChart',
    method: 'get',
    params
  })
}

// 备件出入库图表详情
export function partTransRecordChartDetails(params) {
  return request({
    url: 'part/chart/partTransRecordChartDetails',
    method: 'get',
    params
  })
}

// 所有仓库名称
export function allPartWarehouse() {
  return request({
    url: 'part/store/options',
    method: 'get'
  })
}

// 备件类别库存金额
export function partInventoryChart(data) {
  return request({
    url: 'part/chart/pic',
    method: 'post',
    data
  })
}

// 备件类别库存金额详情
export function partInventoryChartDetails(data) {
  return request({
    url: 'part/chart/partInventoryChartDetails',
    method: 'post',
    data
  })
}
