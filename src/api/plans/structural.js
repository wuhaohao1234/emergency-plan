import request from "@/utils/request";

const serverPath = '/plans'

// 模板保存、修改
export function saveStructrual(data) {
  return request({
    url: serverPath + '/structural/template/saveOrUpdate',
    method: 'post',
    data: data
  })
}

export function saveChapter(data) {
  return request({
    url: serverPath + '/structural/chapter/saveOrUpdate',
    method: 'post',
    data: data
  })
}

// 模板分页查询
export function getStructrualTemplate(query) {
  return request({
    url: serverPath + '/structural/template',
    method: 'get',
    params: query
  })
}

// 未禁用模板查询
export function getTemplate(query) {
  return request({
    url: serverPath + '/structural/template/list',
    method: 'get',
    params: query
  })
}

// 预案模板查询详情
export function getPlanTemplate(templateId) {
  return request({
    url: serverPath + '/structural/template/plan/' + templateId,
    method: 'get',
  })
}

// 查询模板详情
export function getTemplateDetail(templateId) {
  return request({
    url: serverPath + '/structural/template/' + templateId,
    method: 'get',
  })
}

// 模板章节保存、修改

export function saveChapterTemplate(data) {
  return request({
    url: serverPath + '/plan/structural/chapter/saveOrUpdate',
    method: 'post',
    data: data
  })
}

// 预案模板状态修改
export function saveTemplateStatus(data) {
  return request({
    url: serverPath + '/structural/template/updateStatus',
    method: 'put',
    data: data
  })
}

//预案模板结构化分页查询
export function getStructuralTemplate(query) {
  return request({
    url: serverPath + '/structural/template/plan',
    method: 'get',
    params: query
  })
}

// 删除模板
export function delStructuralTemplate(templateId) {
  return request({
    url: serverPath + '/structural/template/' + templateId,
    method: 'delete',
  })
}

// 删除章节
export function delStructuralChapter(chapterId) {
  return request({
    url: serverPath + '/structural/chapter/' + chapterId,
    method: 'delete',
  })
}

// 根据选择的预案及模板复制章节
export function getcopyChapter(query) {
  return request({
    url: serverPath + '/plan/structural/chapter/copyChapter',
    method: 'get',
    params: query
  })
}

// 删除预案模板章节内容
export function delPlanChapter(planId) {
  return request({
    url: serverPath + '/plan/structural/chapter/' + planId,
    method: 'delete',
  })
}

// 根据预案id查询预案模板详情
export function getTempInfoByPlanId(planId) {
  return request({
    url: serverPath + '/structural/template/getTempInfoByPlanId/' + planId,
    method: 'get',
  })
}

// 根据预案id查询企业端预案模板详情
export function enGetTempInfoByPlanId(planId) {
  return request({
    url: serverPath + '/structural/template/enGetTempInfoByPlanId/' + planId,
    method: 'get',
  })
}

// 应急文书模板分页查询
export function documentPageList(query) {
  return request({
    url: serverPath + '/document/template/pageList',
    method: 'get',
    params: query
  })
}

// 应急文书模板保存
export function saveOrUpdate(data) {
  return request({
    url: serverPath + '/document/template/saveOrUpdate',
    method: 'post',
    data: data
  })
}

// 应急文书模板状态修改
export function updateStatus(data) {
  return request({
    url: serverPath + '/document/template/updateStatus',
    method: 'post',
    data: data
  })
}

// 查询应急文书模板详情
export function findById(id) {
  return request({
    url: serverPath + '/document/template/findById/' + id,
    method: 'get',
  })
}

// 删除应急文书模板
export function deleteById(id) {
  return request({
    url: serverPath + '/document/template/deleteById/' + id,
    method: 'delete',
  })
}

// 应急文书模板不分页查询
export function documentList(query) {
  return request({
    url: serverPath + '/document/template/list',
    method: 'get',
    params: query
  })
}

// 文书模板文件上传
export function uploadTemplate(data) {
  return request({
    url: serverPath + '/document/template/uploadTemplate',
    method: 'post',
    data: data
  })
}

// 查询本单位可使用的文书模板
export function queryTemplate(query) {
  return request({
    url: serverPath + '/document/template/queryTemplate',
    method: 'get',
    params: query
  })
}

// 应急文书模板生成
export function generationTemplate(data) {
  return request({
    url: serverPath + '/document/template/generationTemplate',
    method: 'post',
    data: data,
    responseType: 'blob',
  })
}

//预案文书保存或修改
export function saveOrUpdateDocument(data) {
  return request({
    url: serverPath + '/plan/document/saveOrUpdate',
    method: 'post',
    data: data,
  })
}

//查询当前部门所保存的正式应急文书记录
export function getFormalTemplate(query) {
  return request({
    url: serverPath + '/plan/document/getFormalTemplate',
    method: 'get',
    params: query,
  })
}

//根据预案id查询相关预案文书
export function getPlanDocument(planId) {
  return request({
    url: serverPath + '/plan/document/getPlanDocument/' + planId,
    method: 'get',
  })
}

//根据id删除预案文书
export function deleteDocumentById(documentId) {
  return request({
    url: serverPath + '/plan/document/deleteById/' + documentId,
    method: 'delete',
  })
}

//预案章节保存
export function saveChapterUpdate(data) {
  return request({
    url: serverPath + '/plan/structural/chapter/saveOrUpdate',
    method: 'post',
    data: data,
  })
}
// 预案章节删除
export function deleteChapterById(chapterId) {
  return request({
    url: serverPath + '/plan/structural/chapter/deleteByChapterId/' + chapterId,
    method: 'delete',
  })
}
