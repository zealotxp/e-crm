import BasicLayout from '@/layouts/BasicLayout/index.vue'
import UserLayout from '@/layouts/UserLayout/index.vue'

export const routes = [
  {
    path: '/',
    name: 'root',
    redirect: '/dashboard',
    component: BasicLayout,
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '工作台',
          icon: 'icon-dashboard'
        }
      },
      {
        path: '/customer',
        name: 'Customer',
        component: () => import('@/views/customer/index.vue'),
        meta: {
          title: '全部客户',
          icon: 'icon-user-group'
        }
      },
      {
        path: '/customer/my',
        name: 'MyCustomer',
        component: () => import('@/views/customer/index.vue'),
        meta: {
          title: '我的客户',
          icon: 'icon-user',
          filterByOwner: true
        }
      },
      {
        path: '/customer/:id',
        name: 'CustomerDetail',
        component: () => import('@/views/customer/detail.vue'),
        meta: {
          title: '客户详情',
          hideInMenu: true
        }
      },
      {
        path: '/opportunity',
        name: 'Opportunity',
        component: () => import('@/views/opportunity/index.vue'),
        meta: {
          title: '商机管理',
          icon: 'icon-fund'
        }
      },
      {
        path: '/quotation',
        name: 'Quotation',
        component: () => import('@/views/quotation/index.vue'),
        meta: {
          title: '报价管理',
          icon: 'icon-file'
        }
      },
      {
        path: '/contract',
        name: 'Contract',
        component: () => import('@/views/contract/index.vue'),
        meta: {
          title: '合同管理',
          icon: 'icon-book'
        }
      },
      {
        path: '/contract/detail/:id',
        name: 'ContractDetail',
        component: () => import('@/views/contract/detail.vue'),
        meta: {
          title: '合同详情',
          hideInMenu: true
        }
      },
      {
        path: '/project',
        name: 'Project',
        component: () => import('@/views/project/index.vue'),
        meta: {
          title: '项目管理',
          icon: 'icon-apps'
        }
      },
      {
        path: '/project-tree',
        name: 'ProjectTree',
        component: () => import('@/views/project/ProjectTree.vue'),
        meta: {
          title: '项目树',
          icon: 'icon-tree'
        }
      },
      {
        path: '/project/detail/:id',
        name: 'ProjectDetail',
        component: () => import('@/views/project/detail.vue'),
        meta: {
          title: '项目详情',
          hideInMenu: true
        }
      },
      {
        path: '/phase',
        name: 'Phase',
        component: () => import('@/views/phase/index.vue'),
        meta: {
          title: '期号管理',
          icon: 'icon-calendar'
        }
      },
      {
        path: '/task',
        name: 'Task',
        component: () => import('@/views/task/index.vue'),
        meta: {
          title: '任务管理',
          icon: 'icon-check-square'
        }
      },
      {
        path: '/payment',
        name: 'Payment',
        component: () => import('@/views/payment/index.vue'),
        meta: {
          title: '回款管理',
          icon: 'icon-money'
        }
      },
      {
        path: '/invoice',
        name: 'Invoice',
        component: () => import('@/views/invoice/index.vue'),
        meta: {
          title: '开票管理',
          icon: 'icon-printer'
        }
      },
      {
        path: '/ticket',
        name: 'Ticket',
        component: () => import('@/views/ticket/index.vue'),
        meta: {
          title: '工单管理',
          icon: 'icon-customer-service'
        }
      },
      {
        path: '/report',
        name: 'Report',
        component: () => import('@/views/report/index.vue'),
        meta: {
          title: '报表中心',
          icon: 'icon-bar-chart'
        }
      },
      {
        path: '/setting',
        name: 'Setting',
        component: () => import('@/views/setting/index.vue'),
        meta: {
          title: '系统设置',
          icon: 'icon-settings'
        }
      }
    ]
  },
  {
    path: '/user',
    component: UserLayout,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: {
          title: '登录'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue')
  }
]
