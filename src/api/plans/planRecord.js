import request from '@/utils/request'

/**
 * 预案审核
 */
const serverPath = '/plans'

// 未备案申报查询
export function noRecordQuery(query) {
  return request({
    url: serverPath + '/plans/record/currentDept',
    method: 'get',
    params: query
  })
}

// 已备案申报查询
export function recordQuery(query) {
  return request({
    url: serverPath + '/plans/record/currentDepts',
    method: 'get',
    params: query
  })
}

// 备案申报分页查询
export function pageList(query) {
  return request({
    url: serverPath + '/plans/record',
    method: 'get',
    params: query
  })
}

// 获取备案详情
export function getRecordInfo(recordId) {
  return request({
    url: serverPath + '/plans/record/' + recordId,
    method: 'get',
  })
}

// 添加备案
export function addRecord(planIds) {
  return request({
    url: serverPath + '/plans/record/' + planIds,
    method: 'post',
  })
}

// 编辑备案
export function editRecord(data) {
  return request({
    url: serverPath + '/plans/record/save',
    method: 'post',
    data: data
  })
}

// 备案上报
export function recordReport(data) {
  return request({
    url: serverPath + '/plans/record/report',
    method: 'post',
    data: data
  })
}

// 删除备案
export function removeRecord(recordIds) {
  return request({
    url: serverPath + '/plans/record/' + recordIds,
    method: 'delete',
  })
}

// 审核数据分页查询
export function auditPage(query) {
  return request({
    url: serverPath + '/plans/record/audit',
    method: 'get',
    params: query
  })
}

// 预案审核退回
export function auditReturned(data) {
  return request({
    url: serverPath + '/plans/record/audit/returned',
    method: 'put',
    data: data
  })
}
// 预案审核通过
export function auditReviewed(data) {
  return request({
    url: serverPath + '/plans/record/audit/reviewed',
    method: 'put',
    data: data
  })
}
// 预案修订查询
export function amendmentPage(query) {
  return request({
    url: serverPath + '/plans/record/amendment',
    method: 'get',
    params: query
  })
}
// 预案衔接列表查询
export function connectionList(query) {
  return request({
    url: serverPath + '/plans/record/connection/list',
    method: 'get',
    params: query
  })
}
// 预案衔接
export function connection(data) {
  return request({
    url: serverPath + '/plans/record/connection',
    method: 'post',
    data: data
  })
}

// 已有预案备案
export function existPlansRecord(data) {
  return request({
    url: serverPath + '/plans/record/existPlansRecord',
    method: 'post',
    data: data
  })
}

// 企业端备案分页查询
export function enRecordAuditPage(query) {
  return request({
    url: serverPath + '/plans/record/enRecordAuditPage',
    method: 'get',
    params: query
  })
}

// 获取企业端备案详情
export function enRecordAuditInfo(recordId) {
  return request({
    url: serverPath + '/plans/record/enRecordAuditInfo/' + recordId,
    method: 'get',
  })
}

// 企业端预案衔接列表查询
export function enConnectionList(query) {
  return request({
    url: serverPath + '/plans/record/enConnectionList',
    method: 'get',
    params: query
  })
}

// 企业端备案审核退回
export function enAuditReturned(data) {
  return request({
    url: serverPath + '/plans/record/enAuditReturned',
    method: 'post',
    data: data
  })
}
// 企业端备案审核通过
export function enAuditReviewed(data) {
  return request({
    url: serverPath + '/plans/record/enAuditReviewed',
    method: 'post',
    data: data
  })
}
//备案登记表下载
export function downloadRecordRegister(data) {
  return request({
    url: serverPath + '/plans/record/downloadRecordRegister',
    method: 'post',
    data: data,
    responseType:'blob',
  })
}
//备案申报表下载
export function downloadRecordDeclare(data) {
  return request({
    url: serverPath + '/plans/record/downloadRecordDeclare',
    method: 'post',
    data: data,
    responseType:'blob',
  })
}
// 根据预案id获取备案详情
export function findByPlanId(planId) {
  return request({
    url: serverPath + '/plans/record/findByPlanId/' + planId,
    method: 'get',
  })
}
