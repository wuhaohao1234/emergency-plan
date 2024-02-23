import request from "@/utils/request";

const serverPath = '/plans'

// 资讯链接保存、修改
export function saveOrUpdate(data) {
  return request({
    url: serverPath + '/linkInfo',
    method: 'post',
    data: data
  })
}

// 资讯链接分页查询
export function pageList(query) {
  return request({
    url: serverPath + '/linkInfo',
    method: 'get',
    params: query
  })
}

// 查询资讯链接详情
export function getInfo(id) {
  return request({
    url: serverPath + '/linkInfo/getInfo/' + id,
    method: 'get',
  })
}

// 查询资讯链接详情
export function deleteLink(id) {
  return request({
    url: serverPath + '/linkInfo/' + id,
    method: 'delete',
  })
}
