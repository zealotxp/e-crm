export const menuConfig = [
  {
    key: 'Dashboard',
    title: '工作台',
    icon: 'icon-dashboard',
    path: '/dashboard'
  },
  {
    key: 'Customer',
    title: '客户管理',
    icon: 'icon-user-group',
    children: [
      {
        key: 'CustomerList',
        title: '全部客户',
        path: '/customer'
      },
      {
        key: 'MyCustomer',
        title: '我的客户',
        path: '/customer/my'
      }
    ]
  },
  {
    key: 'Sales',
    title: '销售管理',
    icon: 'icon-fund',
    children: [
      {
        key: 'Opportunity',
        title: '商机管理',
        path: '/opportunity'
      },
      {
        key: 'Quotation',
        title: '报价管理',
        path: '/quotation'
      },
      {
        key: 'Contract',
        title: '合同管理',
        path: '/contract'
      }
    ]
  },
  {
    key: 'Project',
    title: '项目管理',
    icon: 'icon-apps',
    children: [
      {
        key: 'ProjectList',
        title: '项目列表',
        path: '/project'
      },
      {
        key: 'Task',
        title: '任务管理',
        path: '/task'
      }
    ]
  },
  {
    key: 'Finance',
    title: '财务管理',
    icon: 'icon-money',
    children: [
      {
        key: 'Payment',
        title: '回款管理',
        path: '/payment'
      },
      {
        key: 'Invoice',
        title: '开票管理',
        path: '/invoice'
      }
    ]
  },
  {
    key: 'Service',
    title: '售后管理',
    icon: 'icon-customer-service',
    children: [
      {
        key: 'Ticket',
        title: '工单管理',
        path: '/ticket'
      }
    ]
  },
  {
    key: 'Report',
    title: '报表中心',
    icon: 'icon-bar-chart',
    path: '/report'
  },
  {
    key: 'Setting',
    title: '系统设置',
    icon: 'icon-settings',
    path: '/setting'
  }
]
