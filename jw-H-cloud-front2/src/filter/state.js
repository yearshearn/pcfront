export function typeFilter(state) {
  let type = ''
  switch (state) {
    case 0:
      type = 'danger'
      break
    case 1:
      type = 'success'
      break
    default:
      type = ''
      break
  }
  return type
}

export function stateFilter(state) {
  let val = ''
  switch (state) {
    case 0:
      val = '禁用'
      break
    case 1:
      val = '启用'
      break
    default:
      val = '无'
      break
  }
  return val
}

