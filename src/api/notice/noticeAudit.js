import request from "@/utils/request";

/**
 * 通知列表
 */
const serverPath = '/notice'

export function getNoticeAuditInfo(query) {
  return request({
    url: serverPath + '/release/list',
    method: 'get',
    params: query
  })
}
export function getNoticeAuditList(query) {
  return request({
    url: serverPath + '/audit/list',
    method: 'get',
    params: query
  })
}
export function getNoticeAuditDetail(id) {
  return request({
    url: serverPath + '/' + id,
    method: 'get'
  })
}
export function delNoticeAuditInfo(data) {
  return request({
    url: serverPath,
    method: 'delete',
    data: data
  })
}
export function delNoticeAuditList(id) {
  return request({
    url: serverPath + '/' + id,
    method: 'delete',
  })
}
export function retuenNoticeAuditList(id) {
  return request({
    url: serverPath + '/withdrawn/' + id,
    method: 'put',
  })
}
export function retuenNoticeAudit(id) {
  return request({
    url: serverPath + '/returned/' + id,
    method: 'put',
  })
}
export function retuenAllNoticeAuditList(id) {
  return request({
    url: serverPath + '/returned/batch/' + id,
    method: 'put',
  })
}
export function pushAllNoticeAuditList(id) {
  return request({
    url: serverPath + '/published/batch/' + id,
    method: 'put',
  })
}
export function pushNoticeAuditList(id) {
  return request({
    url: serverPath + '/published/' + id,
    method: 'put',
  })
}
export function publishNoticeAuditList(data) {
  return request({
    url: serverPath + '/auditing/edit',
    method: 'put',
    data: data,
  })
}
export function commitNoticeAuditInfo(data) {
  return request({
    url: serverPath + '/auditing/add',
    method: 'post',
    data: data
  })
}
export function saveNoticeAuditInfo(data) {
  return request({
    url: serverPath + '/draft/add',
    method: 'post',
    data: data
  })
}
export function getNoticeAuditingCount(query) {
  return request({
    url: serverPath + '/auditing/count',
    method: 'get',
    params: query
  })
}
