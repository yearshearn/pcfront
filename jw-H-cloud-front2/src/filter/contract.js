// 合同类型
export function conTypeNameFilter(status) {
  const statusMap = {
    'MT': '维保',
    'QA': '质保',
    'S': '服务',
    'E': '工程',
    '长期': '长期',
    '定期': '定期'
  }
  return statusMap[status] || '无'
}

// 合同优先级
export function conPriorityNameFilter(status) {
  const statusMap = {
    'low': '低',
    'mid': '中',
    'high': '高'
  }
  return statusMap[status] || '无'
}

// 合同状态
export function conStatusNameFilter(status) {
  const statusMap = {
    'AI': '已发出',
    'NI': '未发出'
  }
  return statusMap[status] || '无'
}

export function conPriorityFilter(status) {
  const statusMap = {
    'low': '',
    'mid': 'warning',
    'high': 'danger'
  }
  return statusMap[status]
}

export function conStatusFilter(status) {
  const statusMap = {
    'AI': 'success',
    'NI': ''
  }
  return statusMap[status]
}

export function isValidFilter(status) {
  const statusMap = {
    0: 'danger',
    1: 'success'
  }
  return statusMap[status]
}

// 是否有效
export function isValidNameFilter(status) {
  const statusMap = {
    0: '否',
    1: '是'
  }
  return statusMap[status] || '无'
}

export function conTypeFilter(status) {
  const statusMap = {
    'device': '设备',
    'pos': '地点'
  }
  return statusMap[status] || '无'
}

export function conBuildFilter(status) {
  const statusMap = {
    '748pro': '科研楼',
    '750pro': '测试用楼'
  }
  return statusMap[status] || '无'
}

export function conFloorFilter(status) {
  const statusMap = {
    'B1': '地下一层',
    'F1': '一层',
    'F2': '二层'
  }
  return statusMap[status] || '无'
}

export function conRoomFilter(status) {
  const statusMap = {
    '111': '监控室',
    '222': '控制室'
  }
  return statusMap[status] || '无'
}

// 循环方式
export function conModesFilter(status) {
  const statusMap = {
    'week': '周',
    'month': '月'
  }
  return statusMap[status] || '无'
}

// 星期
export function conIntervalWeekFilter(status) {
  const statusMap = {
    2: '周一',
    3: '周二',
    4: '周三',
    5: '周四',
    6: '周五',
    7: '周六',
    1: '周日'
  }
  return statusMap[status] || '无'
}
