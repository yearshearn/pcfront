import {
  checkContractIdExist as checkConIdFunc,
  checkQuestionName as checkQueNameFunc
} from '@/api/contract'

export async function checkContractIdExist(rule, value, callback) {
  try {
    const r = await checkConIdFunc(value)
    if (r['data'] === 0) {
      callback()
    } else {
      callback(new Error('合同编码已存在'))
    }
  } catch (e) {
    callback(new Error('网络故障，请稍后重试'))
  }
}

export async function checkQuestionName(rule, value, callback) {
  try {
    const r = await checkQueNameFunc(value)
    if (r['data'] === 0) {
      callback()
    } else {
      callback(new Error('问卷名称已存在'))
    }
  } catch (e) {
    callback(new Error('网络故障，请稍后重试'))
  }
}
