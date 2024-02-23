import { login, logout, getInfo, refreshToken } from '@/api/login'
import { getToken, setToken, setExpiresIn, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    deptId:undefined,
    phone:'',
    deptName:'',
    userId:''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_EXPIRES_IN: (state, time) => {
      state.expires_in = time
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_DEPT_ID: (state, deptId) => {
      state.deptId = deptId
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    },
    SET_DEPT_NAME: (state, deptName) => {
      state.deptName = deptName
    },
    SET_USER_ID: (state, userId) => {
      state.userId = userId
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          let data = res.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          setExpiresIn(data.expireTime)
          commit('SET_EXPIRES_IN', data.expireTime)
          sessionStorage.setItem('PW_NEED_CHANGE',data.pwdNeedChange)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          const user = res.data
          const avatar = (user.avatar == "" || user.avatar == null) ? require("@/assets/images/profile.jpg") : user.avatar;
          if (user.roles && user.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', user.roles)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_PERMISSIONS', user.menuAuthorizes)
          commit('SET_USER_ID', user.userId)
          commit('SET_NAME', user.nickName)
          commit('SET_PHONE', user.phoneNumber)
          commit('SET_AVATAR', avatar)
          commit('SET_DEPT_ID', user.deptId)
          commit('SET_DEPT_NAME', user.deptName)
          sessionStorage.setItem('PW_NEED_CHANGE',user.pwdNeedChange)
          sessionStorage.setItem('OG_EASY_NAV',user.ogEasyNav?user.ogEasyNav:'[]')
          sessionStorage.setItem('EN_EASY_NAV',user.enEasyNav?user.enEasyNav:'[]')
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 刷新token
    RefreshToken({commit, state}) {
      return new Promise((resolve, reject) => {
        refreshToken(state.token).then(res => {
          setExpiresIn(res.data)
          commit('SET_EXPIRES_IN', res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
