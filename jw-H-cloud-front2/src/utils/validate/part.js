
export async function checkparams(name, value, length, callback) {
  if (value) {
    if (length > 0) {
      if (value.length > length) {
        callback(name + '长度不能超过' + length)
      } else {
        callback(true)
      }
    }
  } else {
    callback(name + '不能为空')
  }
}
export async function checkparamsPatten(name, value, patten, callback) {
  if (value) {
    if (patten) {
      if (patten.test(value)) {
        callback(true)
      } else {
        callback('false')
      }
    }
  } else {
    callback('false')
  }
}
