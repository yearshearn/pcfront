import Layout from '@/views/layout/Layout'
// import BaseRouter from '@/views/layout/baseRouter'

const energyRouterMap = {

  path: '/energyRepot',
  component: Layout,
  redirect: '/energyRepot',
  meta: { roles: [], title: '能耗管理', icon: 'part' },
  children: [
    {
      path: 'energyAll',
      // component: BaseRouter,
      // name: 'energyRepot',
      component: () => import('@/views/energyReport/energyAll'),
      name: 'energyAll',
      meta: { title: '能耗管理', activeIndex: '#energyAll' }
    },
    {
      path: 'energyLoc',
      // component: BaseRouter,
      // name: 'energyRepot',
      component: () => import('@/views/energyReport/energyLoc'),
      name: 'energyLoc',
      meta: { title: '地点报表', activeIndex: '#energyLoc' }
    },
    {
      path: 'energyTime',
      // component: BaseRouter,
      // name: 'energyRepot',
      component: () => import('@/views/energyReport/energyTime'),
      name: 'energyTimeAll',
      meta: { title: '设备报表', activeIndex: '#energyTime' }

    },
    {
      path: 'energyRealTime',
      // component: BaseRouter,
      // name: 'energyRepot',
      component: () => import('@/views/energyReport/energyRealTime'),
      name: 'energyRealTime',
      meta: { title: '实时数据', activeIndex: '#energyRealTime' }

    },
    {
      path: 'eyParameter',
      // name: 'eyParameter',
      // hidden: true,
      component: () => import('@/views/energyReport/eyParameter'),
      meta: {
        title: '设置参数',
        activeIndex: '#eyParameter'
      }
    }
  ]
}

export default energyRouterMap
