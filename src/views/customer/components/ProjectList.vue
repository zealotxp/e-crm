<template>
  <div class="project-list table-resizable">
    <div class="list-header">
      <a-button type="primary" @click="handleAdd">
        <template #icon><icon-plus /></template>
        新建项目
      </a-button>
    </div>
    
    <a-table :data="projects" stripe column-resizable>
      <template #columns>
        <a-table-column title="项目名称" data-index="name">
          <template #cell="{ record }">
            <a-link @click="handleView(record)">{{ record.name }}</a-link>
          </template>
        </a-table-column>
        <a-table-column title="项目类型" data-index="type">
          <template #cell="{ record }">
            {{ getTypeLabel(record.type) }}
          </template>
        </a-table-column>
        <a-table-column title="状态" data-index="status">
          <template #cell="{ record }">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusLabel(record.status) }}
            </a-tag>
          </template>
        </a-table-column>
        <a-table-column title="进度" data-index="progress">
          <template #cell="{ record }">
            <a-progress
              :percent="record.progress / 100"
              :color="getProgressColor(record.progress, record.status)"
              size="small"
            />
          </template>
        </a-table-column>
        <a-table-column title="项目经理" data-index="managerName" />
        <a-table-column title="计划周期" data-index="period">
          <template #cell="{ record }">
            {{ record.startDate }} ~ {{ record.endDate }}
          </template>
        </a-table-column>
        <a-table-column title="操作" width="150">
          <template #cell="{ record }">
            <a-space>
              <a-button type="text" size="small" @click="handleView(record)">
                查看
              </a-button>
              <a-button type="text" size="small" @click="handleGantt(record)">
                甘特图
              </a-button>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { IconPlus } from '@arco-design/web-vue/es/icon'
import { PROJECT_STATUS, getDictLabel, getDictColor } from '@/utils/dict'

const props = defineProps({
  customerId: {
    type: [String, Number],
    required: true
  }
})

const router = useRouter()

// 项目类型
const projectTypes = {
  custom: '定制开发',
  product: '产品实施',
  maintenance: '运维服务'
}

// 项目数据
const projects = ref([
  {
    id: 1,
    name: '电商平台升级项目',
    type: 'custom',
    status: 'in_progress',
    progress: 65,
    managerName: '张三',
    startDate: '2024-03-01',
    endDate: '2024-08-31'
  },
  {
    id: 2,
    name: '移动端APP开发项目',
    type: 'custom',
    status: 'delayed',
    progress: 40,
    managerName: '李四',
    startDate: '2024-02-15',
    endDate: '2024-06-30'
  },
  {
    id: 3,
    name: '系统运维服务',
    type: 'maintenance',
    status: 'in_progress',
    progress: 80,
    managerName: '王五',
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  }
])

// 获取类型标签
const getTypeLabel = (type) => projectTypes[type] || type

// 获取状态标签和颜色
const getStatusLabel = (value) => getDictLabel(PROJECT_STATUS, value)
const getStatusColor = (value) => getDictColor(PROJECT_STATUS, value)

// 获取进度条颜色
const getProgressColor = (progress, status) => {
  if (status === 'delayed') return '#ff4d4f'
  if (progress >= 80) return '#52c41a'
  if (progress >= 50) return '#1890ff'
  return '#faad14'
}

// 新建项目
const handleAdd = () => {
  router.push('/project?customerId=' + props.customerId)
}

// 查看项目
const handleView = (record) => {
  router.push('/project?id=' + record.id)
}

// 查看甘特图
const handleGantt = (record) => {
  router.push('/project?id=' + record.id + '&view=gantt')
}
</script>

<style scoped lang="less">
.project-list {
  .list-header {
    margin-bottom: 16px;
  }
}
</style>
