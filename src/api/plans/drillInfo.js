import request from '@/utils/request'

/**
 * 演练计划上报
 * @param query
 */

// 分页查询演练报告列表
export function plansList(query) {
  return request({
    url: '/plans/drill/info/report',
    method: 'get',
    params: query
  })
}

// 分页查询演练报告列表
export function drillInfoList(query) {
  return request({
    url: '/plans/drill/info',
    method: 'get',
    params: query
  })
}

// 查询演练报告详细
export function getType(drillId) {
  return request({
    url: '/plans/drill/info/' + drillId,
    method: 'get'
  })
}


// 新增演练报告
export function addType(data) {
  return request({
    url: '/plans/drill/info',
    method: 'post',
    data: data
  })
}

// 修改演练报告
export function updateType(data) {
  return request({
    url: '/plans/drill/info',
    method: 'put',
    data: data
  })
}

// 删除演练报告
export function delType(drillId) {
  return request({
    url: '/plans/drill/info/' + drillId,
    method: 'delete'
  })
}

// 上报类型
export function reportType(data) {
  return request({
    url: '/plans/drill/info/report',
    method: 'post',
    data: data
  })
}

// 查询预案关联演练报告
export function getDrillFile(planId) {
  return request({
    url: '/plans/drill/info/plan/' + planId,
    method: 'get'
  })
}

// 分页查询企业端演练报告列表
export function enDrillReportPage(query) {
  return request({
    url: '/plans/drill/info/enDrillReportPage',
    method: 'get',
    params: query
  })
}

// 查询企业端演练报告详细
export function enDrillReportInfo(drillId) {
  return request({
    url: '/plans/drill/info/enDrillReportInfo/' + drillId,
    method: 'get'
  })
}

// 演练报告导出
export function drillReportExport(query) {
  return request({
    url: '/plans/drill/info/drillReportExport',
    method: 'post',
    responseType: 'blob',
    data: query
  })
}
// 企业端演练报告导出
export function enDrillReportExport(query) {
  return request({
    url: '/plans/drill/info/enDrillReportExport',
    method: 'post',
    responseType: 'blob',
    data: query
  })
}
