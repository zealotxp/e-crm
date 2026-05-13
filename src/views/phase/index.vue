<template>
  <div class="phase-page">
    <!-- 搜索栏 -->
    <a-card class="search-card" :bordered="false">
      <a-form :model="searchForm" layout="inline">
        <a-form-item field="keyword" hide-label>
          <a-input-search
            v-model="searchForm.keyword"
            placeholder="搜索期号编号/期号名称"
            style="width: 280px"
            allow-clear
            @search="handleSearch"
          />
        </a-form-item>
        <a-form-item field="customerId" hide-label>
          <a-select
            v-model="searchForm.customerId"
            placeholder="选择客户"
            style="width: 160px"
            allow-clear
            allow-search
            @change="handleCustomerChange"
          >
            <a-option
              v-for="item in customerOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </a-select>
        </a-form-item>
        <a-form-item field="projectId" hide-label>
          <a-select
            v-model="searchForm.projectId"
            placeholder="选择项目"
            style="width: 180px"
            allow-clear
            allow-search
          >
            <a-option
              v-for="item in filteredProjects"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </a-select>
        </a-form-item>
        <a-form-item field="status" hide-label>
          <a-select
            v-model="searchForm.status"
            placeholder="期号状态"
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

    <!-- 期号列表 -->
    <a-card class="table-card table-resizable" :bordered="false">
      <template #title>
        <a-space>
          <a-button type="primary" @click="handleAdd">
            <template #icon><icon-plus /></template>
            新建期号
          </a-button>
        </a-space>
      </template>

      <a-table
        :data="phases"
        stripe
        row-key="id"
        :scroll="{ x: 1200 }"
        column-resizable
      >
        <template #columns>
          <a-table-column title="期号编号" data-index="phaseNo" :width="150" fixed="left">
            <template #cell="{ record }">
              <a-link @click="handleView(record)">{{ record.phaseNo }}</a-link>
            </template>
          </a-table-column>
          <a-table-column title="期号名称" data-index="name" :width="200" ellipsis tooltip />
          <a-table-column title="所属项目" data-index="projectName" :width="160" />
          <a-table-column title="客户" data-index="customerName" :width="140" />
          <a-table-column title="期号金额" data-index="amount" :width="140" align="right">
            <template #cell="{ record }">
              <span style="font-weight: 500; color: #f5319d">
                ¥{{ formatAmount(record.amount) }}
              </span>
            </template>
          </a-table-column>
          <a-table-column title="进度" data-index="progress" :width="120">
            <template #cell="{ record }">
              <a-progress
                :percent="record.progress / 100"
                :color="getProgressColor(record.progress, record.status)"
                size="small"
              />
            </template>
          </a-table-column>
          <a-table-column title="状态" data-index="status" :width="100" align="center">
            <template #cell="{ record }">
              <a-tag :color="getStatusColor(record.status)" size="small">
                {{ getStatusLabel(record.status) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="开始日期" data-index="startDate" :width="110" />
          <a-table-column title="结束日期" data-index="endDate" :width="110" />
          <a-table-column title="项目经理" data-index="managerName" :width="120" />
          <a-table-column title="操作" :width="150" fixed="right" align="center">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="handleView(record)">查看</a-button>
                <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <!-- 新建/编辑期号弹窗 -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalTitle"
      :width="700"
      :footer="false"
      @cancel="modalVisible = false"
    >
      <PhaseForm
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
import { IconSearch, IconPlus } from '@arco-design/web-vue/es/icon'
import { PROJECT_STATUS, getDictLabel, getDictColor } from '@/utils/dict'
import PhaseForm from './components/PhaseForm.vue'

const router = useRouter()
const route = useRoute()

const modalVisible = ref(false)
const modalType = ref('add')
const modalTitle = ref('新建期号')
const currentRow = ref(null)

const searchForm = reactive({
  keyword: '',
  customerId: route.query.customerId || undefined,
  projectId: route.query.projectId || undefined,
  status: undefined
})

const customerOptions = [
  { value: '1501', label: '阿里巴巴' },
  { value: '1502', label: '腾讯科技' },
  { value: '1503', label: '招商银行' },
  { value: '1504', label: '平安保险' }
]

const projectOptions = [
  { value: '1', label: '1501-01 电商平台升级项目', customerId: '1501' },
  { value: '2', label: '1501-02 移动端APP开发项目', customerId: '1501' },
  { value: '3', label: '1502-01 微信小程序开发', customerId: '1502' },
  { value: '4', label: '1503-01 数据中台建设', customerId: '1503' }
]

const filteredProjects = computed(() => {
  if (!searchForm.customerId) return projectOptions
  return projectOptions.filter(p => p.customerId === searchForm.customerId)
})

// 期号数据
const phases = ref([
  {
    id: 1,
    phaseNo: '1501-01-01',
    name: '电商平台升级项目-第一期',
    projectId: '1',
    projectName: '1501-01 电商平台升级项目',
    customerId: '1501',
    customerName: '阿里巴巴',
    amount: 400000,
    progress: 100,
    status: 'completed',
    startDate: '2024-03-01',
    endDate: '2024-05-31',
    managerName: '张三'
  },
  {
    id: 2,
    phaseNo: '1501-01-02',
    name: '电商平台升级项目-第二期',
    projectId: '1',
    projectName: '1501-01 电商平台升级项目',
    customerId: '1501',
    customerName: '阿里巴巴',
    amount: 400000,
    progress: 60,
    status: 'in_progress',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    managerName: '李四'
  },
  {
    id: 3,
    phaseNo: '1501-01-03',
    name: '电商平台升级项目-第三期',
    projectId: '1',
    projectName: '1501-01 电商平台升级项目',
    customerId: '1501',
    customerName: '阿里巴巴',
    amount: 400000,
    progress: 0,
    status: 'not_started',
    startDate: '2024-09-01',
    endDate: '2024-11-30',
    managerName: '王五'
  },
  {
    id: 4,
    phaseNo: '1501-02-01',
    name: '移动端APP开发项目-第一期',
    projectId: '2',
    projectName: '1501-02 移动端APP开发项目',
    customerId: '1501',
    customerName: '阿里巴巴',
    amount: 400000,
    progress: 100,
    status: 'completed',
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    managerName: '李四'
  },
  {
    id: 5,
    phaseNo: '1501-02-02',
    name: '移动端APP开发项目-第二期',
    projectId: '2',
    projectName: '1501-02 移动端APP开发项目',
    customerId: '1501',
    customerName: '阿里巴巴',
    amount: 400000,
    progress: 100,
    status: 'completed',
    startDate: '2024-05-01',
    endDate: '2024-07-31',
    managerName: '张三'
  }
])

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

const handleCustomerChange = () => {
  searchForm.projectId = undefined
}

const handleSearch = () => {}
const handleReset = () => {}

const handleAdd = () => {
  modalType.value = 'add'
  modalTitle.value = '新建期号'
  currentRow.value = null
  modalVisible.value = true
}

const handleEdit = (record) => {
  modalType.value = 'edit'
  modalTitle.value = '编辑期号'
  currentRow.value = { ...record }
  modalVisible.value = true
}

const handleView = (record) => {
  router.push(`/phase/detail/${record.id}`)
}

const handleModalSubmit = (values) => {
  if (modalType.value === 'add') {
    const project = projectOptions.find(p => p.value === values.projectId)
    const customer = customerOptions.find(c => c.value === project?.customerId)
    
    // 自动生成期号编号
    const existingPhases = phases.value.filter(p => p.projectId === values.projectId)
    const phaseNo = `${project?.label.split(' ')[0]}-${String(existingPhases.length + 1).padStart(2, '0')}`
    
    phases.value.push({
      ...values,
      id: Date.now(),
      phaseNo,
      projectName: project?.label || '',
      customerId: project?.customerId || '',
      customerName: customer?.label || ''
    })
    Message.success('创建成功')
  } else {
    const index = phases.value.findIndex(p => p.id === currentRow.value.id)
    if (index > -1) {
      phases.value[index] = { ...phases.value[index], ...values }
    }
    Message.success('更新成功')
  }
  modalVisible.value = false
}
</script>

<style scoped lang="less">
.phase-page {
  .search-card {
    margin-bottom: 16px;
  }
}
</style>
