import request from '@/utils/request'

// 初始化主备件仓库
export function partStoreAdd(data) {
  return request({
    url: '/part/store/init',
    method: 'post',
    data
  })
}

// 同步备件信息
export function syncStore(data) {
  return request({
    url: '/part/store/sync',
    method: 'post',
    data
  })
}

// 修改备件仓库列表
export function partStoreModify(data) {
  return request({
    url: '/part/store/modify',
    method: 'post',
    data
  })
}

// 检查是否有主仓库
export function checkInit(data) {
  return request({
    url: '/part/store/init/check',
    method: 'get',
    data
  })
}

// 检查备件仓库名称
export function checkWarehouseName(params) {
  return request({
    url: '/part/store/check/name',
    method: 'get',
    params
  })
}

// 备件仓库详情
export function findWarehouse(params) {
  return request({
    url: '/part/store/find',
    method: 'get',
    params
  })
}
// 修改备件状态
export function modifyPartState(data) {
  return request({
    url: '/part/state/modify',
    method: 'post',
    data
  })
}

// 备件信息列表
export function getPartDetailList(params) {
  return request({
    url: '/part/list',
    method: 'get',
    params
  })
}

// 新增备件
export function createPart(data) {
  return request({
    url: '/part/add',
    method: 'post',
    data
  })
}

// 修改备件
export function modifyPart(data) {
  return request({
    url: '/part/modify',
    method: 'post',
    data
  })
}

// 检查备件名称接口
export function checkPartName(params) {
  return request({
    url: '/part/check/name',
    method: 'get',
    params
  })
}

// 检查备件编码接口
export function checkPartCode(params) {
  return request({
    url: '/part/check/code',
    method: 'get',
    params
  })
}

// 备件信息详情接口
export function findPart(params) {
  return request({
    url: '/part/find',
    method: 'get',
    params
  })
}

// 备件选项列表
export function optionPart(params) {
  return request({
    url: '/part/options',
    method: 'get',
    params
  })
}

// 备件类型列表1
export function getPartTypeList(params) {
  return request({
    url: '/part/cat/list',
    method: 'get',
    params
  })
}

// 新增备件类型1
export function createPartType(data) {
  return request({
    url: '/part/cat/add',
    method: 'post',
    data
  })
}

// 修改备件类型1
export function modifyPartType(data) {
  return request({
    url: '/part/cat/modify',
    method: 'post',
    data
  })
}

// 检查备件类型1
export function checkPartType(params) {
  return request({
    url: '/part/cat/check',
    method: 'get',
    params
  })
}

// 备件类型详情1
export function findPartType(params) {
  return request({
    url: '/part/cat/find',
    method: 'get',
    params
  })
}

// 修改备件类型状态
export function modifyPartTypeState(data) {
  return request({
    url: '/part/cat/state/modify',
    method: 'post',
    data
  })
}

// 备件类型选项接口
export function optionPartType(params) {
  return request({
    url: '/part/cat/options',
    method: 'get',
    params
  })
}

// 备件供应商列表
export function getPartSupplierList(params) {
  return request({
    url: '/part/vn/list',
    method: 'get',
    params
  })
}

// 新增备件供应商
export function createPartSupplier(data) {
  return request({
    url: '/part/vn/add',
    method: 'post',
    data
  })
}

// 修改备件供应商
export function modifyPartSupplier(data) {
  return request({
    url: '/part/vn/modify',
    method: 'post',
    data
  })
}

// 备件供应商详情
export function findSupplier(params) {
  return request({
    url: '/part/vn/find',
    method: 'get',
    params
  })
}

// 修改备件供应商状态
export function modifyPartSupplierState(data) {
  return request({
    url: '/part/vn/state/modify',
    method: 'post',
    data
  })
}

// 备件供应商选项列表
export function optionSupplier(params) {
  return request({
    url: '/part/vn/options',
    method: 'get',
    params
  })
}

// 检查备件供应商名称
export function checkSupplierName(params) {
  return request({
    url: '/part/vn/check/name',
    method: 'get',
    params
  })
}

// 新增备件类型1
export function createPartSupplierType(data) {
  return request({
    url: '/part/supplier/cat/add',
    method: 'post',
    data
  })
}

// 修改备件类型1
export function modifyPartSupplierType(data) {
  return request({
    url: '/part/supplier/cat/modify',
    method: 'post',
    data
  })
}

// 检查备件类型1
export function checkPartSupplierType(params) {
  return request({
    url: '/part/cat/check',
    method: 'get',
    params
  })
}

// 备件类型详情1
export function findPartSupplierType(params) {
  return request({
    url: '/part/supplier/cat/find',
    method: 'get',
    params
  })
}

// 备件供应商选项类型列表
export function optionPartSupplierType(params) {
  return request({
    url: '/part/vn/type/options',
    method: 'get',
    params
  })
}

// 备件名称
export function getPartName() {
  return request({
    url: '/part/options',
    method: 'get'
  })
}

// 领料
export function receivePart(data) {
  return request({
    url: '/part/it/picking',
    method: 'post',
    data
  })
}

// 退料
export function recedePart(data) {
  return request({
    url: '/part/it/cs',
    method: 'post',
    data
  })
}

// 采购
export function purchasePart(data) {
  return request({
    url: 'part/it/purchase',
    method: 'post',
    data
  })
}

// 退供应商
export function supplierBack(data) {
  return request({
    url: '/part/it/returnvn',
    method: 'post',
    data
  })
}

// 一键退库
export function withdrawing(data) {
  return request({
    url: 'part/it/ptc',
    method: 'post',
    data
  })
}

// // 我的仓库
// export function myStore(params) {
//   return request({
//     url: '/part/store/my',
//     method: 'get',
//     params
//   })
// }

// 定义备件仓库备件列表
// export function partDefines(params) {
//   return request({
//     url: '/part/store/part/defines',
//     method: 'get',
//     params
//   })
// }

// 定义备件库存
// export function definePart(data) {
//   return request({
//     url: '/part/store/part/define',
//     method: 'post',
//     data
//   })
// }

// 修改备件最低保有量
// export function modifyMin(data) {
//   return request({
//     url: '/part/store/part/modify/min',
//     method: 'post',
//     data
//   })
// }
// 备件仓库选项列表
export function storeOptions(params) {
  return request({
    url: '/part/store/options',
    method: 'get',
    params
  })
}
// 备件库存列表
export function partInventory(data) {
  return request({
    url: '/part/store/part/list',
    method: 'post',
    data
  })
}
// 个人仓库列表
export function mechanicOptions() {
  return request({
    url: '/part/store/cf/options',
    method: 'get'
  })
}

// 个人仓库备件
export function partListStore(params) {
  return request({
    url: '/part/store/part/list/store',
    method: 'get',
    params
  })
}

// 主仓库备件
export function mainPart() {
  return request({
    url: '/part/store/part/list/store/main',
    method: 'get'
  })
}

// 转移记录
export function transferRecord(data) {
  return request({
    url: '/part/it/list',
    method: 'post',
    data
  })
}

export function itType() {
  return request({
    url: '/part/it/type/options',
    method: 'get'
  })
}

