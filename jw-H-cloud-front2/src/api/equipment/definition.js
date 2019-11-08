import request from '@/utils/request'

// 合同查询设备下拉框
export function findByEquipment(params) {
  return request({
    url: `spaceFacilities/equipment/findByEquipment`,
    method: 'get',
    params
  })
}

// 设备列表
export function equipmentList(params) {
  return request({
    url: `spaceFacilities/equipment/list`,
    method: 'get',
    params
  })
}

// 添加设备
export function addEquipment(data) {
  return request({
    url: `spaceFacilities/equipment/add`,
    method: 'post',
    data
  })
}

// 修改设备
export function modifyEquipment(data) {
  return request({
    url: `spaceFacilities/equipment/modify`,
    method: 'post',
    data
  })
}

// 删除设备
export function deleteEquipment(data) {
  return request({
    url: `spaceFacilities/equipment/delete`,
    method: 'post',
    data
  })
}

// 设备联动
export function equipmentLinkage(params) {
  return request({
    url: `spaceFacilities/equipment/linkage`,
    method: 'get',
    params
  })
}

// 根据设备编码查询数据
export function equipmentFindById(params) {
  return request({
    url: `spaceFacilities/equipment/findById`,
    method: 'get',
    params
  })
}

// 修改设备
export function QRCode(data) {
  return request({
    url: `spaceFacilities/equipment/QRCode`,
    method: 'post',
    data
  })
}

// 查找设备类型
export function eqTypeList() {
  return request({
    url: `spaceFacilities/equipmentType/eqTypeList`,
    method: 'get'
  })
}

// 设备导入
export function impertEquipment(data) {
  return request({
    url: `spaceFacilities/equipment/impertEquipment`,
    method: 'post',
    data,
    headers: {
      'Content-type': 'multipart/form-data'
    }
  })
}
