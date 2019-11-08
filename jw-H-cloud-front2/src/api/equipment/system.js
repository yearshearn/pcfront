import request from '@/utils/request'

// 获取列表页面所需数据
export function getTableList(params) {
  return request({
    url: 'spaceFacilities/systemCategory/list',
    method: 'get',
    params
  })
}

export function getEquipmentSystemData(params) {
  return request({
    url: 'spaceFacilities/systemCategory/findById',
    method: 'get',
    params
  })
}

export function updateEquipmentSystemData(data) {
  return request({
    url: 'spaceFacilities/systemCategory/modify',
    method: 'post',
    data
  })
}

export function addEquipmentSystemData(data) {
  return request({
    url: 'spaceFacilities/systemCategory/add',
    method: 'post',
    data
  })
}

export function deleteEquipmentSystemData(data) {
  return request({
    url: 'spaceFacilities/systemCategory/delete',
    method: 'post',
    data
  })
}
