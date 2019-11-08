import Mock from 'mockjs'
import userAPI from './user'
import tableAPI from './table'

import contractAPI from './contract'
// import partAPI from './part'
import workorderAPI from './workorder'

// Fix an issue with setting withCredentials = true, cross-domain request lost cookies
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}
Mock.setup({
  timeout: '350-600'
})

// User
// Mock.mock(/\/user\/login/, 'post', userAPI.login)
// Mock.mock(/\/user\/info/, 'get', userAPI.getInfo)
Mock.mock(/\/user\/logout/, 'post', userAPI.logout)

// Table
Mock.mock(/\/table\/list/, 'get', tableAPI.list)

// contract
Mock.mock(/\/contract\/list/, 'get', contractAPI.getList)
Mock.mock(/\/contract\/contractDetails/, 'get', contractAPI.getContractDetails)
Mock.mock(/\/contract\/clauseDetails/, 'get', contractAPI.getClauseDetails)
Mock.mock(/\/contract\/questionnaireDetails/, 'get', contractAPI.getQuestionnaireDetails)
Mock.mock(/\/contract\/questionnairesList/, 'get', contractAPI.getQuestionnairesList)
// Mock.mock('192.168.0.233:9080/api/contract/list/', 'get', contractAPI.getList)
Mock.mock(/\/contract\/details/, 'get', contractAPI.getDetails)

Mock.mock(/\/testData\/table/, 'get', contractAPI.getEvaluationTableData)

// Mock.mock(/\/part\/storeList/, 'get', partAPI.getPartStoreList)
Mock.mock(/\/workorder\/list/, 'get', workorderAPI.getList)
Mock.mock(/\/workorder\/details/, 'get', workorderAPI.getDetails)

export default Mock
