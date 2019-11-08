import Layout from '@/views/layout/Layout'
// import BaseRouter from '@/views/layout/baseRouter'

const profileRouterMap = {
  path: '/profile',
  component: Layout,
  redirect: '/profile/reset',
  name: 'profile',
  hidden: true,
  meta: { roles: [], title: '个人信息', icon: 'user' },
  children: [
    {
      path: 'reset',
      component: () => import('@/views/profile/reset'), // Parent router-view
      name: 'reset',
      meta: { title: '修改密码' }
    }
  ]
}

export default profileRouterMap
