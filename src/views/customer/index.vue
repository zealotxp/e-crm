<template>
  <div class="customer-page">
    <!-- 搜索栏 -->
    <a-card class="search-card" :bordered="false">
      <a-form :model="searchForm" layout="inline">
        <a-form-item field="keyword" hide-label>
          <a-input-search
            v-model="searchForm.keyword"
            placeholder="搜索客户名称/联系人/电话"
            style="width: 300px"
            allow-clear
            @search="handleSearch"
          />
        </a-form-item>
        <a-form-item field="industry" hide-label>
          <a-select
            v-model="searchForm.industry"
            placeholder="选择行业"
            style="width: 150px"
            allow-clear
          >
            <a-option
              v-for="item in INDUSTRY_LIST"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </a-select>
        </a-form-item>
        <a-form-item field="level" hide-label>
          <a-select
            v-model="searchForm.level"
            placeholder="客户等级"
            style="width: 120px"
            allow-clear
          >
            <a-option
              v-for="item in CUSTOMER_LEVEL"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </a-select>
        </a-form-item>
        <a-form-item field="status" hide-label>
          <a-select
            v-model="searchForm.status"
            placeholder="客户状态"
            style="width: 120px"
            allow-clear
          >
            <a-option
              v-for="item in CUSTOMER_STATUS"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </a-select>
        </a-form-item>
        <a-form-item hide-label>
          <a-button type="primary" @click="handleSearch">
            <template #icon><icon-search /></template>
            查询
          </a-button>
          <a-button @click="handleReset" style="margin-left: 8px">
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 操作栏 -->
    <a-card class="table-card table-resizable" :bordered="false">
      <template #title>
        <a-space>
          <a-button type="primary" @click="handleAdd">新建客户</a-button>
          <a-button @click="handleImport">导入</a-button>
          <a-button @click="handleExport">导出</a-button>
        </a-space>
      </template>
      
      <!-- 标签页 -->
      <a-tabs v-model="activeTab" @change="handleTabChange">
        <a-tab-pane key="all" title="全部客户" />
        <a-tab-pane key="my" title="我的客户" />
        <a-tab-pane key="pool" title="公海池" />
        <a-tab-pane key="recent" title="最近跟进" />
        <a-tab-pane key="unfollow7" title="7天未跟进" />
        <a-tab-pane key="unfollow30" title="30天未跟进" />
      </a-tabs>

      <!-- 数据表格 -->
      <a-table
        :loading="loading"
        :data="displayData"
        :pagination="pagination"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
        row-key="id"
        stripe
        column-resizable>
        <template #columns>
          <a-table-column title="客户编号" data-index="customerNo" :width="120" >
            <template #cell="{ record }">
              <a-link @click="handleView(record)">{{ record.customerNo }}</a-link>
            </template>
          </a-table-column>
          <a-table-column title="客户主体" data-index="entityName" :width="180" >
            <template #cell="{ record }">
              <a-link @click="handleView(record)">{{ record.entityName }}</a-link>
            </template>
          </a-table-column>
          <a-table-column title="客户名称" data-index="name" :width="200" >
            <template #cell="{ record }">
              <a-link @click="handleView(record)">{{ record.name }}</a-link>
            </template>
          </a-table-column>
          <a-table-column title="行业" data-index="industry" :width="120" >
            <template #cell="{ record }">
              {{ getIndustryLabel(record.industry) }}
            </template>
          </a-table-column>
          <a-table-column title="联系人数量" data-index="contactCount" :width="100" align="center">
            <template #cell="{ record }">
              <a-badge :count="record.contacts?.length || 0" show-zero />
            </template>
          </a-table-column>
          <a-table-column title="等级" data-index="level" :width="100" >
            <template #cell="{ record }">
              <a-tag :color="getLevelColor(record.level)">
                {{ getLevelLabel(record.level) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="状态" data-index="status" :width="120" >
            <template #cell="{ record }">
              <a-tag :color="getStatusColor(record.status)">
                {{ getStatusLabel(record.status) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="项目数" data-index="projectCount" :width="100" align="center">
            <template #cell="{ record }">
              <a-badge :count="record.projectCount || 0" show-zero />
            </template>
          </a-table-column>
          <a-table-column title="归属销售" data-index="ownerName" :width="120" />
          <a-table-column title="最近跟进" data-index="lastFollowTime" :width="160" >
            <template #cell="{ record }">
              {{ formatDate(record.lastFollowTime) }}
            </template>
          </a-table-column>
          <a-table-column title="操作" :width="200" fixed="right" >
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="handleFollow(record)">
                  跟进
                </a-button>
                <a-button type="text" size="small" @click="handleEdit(record)">
                  编辑
                </a-button>
                <a-dropdown trigger="hover">
                  <a-button type="text" size="small">
                    更多<icon-down />
                  </a-button>
                  <template #content>
                    <a-doption @click="handleView(record)">查看详情</a-doption>
                    <a-doption @click="handleTransfer(record)">转移客户</a-doption>
                    <a-doption @click="handleViewProjects(record)">查看项目</a-doption>
                  </template>
                </a-dropdown>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <!-- 新建/编辑客户弹窗 -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalTitle"
      :width="700"
      :footer="false"
      @cancel="modalVisible = false"
    >
      <CustomerForm
        v-if="modalVisible"
        :type="modalType"
        :data="currentRow"
        @submit="handleModalSubmit"
        @cancel="modalVisible = false"
      />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconSearch, IconPlus, IconDown } from '@arco-design/web-vue/es/icon'
import { 
  INDUSTRY_LIST, 
  CUSTOMER_LEVEL, 
  CUSTOMER_STATUS,
  getDictLabel, 
  getDictColor 
} from '@/utils/dict'
import CustomerForm from './components/CustomerForm.vue'

const router = useRouter()
const route = useRoute()

// 判断是否是我的客户页面
const isMyCustomer = computed(() => route.path === '/customer/my')

const loading = ref(false)
const modalVisible = ref(false)
const modalType = ref('add')
const modalTitle = ref('新建客户')
const currentRow = ref(null)
const activeTab = ref('all')

const searchForm = reactive({
  keyword: '',
  industry: undefined,
  level: undefined,
  status: undefined
})

const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 20
})

// 客户数据
const tableData = ref([
  {
    id: 1,
    customerNo: '1501',
    entityName: '阿里巴巴网络技术有限公司',
    name: '电商平台升级项目',
    industry: 'internet',
    level: 'A',
    status: 'signed',
    projectCount: 3,
    ownerName: '李四',
    lastFollowTime: '2024-03-20 14:30',
    contacts: [
      { id: 101, name: '张三', phone: '138****8888', email: 'zhangsan@alibaba.com', position: '技术总监', isPrimary: true },
      { id: 102, name: '李四', phone: '138****7777', email: 'lisi@alibaba.com', position: '项目经理', isPrimary: false },
      { id: 103, name: '王五', phone: '138****6666', email: 'wangwu@alibaba.com', position: '产品经理', isPrimary: false }
    ]
  },
  {
    id: 2,
    customerNo: '1502',
    entityName: '腾讯科技（深圳）有限公司',
    name: '企业微信定制开发',
    industry: 'internet',
    level: 'A',
    status: 'intention',
    projectCount: 1,
    ownerName: '李四',
    lastFollowTime: '2024-03-18 10:00',
    contacts: [
      { id: 201, name: '王五', phone: '139****9999', email: 'wangwu@tencent.com', position: 'CTO', isPrimary: true }
    ]
  },
  {
    id: 3,
    customerNo: '1503',
    entityName: '招商银行股份有限公司',
    name: '移动银行APP优化',
    industry: 'finance',
    level: 'B',
    status: 'potential',
    projectCount: 2,
    ownerName: '王五',
    lastFollowTime: '2024-03-15 16:00',
    contacts: [
      { id: 301, name: '赵六', phone: '137****7777', email: 'zhaoliu@cmbchina.com', position: '信息部经理', isPrimary: true },
      { id: 302, name: '钱七', phone: '137****6666', email: 'qianqi@cmbchina.com', position: '技术主管', isPrimary: false }
    ]
  },
  {
    id: 4,
    customerNo: '1504',
    entityName: '中国平安保险（集团）股份有限公司',
    name: '保险理赔系统开发',
    industry: 'finance',
    level: 'B',
    status: 'signed',
    projectCount: 1,
    ownerName: '王五',
    lastFollowTime: '2024-03-10 09:30',
    contacts: [
      { id: 401, name: '钱七', phone: '136****6666', email: 'qianqi@pingan.com', position: 'IT总监', isPrimary: true }
    ]
  },
  {
    id: 5,
    customerNo: '1505',
    entityName: '美团点评',
    name: '外卖小程序开发',
    industry: 'internet',
    level: 'A',
    status: 'intention',
    projectCount: 0,
    ownerName: '张三',
    lastFollowTime: '2024-03-12 11:00',
    contacts: [
      { id: 501, name: '孙八', phone: '135****5555', email: 'sunba@meituan.com', position: '技术负责人', isPrimary: true },
      { id: 502, name: '周九', phone: '135****4444', email: 'zhoujiu@meituan.com', position: '产品经理', isPrimary: false },
      { id: 503, name: '吴十', phone: '135****3333', email: 'wushi@meituan.com', position: '开发经理', isPrimary: false }
    ]
  }
])

// 根据路由过滤数据
const filteredTableData = computed(() => {
  let data = tableData.value
  // 路由过滤（我的客户）
  if (isMyCustomer.value) {
    data = data.filter(item => item.ownerName === '当前用户' || item.ownerName === '张三')
  }
  // Tab 过滤
  if (activeTab.value === 'my') {
    data = data.filter(item => item.ownerName === '张三' || item.ownerName === '当前用户')
  } else if (activeTab.value === 'pool') {
    data = data.filter(item => !item.ownerName)
  } else if (activeTab.value === 'recent') {
    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000
    data = data.filter(item => item.lastFollowTime && new Date(item.lastFollowTime).getTime() > threeDaysAgo)
  } else if (activeTab.value === 'unfollow7') {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    data = data.filter(item => !item.lastFollowTime || new Date(item.lastFollowTime).getTime() < sevenDaysAgo)
  } else if (activeTab.value === 'unfollow30') {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    data = data.filter(item => !item.lastFollowTime || new Date(item.lastFollowTime).getTime() < thirtyDaysAgo)
  }
  // 关键词搜索
  if (searchForm.keyword) {
    const kw = searchForm.keyword.toLowerCase()
    data = data.filter(item =>
      item.name?.toLowerCase().includes(kw) ||
      item.entityName?.toLowerCase().includes(kw) ||
      item.contacts?.some(c => c.name?.includes(searchForm.keyword) || c.phone?.includes(searchForm.keyword))
    )
  }
  // 行业筛选
  if (searchForm.industry) {
    data = data.filter(item => item.industry === searchForm.industry)
  }
  // 等级筛选
  if (searchForm.level) {
    data = data.filter(item => item.level === searchForm.level)
  }
  // 状态筛选
  if (searchForm.status) {
    data = data.filter(item => item.status === searchForm.status)
  }
  return data
})

// 计算属性用于表格数据（含分页）
const displayData = computed(() => {
  const data = filteredTableData.value
  pagination.total = data.length
  const start = (pagination.current - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

const getIndustryLabel = (value) => getDictLabel(INDUSTRY_LIST, value)
const getLevelLabel = (value) => getDictLabel(CUSTOMER_LEVEL, value)
const getLevelColor = (value) => getDictColor(CUSTOMER_LEVEL, value)
const getStatusLabel = (value) => getDictLabel(CUSTOMER_STATUS, value)
const getStatusColor = (value) => getDictColor(CUSTOMER_STATUS, value)

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleSearch = () => {
  pagination.current = 1
}
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.industry = undefined
  searchForm.level = undefined
  searchForm.status = undefined
  pagination.current = 1
}
const handleTabChange = (tab) => {
  activeTab.value = tab
  pagination.current = 1
}
const handlePageChange = (page) => {
  pagination.current = page
}
const handlePageSizeChange = (size) => {
  pagination.pageSize = size
  pagination.current = 1
}

const handleAdd = () => {
  modalType.value = 'add'
  modalTitle.value = '新建客户'
  currentRow.value = null
  modalVisible.value = true
}

const handleEdit = (record) => {
  modalType.value = 'edit'
  modalTitle.value = '编辑客户'
  currentRow.value = { ...record }
  modalVisible.value = true
}

const handleView = (record) => {
  router.push(`/customer/${record.id}`)
}

const handleViewProjects = (record) => {
  router.push(`/project?customerId=${record.customerNo}`)
}

const handleFollow = (record) => {
  Message.success(`跟进客户：${record.name}`)
}

const handleTransfer = (record) => {
  Message.success(`转移客户：${record.name}`)
}

const handleImport = () => {
  Message.success('导入功能开发中...')
}

const handleExport = () => {
  Message.success('导出功能开发中...')
}

const handleModalSubmit = (values) => {
  if (modalType.value === 'add') {
    const maxNo = Math.max(...tableData.value.map(c => parseInt(c.customerNo)), 1500)
    tableData.value.push({
      ...values,
      id: Date.now(),
      customerNo: String(maxNo + 1),
      projectCount: 0,
      ownerName: '当前用户'
    })
    Message.success('客户创建成功')
  } else {
    const index = tableData.value.findIndex(c => c.id === currentRow.value.id)
    if (index > -1) {
      tableData.value[index] = { ...tableData.value[index], ...values }
    }
    Message.success('客户更新成功')
  }
  modalVisible.value = false
}
</script>

<style scoped lang="less">
.customer-page {
  .search-card {
    margin-bottom: 16px;
  }
}
</style>
