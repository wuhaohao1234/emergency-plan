import request from '@/utils/request'

// 获取路由
export const getRouters = (businessType) => {
  return request({
    url: '/system/menus/getRouters',
    method: 'get',
    params:{
      businessType
    }
  })
}
