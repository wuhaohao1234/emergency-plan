import request from '@/utils/request'

/**
 * 预案审核
 */
const serverPath = '/plans'

// 分页查询预案申报列表
export function pageList(query) {
  return request({
    url: serverPath + '/plans/report',
    method: 'get',
    params: query
  })
}

// 未申报预案查询
export function currentDept(query) {
  return request({
    url: serverPath + '/plans/audit/currentDept',
    method: 'get',
    params: query
  })
}

// 预案申报
export function planReport(planId) {
  return request({
    url: serverPath + '/plans/report/' + planId,
    method: 'post',
  })
}

// 预案申报保存
export function reportSave(data) {
  return request({
    url: serverPath + '/plans/report/save',
    method: 'post',
    data: data
  })
}

// 预案申报提交
export function reportSubmit(data) {
  return request({
    url: serverPath + '/plans/report/report',
    method: 'post',
    data: data
  })
}

// 预案申报查询
export function findAuditById(id) {
  return request({
    url: serverPath + '/plans/report/' + id,
    method: 'get',
  })
}
// 根据planId查询预案申报详情
export function findByPlanId(id) {
  return request({
    url: serverPath + '/plans/report/findByPlanId/' + id,
    method: 'get',
  })
}

// 删除预案申报
export function delAuditById(id) {
  return request({
    url: serverPath + '/plans/report/' + id,
    method: 'delete',
  })
}

// 预案审核分页
export function auditPage(query) {
  return request({
    url: serverPath + '/plans/report/audit',
    method: 'get',
    params: query
  })
}
// 预案审核退回
export function auditReturned(data) {
  return request({
    url: serverPath + '/plans/report/audit/returned',
    method: 'put',
    data: data
  })
}
// 预案审核通过
export function auditReviewed(data) {
  return request({
    url: serverPath + '/plans/report/audit/reviewed',
    method: 'put',
    data: data
  })
}
//审核意见表下载
export function downloadCommentForm(data) {
  return request({
    url: serverPath + '/plans/report/audit/downloadCommentForm',
    method: 'post',
    data: data,
    responseType:'blob',
  })
}
//审核送审表下载
export function downloadSubmissionForm(data) {
  return request({
    url: serverPath + '/plans/report/audit/downloadSubmissionForm',
    method: 'post',
    data: data,
    responseType:'blob',
  })
}


