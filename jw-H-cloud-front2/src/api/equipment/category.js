import request from '@/utils/request'

// 获取列表页面所需数据
export function getTableList(params) {
  return request({
    url: 'spaceFacilities/equipmentType/list',
    method: 'get',
    params
  })
}

export function getEquipmentCategoryData(params) {
  return request({
    url: 'spaceFacilities/equipmentType/findById',
    method: 'get',
    params
  })
}
export function getCategoryOptions(params) {
  return request({
    url: 'spaceFacilities/equipmentType/eqTypeList',
    method: 'get'
  })
}

export function updateEquipmentCategoryData(data) {
  return request({
    url: 'spaceFacilities/equipmentType/modify',
    method: 'post',
    data
  })
}

export function addEquipmentCategoryData(data) {
  return request({
    url: 'spaceFacilities/equipmentType/add',
    method: 'post',
    data
  })
}

export function deleteEquipmentCategoryData(data) {
  return request({
    url: 'spaceFacilities/equipmentType/delete',
    method: 'post',
    data
  })
}

