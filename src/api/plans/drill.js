import request from '@/utils/request'

/**
 * 演练计划上报
 * @param query
 */

// 分页查询演练计划列表
export function plansList(query) {
  return request({
    url: '/plans/drill/report',
    method: 'get',
    params: query
  })
}

// 分页查询演练计划列表
export function plansDrillList(query) {
  return request({
    url: '/plans/drill',
    method: 'get',
    params: query
  })
}
//查询演练计划数量
export function getmonthDrillNum() {
  return request({
    url: '/plans/drill/monthDrillNum',
    method: 'get',
  })
}
//统计企业演练计划数量
export function getmonthDrillQyNum() {
  return request({
    url: '/plans/drill/enMonthStatisticsNum',
    method: 'get',
  })
}
//查询年度演练计划数量
export function getyearStatisticsNum() {
  return request({
    url: '/plans/drill/yearStatisticsNum',
    method: 'get',
  })
}
//统计企业年度演练计划数量
export function getyearStatisticsQyNum() {
  return request({
    url: '/plans/drill/enYearStatisticsNum',
    method: 'get',
  })
}
// 查询演练计划详细
export function getType(drillId) {
  return request({
    url: '/plans/drill/' + drillId,
    method: 'get'
  })
}

// 新增演练计划
export function addType(data) {
  return request({
    url: '/plans/drill',
    method: 'post',
    data: data
  })
}

// 修改演练计划
export function updateType(data) {
  return request({
    url: '/plans/drill',
    method: 'put',
    data: data
  })
}

// 删除演练计划
export function delType(drillId) {
  return request({
    url: '/plans/drill/' + drillId,
    method: 'delete'
  })
}

// 上报演练计划
export function reportType(data) {
  return request({
    url: '/plans/drill/report',
    method: 'post',
    data: data
  })
}

// 分页查询企业端演练计划列表
export function enDrillPage(query) {
  return request({
    url: '/plans/drill/enDrillPage',
    method: 'get',
    params: query
  })
}


// 查询企业端演练计划详细
export function enDrillInfo(drillId) {
  return request({
    url: '/plans/drill/enDrillInfo/' + drillId,
    method: 'get'
  })
}

// 演练计划导出
export function drillExport(query) {
  return request({
    url: '/plans/drill/drillExport',
    method: 'post',
    responseType:'blob',
    data:query
  })
}
// 企业端演练计划导出
export function enDrillExport(query) {
  return request({
    url: '/plans/drill/enDrillExport',
    method: 'post',
    responseType:'blob',
    data:query
  })
}

//资讯列表
export function getNews() {
  return request({
    url: '/plans/linkInfo/list',
    method: 'get'
  })
}
