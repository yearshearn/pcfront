import request from '@/utils/request'
export function getFileList(params) {
  return request({
    // url: '/user/login',
    url: '/wr/findFileList',
    method: 'get',
    params
  })
}

export function removeFile(params) {
  return request({
    // url: '/user/login',
    url: '/wr/deleteFile',
    method: 'get',
    params
  })
}
export function exportToExcel(params) {
  return request({
    // url: '/user/login',
    url: 'http://192.168.0.133:9083/jwkjPublicService/exportExcel',
    method: 'get',
    params
  })
}

