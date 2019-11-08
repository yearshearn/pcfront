import Layout from '@/views/layout/Layout'
import BaseRouter from '@/views/layout/baseRouter'

const MISRouterMap = {
  path: '/mis',
  component: Layout,
  name: 'mis',
  redirect: '/mis',
  meta: { roles: [], title: '系统管理', icon: 'user' },
  children: [{
    path: 'mechanic',
    component: BaseRouter,
    name: 'mechanic',
    meta: { title: '系统定义', activeIndex: '#sysD' },
    children: [
      {
        path: 'questionClassList',
        component: () => import('@/views/mechanic/definition/questionClassList'),
        name: 'questionClassList',
        meta: { title: '问题分类', activeIndex: '#sysD' }
      },
      {
        path: 'problemTypeList',
        component: () => import('@/views/mechanic/definition/problemTypeList'),
        name: 'problemTypeList',
        meta: { title: '问题类型', activeIndex: '#sysP' }
      },
      {
        path: 'typeWork',
        component: () => import('@/views/mechanic/definition/typework'),
        name: 'typeWork',
        meta: { title: '定义工种', activeIndex: '#sysW' }
      },
      {
        path: 'workerGroup',
        component: () => import('@/views/mechanic/definition/workergroup'),
        name: 'workergroup',
        meta: { title: '定义工作组', activeIndex: '#sysG' }
      },
      {
        path: 'addQuestionClass',
        name: 'addQuestionClass',
        hidden: true,
        component: () => import('@/views/mechanic/definition/addQuestionClass'),
        meta: {
          title: '新增问题分类',
          activeIndex: '#sysD'
        }
      },
      {
        path: 'addProblemType',
        name: 'addProblemType',
        hidden: true,
        component: () => import('@/views/mechanic/definition/addProblemType'),
        meta: {
          title: '新增问题类型',
          activeIndex: '#sysP'
        }
      },
      {
        path: 'addtypeWork',
        name: 'addtypeWork',
        hidden: true,
        component: () => import('@/views/mechanic/definition/addtypeWork'),
        meta: {
          title: '新增工种',
          activeIndex: '#sysW'
        }
      },
      {
        path: 'addWorkerGroup',
        name: 'addWorkerGroup',
        hidden: true,
        component: () => import('@/views/mechanic/definition/addWorkerGroup'),
        meta: {
          title: '新增工作组',
          activeIndex: '#sysG'
        }
      }
    ]
  },
  {
    path: 'ums',
    component: BaseRouter,
    name: 'ums',
    meta: { title: '组织机构' },
    redirect: '/mis/ums/account/list',
    children: [
      {
        path: 'account',
        component: BaseRouter,
        name: 'account',
        meta: { title: '账号管理',
          activeIndex: '#account'
        },
        redirect: '/mis/ums/account/list',
        children: [
          {
            path: 'list',
            name: 'accountList',
            hidden: true,
            component: () => import('@/views/MIS/UMS/components/account/list'),
            meta: { title: '账号列表',
              activeIndex: '#account'
            }
          },
          {
            path: 'create',
            hidden: true,
            component: () => import('@/views/MIS/UMS/components/account/create'),
            name: 'accountCreate',
            meta: { title: '新增账号',
              activeIndex: '#account'
            }
          },
          {
            path: 'edit/:userId',
            hidden: true,
            component: () => import('@/views/MIS/UMS/components/account/edit'),
            name: 'accountEdit',
            meta: { title: '编辑账号',
              activeIndex: '#account'
            }
          }
        ]
      },
      {
        path: 'role',
        name: 'role',
        redirect: '/mis/ums/role/list',
        component: BaseRouter,
        meta: { title: '角色管理',
          activeIndex: '#role'
        },
        children: [
          {
            path: 'list',
            name: 'roleList',
            hidden: true,
            component: () => import('@/views/MIS/UMS/components/role/list'),
            meta: { title: '角色列表',
              activeIndex: '#role'
            }
          },
          {
            path: 'create',
            hidden: true,
            component: () => import('@/views/MIS/UMS/components/role/create'),
            name: 'roleCreate',
            meta: { title: '新增角色',
              activeIndex: '#role'
            }
          },
          {
            path: 'edit/:roleId',
            hidden: true,
            component: () => import('@/views/MIS/UMS/components/role/edit'),
            name: 'roleEdit',
            meta: { title: '编辑角色',
              activeIndex: '#role'
            }
          }
        ]
      },
      {
        path: 'roleGroup',
        name: 'roleGroup',
        redirect: '/mis/ums/roleGroup/list',
        component: BaseRouter,
        meta: { title: '角色组管理',
          activeIndex: '#roleGroup'
        },
        children: [
          {
            path: 'list',
            name: 'roleGroupList',
            hidden: true,
            component: () => import('@/views/MIS/UMS/components/roleGroup/list'),
            meta: { title: '角色组列表',
              activeIndex: '#roleGroup'
            }
          },
          {
            path: 'create',
            hidden: true,
            component: () => import('@/views/MIS/UMS/components/roleGroup/create'),
            name: 'roleGroupCreate',
            meta: { title: '新增角色组',
              activeIndex: '#roleGroup'
            }
          },
          {
            path: 'edit/:roleGroupId',
            hidden: true,
            component: () => import('@/views/MIS/UMS/components/roleGroup/edit'),
            name: 'roleGroupEdit',
            meta: { title: '编辑角色组',
              activeIndex: '#roleGroup'
            }
          }
        ]
      },
      {
        path: 'dms',
        name: 'dms',
        component: BaseRouter,
        redirect: 'dms/departmentList',
        meta: {
          title: '部门管理',
          activeIndex: '#dms'
        },
        children: [
          {
            path: 'departmentList',
            name: 'departmentList',
            hidden: true,
            component: () => import('@/views/MIS/DMS/department/departmentList'), // Parent router-view
            meta: {
              title: '部门列表',
              activeIndex: '#dms'
            }
          },
          {
            path: 'departmentDetail/:deptId',
            name: 'departmentDetail',
            hidden: true,
            component: () => import('@/views/MIS/DMS/department/departmentDetail'), // Parent router-view
            meta: {
              title: '部门详情',
              activeIndex: '#dms'
            }
          },
          {
            path: 'addDepartment',
            name: 'addDepartment',
            hidden: true,
            component: () => import('@/views/MIS/DMS/department/addDepartment'), // Parent router-view
            meta: {
              title: '新增部门',
              activeIndex: '#dms'
            }
          }
        ]
      }
    ]
  }
  // {
  //   path: 'logs',
  //   component: BaseRouter,
  //   name: 'logs',
  //   meta: { title: '日志管理' },
  //   children: [
  //     {
  //       path: 'exception',
  //       component: () => import('@/views/MIS/UMS/components/logs/exception'),
  //       name: 'exceptionLogs',
  //       meta: { title: '异常日志' }
  //     },
  //     {
  //       path: 'operation',
  //       component: () => import('@/views/MIS/UMS/components/logs/operation'),
  //       name: 'operationLogs',
  //       meta: { title: '操作日志' }
  //     },
  //     {
  //       path: 'test',
  //       component: () => import('@/views/test'),
  //       name: 'test',
  //       meta: { title: '测试页面' }
  //     }
  //   ]
  // }
  ]
}

export default MISRouterMap
