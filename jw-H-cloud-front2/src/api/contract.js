import request from '@/utils/request'
const isDev = false
// 合同列表 分页查询
export function getList(params) {
  return request({
    url: `${!isDev ? 'contract/' : ''}doFindPageContract`,
    method: 'get',
    params
  })
}

// 合同查找
export function getContractDetails(cid) {
  return request({
    url: `${!isDev ? 'contract/' : ''}find`,
    method: 'get',
    params: { conId: cid }
  })
}

// 合同创建
export function getNewContract(data) {
  return request({
    url: `${!isDev ? 'contract/' : ''}createContract`,
    method: 'post',
    data
    // headers: {
    //   'Content-type': 'multipart/form-data'
    // }
  })
}

// 合同删除
export function deleteContract(data) {
  return request({
    url: `${!isDev ? 'contract/' : ''}delete`,
    method: 'post',
    data
  })
}

// 问卷新增
export function getNewQuestionNaire(data) {
  return request({
    url: `${!isDev ? 'contract/' : ''}questionnaire/createQue`,
    method: 'post',
    data
  })
}

// 条款查找
export function getClauseDetails(cid) {
  return request({
    url: `${!isDev ? 'contract/' : ''}clause/find`,
    method: 'get',
    params: { conId: cid }
  })
}

// 问卷列表
export function getQuestionnairesList(params) {
  return request({
    url: `${!isDev ? 'contract/' : ''}questionnaire/doFindPageQuestionnaire`,
    method: 'get',
    params
  })
}

// 问卷列表详情
export function getQuestionnaireDetailsByQueId(params) {
  return request({
    url: `${!isDev ? 'contract/' : ''}questionnaire/find`,
    method: 'get',
    params
  })
}

// 合同修改
export function updateContractDetails(data) {
  return request({
    url: `${!isDev ? 'contract/' : ''}update`,
    method: 'post',
    data
  })
}

// 条款修改
export function updateClauseDetails(data) {
  return request({
    url: `${!isDev ? 'contract/' : ''}clause/update`,
    method: 'post',
    data
  })
}

// 条款创建
export function addClauseDetails(data) {
  return request({
    url: `${!isDev ? 'contract/' : ''}clause/createClause`,
    method: 'post',
    data
  })
}

// 条款事件
export function changeContractStatus(data) {
  return request({
    url: `${!isDev ? 'contract/' : ''}clause/event/createEvent`,
    method: 'post',
    data
  })
}

// 条款删除
export function deleteClauseDetails(data) {
  return request({
    url: `${!isDev ? 'contract/' : ''}clause/delete`,
    method: 'post',
    data
  })
}

// 问卷详情
export function getQuestionnaireDetailsByConId(params) {
  return request({
    url: `${!isDev ? 'contract/' : ''}questionnaire/findConId`,
    method: 'get',
    params
  })
}

// 考核历史
export function getAssessmentHistoryByDate(params) {
  return request({
    url: `${!isDev ? 'contract/' : ''}questionnaire/findConId`,
    method: 'get',
    params
  })
}

// 考核日期是否存在
export function findAssessDate(params) {
  return request({
    url: `${!isDev ? 'contract/' : ''}questionnaire/findAssessDateByQueIdAndAssessDate`,
    method: 'get',
    params
  })
}

// 考核评价
export function answerQuestionnaire(data) {
  return request({
    url: `${!isDev ? 'contract/' : ''}questionnaire/answerQuestionnaire`,
    method: 'post',
    data
  })
}

// 问卷修改
export function updateQuestionnaireDetails(data) {
  return request({
    url: `${!isDev ? 'contract/' : ''}questionnaire/update`,
    method: 'post',
    data
  })
}

// 问卷删除
export function deleteQuestionnaire(data) {
  return request({
    url: `${!isDev ? 'contract/' : ''}questionnaire/delete`,
    method: 'post',
    data
  })
}

// 上传合同文件
export function uploadContractFile(data) {
  return request({
    url: `${!isDev ? 'contract/' : ''}uploadFile`,
    method: 'post',
    data,
    headers: {
      'Content-type': 'multipart/form-data'
    }
  })
}

// 下载合同文件
export function downloadContractFile(params) {
  return request({
    url: `${!isDev ? 'contract/' : ''}downFile`,
    method: 'get',
    params,
    headers: {
      'ResponseType': 'arraybuffer'
    }
  })
}

// 导出excel
export function exportToExcel(data) {
  return request({
    url: `${!isDev ? 'contract/' : ''}download`,
    method: 'post',
    data,
    headers: {
      'ResponseType': 'arraybuffer'
    }
  })
}

// questionnaireDetails
export function getEvaluationTableData() {
  return request({
    url: `${!isDev ? 'contract/' : ''}questionnaireDetails`,
    method: 'get'
  })
}

// 验证合同编码是否重复
export function checkContractIdExist(conId) {
  return request({
    url: `${!isDev ? 'contract/' : ''}findConIdByConId`,
    method: 'get',
    params: {
      conId
    }
  })
}

// 验证问卷名称是否重复
export function checkQuestionName(queName) {
  return request({
    url: `${!isDev ? 'contract/' : ''}questionnaire/findQueByQueName`,
    method: 'get',
    params: {
      queName
    }
  })
}

// 合同履约表执行情况
export function getContractPerformanceByConId(conId) {
  return request({
    url: `${!isDev ? 'contract/' : ''}contractPerformance`,
    method: 'get',
    params: {
      conId
    }
  })
}

// 合同履约表提交
export function performanceFormSubmit(data) {
  return request({
    url: `${!isDev ? 'contract/' : ''}updatePerformance`,
    method: 'post',
    data
  })
}

// 责任人
export function findContractResPerson() {
  return request({
    url: `${!isDev ? 'contract/' : ''}findContractResPerson`,
    method: 'get'
  })
}

// 发票列表
export function invoiceList(params) {
  return request({
    url: `${!isDev ? 'contract/' : ''}invoice/invoiceList`,
    method: 'get',
    params
  })
}

// 删除发票
export function deleteInvoice(data) {
  return request({
    url: `${!isDev ? 'contract/' : ''}invoice/deleteInvoice`,
    method: 'post',
    data
  })
}

// 添加发票
export function insertInvoice(data) {
  return request({
    url: `${!isDev ? 'contract/' : ''}invoice/insertInvoice`,
    method: 'post',
    data
  })
}

// 编辑发票
export function updateInvoice(data) {
  return request({
    url: `${!isDev ? 'contract/' : ''}invoice/updateInvoice`,
    method: 'post',
    data
  })
}
// 检查发票号码是否存在
export function checkPipelineNumExist(data) {
  return request({
    url: `${!isDev ? 'contract/' : ''}invoice/checkPipelineNumExist`,
    method: 'post',
    data
  })
}

// 所有发票列表
export function allInvoiceList(params) {
  return request({
    url: `${!isDev ? 'contract/' : ''}invoice/allInvoiceList`,
    method: 'get',
    params
  })
}

// 根据发票id查询详情
export function findInvoiceById(params) {
  return request({
    url: `${!isDev ? 'contract/' : ''}invoice/findInvoiceById`,
    method: 'get',
    params
  })
}

// 新增发票时输入金额check金额是否超出
export function checkInsertAmount(data) {
  return request({
    url: `${!isDev ? 'contract/' : ''}invoice/checkInsertAmount`,
    method: 'post',
    data
  })
}

// 修改发票时输入金额check金额是否超出接口
export function checkUpdateAmount(data) {
  return request({
    url: `${!isDev ? 'contract/' : ''}invoice/checkUpdateAmount`,
    method: 'post',
    data
  })
}
