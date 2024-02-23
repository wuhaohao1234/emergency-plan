import request from '@/utils/request'

// 文件模板保存修改
export function saveOrUpdate(data) {
  return request({
    url: '/system/fileTemplate/saveOrUpdate',
    method: 'post',
    data: data
  })
}

// 文件模板分页查询
export function pageList(query) {
  return request({
    url: '/system/fileTemplate',
    method: 'get',
    params: query
  })
}
// 根据id查询文件模板详情
export function getById(templateId) {
  return request({
    url: '/system/fileTemplate/getInfo/'+templateId,
    method: 'get',
  })
}
