import request from '@/utils/request'
/**
 * 文件
 */
const serverPath = '/file'

// 查看文件
export function viewFile(data) {
  return request({
    url: serverPath + '/view',
    method: 'get',
    params: data,
    responseType:'blob',
  })
}
// 查看文件
export function getLocalUrl(data) {
  return request({
    url: serverPath + '/getLocalUrl',
    method: 'post',
    data: data,
  })
}

// 查看企业端文件
export function enFileView(data) {
  return request({
    url: serverPath + '/enFileView',
    method: 'get',
    params: data,
    responseType:'blob',
  })
}
