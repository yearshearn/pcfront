import request from '@/utils/request'
// import { runInContext } from 'vm'

/** 问题分类 */
// 添加问题分类
export function problemTypeadd(data) {
  return request({
    url: 'mechanic/problem/sort/add',
    method: 'post',
    data
  })
}
// 修改问题分类
export function problemTypeModify(data) {
  return request({
    url: 'mechanic/problem/sort/modify',
    method: 'post',
    data
  })
}
// 问题分类详情
export function findIdData(params) {
  return request({
    url: 'mechanic/problem/sort/find',
    method: 'get',
    params
  })
}
// 问题分类列表
export function getProblemTypeList(params) {
  return request({
    url: 'mechanic/problem/sort/list',
    method: 'get',
    params
  })
}

// 检查问题分类名称是否存在
export function checkPoblemType(params) {
  return request({
    url: 'mechanic/problem/sort/check',
    method: 'get',
    params
  })
}
// 修改问题分类状态
export function btnType(data) {
  return request({
    url: 'mechanic/problem/sort/state/modify',
    method: 'post',
    data
  })
}

/** *问题类型 */
// 添加问题类型
export function addProblemClass(data) {
  return request({
    url: 'mechanic/problem/type/add',
    method: 'post',
    data
  })
}
// 修改问题类型
export function problemClassModify(data) {
  return request({
    url: 'mechanic/problem/type/modify',
    method: 'post',
    data
  })
}
// 问题类型选项下拉框
export function problemOptions(params) {
  return request({
    url: 'mechanic/problem/sort/options',
    method: 'get',
    params
  })
}
// 问题类型详情
export function problemClassFind(params) {
  return request({
    url: 'mechanic/problem/type/find',
    method: 'get',
    params
  })
}
// 问题类型列表
export function problemClassList(params) {
  return request(
    {
      url: 'mechanic/problem/type/list',
      method: 'get',
      params
    }
  )
}
// 检查问题类型是否存在
export function checkPoblemClass(params) {
  return request({
    url: 'mechanic/problem/type/check',
    method: 'get',
    params
  })
}
// 启用禁用问题类型状态
export function btnProblem(data) {
  return request({
    url: 'mechanic/problem/type/state/modify',
    method: 'post',
    data
  })
}
// 工种关联的checkbook
export function checkBtn(params) {
  return request({
    url: 'mechanic/profession/options',
    method: 'get',
    params
  })
}

/** 工种 */
// 添加工种信息
export function createdTypeWork(data) {
  return request({
    url: 'mechanic/profession/add',
    method: 'post',
    data
  })
}

// 修改工种信息
export function modifyTypeWork(data) {
  return request({
    url: 'mechanic/profession/modify',
    method: 'post',
    data
  })
}
// 工种信息选项
export function professionOptions(params) {
  return request({
    url: 'mechanic/profession/options',
    method: 'get',
    params
  })
}
// 工种信息的列表
export function typeWorkList(params) {
  return request({
    url: 'mechanic/profession/list',
    method: 'get',
    params
  })
}
// 检查工种信息
export function chekProfessionName(params) {
  return request({
    url: 'mechanic/profession/check',
    method: 'get',
    params
  })
}
// 工种中多选框
export function typeWorkCheckBox(params) {
  return request({
    url: 'mechanic/problem/type/options',
    method: 'get',
    params
  })
}
// 工种详情
export function typeWorkFind(params) {
  return request({
    url: 'mechanic/profession/find',
    method: 'get',
    params
  })
}

/** 工作组 */
// 添加工作组
export function addWorkGroup(data) {
  return request({
    url: 'mechanic/work/group/add',
    method: 'post',
    data
  })
}

// 修改工作组
export function modifyWorkGroup(data) {
  return request({
    url: 'mechanic/work/group/modify',
    method: 'post',
    data
  })
}
// 工作组选项列表
export function workGroupOptions(params) {
  return request({
    url: 'mechanic/work/group/options',
    method: 'get',
    params
  })
}
// 工作组详情
export function findWorkGroupById(params) {
  return request({
    url: 'mechanic/work/group/find',
    method: 'get',
    params
  })
}
// 检查工作组名称
export function checkWorkGroupName(params) {
  return request({
    url: 'mechanic/work/group/check',
    method: 'get',
    params
  })
}

// 工作组列表
export function groupList(params) {
  return request({
    url: 'mechanic/work/group/list',
    method: 'get',
    params
  })
}
// 工作组负责人
export function groupAdim(params) {
  return request({
    url: 'user/options',
    method: 'get',
    params
  })
}
// 工作组人员（技工）
export function groupcf(params) {
  return request({
    url: 'user/cf/options',
    method: 'get',
    params
  })
}

