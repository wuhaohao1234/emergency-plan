import request from '@/utils/request'

/**
 * 修编计划上报
 * @param query
 */

// 分页查询修编计划上报列表
export function plansList(query) {
  return request({
    url: '/plans/revision/report',
    method: 'get',
    params: query
  })
}

// 分页查询修编计划列表
export function plansRevisionList(query) {
  return request({
    url: '/plans/revision',
    method: 'get',
    params: query
  })
}


// 查询修编计划详细
export function getType(revisionId) {
  return request({
    url: '/plans/revision/' + revisionId,
    method: 'get'
  })
}

// 新增修编计划
export function addType(data) {
  return request({
    url: '/plans/revision',
    method: 'post',
    data: data
  })
}

// 修改修编计划
export function updateType(data) {
  return request({
    url: '/plans/revision',
    method: 'put',
    data: data
  })
}

// 删除修编计划
export function delType(revisionId) {
  return request({
    url: '/plans/revision/' + revisionId,
    method: 'delete'
  })
}

// 上报修编计划
export function reportType(data) {
  return request({
    url: '/plans/revision/report',
    method: 'post',
    data: data
  })
}

// 分页查询企业端修编计划列表
export function enRevisionPage(query) {
  return request({
    url: '/plans/revision/enRevisionPage',
    method: 'get',
    params: query
  })
}

// 查询企业端修编计划详细
export function enRevisionInfo(revisionId) {
  return request({
    url: '/plans/revision/enRevisionInfo/' + revisionId,
    method: 'get'
  })
}
// 修编计划导出
export function revisionExport(query) {
  return request({
    url: '/plans/revision/revisionExport',
    method: 'post',
    responseType:'blob',
    data:query
  })
}
// 企业端修编计划导出
export function enRevisionExport(query) {
  return request({
    url: '/plans/revision/enRevisionExport',
    method: 'post',
    responseType:'blob',
    data:query
  })
}
// 预案计划修编查询
export function planAmendmentQuery(query) {
  return request({
    url: '/plans/revision/planAmendment',
    method: 'get',
    params:query
  })
}
