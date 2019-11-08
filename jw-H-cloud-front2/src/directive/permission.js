import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const roleGroups = store.getters && store.getters.roleGroups
    if (value && value instanceof Array && value.length > 0) {
      const permissionroleGroups = value
      if (!roleGroups.includes('admin') && !roleGroups.includes('系统管理员')) {
        const hasPermission = roleGroups.some(role => {
          return permissionroleGroups.includes(role)
        })

        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el)
        }
      }
    } else {
      throw new Error(`need roleGroups! Like v-permission="['admin','editor']"`)
    }
  }
}
