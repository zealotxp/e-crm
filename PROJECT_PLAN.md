# CRM系统前端开发计划 (Arco Design)

## 一、项目概述

- **框架**: Vue 3 + Arco Design Vue
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP客户端**: Axios
- **图表**: ECharts

## 二、项目结构

```
crm-arco/
├── public/                      # 静态资源
│   └── favicon.ico
├── src/
│   ├── api/                     # API接口
│   │   ├── customer.js          # 客户相关接口
│   │   ├── contact.js           # 联系人接口
│   │   ├── opportunity.js       # 商机接口
│   │   ├── quotation.js         # 报价接口
│   │   ├── contract.js          # 合同接口
│   │   ├── project.js           # 项目接口
│   │   ├── milestone.js         # 里程碑接口
│   │   ├── task.js              # 任务接口
│   │   ├── payment.js           # 回款接口
│   │   ├── invoice.js           # 开票接口
│   │   ├── ticket.js            # 工单接口
│   │   ├── bug.js               # Bug接口
│   │   ├── report.js            # 报表接口
│   │   ├── user.js              # 用户接口
│   │   └── dashboard.js         # 仪表盘接口
│   ├── assets/                  # 资源文件
│   │   ├── styles/
│   │   │   ├── global.less      # 全局样式
│   │   │   └── variables.less   # 变量定义
│   │   └── images/
│   ├── components/              # 公共组件
│   │   ├── CommonTable/         # 通用表格
│   │   ├── CommonForm/          # 通用表单
│   │   ├── CommonModal/         # 通用弹窗
│   │   ├── StatisticCard/       # 统计卡片
│   │   ├── SalesFunnel/         # 销售漏斗
│   │   ├── TrendChart/          # 趋势图
│   │   ├── PieChart/            # 饼图
│   │   ├── KanbanBoard/         # 看板
│   │   ├── GanttChart/          # 甘特图
│   │   ├── Timeline/            # 时间线
│   │   ├── UploadFile/          # 文件上传
│   │   ├── SelectUser/          # 人员选择
│   │   ├── SelectCustomer/      # 客户选择
│   │   ├── SelectProject/       # 项目选择
│   │   └── Breadcrumb/          # 面包屑
│   ├── directives/              # 自定义指令
│   ├── hooks/                   # 组合式函数
│   │   ├── useTable.js          # 表格相关
│   │   ├── useForm.js           # 表单相关
│   │   ├── useModal.js          # 弹窗相关
│   │   ├── usePermission.js     # 权限相关
│   │   └── useDict.js           # 字典相关
│   ├── layouts/                 # 布局组件
│   │   ├── BasicLayout/         # 基础布局
│   │   │   ├── index.vue
│   │   │   ├── components/
│   │   │   │   ├── Navbar.vue   # 顶部导航
│   │   │   │   ├── Sidebar.vue  # 侧边栏
│   │   │   │   ├── Footer.vue   # 页脚
│   │   │   │   └── Settings.vue # 设置面板
│   │   │   └── menu.js          # 菜单配置
│   │   ├── BlankLayout/         # 空白布局
│   │   └── UserLayout/          # 用户布局(登录/注册)
│   ├── router/                  # 路由配置
│   │   ├── index.js             # 路由入口
│   │   ├── routes.js            # 路由定义
│   │   └── guards.js            # 路由守卫
│   ├── stores/                  # Pinia状态管理
│   │   ├── index.js             # Store入口
│   │   ├── user.js              # 用户状态
│   │   ├── app.js               # 应用状态
│   │   ├── tab.js               # 标签页状态
│   │   └── dict.js              # 字典状态
│   ├── utils/                   # 工具函数
│   │   ├── request.js           # HTTP请求封装
│   │   ├── storage.js           # 本地存储
│   │   ├── format.js            # 格式化
│   │   ├── validate.js          # 验证规则
│   │   └── dict.js              # 字典数据
│   ├── views/                   # 页面视图
│   │   ├── login/               # 登录页
│   │   ├── dashboard/           # 工作台
│   │   │   └── index.vue
│   │   ├── customer/            # 客户管理
│   │   │   ├── index.vue        # 客户列表
│   │   │   ├── detail.vue       # 客户详情
│   │   │   ├── components/
│   │   │   │   ├── CustomerForm.vue
│   │   │   │   ├── ContactList.vue
│   │   │   │   ├── FollowRecord.vue
│   │   │   │   └── CustomerImport.vue
│   │   │   └── composables/
│   │   │       └── useCustomer.js
│   │   ├── contact/             # 联系人管理
│   │   │   └── index.vue
│   │   ├── opportunity/         # 商机管理
│   │   │   ├── index.vue        # 列表/看板
│   │   │   ├── detail.vue
│   │   │   └── components/
│   │   │       ├── OpportunityForm.vue
│   │   │       ├── OpportunityKanban.vue
│   │   │       └── OpportunityList.vue
│   │   ├── quotation/           # 报价管理
│   │   │   ├── index.vue
│   │   │   ├── detail.vue
│   │   │   └── components/
│   │   │       ├── QuotationForm.vue
│   │   │       └── QuotationItems.vue
│   │   ├── contract/            # 合同管理
│   │   │   ├── index.vue
│   │   │   ├── detail.vue
│   │   │   └── components/
│   │   │       ├── ContractForm.vue
│   │   │       └── PaymentTerms.vue
│   │   ├── project/             # 项目管理
│   │   │   ├── index.vue
│   │   │   ├── detail.vue
│   │   │   └── components/
│   │   │       ├── ProjectForm.vue
│   │   │       ├── ProjectCard.vue
│   │   │       └── ProjectTeam.vue
│   │   ├── milestone/           # 里程碑
│   │   │   └── index.vue
│   │   ├── task/                # 任务管理
│   │   │   ├── index.vue
│   │   │   └── components/
│   │   │       ├── TaskKanban.vue
│   │   │       ├── TaskForm.vue
│   │   │       └── TaskGantt.vue
│   │   ├── payment/             # 回款管理
│   │   │   ├── index.vue
│   │   │   └── components/
│   │   │       ├── PaymentPlan.vue
│   │   │       └── PaymentRecord.vue
│   │   ├── invoice/             # 开票管理
│   │   │   └── index.vue
│   │   ├── ticket/              # 工单管理
│   │   │   └── index.vue
│   │   ├── bug/                 # Bug跟踪
│   │   │   └── index.vue
│   │   ├── report/              # 报表中心
│   │   │   ├── index.vue
│   │   │   ├── sales.vue
│   │   │   ├── project.vue
│   │   │   └── finance.vue
│   │   └── setting/             # 系统设置
│   │       ├── index.vue
│   │       ├── user.vue
│   │       ├── role.vue
│   │       ├── department.vue
│   │       └── system.vue
│   ├── App.vue                  # 根组件
│   └── main.js                  # 入口文件
├── index.html                   # HTML模板
├── package.json                 # 依赖配置
├── vite.config.js               # Vite配置
├── jsconfig.json                # JS配置
└── README.md                    # 项目说明
```

## 三、开发步骤

### 第一阶段：项目初始化 (Step 1)
1. 创建Vite项目
2. 安装Arco Design Vue
3. 配置路由和状态管理
4. 搭建基础布局

### 第二阶段：基础组件 (Step 2)
1. 封装HTTP请求
2. 创建通用组件
3. 配置字典数据
4. 实现登录页面

### 第三阶段：核心功能 (Step 3-8)
3. 工作台仪表盘
4. 客户管理模块
5. 销售管理模块(商机/报价/合同)
6. 项目管理模块
7. 财务管理模块(回款/开票)
8. 售后管理模块(工单/Bug)

### 第四阶段：完善功能 (Step 9-10)
9. 报表中心
10. 系统设置

## 四、文件清单

### Step 1: 项目初始化
- [ ] package.json
- [ ] vite.config.js
- [ ] index.html
- [ ] src/main.js
- [ ] src/App.vue
- [ ] src/layouts/BasicLayout/index.vue
- [ ] src/layouts/BasicLayout/components/Navbar.vue
- [ ] src/layouts/BasicLayout/components/Sidebar.vue
- [ ] src/layouts/BasicLayout/menu.js
- [ ] src/layouts/UserLayout/index.vue
- [ ] src/router/index.js
- [ ] src/router/routes.js
- [ ] src/router/guards.js
- [ ] src/stores/index.js
- [ ] src/stores/user.js
- [ ] src/stores/app.js

### Step 2: 基础组件和工具
- [ ] src/utils/request.js
- [ ] src/utils/storage.js
- [ ] src/utils/format.js
- [ ] src/utils/validate.js
- [ ] src/utils/dict.js
- [ ] src/hooks/useTable.js
- [ ] src/hooks/useForm.js
- [ ] src/hooks/useModal.js
- [ ] src/components/CommonTable/index.vue
- [ ] src/components/CommonForm/index.vue
- [ ] src/components/StatisticCard/index.vue
- [ ] src/views/login/index.vue

### Step 3: 工作台
- [ ] src/api/dashboard.js
- [ ] src/views/dashboard/index.vue
- [ ] src/components/SalesFunnel/index.vue
- [ ] src/components/TrendChart/index.vue
- [ ] src/components/PieChart/index.vue

### Step 4: 客户管理
- [ ] src/api/customer.js
- [ ] src/api/contact.js
- [ ] src/views/customer/index.vue
- [ ] src/views/customer/detail.vue
- [ ] src/views/customer/components/CustomerForm.vue
- [ ] src/views/customer/components/ContactList.vue
- [ ] src/views/customer/components/FollowRecord.vue
- [ ] src/views/contact/index.vue

### Step 5: 销售管理
- [ ] src/api/opportunity.js
- [ ] src/api/quotation.js
- [ ] src/api/contract.js
- [ ] src/views/opportunity/index.vue
- [ ] src/views/opportunity/components/OpportunityKanban.vue
- [ ] src/views/quotation/index.vue
- [ ] src/views/quotation/components/QuotationForm.vue
- [ ] src/views/contract/index.vue
- [ ] src/views/contract/components/ContractForm.vue

### Step 6: 项目管理
- [ ] src/api/project.js
- [ ] src/api/milestone.js
- [ ] src/api/task.js
- [ ] src/views/project/index.vue
- [ ] src/views/project/detail.vue
- [ ] src/views/milestone/index.vue
- [ ] src/views/task/index.vue
- [ ] src/views/task/components/TaskKanban.vue
- [ ] src/components/KanbanBoard/index.vue

### Step 7: 财务管理
- [ ] src/api/payment.js
- [ ] src/api/invoice.js
- [ ] src/views/payment/index.vue
- [ ] src/views/invoice/index.vue

### Step 8: 售后管理
- [ ] src/api/ticket.js
- [ ] src/api/bug.js
- [ ] src/views/ticket/index.vue
- [ ] src/views/bug/index.vue

### Step 9: 报表中心
- [ ] src/api/report.js
- [ ] src/views/report/index.vue
- [ ] src/views/report/sales.vue
- [ ] src/views/report/project.vue
- [ ] src/views/report/finance.vue

### Step 10: 系统设置
- [ ] src/api/user.js
- [ ] src/views/setting/index.vue
- [ ] src/views/setting/user.vue
- [ ] src/views/setting/role.vue
- [ ] src/views/setting/department.vue

## 五、技术栈版本

```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "@arco-design/web-vue": "^2.55.0",
    "axios": "^1.6.0",
    "echarts": "^5.4.0",
    "vue-echarts": "^6.6.0",
    "dayjs": "^1.11.0",
    "lodash-es": "^4.17.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-vue": "^5.0.0",
    "less": "^4.2.0"
  }
}
```

## 六、开发顺序

按以下顺序逐步开发，每个Step完成后可独立运行测试：

1. **Step 1**: 项目框架搭建 → 可看到基础布局和菜单
2. **Step 2**: 登录和基础组件 → 可登录系统
3. **Step 3**: 工作台 → 看到数据仪表盘
4. **Step 4**: 客户管理 → 核心功能可用
5. **Step 5**: 销售管理 → 销售流程打通
6. **Step 6**: 项目管理 → 交付流程打通
7. **Step 7**: 财务管理 → 回款开票管理
8. **Step 8**: 售后管理 → 完整闭环
9. **Step 9**: 报表中心 → 数据分析
10. **Step 10**: 系统设置 → 权限管理

---

**当前状态**: 准备开始 Step 1
**下一步**: 创建项目基础结构和配置文件
