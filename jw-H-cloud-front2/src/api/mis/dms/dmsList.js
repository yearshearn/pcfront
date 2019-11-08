import request from '@/utils/request'

// 部门列表
export function getDepartList(params) {
  return request({
    url: 'user/dept/list',
    method: 'get',
    params
  })
}

// 部门树桩
export function departOptions() {
  return request({
    url: 'user/dept/options',
    method: 'get'
  })
}

// 改变状态
export function updateDepartmentStatus(data) {
  return request({
    url: 'user/dept/state/modify',
    method: 'post',
    data
  })
}

// 部门详情
export function getDepartDetails(params) {
  return request({
    url: 'user/dept/find',
    method: 'get',
    params
  })
}

// 部门是否存在
export function checkDept(params) {
  return request({
    url: 'user/dept/check/name',
    method: 'get',
    params
  })
}

// 部门修改
export function changeDept(data) {
  return request({
    url: 'user/dept/modify',
    method: 'post',
    data
  })
}
