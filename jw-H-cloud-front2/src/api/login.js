import request from '@/utils/request'

// 登陆
export function login(username, password, code, requestId) {
  return request({
    // url: '/user/login',
    url: 'user/login',
    method: 'post',
    data: {
      userName: username,
      userPwd: password,
      code: code,
      requestId
    }
  })
}

// 验证码图片
export function verificationCode() {
  return request({
    url: 'user/code',
    method: 'get'
  })
}

export function getInfo(userId) {
  return request({
    url: 'user/info',
    method: 'get',
    params: { userId: userId }
  })
}

// 退出
export function logout() {
  return request({
    url: 'user/logout',
    method: 'post'
  })
}
export function getCode() {
  return request({
    url: 'user/code',
    method: 'get'
  })
}

export function testToken() {
  return request({
    url: 'user/',
    method: 'get'
  })
}
