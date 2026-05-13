<template>
  <div class="project-detail-page">
    <a-page-header
      title="项目详情"
      :subtitle="project.projectNo"
      @back="goBack"
    >
      <template #extra>
        <a-space>
          <a-button @click="handleEdit">
            <template #icon><icon-pen /></template>
            编辑
          </a-button>
          <a-button type="primary" @click="handleAddPhase">
            <template #icon><icon-plus /></template>
            新增期号
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- 项目概览 -->
    <a-card class="overview-card" :bordered="false">
      <div class="project-overview">
        <div class="overview-header">
          <h2>{{ project.name }}</h2>
          <a-tag :color="getStatusColor(project.status)" size="large">
            {{ getStatusLabel(project.status) }}
          </a-tag>
        </div>
        <div class="overview-meta">
          <span>客户：{{ project.customerName }}</span>
          <a-divider direction="vertical" />
          <span>项目编号：{{ project.projectNo }}</span>
          <a-divider direction="vertical" />
          <span>期数：{{ project.phaseCount }}期</span>
          <a-divider direction="vertical" />
          <span>项目经理：{{ project.managerName }}</span>
        </div>
      </div>
    </a-card>

    <!-- 金额统计 -->
    <a-row :gutter="[16, 16]" class="stat-row">
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-label">项目总金额</div>
          <div class="stat-value" style="color: #f5319d">
            ¥{{ formatAmount(project.totalAmount) }}
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-label">已完成金额</div>
          <div class="stat-value" style="color: #52c41a">
            ¥{{ formatAmount(project.completedAmount || 0) }}
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-label">进行中金额</div>
          <div class="stat-value" style="color: #1890ff">
            ¥{{ formatAmount(project.inProgressAmount || 0) }}
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-label">未开始金额</div>
          <div class="stat-value" style="color: #faad14">
            ¥{{ formatAmount(project.notStartedAmount || 0) }}
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 期号列表 -->
    <a-card class="phases-card table-resizable" :bordered="false" title="期号列表">
      <a-table
        :data="phases"
        stripe
        row-key="id"
        column-resizable
      >
        <template #columns>
          <a-table-column title="期号编号" data-index="phaseNo" :width="150">
            <template #cell="{ record }">
              <a-link @click="handleViewPhase(record)">{{ record.phaseNo }}</a-link>
            </template>
          </a-table-column>
          <a-table-column title="期号名称" data-index="name" :width="200" ellipsis tooltip />
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
          <a-table-column title="操作" :width="150" align="center">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="handleViewPhase(record)">查看</a-button>
                <a-button type="text" size="small" @click="handleEditPhase(record)">编辑</a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <!-- 编辑项目弹窗 -->
    <a-modal
      v-model:visible="editModalVisible"
      title="编辑项目"
      :width="700"
      :footer="false"
      @cancel="editModalVisible = false"
    >
      <ProjectForm
        v-if="editModalVisible"
        type="edit"
        :data="project"
        @submit="handleEditSubmit"
        @cancel="editModalVisible = false"
      />
    </a-modal>

    <!-- 新增/编辑期号弹窗 -->
    <a-modal
      v-model:visible="phaseModalVisible"
      :title="phaseModalTitle"
      :width="700"
      :footer="false"
      @cancel="phaseModalVisible = false"
    >
      <ProjectPhaseForm
        v-if="phaseModalVisible"
        :type="phaseModalType"
        :data="currentPhase"
        :customer-code="project.customerId"
        @submit="handlePhaseSubmit"
        @cancel="phaseModalVisible = false"
      />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconPen, IconPlus } from '@arco-design/web-vue/es/icon'
import { PROJECT_STATUS, getDictLabel, getDictColor } from '@/utils/dict'
import ProjectForm from './components/ProjectForm.vue'
import ProjectPhaseForm from './components/ProjectPhaseForm.vue'

const router = useRouter()
const route = useRoute()

const project = ref({
  id: 1,
  projectNo: '1501-01',
  name: '电商平台升级项目',
  customerId: '1501',
  customerName: '阿里巴巴',
  phaseCount: 3,
  totalAmount: 1200000,
  completedAmount: 800000,
  inProgressAmount: 400000,
  notStartedAmount: 0,
  status: 'in_progress',
  managerName: '张三'
})

// 期号数据
const phases = ref([
  {
    id: 1,
    phaseNo: '1501-01-01',
    name: '电商平台升级项目-第一期',
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
    amount: 400000,
    progress: 0,
    status: 'not_started',
    startDate: '2024-09-01',
    endDate: '2024-11-30',
    managerName: '王五'
  }
])

const editModalVisible = ref(false)
const phaseModalVisible = ref(false)
const phaseModalType = ref('add')
const phaseModalTitle = ref('新增期号')
const currentPhase = ref(null)

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

const goBack = () => {
  router.back()
}

const handleEdit = () => {
  editModalVisible.value = true
}

const handleEditSubmit = (values) => {
  project.value = { ...project.value, ...values }
  Message.success('更新成功')
  editModalVisible.value = false
}

const handleAddPhase = () => {
  phaseModalType.value = 'add'
  phaseModalTitle.value = '新增期号'
  currentPhase.value = null
  phaseModalVisible.value = true
}

const handleEditPhase = (record) => {
  phaseModalType.value = 'edit'
  phaseModalTitle.value = '编辑期号'
  currentPhase.value = { ...record }
  phaseModalVisible.value = true
}

const handleViewPhase = (record) => {
  router.push(`/project/phase/${record.id}`)
}

const handlePhaseSubmit = (values) => {
  if (phaseModalType.value === 'add') {
    const phaseCount = phases.value.length + 1
    const phaseNo = `${project.value.projectNo}-${String(phaseCount).padStart(2, '0')}`
    
    phases.value.push({
      ...values,
      id: Date.now(),
      phaseNo,
      fullCode: phaseNo
    })
    project.value.phaseCount = phases.value.length
    project.value.totalAmount = phases.value.reduce((sum, p) => sum + (p.amount || 0), 0)
    Message.success('创建成功')
  } else {
    const index = phases.value.findIndex(p => p.id === currentPhase.value.id)
    if (index > -1) {
      phases.value[index] = { ...phases.value[index], ...values }
    }
    project.value.totalAmount = phases.value.reduce((sum, p) => sum + (p.amount || 0), 0)
    Message.success('更新成功')
  }
  phaseModalVisible.value = false
}
</script>

<style scoped lang="less">
.project-detail-page {
  .overview-card {
    margin-bottom: 16px;

    .project-overview {
      .overview-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;

        h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 500;
        }
      }

      .overview-meta {
        color: var(--color-text-3);
        font-size: 14px;
      }
    }
  }

  .stat-row {
    margin-bottom: 16px;

    .stat-card {
      text-align: center;

      .stat-label {
        color: var(--color-text-3);
        font-size: 14px;
        margin-bottom: 8px;
      }

      .stat-value {
        font-size: 24px;
        font-weight: 600;
      }
    }
  }

  .phases-card {
    :deep(.arco-card-header) {
      border-bottom: 1px solid var(--color-neutral-3);
    }
  }
}
</style>
