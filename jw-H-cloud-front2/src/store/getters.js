const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  realName: state => state.user.realName,
  userId: state => state.user.userId,
  roles: state => state.user.roles,
  roleGroups: state => state.user.roleGroups,
  workteam: state => state.user.workteam,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  queDataRefreshFlag: state => state.contract.queDataRefreshFlag
}
export default getters
