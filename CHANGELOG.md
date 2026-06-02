# CHANGELOG

## [1.0.7] - 2026-06-02

### Fixed
- 修复 `/bug` 路由缺失，复用工单页面避免 404
- 修复 `/report/sales`、`/report/project`、`/report/finance` 三个报表子路由缺失
- 修复 `customer/index.vue` 分页 `total` 硬编码 128 的问题，改为动态计算
- 修复 `handleSearch`、`handleReset`、`handleTabChange` 空函数，实现完整多条件过滤
- 修复 `request.js` 响应拦截器中 `switch case` 内 `const` 声明的块作用域问题

### Added
- 新增销售报表详情页（业绩趋势/赢单率/漏斗图/排行榜）
- 新增项目报表详情页（状态分布/完成率趋势/延期分析）
- 新增财务报表详情页（回款趋势/账龄分析/应收账款明细）
- 新增 `CHANGELOG.md` 更新记录文件
- 新增 `scripts/deploy.cjs` 一键自动部署脚本

### Changed
- Vue Router 历史模式从 `createWebHistory` 切换为 `createWebHashHistory`，支持 Gitee Pages
- `vite.config.js` 添加 `base: '/ehaiba-crm'` 路径配置

---

## [1.0.6] - 2026-03-25

### Added
- 新增项目树功能 (`/project-tree`)，支持项目结构可视化

### Changed
- 更新项目版本号和 README

---

## [1.0.5] - 2026-03-22

### Added
- 任务管理页面增加看板和列表模式切换功能

### Changed
- 更新项目版本号和 README

---

## [1.0.4] - 2026-03-20

### Added
- 客户管理菜单新增「我的客户」子菜单
- 我的客户页面支持按归属人过滤数据

### Changed
- 更新项目版本号和 README

---

## [1.0.3] - 2026-03-18

### Added
- 客户表单增加「客户主体名称」字段

### Changed
- 更新项目版本号和 README

---

## [1.0.2] - 2026-03-16

### Added
- 客户管理支持多联系人功能

### Changed
- 更新项目版本号和 README

---

## [1.0.1] - 2026-03-14

### Added
- 客户表单优化：增加客户编号字段，移除邮箱和网站字段

### Changed
- 更新项目版本号和 README

---

## [1.0.0] - 2026-03-12

### Added
- CRM Arco Design Vue3 项目初始化
- 基于 Vue 3 + Arco Design + Vite + Pinia + ECharts 技术栈
- 实现工作台、客户管理、商机管理、报价管理、合同管理、项目管理
- 实现期号管理、任务管理、回款管理、开票管理、工单管理
- 实现报表中心、系统设置等核心模块
