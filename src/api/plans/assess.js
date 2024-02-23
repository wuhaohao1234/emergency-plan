import request from '@/utils/request'

/**
 * 演练计划上报
 * @param query
 */

// 分页查询预案评估列表
export function plansList(query) {
  return request({
    url: '/plans/plans/assess',
    method: 'get',
    params: query
  })
}

// 分页查询预案评估列表
export function assessList(query) {
  return request({
    url: '/plans/plans/assess/audit',
    method: 'get',
    params: query
  })
}


// 查询预案评估详细
export function getType(assessId) {
  return request({
    url: '/plans/plans/assess/' + assessId,
    method: 'get'
  })
}

// 新增预案评估
export function addType(data) {
  return request({
    url: '/plans/plans/assess/save',
    method: 'post',
    data: data
  })
}

// 评估报告建议
export function adviceType(data) {
  return request({
    url: '/plans/plans/assess/advice',
    method: 'post',
    data: data
  })
}
// 评估报告确定
export function confirmAssess(data) {
  return request({
    url: '/plans/plans/assess/confirmAssess',
    method: 'post',
    data: data
  })
}
// 企业端评估报告确定
export function enConfirmAssess(data) {
  return request({
    url: '/plans/plans/assess/enConfirmAssess',
    method: 'post',
    data: data
  })
}

// 修改预案评估
export function updateType(assessId) {
  return request({
    url: '/plans/plans/assess/confirm/' + assessId,
    method: 'put',
  })
}

// 删除字典类型
export function delType(assessId) {
  return request({
    url: '/plans/plans/assess/' + assessId,
    method: 'delete'
  })
}

// 上报类型
export function reportType(data) {
  return request({
    url: '/plans/plans/assess/report',
    method: 'post',
    data: data
  })
}

// 查询预案评估详细
export function getDrillInfoFile(planId) {
  return request({
    url: '/plans/plans/assess/dillReportFile/' + planId,
    method: 'get'
  })
}


// 企业端分页查询预案评估列表
export function enAssessPage(query) {
  return request({
    url: '/plans/plans/assess/enAssessPage',
    method: 'get',
    params: query
  })
}


// 企业端查询预案评估详细
export function enAssessInfo(assessId) {
  return request({
    url: '/plans/plans/assess/enAssessInfo/' + assessId,
    method: 'get'
  })
}

// 企业端评估报告建议
export function enAssessAdvice(data) {
  return request({
    url: '/plans/plans/assess/enAssessAdvice',
    method: 'post',
    data: data
  })
}
// 预案评估修订分页查询
export function assessAmendmentQuery(query) {
  return request({
    url: '/plans/plans/assess/assessAmendmentPage',
    method: 'get',
    params: query
  })
}
