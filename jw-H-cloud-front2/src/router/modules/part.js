import Layout from '@/views/layout/Layout'
import BaseRouter from '@/views/layout/baseRouter'

const partRouter = {
  path: '/part',
  component: Layout,
  redirect: '/part',
  name: 'part',
  meta: { roles: [], title: '备件管理', icon: 'part' },
  children: [
    {
      path: 'store',
      component: BaseRouter,
      // component: () => import('@/views/part/store/list'),
      meta: { title: '备件仓库', activeIndex: '#partStore' },
      redirect: 'store/list',
      children: [
        {
          path: 'list',
          name: 'PartStoreList',
          meta: { title: '定义主仓库', activeIndex: '#partStore' },
          hidden: true,
          component: () => import('@/views/part/store/list')
        },
        {
          path: 'inventory/list',
          name: 'PartInventoryList',
          meta: { title: '备件库存列表', activeIndex: '#partStore' },
          hidden: true,
          component: () => import('@/views/part/store/inventoryList')
        }
      ]
    },
    //  {
    //    path: 'storeList',
    //    component: BaseRouter,
    //    // component: () => import('@/views/part/store/list'),
    //    meta: { title: '我的仓库' },
    //    children: [
    //      {
    //        path: '',
    //        name: 'MyStoreList',
    //        meta: { title: '我的仓库' },
    //        hidden: true,
    //        component: () => import('@/views/part/mystore/mystore')
    //      }
    //    ]
    //  },
    {
      path: 'type',
      component: BaseRouter,
      // component: () => import('@/views/part/store/list'),
      meta: { title: '备件类别', activeIndex: '#partType' },
      redirect: 'type/list',
      children: [
        {
          path: 'list',
          name: 'PartTypeList',
          meta: { title: '备件类别列表', activeIndex: '#partType' },
          hidden: true,
          component: () => import('@/views/part/type/list')
        },
        {
          path: 'part/type/create',
          name: 'PartTypeCreate',
          meta: { title: '新增备件类别', activeIndex: '#partType' },
          hidden: true,
          component: () => import('@/views/part/type/create')
        },
        {
          path: 'part/type/edit/:id',
          name: 'PartTypeEdit',
          meta: { title: '修改备件类别', activeIndex: '#partType' },
          hidden: true,
          component: () => import('@/views/part/type/create')
        }
      ]
    },
    {
      path: 'supplier',
      component: BaseRouter,
      name: 'partSupplier',
      redirect: 'supplier/list',
      meta: { title: '备件供应商', activeIndex: '#partSupplier' },
      children: [
        {
          path: 'list',
          name: 'PartSupplierList',
          meta: { title: '备件供应商列表', activeIndex: '#partSupplier' },
          hidden: true,
          component: () => import('@/views/part/supplier/list')
        },
        {
          path: 'part/supplier/edit/:id',
          name: 'PartSupplierEdit',
          meta: { title: '修改备件供应商', activeIndex: '#partSupplier' },
          hidden: true,
          component: () => import('@/views/part/supplier/create')
        },
        {
          path: 'part/supplier/create',
          name: 'PartSupplierCreate',
          meta: { title: '新增备件供应商', activeIndex: '#partSupplier' },
          hidden: true,
          component: () => import('@/views/part/supplier/create')
        }
      ]
    },
    {
      path: 'detail',
      component: BaseRouter,
      name: 'partDetail',
      meta: { title: '定义备件', activeIndex: '#partDetail' },
      redirect: 'detail/list',
      children: [
        {
          path: 'list',
          name: 'PartDetailList',
          meta: { title: '备件列表', activeIndex: '#partDetail' },
          hidden: true,
          component: () => import('@/views/part/detail/list')
        },
        {
          path: 'create',
          name: 'PartDetailCreate',
          meta: { title: '新增备件', activeIndex: '#partDetail' },
          hidden: true,
          component: () => import('@/views/part/detail/create')
        },
        {
          path: 'edit/:id',
          name: 'PartDetailEdit',
          meta: { title: '修改备件', activeIndex: '#partDetail' },
          hidden: true,
          component: () => import('@/views/part/detail/create')
        }
      ]
    },
    // {
    //   path: 'auto',
    //   component: () => import('@/views/part/auto/list'),
    //   name: 'partAuto',
    //   meta: { title: '自动补货' }
    // },
    {
      path: 'transfer',
      component: () => import('@/views/part/transfer/operate/picking'),
      name: 'partTransfer',
      meta: { title: '备件转移', activeIndex: '#transfer' },
      // redirect: 'transfer/operate/picking',
      children: [
        {
          path: 'picking',
          name: 'partTransferPicking',
          meta: { title: '领料', activeIndex: '#transfer' },
          hidden: true,
          component: () => import('@/views/part/transfer/operate/picking')
        },
        {
          path: 'returning',
          name: 'partTransferReturning',
          meta: { title: '退料', activeIndex: '#transfer' },
          hidden: true,
          component: () => import('@/views/part/transfer/operate/picking')
        },
        {
          path: 'purchasing',
          name: 'partTransferPurchasing',
          meta: { title: '采购', activeIndex: '#transfer' },
          hidden: true,
          component: () => import('@/views/part/transfer/operate/components/purchasing')
        },
        {
          path: 'backing',
          name: 'partTransferBacking',
          meta: { title: '退供应商', activeIndex: '#transfer' },
          hidden: true,
          component: () => import('@/views/part/transfer/operate/components/purchasing')
        },
        {
          path: 'reboot',
          name: 'partTransferReboot',
          meta: { title: '一键退库', activeIndex: '#transfer' },
          hidden: true,
          component: () => import('@/views/part/transfer/operate/components/reboot')
        }
      ]
    },
    {
      path: 'tranfer_list',
      component: () => import('@/views/part/transfer/list'),
      name: 'partTranferList',
      meta: { title: '转移记录' }
    },
    {
      path: 'inventory',
      component: BaseRouter,
      // component: () => import('@/views/part/store/list'),
      meta: { title: '备件库存', activeIndex: '#inventory' },
      redirect: 'inventory/list',
      children: [
        {
          path: 'list',
          name: 'partManageList',
          meta: { title: '备件库存列表', activeIndex: '#inventory' },
          hidden: true,
          component: () => import('@/views/part/inventory/list')
        }
      ]
    },
    {
      path: 'chart',
      component: () => import('@/views/part/chart'),
      name: 'partChart',
      meta: { title: '备件图表' }
    }
  ]
}

export default partRouter
