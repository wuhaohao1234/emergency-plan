import request from "@/utils/request";
/**
 * 通知
 */
const serverPath = '/notice'
// 获取首页通知列表
export function getNoticeInfo(id) {
  return request({
    url: serverPath + '/list/list/' + id,
    method: 'get'
  })
}
export function getNoticeInfoList(query) {
  return request({
    url: serverPath + '/list/list',
    method: 'get',
    params: query
  })
}
// 全部标为已读
export function updateNoticeAllReadStatus() {
  return request({
    url: serverPath + '/list/setReadAll',
    method: 'put',
  })
}
//批量标记为已读/未读
export function updateNoticeReadStatus(data) {
  return request({
    url: serverPath + '/list/isRead',
    method: 'put',
    data: data
  })
}
//批量标星/取消标星
export function updateNoticeStarStatus(data) {
  return request({
    url: serverPath + '/list/isStar',
    method: 'put',
    data: data
  })
}
// 获取通知详情
export function getNoticeDeatil(noticeId) {
  return request({
    url: serverPath + '/list/' + noticeId,
    method: 'get'
  })
}
// 批量删除
export function delNoticeAll(noticeIds) {
  return request({
    url: serverPath + '/list/' + noticeIds,
    method: 'delete'
  })
}
