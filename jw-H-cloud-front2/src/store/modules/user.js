import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const user = {
  state: {
    token: getToken(),
    name: '',
    realName: '',
    avatar: '',
    roles: [],
    roleGroups: [],
    userId: '',
    workteam: [],
    workType: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_REAL_NAME: (state, realName) => {
      state.realName = realName
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROLE_GROUPS: (state, roleGroups) => {
      state.roleGroups = roleGroups
    },
    SET_USER_ID: (state, id) => {
      state.userId = id
    },
    SET_WORKTEAM: (state, workteam) => {
      state.workteam = workteam
    },
    SET_WORK_TYPE: (state, workType) => {
      state.workType = workType
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password, userInfo.verificationCode, userInfo.requestId).then(response => {
          const data = response.data
          setToken(data.token)

          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.userId).then(response => {
          const data = response.data
          if (data.roleGroups) {
            data.roles = JSON.parse(JSON.stringify(data.roleGroups)).map(i => i['groupName'])
          } else {
            data.roles = []
          }
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            // commit('SET_ROLES', ['admin'])
            reject('用户路由设置失败，角色组列表必须为非空数组！')
          }
          if (data.roleGroups && Array.isArray(data.roleGroups)) {
            const roleGroups = data.roleGroups.map(i => i['groupName'])
            // console.log(roleGroups)
            commit('SET_ROLE_GROUPS', roleGroups)
          } else {
            reject('getInfo: roleGroups must be a array !')
          }
          commit('SET_NAME', data.userName)
          commit('SET_REAL_NAME', data.realName)
          commit('SET_USER_ID', data.userId)
          commit('SET_WORKTEAM', data.workteam || [])
          commit('SET_WORK_TYPE', data.workType || '')
          commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_ROLE_GROUPS', [])
          removeToken()
          resetRouter()
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
        commit('SET_ROLES', [])
        commit('SET_ROLE_GROUPS', [])
        removeToken()
        resolve()
      })
    },

    // 路由状态改变
    changeRoles({ commit, dispatch }, role) {
      return new Promise(async resolve => {
        const token = role + '-token'

        commit('SET_TOKEN', token)
        setToken(token)

        const { roles } = await dispatch('getInfo')

        resetRouter()

        // generate accessible routes map based on roles
        const accessRoutes = await dispatch('permission/GenerateRoutes', roles, { root: true })

        // dynamically add accessible routes
        router.addRoutes(accessRoutes)

        // reset visited views and cached views
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      })
    }
  }
}

export default user
