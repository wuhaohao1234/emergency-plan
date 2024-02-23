import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
  return request({
    url: '/system/depts/list',
    method: 'get',
    params: query
  })
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return request({
    url: '/system/depts/list/exclude/' + deptId,
    method: 'get'
  })
}

// 查询部门详细
export function getDept(deptId) {
  return request({
    url: '/system/depts/' + deptId,
    method: 'get'
  })
}

// 新增部门
export function addDept(data) {
  return request({
    url: '/system/depts',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/system/depts',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delDept(deptId) {
  return request({
    url: '/system/depts/' + deptId,
    method: 'delete'
  })
}

// 获取部门数据树结构
export function listDeptTree(query) {
  return request({
    url: '/system/depts/tree/brief',
    method: 'get',
    params: query
  })
}

//获取下级机构 isContains:是否需要本级机构 0.否 1.是
export function childrenDept(deptId, isContains) {
  return request({
    url: '/system/depts/getChildrenDept',
    method: 'get',
    params: {
      deptId,
      isContains
    }
  })
}
