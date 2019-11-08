export function accStatusFilter(status) {
  let val = ''
  switch (status) {
    case 0:
      val = 'danger'
      break
    case 1:
      val = 'success'
      break
    default:
      val = 'danger'
  }
  return val
}

export function accStatusNameFilter(status) {
  let val = ''
  switch (status) {
    case 0:
      val = '禁用'
      break
    case 1:
      val = '正常'
      break
    default:
      val = '无'
  }
  return val
}
