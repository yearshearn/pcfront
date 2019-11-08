import Mock from 'mockjs'
import {
  param2Obj
} from '../utils'

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
  },
  getPartDetailList: (res) => {
    const params = param2Obj(res.url)
    const items = Mock.mock({
      ['item|' + params.pageSize]: [{
        'code|+00001': 1,
        name: '@title(3,5)',
        category: '电料',
        type: '电料',
        cost: 56,
        unit: '个',
        supplier: '今维建筑科技',
        safe: 34
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
