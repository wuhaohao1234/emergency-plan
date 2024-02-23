import request from '@/utils/request'

/**
 * 专家管理
 * @param query
 */

// 分页查询专家列表
export function getExpertsList(query) {
  return request({
    url: '/plans/experts',
    method: 'get',
    params: query
  })
}

// 分页查询预案列表
export function plansDrillList(query) {
  return request({
    url: '/plans/drill',
    method: 'get',
    params: query
  })
}


// 查询预案详细
export function getType(drillId) {
  return request({
    url: '/plans/drill/' + drillId,
    method: 'get'
  })
}

export function getExpertsDetail(phoneNumber) {
  return request({
    url: '/plans/experts/' + phoneNumber,
    method: 'get'
  })
}

// 新增预案
export function addType(data) {
  return request({
    url: '/plans/drill',
    method: 'post',
    data: data
  })
}

// 修改预案
export function updateType(data) {
  return request({
    url: '/plans/drill',
    method: 'put',
    data: data
  })
}

// 删除字典类型
export function delType(drillId) {
  return request({
    url: '/plans/drill/' + drillId,
    method: 'delete'
  })
}

// 上报类型
export function reportType(data) {
  return request({
    url: '/plans/drill/report',
    method: 'post',
    data: data
  })
}

// 分页查询企业端专家列表
export function enExpertAuthPage(query) {
  return request({
    url: '/plans/experts/enExpertAuthPage',
    method: 'get',
    params: query
  })
}
// 查询企业端专家详情
export function enExpertAuthInfo(expertId) {
  return request({
    url: '/plans/experts/enExpertAuthInfo/'+expertId,
    method: 'get',
  })
}
//认证企业端专家
export function enExpertAuth(expertId) {
  return request({
    url: '/plans/experts/enExpertAuth/'+expertId,
    method: 'get',
  })
}

//动态分页查询企业端专家履历
export function enExpertResumePage(query) {
  return request({
    url: '/plans/expert/resume/enExpertResumePage',
    method: 'get',
    params:query
  })
}

//查询企业端专家履历详情
export function enExpertResumeInfo(resumeId) {
  return request({
    url: '/plans/expert/resume/enExpertResumeInfo/'+resumeId,
    method: 'get',
  })
}

//确认企业端专家履历
export function enExpertResumeConfirm(resumeId,status) {
  return request({
    url: '/plans/expert/resume/enExpertResumeConfirm',
    method: 'get',
    params:{
      expertResumeId:resumeId,
      status:status
    }
  })
}

// 企业端专家数据导出
export function enExpertExport(query) {
  return request({
    url: '/plans/experts/enExpertExport',
    method: 'get',
    responseType:'blob',
    params:query
  })
}
