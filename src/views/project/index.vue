<template>
  <div class="project-page">
    <!-- 搜索栏 -->
    <a-card class="search-card" :bordered="false">
      <a-form :model="searchForm" layout="inline">
        <a-form-item field="keyword" hide-label>
          <a-input-search
            v-model="searchForm.keyword"
            placeholder="搜索客户/项目/期号"
            style="width: 300px"
            allow-clear
            @search="handleSearch"
          />
        </a-form-item>
        <a-form-item field="status" hide-label>
          <a-select
            v-model="searchForm.status"
            placeholder="状态筛选"
            style="width: 140px"
            allow-clear
          >
            <a-option
              v-for="item in PROJECT_STATUS"
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
          <a-button @click="handleReset" style="margin-left: 8px">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 树形表格 -->
    <a-card class="table-card table-resizable" :bordered="false">
      <template #title>
        <a-space>
          <a-button type="primary" @click="handleAddCustomer">
            <template #icon><icon-plus /></template>
            新建客户
          </a-button>
          <a-button @click="expandAll">
            <template #icon><icon-expand /></template>
            展开全部
          </a-button>
          <a-button @click="collapseAll">
            <template #icon><icon-shrink /></template>
            收起全部
          </a-button>
        </a-space>
      </template>

      <a-table
        :data="treeData"
        :loading="loading"
        :pagination="false"
        row-key="id"
        stripe
        column-resizable
        :expandable="{
          expandedRowKeys: expandedKeys,
          onExpand: handleExpand,
          defaultExpandAllRows: false
        }"
      >
        <template #columns>
          <!-- 名称列（树形展示） -->
          <a-table-column title="名称" data-index="name" :width="320" fixed="left">
            <template #cell="{ record }">
              <div class="tree-name" :class="`level-${record.level}`">
                <span class="type-icon">
                  <icon-user v-if="record.level === 1" />
                  <icon-apps v-else-if="record.level === 2" />
                  <icon-calendar v-else />
                </span>
                <span class="name-text">{{ record.name }}</span>
                <a-tag v-if="record.level === 1" size="small" color="blue">客户</a-tag>
                <a-tag v-else-if="record.level === 2" size="small" color="green">项目</a-tag>
                <a-tag v-else size="small" color="orange">期号</a-tag>
              </div>
            </template>
          </a-table-column>

          <!-- 编号列 -->
          <a-table-column title="编号" data-index="code" :width="150">
            <template #cell="{ record }">
              <span class="code-text">{{ record.code }}</span>
            </template>
          </a-table-column>

          <!-- 金额列 -->
          <a-table-column title="金额" data-index="amount" :width="140" align="right">
            <template #cell="{ record }">
              <span v-if="record.amount" class="amount-text">
                ¥{{ formatAmount(record.amount) }}
              </span>
              <span v-else-if="record.totalAmount" class="amount-text total">
                ¥{{ formatAmount(record.totalAmount) }}
              </span>
              <span v-else>-</span>
            </template>
          </a-table-column>

          <!-- 进度列 -->
          <a-table-column title="进度" data-index="progress" :width="120">
            <template #cell="{ record }">
              <a-progress
                v-if="record.progress !== undefined"
                :percent="record.progress / 100"
                :color="getProgressColor(record.progress, record.status)"
                size="small"
              />
              <span v-else>-</span>
            </template>
          </a-table-column>

          <!-- 状态列 -->
          <a-table-column title="状态" data-index="status" :width="100" align="center">
            <template #cell="{ record }">
              <a-tag v-if="record.status" :color="getStatusColor(record.status)" size="small">
                {{ getStatusLabel(record.status) }}
              </a-tag>
              <span v-else>-</span>
            </template>
          </a-table-column>

          <!-- 负责人列 -->
          <a-table-column title="负责人" data-index="managerName" :width="120">
            <template #cell="{ record }">
              {{ record.managerName || record.contactName || '-' }}
            </template>
          </a-table-column>

          <!-- 日期列 -->
          <a-table-column title="周期" :width="180">
            <template #cell="{ record }">
              <span v-if="record.startDate && record.endDate">
                {{ record.startDate }} ~ {{ record.endDate }}
              </span>
              <span v-else>-</span>
            </template>
          </a-table-column>

          <!-- 操作列 -->
          <a-table-column title="操作" :width="200" fixed="right" align="center">
            <template #cell="{ record }">
              <a-space>
                <!-- 客户级别操作 -->
                <template v-if="record.level === 1">
                  <a-button type="text" size="small" @click="handleViewCustomer(record)">查看</a-button>
                  <a-button type="text" size="small" @click="handleAddProject(record)">新建项目</a-button>
                </template>

                <!-- 项目级别操作 -->
                <template v-else-if="record.level === 2">
                  <a-button type="text" size="small" @click="handleViewProject(record)">查看</a-button>
                  <a-button type="text" size="small" @click="handleAddPhase(record)">新建期号</a-button>
                </template>

                <!-- 期号级别操作 -->
                <template v-else>
                  <a-button type="text" size="small" @click="handleViewPhase(record)">查看</a-button>
                  <a-button type="text" size="small" @click="handleEditPhase(record)">编辑</a-button>
                </template>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <!-- 新建客户弹窗 -->
    <a-modal
      v-model:visible="customerModalVisible"
      title="新建客户"
      :width="700"
      :footer="false"
      @cancel="customerModalVisible = false"
    >
      <CustomerForm
        v-if="customerModalVisible"
        type="add"
        @submit="handleCustomerSubmit"
        @cancel="customerModalVisible = false"
      />
    </a-modal>

    <!-- 新建项目弹窗 -->
    <a-modal
      v-model:visible="projectModalVisible"
      title="新建项目"
      :width="700"
      :footer="false"
      @cancel="projectModalVisible = false"
    >
      <ProjectForm
        v-if="projectModalVisible"
        type="add"
        :customer-id="currentCustomer?.id"
        @submit="handleProjectSubmit"
        @cancel="projectModalVisible = false"
      />
    </a-modal>

    <!-- 新建/编辑期号弹窗 -->
    <a-modal
      v-model:visible="phaseModalVisible"
      :title="phaseModalTitle"
      :width="700"
      :footer="false"
      @cancel="phaseModalVisible = false"
    >
      <PhaseForm
        v-if="phaseModalVisible"
        :type="phaseModalType"
        :data="currentPhase"
        :project="currentProject"
        @submit="handlePhaseSubmit"
        @cancel="phaseModalVisible = false"
      />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { 
  IconSearch, 
  IconPlus, 
  IconExpand, 
  IconShrink,
  IconUser,
  IconApps,
  IconCalendar
} from '@arco-design/web-vue/es/icon'
import { PROJECT_STATUS, getDictLabel, getDictColor } from '@/utils/dict'
import CustomerForm from '../customer/components/CustomerForm.vue'
import ProjectForm from './components/ProjectForm.vue'
import PhaseForm from '../phase/components/PhaseForm.vue'

const router = useRouter()

const loading = ref(false)
const expandedKeys = ref([])
const customerModalVisible = ref(false)
const projectModalVisible = ref(false)
const phaseModalVisible = ref(false)
const phaseModalType = ref('add')
const phaseModalTitle = ref('新建期号')
const currentCustomer = ref(null)
const currentProject = ref(null)
const currentPhase = ref(null)

const searchForm = reactive({
  keyword: '',
  status: undefined
})

// 原始数据
const customers = ref([
  {
    id: 'c-1501',
    code: '1501',
    name: '阿里巴巴网络技术有限公司',
    contactName: '张三',
    status: 'signed',
    projects: [
      {
        id: 'p-1501-01',
        code: '1501-01',
        name: '电商平台升级项目',
        customerId: 'c-1501',
        totalAmount: 1200000,
        status: 'in_progress',
        managerName: '张三',
        startDate: '2024-03-01',
        endDate: '2024-11-30',
        phases: [
          {
            id: 'ph-1501-01-01',
            code: '1501-01-01',
            name: '电商平台升级项目-第一期',
            projectId: 'p-1501-01',
            amount: 400000,
            progress: 100,
            status: 'completed',
            managerName: '张三',
            startDate: '2024-03-01',
            endDate: '2024-05-31'
          },
          {
            id: 'ph-1501-01-02',
            code: '1501-01-02',
            name: '电商平台升级项目-第二期',
            projectId: 'p-1501-01',
            amount: 400000,
            progress: 60,
            status: 'in_progress',
            managerName: '李四',
            startDate: '2024-06-01',
            endDate: '2024-08-31'
          },
          {
            id: 'ph-1501-01-03',
            code: '1501-01-03',
            name: '电商平台升级项目-第三期',
            projectId: 'p-1501-01',
            amount: 400000,
            progress: 0,
            status: 'not_started',
            managerName: '王五',
            startDate: '2024-09-01',
            endDate: '2024-11-30'
          }
        ]
      },
      {
        id: 'p-1501-02',
        code: '1501-02',
        name: '移动端APP开发项目',
        customerId: 'c-1501',
        totalAmount: 800000,
        status: 'completed',
        managerName: '李四',
        startDate: '2024-02-01',
        endDate: '2024-07-31',
        phases: [
          {
            id: 'ph-1501-02-01',
            code: '1501-02-01',
            name: '移动端APP开发项目-第一期',
            projectId: 'p-1501-02',
            amount: 400000,
            progress: 100,
            status: 'completed',
            managerName: '李四',
            startDate: '2024-02-01',
            endDate: '2024-04-30'
          },
          {
            id: 'ph-1501-02-02',
            code: '1501-02-02',
            name: '移动端APP开发项目-第二期',
            projectId: 'p-1501-02',
            amount: 400000,
            progress: 100,
            status: 'completed',
            managerName: '张三',
            startDate: '2024-05-01',
            endDate: '2024-07-31'
          }
        ]
      }
    ]
  },
  {
    id: 'c-1502',
    code: '1502',
    name: '腾讯科技（深圳）有限公司',
    contactName: '王五',
    status: 'intention',
    projects: [
      {
        id: 'p-1502-01',
        code: '1502-01',
        name: '微信小程序开发',
        customerId: 'c-1502',
        totalAmount: 500000,
        status: 'not_started',
        managerName: '王五',
        startDate: '2024-04-01',
        endDate: '2024-08-31',
        phases: [
          {
            id: 'ph-1502-01-01',
            code: '1502-01-01',
            name: '微信小程序开发-第一期',
            projectId: 'p-1502-01',
            amount: 500000,
            progress: 0,
            status: 'not_started',
            managerName: '王五',
            startDate: '2024-04-01',
            endDate: '2024-08-31'
          }
        ]
      }
    ]
  },
  {
    id: 'c-1503',
    code: '1503',
    name: '招商银行股份有限公司',
    contactName: '赵六',
    status: 'potential',
    projects: [
      {
        id: 'p-1503-01',
        code: '1503-01',
        name: '数据中台建设',
        customerId: 'c-1503',
        totalAmount: 2000000,
        status: 'in_progress',
        managerName: '赵六',
        startDate: '2024-01-10',
        endDate: '2024-12-31',
        phases: [
          {
            id: 'ph-1503-01-01',
            code: '1503-01-01',
            name: '数据中台建设-第一期',
            projectId: 'p-1503-01',
            amount: 500000,
            progress: 100,
            status: 'completed',
            managerName: '赵六',
            startDate: '2024-01-10',
            endDate: '2024-03-31'
          },
          {
            id: 'ph-1503-01-02',
            code: '1503-01-02',
            name: '数据中台建设-第二期',
            projectId: 'p-1503-01',
            amount: 500000,
            progress: 80,
            status: 'in_progress',
            managerName: '钱七',
            startDate: '2024-04-01',
            endDate: '2024-06-30'
          },
          {
            id: 'ph-1503-01-03',
            code: '1503-01-03',
            name: '数据中台建设-第三期',
            projectId: 'p-1503-01',
            amount: 500000,
            progress: 30,
            status: 'in_progress',
            managerName: '孙八',
            startDate: '2024-07-01',
            endDate: '2024-09-30'
          },
          {
            id: 'ph-1503-01-04',
            code: '1503-01-04',
            name: '数据中台建设-第四期',
            projectId: 'p-1503-01',
            amount: 500000,
            progress: 0,
            status: 'not_started',
            managerName: '周九',
            startDate: '2024-10-01',
            endDate: '2024-12-31'
          }
        ]
      }
    ]
  }
])

// 构建树形数据
const treeData = computed(() => {
  const result = []
  customers.value.forEach(customer => {
    // 客户节点
    const customerNode = {
      ...customer,
      id: customer.id,
      code: customer.code,
      name: customer.name,
      level: 1,
      children: []
    }

    // 项目节点
    if (customer.projects) {
      customer.projects.forEach(project => {
        const projectNode = {
          ...project,
          id: project.id,
          code: project.code,
          name: project.name,
          level: 2,
          children: []
        }

        // 期号节点
        if (project.phases) {
          project.phases.forEach(phase => {
            projectNode.children.push({
              ...phase,
              id: phase.id,
              code: phase.code,
              name: phase.name,
              level: 3
            })
          })
        }

        customerNode.children.push(projectNode)
      })
    }

    result.push(customerNode)
  })
  return result
})

const getStatusLabel = (status) => getDictLabel(PROJECT_STATUS, status)
const getStatusColor = (status) => getDictColor(PROJECT_STATUS, status)

const getProgressColor = (progress, status) => {
  if (status === 'delayed') return '#ff4d4f'
  if (progress >= 80) return '#52c41a'
  if (progress >= 50) return '#1890ff'
  return '#faad14'
}

const formatAmount = (amount) => {
  return amount.toLocaleString('zh-CN')
}

const handleExpand = (rowKey, expanded) => {
  if (expanded) {
    expandedKeys.value.push(rowKey)
  } else {
    expandedKeys.value = expandedKeys.value.filter(key => key !== rowKey)
  }
}

const expandAll = () => {
  const keys = []
  const collectKeys = (nodes) => {
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        keys.push(node.id)
        collectKeys(node.children)
      }
    })
  }
  collectKeys(treeData.value)
  expandedKeys.value = keys
}

const collapseAll = () => {
  expandedKeys.value = []
}

const handleSearch = () => {}
const handleReset = () => {}

const handleAddCustomer = () => {
  customerModalVisible.value = true
}

const handleAddProject = (customer) => {
  currentCustomer.value = customer
  projectModalVisible.value = true
}

const handleAddPhase = (project) => {
  currentProject.value = project
  phaseModalType.value = 'add'
  phaseModalTitle.value = '新建期号'
  currentPhase.value = null
  phaseModalVisible.value = true
}

const handleViewCustomer = (customer) => {
  router.push(`/customer/${customer.id.replace('c-', '')}`)
}

const handleViewProject = (project) => {
  router.push(`/project/detail/${project.id.replace('p-', '')}`)
}

const handleViewPhase = (phase) => {
  router.push(`/phase/detail/${phase.id.replace('ph-', '')}`)
}

const handleEditPhase = (phase) => {
  currentPhase.value = phase
  phaseModalType.value = 'edit'
  phaseModalTitle.value = '编辑期号'
  phaseModalVisible.value = true
}

const handleCustomerSubmit = (values) => {
  const maxCode = Math.max(...customers.value.map(c => parseInt(c.code)), 1500)
  const newCode = String(maxCode + 1)
  
  customers.value.push({
    ...values,
    id: `c-${newCode}`,
    code: newCode,
    projects: []
  })
  Message.success('客户创建成功')
  customerModalVisible.value = false
}

const handleProjectSubmit = (values) => {
  const customer = customers.value.find(c => c.id === currentCustomer.value.id)
  if (customer) {
    const projectCount = customer.projects.length + 1
    const projectCode = `${customer.code}-${String(projectCount).padStart(2, '0')}`
    
    customer.projects.push({
      ...values,
      id: `p-${projectCode}`,
      code: projectCode,
      customerId: customer.id,
      totalAmount: 0,
      phases: []
    })
    Message.success('项目创建成功')
  }
  projectModalVisible.value = false
}

const handlePhaseSubmit = (values) => {
  const customer = customers.value.find(c => c.id === currentProject.value.customerId)
  if (customer) {
    const project = customer.projects.find(p => p.id === currentProject.value.id)
    if (project) {
      if (phaseModalType.value === 'add') {
        const phaseCount = project.phases.length + 1
        const phaseCode = `${project.code}-${String(phaseCount).padStart(2, '0')}`
        
        project.phases.push({
          ...values,
          id: `ph-${phaseCode}`,
          code: phaseCode,
          projectId: project.id
        })
        project.totalAmount = project.phases.reduce((sum, p) => sum + (p.amount || 0), 0)
        Message.success('期号创建成功')
      } else {
        const index = project.phases.findIndex(p => p.id === currentPhase.value.id)
        if (index > -1) {
          project.phases[index] = { ...project.phases[index], ...values }
        }
        project.totalAmount = project.phases.reduce((sum, p) => sum + (p.amount || 0), 0)
        Message.success('期号更新成功')
      }
    }
  }
  phaseModalVisible.value = false
}
</script>

<style scoped lang="less">
.project-page {
  .search-card {
    margin-bottom: 16px;
  }

  .tree-name {
    display: flex;
    align-items: center;
    gap: 8px;

    .type-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      font-size: 14px;
    }

    .name-text {
      font-weight: 500;
    }

    &.level-1 {
      .type-icon {
        background: #e6f7ff;
        color: #1890ff;
      }
      .name-text {
        font-size: 15px;
      }
    }

    &.level-2 {
      .type-icon {
        background: #f6ffed;
        color: #52c41a;
      }
    }

    &.level-3 {
      .type-icon {
        background: #fff7e6;
        color: #fa8c16;
      }
    }
  }

  .code-text {
    font-family: monospace;
    font-weight: 500;
    color: var(--color-text-2);
  }

  .amount-text {
    font-weight: 600;
    color: #f5319d;

    &.total {
      color: #1890ff;
    }
  }
}
</style>
