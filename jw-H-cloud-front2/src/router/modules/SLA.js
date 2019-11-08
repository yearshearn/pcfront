import Layout from '@/views/layout/Layout'

const SLARouterMap = {
  path: '/SLA',
  component: Layout,
  redirect: '/SLA',
  meta: { roles: [], title: 'SLA流程', icon: 'workorder' },
  children: [{
    path: '/SLAlist',
    component: () => import('@/views/SLA/SLAlist'),
    name: 'SLAlist',
    meta: { title: 'SLA列表', activeIndex: 'SLAlist' }
  },
  {
    path: '/SLAdetails',
    component: () => import('@/views/SLA/SLAdetails'),
    name: 'SLAdetails',
    hidden: true,
    meta: { title: 'SLA详情', activeIndex: 'SLAdetails' }
  },
  {
    path: '/SLAhistory',
    component: () => import('@/views/SLA/SLAhistory'),
    name: 'SLAhistory',
    meta: { title: 'SLA历史', activeIndex: 'SLAhistory' }
  }
  ]
}

export default SLARouterMap
