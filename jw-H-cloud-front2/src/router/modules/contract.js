import Layout from '@/views/layout/Layout'
import BaseRouter from '@/views/layout/baseRouter'

const contractRouterMap = {

  path: '/contract',
  component: Layout,
  redirect: '/contract/list',
  name: 'contract',
  meta: { roles: [], title: '合同管理', icon: 'contract' },
  children: [
    {
      path: 'list',
      component: () => import('@/views/contract/contract/list'), // Parent router-view
      name: 'contractList',
      meta: { roles: [], title: '合同列表' }
    },
    {
      path: 'details/:cid',
      hidden: true,
      component: () => import('@/views/contract/contract/details'), // Parent router-view
      name: 'contractDetails',
      meta: { title: '合同详情' }
    },
    {
      path: 'questionnaire',
      component: () => import('@/views/contract/questionnaires/list'), // Parent router-view
      name: '问卷列表',
      meta: { title: '问卷列表', activeIndex: '#questionnaireList' }
    },
    {
      path: 'questionnaire/details/:qid',
      component: () => import('@/views/contract/questionnaires/details'), // Parent router-view
      name: '问卷详情',
      hidden: true,
      meta: { title: '问卷详情', activeIndex: '#questionnaireList' }
    },
    {
      path: 'invoice',
      component: () => import('@/views/contract/invoice/invoiceList'), // Parent router-view
      name: '发票列表',
      meta: { title: '发票列表', activeIndex: '#invoiceList' }
    },
    {
      path: 'newlyBuild',
      component: BaseRouter,
      meta: { roles: [], title: '新建' },
      alwaysShow: true,
      children: [
        {
          path: 'newContract',
          component: () => import('@/views/contract/newlyBuild/newContract'),
          name: '合同',
          meta: { title: '合同' }
        },
        {
          path: 'newQuestionnaire',
          component: () => import('@/views/contract/newlyBuild/newQuestionnaire'),
          name: '问卷',
          meta: { title: '问卷' }
        }
      ]
    }
  ]
}

export default contractRouterMap
