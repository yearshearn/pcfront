import Layout from '@/views/layout/Layout'
import BaseRouter from '@/views/layout/baseRouter'

const workorderRouterMap = {
  path: '/workorder',
  component: Layout,
  name: 'workorder',
  redirect: '/workorder/list',
  meta: { title: '工单管理', icon: 'workorder', roles: [] },
  children: [
    {
      path: 'list',
      component: BaseRouter,
      meta: { activeIndex: '#workorderList', roles: [] },
      children: [
        {
          path: '',
          component: () => import('@/views/workorder/list'),
          name: 'workorderList',
          meta: { title: '工单列表', roles: [], activeIndex: '#workorderList' }
        },
        {
          path: 'create',
          hidden: true,
          component: () => import('@/views/workorder/list/create'),
          name: 'workorderCreate',
          meta: { title: '新增工单', roles: [], activeIndex: '#workorderList' }
        },
        {
          path: 'edit/:wrId',
          hidden: true,
          component: () => import('@/views/workorder/list/edit'),
          name: 'workorderEdit',
          meta: { title: '工单修改', activeIndex: '#workorderList' }
        }
      ]
    },
    {
      path: 'analysis',
      component: () => import('@/views/workorder/analysis'),
      name: 'workorderAnalysis',
      meta: { title: '工时分析' }
    },
    {
      path: 'chart',
      component: () => import('@/views/workorder/chart'),
      name: 'workorderChart',
      meta: { title: '工单图表' }
    }
  ]
}

export default workorderRouterMap
