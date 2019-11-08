import Mock from 'mockjs'
import {
  param2Obj
} from '../utils'

export default {
  getList: (req) => {
    console.log(req)
    // window.open(req.url)
    const items = Mock.mock({
      'items|10': [{
        wrId: '@string("upper", 5)' + '@string("number", 7)',
        position: '@title(3,4)',
        description: '@title(1)',
        'repairType|1': [1, 2, 3],
        'problemType|1': [1, 2, 3],
        'cfId': '@string("upper", 5)',
        'submitter': '@string("upper", 5)',
        device: '@title(1)',
        'workGroup': '@title(1)',
        'document': '@title(1)',
        'workTpye|1': [1, 2, 3],
        'rework|1': [1, 2, 3],
        'priority|1': [1, 2, 3],
        requestTime: '@date("yyyy-MM-dd")',
        completeTime: '@date("yyyy-MM-dd")'
      }]
    })
    return {
      code: 0,
      data: {
        list: items,
        rowCount: Number((Math.random() * 50 + 50).toFixed(0))
      }
    }
  },
  getDetails: () => {
    const item = Mock.mock({
      wrId: '@string("upper", 5)' + '@string("number", 7)',
      position: '@title(3,4)',
      description: '@title(1)',
      'repairType|1': [1, 2, 3],
      'problemType|1': [1, 2, 3],
      'assignTo': '@string("upper", 5)',
      'submitter': '@string("upper", 5)',
      device: '@title(1)',
      'workGroup': '@title(1)',
      'document': '@title(1)',
      'workTpye|1': [1, 2, 3],
      'rework|1': [1, 2, 3],
      'priority|1': [1, 2, 3],
      requestTime: '@date("yyyy-MM-dd")',
      completeTime: '@date("yyyy-MM-dd")'
    })
    return {
      code: 0,
      data: item
    }
  }
}
