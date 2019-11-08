import variables from '@/styles/variables.scss'

export function tableStripeCallBack({ row, rowIndex }) {
  if (rowIndex % 2 === 0) {
    const str = `background: ${variables.tableHeaderBg}`
    // console.log(str)
    return str
  } else {
    return ''
  }
}

export function tableHeaderStyleCallBack(ttt) {
  const str = `font-size: 20px;color:black;`
  // console.log(str)
  return str
}
