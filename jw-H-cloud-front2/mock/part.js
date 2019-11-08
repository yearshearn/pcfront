import Mock from 'mockjs'
import {
  param2Obj
} from './utils'

export default {
  getPartStoreList: (res) => {
    const params = param2Obj(res.url)
    const items = Mock.mock({
      ['item|' + params.pageSize]: [{
        'code|+00001': 1,
        name: '@title(3,5)'
      }]
    })
    return {
      code: 0,
      data: {
        list: items,
        rowCount: 200
      }
    }
  }
}
