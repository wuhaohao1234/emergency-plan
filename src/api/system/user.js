import request from '@/utils/request'
import {parseStrEmpty} from "@/utils/ruoyi";

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/system/users/list',
    method: 'get',
    params: query
  })
}

// 分页查询用户列表
export function userPage(query) {
  return request({
    url: '/system/users',
    method: 'get',
    params: query
  })
}


// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/system/users/' + parseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/system/users',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/users',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/system/users/' + userId,
    method: 'delete'
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/system/users/resetPwd',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/system/users/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/users/profiles',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/users/profile',
    method: 'put',
    data: data
  })
}

// 用户密码修改
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/users/profiles/updatePwd',
    method: 'put',
    data: data
  })
}

// 首次登录及账号重置后修改密码
export function changePwd(newPassword) {
  const data = {
    newPassword
  }
  return request({
    url: '/system/users/profiles/changePwd',
    method: 'put',
    data: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/users/profile/avatar',
    method: 'post',
    data: data
  })
}

// 查询授权角色
export function getAuthRole(userId) {
  return request({
    url: '/system/users/authRole/' + userId,
    method: 'get'
  })
}

// 保存授权角色
export function updateAuthRole(data) {
  return request({
    url: '/system/users/authRole',
    method: 'put',
    params: data
  })
}

// 查询部门下拉树结构
export function deptTreeSelect() {
  return request({
    url: '/system/users/deptTree',
    method: 'get'
  })
}

// 查询用户
export function getList(query) {
  return request({
    url: '/system/aBooks',
    method: 'get',
    params: query
  })
}

// 修改快捷菜单
export function updateEasyNav(data) {
  return request({
    url: '/system/users/profiles/updateEasyNav',
    method: 'post',
    data: data
  })
}
// 查询用户
export function getDeptUsers(deptId) {
  return request({
    url: '/system//users/deptUsers/' + deptId,
    method: 'get',
  });
}
