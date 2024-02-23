import request from '@/utils/request'

/**
 * 预案修编
 */
const serverPath = '/plans'

// 分页查询预案列表
export function pageList(query) {
  return request({
    url: serverPath + '/plans',
    method: 'get',
    params: query
  })
}
// 查询未添加预案模板列表
export function getUnAddTemplatePlanList(query) {
  return request({
    url: serverPath + '/plans/unAddTemplate',
    method: 'get',
    params: query
  })
}
// 新增预案/修改预案
export function saveOrUpdate(data) {
  return request({
    url: serverPath + '/plans',
    method: 'post',
    data: data
  })
}

// 删除预案
export function delPlans(planId) {
  return request({
    url: serverPath + '/plans/' + planId,
    method: 'delete'
  })
}

// 添加指挥中心人员
export function addPeoples(data) {
  return request({
    url: serverPath + '/plans/organizations/peoples',
    method: 'post',
    data: data
  })
}

// 查询组织机构
export function getOrganizations(planId) {
  return request({
    url: serverPath + '/plans/organizations/' + planId,
    method: 'get',
  })
}

// 新增机构组织
export function addOrganizations(data) {
  return request({
    url: serverPath + '/plans/organizations',
    method: 'post',
    data: data
  })
}

// 编辑机构组织
export function editOrganizations(data) {
  return request({
    url: serverPath + '/plans/organizations',
    method: 'put',
    data: data
  })
}

// 删除机构组织
export function delOrganizations(orgId) {
  return request({
    url: serverPath + '/plans/organizations/' + orgId,
    method: 'delete',
  })
}

// 查询机构组织详情
export function getOrganizationsInfo(orgId) {
  return request({
    url: serverPath + '/plans/organizations/detail/' + orgId,
    method: 'get',
  })
}

// 查询预案详细信息
export function getPlanInfo(planId) {
  return request({
    url: serverPath + '/plans/' + planId,
    method: 'get',
  })
}

// 分页查询本部门预案列表
export function currentDept(query) {
  return request({
    url: serverPath + '/plans/currentDept',
    method: 'get',
    params: query
  })
}

// 查询本部门已备案预案列表
export function currentAuditDept(query) {
  return request({
    url: serverPath + '/plans/record/currentDepts',
    method: 'get',
    params: query
  })
}

// 添加预案事件情况
export function addOrEditEvents(data) {
  return request({
    url: serverPath + '/plans/addOrEditEvents',
    method: 'post',
    data: data
  })
}


//查询组织机构人员集合信息
export function getOrgPeople(planOrgId) {
  return request({
    url: serverPath + '/plans/organizations/peoples/' + planOrgId,
    method: 'get',
  })
}

//删除组织机构信息
export function removeOrganization(planOrgId) {
  return request({
    url: serverPath + '/organization/' + planOrgId,
    method: 'delete',
  })
}

//查询非当前预案组织机构人员集合信息
export function getOtherPeople(planOrgId) {
  return request({
    url: serverPath + '/plans/plan/userIds/' + planOrgId,
    method: 'get',
  })
}

//预案修订
export function planAmendment(data) {
  return request({
    url: serverPath + '/plans/revision',
    method: 'put',
    data: data
  })
}

//获取修订历史记录
export function getHistory(beforeChangeId) {
  return request({
    url: serverPath + '/plans/history/' + beforeChangeId,
    method: 'get',
  })
}


// 预案评估预案选择
export function currentAssessDept(query) {
  return request({
    url: serverPath + '/plans/assess/currentDept',
    method: 'get',
    params: query
  })
}

// 预案综合查询
export function synthesisQuery(query) {
  return request({
    url: serverPath + '/plans/synthesisQuery',
    method: 'get',
    params: query
  })
}

// 企业端预案综合查询
export function enPlansSynthesisQuery(query) {
  return request({
    url: serverPath + '/plans/enPlansSynthesisQuery',
    method: 'get',
    params: query
  })
}

// 查询企业端组织机构
export function enPlanOrganizations(planId) {
  return request({
    url: serverPath + '/plans/enPlanOrganizations/' + planId,
    method: 'get',
  })
}

// 查询企业端预案详细信息
export function enPlanInfo(planId) {
  return request({
    url: serverPath + '/plans/enPlanInfo/' + planId,
    method: 'get',
  })
}


//查询企业端组织机构人员集合信息
export function enOrgPeoples(planOrgId) {
  return request({
    url: serverPath + '/plans/enOrgPeoples/' + planOrgId,
    method: 'get',
  })
}

// 查询企业端机构组织详情
export function enOrgDetail(orgId) {
  return request({
    url: serverPath + '/plans/enOrgDetail/' + orgId,
    method: 'get',
  })
}

// 获取未进行修编计划上报的预案
export function unReportPlans(planId) {
  return request({
    url: serverPath + '/plans/unReportPlans',
    method: 'get',
    params: {planId: planId ? planId : 0}
  })
}
