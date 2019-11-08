import request from '@/utils/request'
// import qs from 'querystring'

// 获取列表页面所需数据
export function getTableList(params) {
  return request({
    url: 'spaceFacilities/equipmentAlarm/list',
    method: 'get',
    params
  })
}

export function getEquipmentAlarmData(params) {
  return request({
    url: 'spaceFacilities/equipmentAlarm/findById',
    method: 'get',
    params
  })
}

export function getEquipmentAlarmeqSubtypesData(params) {
  return request({
    url: 'spaceFacilities/equipmentAlarm/findEqSubtype',
    method: 'get',
    params
  })
}

export function updateEquipmentAlarmData(data) {
  return request({
    url: 'spaceFacilities/equipmentAlarm/modify',
    method: 'post',
    data
  })
}

export function updateEquipmentAlarmStatus(data) {
  return request({
    url: 'spaceFacilities/equipmentAlarm/modifyStatus',
    method: 'post',
    data
  })
}

export function addEquipmentAlarmData(data) {
  return request({
    url: 'spaceFacilities/equipmentAlarm/add',
    method: 'post',
    data
  })
}

export function deleteEquipmentAlarmData(data) {
  return request({
    url: 'spaceFacilities/equipmentAlarm/delete',
    method: 'post',
    data
  })
}
