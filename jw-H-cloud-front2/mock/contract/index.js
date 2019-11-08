import Mock from 'mockjs'
import {
  param2Obj
} from '../utils'
/**
 *  con_id	合同编码
    con_name	合同名称
    res_person	医院责任人
    con_type	合同类型
    date_start	开始日期
    date_end	结束日期
    supplier	设备供应商
    maint_dep	维保单位
    con_term	合同签约期限
    comment	说明
    con_contacts	合同编辑人
    maint_people	维保联系人
    maint_phone	维保联系人电话
    con_priority	合同优先级  高/中/低
    con_status	合同状态  已发出工单/未发出工单
 */
export default {
  getList: () => {
    const items = Mock.mock({
      'items|10': [{
        conId: '@string("upper", 5)' + '@string("number", 7)',
        conName: '@title(3,4)',
        resPerson: '@title(1)',
        'conType|1': ['MT', 'QT', 'S', 'E'],
        dateStart: '@date("yyyy-MM-dd")',
        dateEnd: '@date("yyyy-MM-dd")',
        supplier: '@title(1)',
        maintDep: '@title(1)',
        'conPriority|1': ['low', 'mid', 'high'],
        'conStatus|1': ['AI', 'NI'],
        'conTerm|1': [1, 2, 3],
        conContacts: '@title(1)',
        comment: '@sentence(100)'
      }]
    })
    return {
      code: 0,
      data: items
    }
  },
  getContractDetails: (res) => {
    const params = param2Obj(res.url)
    const item = Mock.mock({
      conId: params['cid'],
      conName: '@title(3,4)',
      resPerson: '@title(1)',
      'conType|1': ['MT', 'QT', 'S', 'E'],
      // dateStart: '@date("yyyy-MM-dd")',
      // dateEnd: '@date("yyyy-MM-dd")',
      supplier: '@title(1)',
      maintDep: '@title(1)',
      'conPriority|1': ['low', 'mid', 'high'],
      'conStatus|1': ['AI', 'NI'],
      'conTerm|1': [1, 2, 3],
      conContacts: '@title(1)',
      comment: '@sentence(100)',
      maintPeople: '@title(1)',
      maintPhone: '@string("number", 11)',
      // conName: null
      // resPerson: null
      // 'conType': null
      dateEnd: null,
      dateStart: null
      // supplier: null,
      // maintDep: null,
      // 'conPriority': null,
      // 'conStatus': null,
      // 'conTerm': null,
      // conContacts: null,
      // comment: null,
      // maintPeople: null,
      // maintPhone: null
    })
    return {
      code: 0,
      data: item
    }
  },
  getClauseDetails: (res) => {
    const params = param2Obj(res.url)
    const items = Mock.mock({
      'items|1-3': [{
        conId: params['cid'], // 合同编码
        claId: '@string("upper", 5)' + '@string("number", 7)', // 条款编码
        'claType|1': ['pos', 'device'], // 条款类型 地点/设备
        'modes|1': ['week', 'month'], // 循环方式 周,月 week/month
        'cirDate|1': [1, 2, 3, 4, 5], // 每周或每月的第几日
        'exeTimes|1': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // 执行次数
        'intervalTimes|1': [1, 2, 3, 4, 5], // 间隔次数
        claContent: '@sentence(200)', // 条款内容
        'places|1-3': [ // 关联的地点
          {
            'blid|1': ['748pro', '750pro'],
            'flid|1': ['B1', 'F1', 'F2'],
            'rmid|1': ['111', '222'],
            'device|1': ['B1-XFS-001', 'F1-KTJ-001', 'F1-KTJ-002', 'F2-KTJ-001']
          }
        ]
      }]
    })
    return {
      code: 0,
      data: items
    }
  },
  getQuestionnaireDetails: (res) => {
    const params = param2Obj(res.url)
    const qid = params['qid'] || '@string("upper", 5)' + '@string("number", 7)'
    // console.log(qid)
    const item = Mock.mock({
      queId: qid, // 问卷编码
      queName: '@title(3,4)', // 问卷名称
      'problems|3-7': [{ // 问卷问题组
        proId: '@string("upper", 5)' + '@string("number", 7)', // 问题编码
        proProblem: '@title(3,4)', // 问卷问题
        'answers|2-5': [{ // 问题答案组
          ansId: '@string("upper", 5)' + '@string("number", 7)', // 答案编码
          ansAnswer: '@title(1)' // 答案名称
        }]
      }]

    })
    return {
      code: 0,
      data: item
    }
  },
  getQuestionnairesList: () => {
    const item = Mock.mock({
      'items|10': [{
        queId: '@string("upper", 5)' + '@string("number", 7)', // 问卷编码
        queName: '@title(3,4)', // 问卷名称
        'isValid|1': ['N', 'Y'], // 是否生效
        editor: '@title(1)', // 编辑人
        operationDaytime: '@date("yyyy-MM-dd hh:mm:ss")', // 最后更改时间
        'problems|3-7': [{ // 问卷问题组
          proId: '@string("upper", 5)' + '@string("number", 7)', // 问题编码
          proProblem: '@title(3,4)', // 问卷问题
          'answers|2-5': [{ // 问题答案组
            ansId: '@string("upper", 5)' + '@string("number", 7)', // 答案编码
            ansAnswer: '@title(1)' // 答案名称
          }]
        }]
      }]
    })
    return {
      code: 0,
      data: item
    }
  },
  getEvaluationTableData: () => {
    const item = Mock.mock({
      'items|2-12': [{
        date: '@date("yyyy年MM月dd日")',
        'workload|1-100': 1,
        'staff|2-10': 1,
        'turnover|11111-33333': 1,
        'grade|20-120': 1
      }]
    })
    return {
      code: 0,
      data: item
    }
  }
}
