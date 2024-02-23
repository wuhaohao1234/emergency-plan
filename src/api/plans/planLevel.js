import request from '@/utils/request'

/**
 * 预案事件级别、预警级别、响应级别
 */
const serverPath = '/plans'

// 级别批量保存或修改
export function saveOrUpdateBatch(data) {
  return request({
    url: serverPath + '/level/saveOrUpdateBatch',
    method: 'post',
    data: data
  })
}

// 根据预案id、级别类型级别查询详情
export function findLevelInfo(planId,levelType) {
  return request({
    url: serverPath + '/level/findLevelInfo',
    method: 'get',
    params: {planId,levelType}
  })
}

// 企业端根据预案id、级别类型级别查询详情
export function enFindLevelInfo(planId,levelType) {
  return request({
    url: serverPath + '/level/enFindLevelInfo',
    method: 'get',
    params: {planId,levelType}
  })
}

//根据id删除预案级别信息
export function deleteById(levelId) {
  return request({
    url: serverPath + '/level/deleteById/'+levelId,
    method: 'delete',
  })
}
