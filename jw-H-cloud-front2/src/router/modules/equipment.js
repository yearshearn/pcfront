import Layout from '@/views/layout/Layout'
import BaseRouter from '@/views/layout/baseRouter'

const equipmentRouterMap = {
  path: '/equipment',
  component: Layout,
  name: 'equipment',
  redirect: '/equipment',
  meta: { title: '设备管理', icon: 'equipment', roles: [] },
  children: [
    {
      path: 'system',
      component: BaseRouter,
      name: 'equipmentSystem',
      redirect: 'system/list',
      meta: { title: '系统分类', activeIndex: '#equipmentSystem' },
      children: [
        {
          path: 'list',
          name: 'equipmentSystemList',
          hidden: true,
          component: () => import('@/views/equipment/system'),
          meta: { activeIndex: '#equipmentSystem' }
        },
        {
          path: 'add',
          name: 'equipmentSystemAdd',
          hidden: true,
          component: () => import('@/views/equipment/system/detaile'),
          meta: { title: '新增', activeIndex: '#equipmentSystem' }
        },
        {
          path: 'edit/:alarmType',
          hidden: true,
          name: 'equipmentSystemEdit',
          component: () => import('@/views/equipment/system/detaile'),
          meta: { title: '编辑', activeIndex: '#equipmentSystem' }
        }
      ]
    },
    {
      path: 'category',
      component: BaseRouter,
      name: 'equipmentCategory',
      redirect: 'category/list',
      meta: { title: '设备类型', activeIndex: '#equipmentCategory' },
      children: [
        {
          path: 'list',
          name: 'equipmentCategoryList',
          hidden: true,
          component: () => import('@/views/equipment/category'),
          meta: { activeIndex: '#equipmentCategory' }
        },
        {
          path: 'add',
          name: 'equipmentCategoryAdd',
          hidden: true,
          component: () => import('@/views/equipment/category/detaile'),
          meta: { title: '新增', activeIndex: '#equipmentCategory' }
        },
        {
          path: 'edit/:eqTypeId',
          hidden: true,
          name: 'equipmentCategoryEdit',
          component: () => import('@/views/equipment/category/detaile'),
          meta: { title: '编辑', activeIndex: '#equipmentCategory' }
        }
      ]
    },
    {
      path: 'definition',
      component: BaseRouter,
      redirect: 'definition/list',
      meta: { title: '定义设备', activeIndex: '#definition' },
      children: [
        {
          path: 'list',
          name: 'definitionList',
          meta: { title: '定义设备', activeIndex: '#definition' },
          hidden: true,
          component: () => import('@/views/equipment/definition/list')
        },
        {
          path: 'editor/:eqId',
          name: 'definitionEditor',
          meta: { title: '编辑设备', activeIndex: '#definition' },
          hidden: true,
          component: () => import('@/views/equipment/definition/editor')
        },
        {
          path: 'qrCode/:eqIdData',
          name: 'definitionQrCode',
          meta: { title: '二维码生成', activeIndex: '#definition' },
          hidden: true,
          component: () => import('@/views/equipment/definition/qrCode')
        }
      ]
    },
    {
      path: 'alarm',
      component: BaseRouter,
      redirect: 'alarm/list',
      name: 'equipmentAlarm',
      meta: { title: '设备警报', activeIndex: '#equipmentAlarm' },
      children: [
        {
          path: 'list',
          name: 'equipmentAlarmList',
          hidden: true,
          component: () => import('@/views/equipment/alarm'),
          meta: { activeIndex: '#equipmentAlarm' }
        },
        {
          path: 'add',
          name: 'equipmentAlarmAdd',
          hidden: true,
          component: () => import('@/views/equipment/alarm/detaile'),
          meta: { title: '新增', activeIndex: '#equipmentAlarm' }
        },
        {
          path: 'edit/:equipmentAlarmId',
          hidden: true,
          name: 'equipmentAlarmEdit',
          component: () => import('@/views/equipment/alarm/detaile'),
          meta: { title: '编辑', activeIndex: '#equipmentAlarm' }
        }
      ]
    },
    {
      path: 'assets',
      component: BaseRouter,
      redirect: 'assets/list',
      meta: { title: '设备资产', activeIndex: '#assets' },
      children: [
        {
          path: 'list',
          name: 'assetsList',
          meta: { title: '设备资产', activeIndex: '#assets' },
          hidden: true,
          component: () => import('@/views/equipment/assets/list')
        },
        {
          path: 'edit/:eqId',
          name: 'assetsEdit',
          meta: { title: '编辑资产', activeIndex: '#assets' },
          hidden: true,
          component: () => import('@/views/equipment/assets/editor')
        }
      ]
    }
  ]
}

export default equipmentRouterMap
