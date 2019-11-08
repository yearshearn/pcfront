import request from '@/utils/request'

// 设备资产列表
export function equipmentAssetsList(params) {
  return request({
    url: `spaceFacilities/equipmentAssets/list`,
    method: 'get',
    params
  })
}

// 设备资产编辑
export function equipmentAssetsModify(data) {
  return request({
    url: `spaceFacilities/equipmentAssets/modify`,
    method: 'post',
    data
  })
}

// 根据设备id查询设备资产
export function equipmentAssetsfindById(params) {
  return request({
    url: `spaceFacilities/equipmentAssets/findById`,
    method: 'get',
    params
  })
}
