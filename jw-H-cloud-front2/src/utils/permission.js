import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  // console.log(value)
  return true
  if (value && value instanceof Array && value.length > 0) {
    const roleGroups = store.getters && store.getters.roleGroups
    const permissionroleGroups = value
    if (roleGroups.includes('admin') || roleGroups.includes('系统管理员') || roleGroups.includes('管理员')) {
      // console.log('admin')
      return true
    }
    const hasPermission = roleGroups.some(role => {
      return permissionroleGroups.includes(role)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roleGroups! Like v-permission="['admin','editor']"`)
    return false
  }
}
