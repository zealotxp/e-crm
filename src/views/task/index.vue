<template>
  <div class="task-page">
    <a-card class="project-select-card" :bordered="false">
      <a-space>
        <span>当前项目：</span>
        <a-select v-model="selectedProject" placeholder="选择项目" style="width: 300px">
          <a-option value="1" label="电商平台升级项目" />
          <a-option value="2" label="移动端APP开发" />
          <a-option value="3" label="数据中台建设" />
        </a-select>
        <a-radio-group v-model="viewMode" type="button">
          <a-radio value="kanban">
            <template #radio><icon-apps /></template>
            看板
          </a-radio>
          <a-radio value="list">
            <template #radio><icon-list /></template>
            列表
          </a-radio>
        </a-radio-group>
        <a-button type="primary" @click="handleAdd"><template #icon><icon-plus /></template>新建任务</a-button>
      </a-space>
    </a-card>

    <!-- 看板视图 -->
    <div v-if="viewMode === 'kanban'" class="kanban-board">
      <div v-for="status in taskStatuses" :key="status.value" class="kanban-column">
        <div class="column-header">
          <span class="status-name">{{ status.label }}</span>
          <a-tag :color="status.color">{{ getTaskCount(status.value) }}</a-tag>
        </div>
        <div class="column-content">
          <div v-for="task in getTasksByStatus(status.value)" :key="task.id" class="task-card" :class="{ 'high-priority': task.priority === 'high' }" @click="handleEdit(task)">
            <div class="task-header">
              <a-tag :color="getPriorityColor(task.priority)" size="small">{{ getPriorityLabel(task.priority) }}</a-tag>
              <span class="task-no">{{ task.taskNo }}</span>
            </div>
            <div class="task-title">{{ task.title }}</div>
            <div class="task-meta">
              <span class="task-assignee">
                <a-avatar :size="20" :style="{ background: '#1890ff' }">{{ task.assignee.charAt(0) }}</a-avatar>
                {{ task.assignee }}
              </span>
              <span class="task-deadline" :class="{ overdue: isOverdue(task.deadline) }">
                <icon-clock-circle /> {{ task.deadline }}
              </span>
            </div>
            <div v-if="task.estimatedHours" class="task-hours">
              <icon-clock-circle /> {{ task.actualHours || 0 }}h / {{ task.estimatedHours }}h
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 列表视图 -->
    <a-card v-else class="list-view" :bordered="false">
      <a-table :data="tasks" stripe>
        <template #columns>
          <a-table-column title="任务编号" data-index="taskNo" :width="100" />
          <a-table-column title="任务标题" data-index="title" :width="250" />
          <a-table-column title="优先级" data-index="priority" :width="100">
            <template #cell="{ record }">
              <a-tag :color="getPriorityColor(record.priority)" size="small">
                {{ getPriorityLabel(record.priority) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="状态" data-index="status" :width="100">
            <template #cell="{ record }">
              <a-tag :color="getStatusColor(record.status)">
                {{ getStatusLabel(record.status) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="负责人" data-index="assignee" :width="120">
            <template #cell="{ record }">
              <a-avatar :size="20" :style="{ background: '#1890ff' }">{{ record.assignee.charAt(0) }}</a-avatar>
              {{ record.assignee }}
            </template>
          </a-table-column>
          <a-table-column title="截止日期" data-index="deadline" :width="120">
            <template #cell="{ record }">
              <span :class="{ overdue: isOverdue(record.deadline) }">{{ record.deadline }}</span>
            </template>
          </a-table-column>
          <a-table-column title="预估工时" data-index="estimatedHours" :width="100" align="center">
            <template #cell="{ record }">
              {{ record.estimatedHours }}h
            </template>
          </a-table-column>
          <a-table-column title="实际工时" data-index="actualHours" :width="100" align="center">
            <template #cell="{ record }">
              {{ record.actualHours || 0 }}h
            </template>
          </a-table-column>
          <a-table-column title="操作" :width="150" fixed="right">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
                <a-button type="text" size="small" status="danger">删除</a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    
    <a-modal v-model:visible="modalVisible" :title="modalTitle" :width="700" :footer="false" @cancel="modalVisible = false">
      <TaskForm v-if="modalVisible" :type="modalType" :data="currentRow" @submit="handleModalSubmit" @cancel="modalVisible = false" />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconPlus, IconClockCircle, IconApps, IconList } from '@arco-design/web-vue/es/icon'
import { TASK_STATUS, TASK_PRIORITY, getDictLabel, getDictColor } from '@/utils/dict'
import TaskForm from './components/TaskForm.vue'

const selectedProject = ref('1')
const viewMode = ref('kanban') // 'kanban' 或 'list'
const modalVisible = ref(false)
const modalType = ref('add')
const modalTitle = ref('新建任务')
const currentRow = ref(null)

const taskStatuses = [
  { value: 'todo', label: '待办', color: 'gray' },
  { value: 'in_progress', label: '进行中', color: 'blue' },
  { value: 'completed', label: '已完成', color: 'green' },
  { value: 'cancelled', label: '已取消', color: 'red' }
]

const tasks = ref([
  { id: 1, taskNo: 'T001', title: '需求分析文档编写', status: 'completed', priority: 'high', assignee: '张三', deadline: '2024-03-10', estimatedHours: 16, actualHours: 14 },
  { id: 2, taskNo: 'T002', title: '数据库设计', status: 'in_progress', priority: 'high', assignee: '李四', deadline: '2024-03-22', estimatedHours: 24, actualHours: 12 },
  { id: 3, taskNo: 'T003', title: 'UI设计稿制作', status: 'in_progress', priority: 'medium', assignee: '王五', deadline: '2024-03-25', estimatedHours: 40, actualHours: 20 },
  { id: 4, taskNo: 'T004', title: '前端框架搭建', status: 'todo', priority: 'high', assignee: '赵六', deadline: '2024-03-28', estimatedHours: 16, actualHours: 0 },
  { id: 5, taskNo: 'T005', title: '后端接口开发', status: 'todo', priority: 'high', assignee: '钱七', deadline: '2024-04-10', estimatedHours: 80, actualHours: 0 },
  { id: 6, taskNo: 'T006', title: '接口联调测试', status: 'todo', priority: 'medium', assignee: '孙八', deadline: '2024-04-20', estimatedHours: 40, actualHours: 0 },
  { id: 7, taskNo: 'T007', title: '项目启动会', status: 'completed', priority: 'low', assignee: '张三', deadline: '2024-03-01', estimatedHours: 4, actualHours: 4 },
  { id: 8, taskNo: 'T008', title: '技术选型评估', status: 'completed', priority: 'medium', assignee: '李四', deadline: '2024-03-05', estimatedHours: 8, actualHours: 8 }
])

const getPriorityLabel = (priority) => getDictLabel(TASK_PRIORITY, priority)
const getPriorityColor = (priority) => getDictColor(TASK_PRIORITY, priority)
const getStatusLabel = (status) => {
  const statusMap = { todo: '待办', in_progress: '进行中', completed: '已完成', cancelled: '已取消' }
  return statusMap[status] || status
}
const getStatusColor = (status) => {
  const colorMap = { todo: 'gray', in_progress: 'blue', completed: 'green', cancelled: 'red' }
  return colorMap[status] || 'default'
}
const getTasksByStatus = (status) => tasks.value.filter(t => t.status === status)
const getTaskCount = (status) => tasks.value.filter(t => t.status === status).length
const isOverdue = (deadline) => new Date(deadline) < new Date()

const handleAdd = () => {
  modalType.value = 'add'
  modalTitle.value = '新建任务'
  currentRow.value = null
  modalVisible.value = true
}

const handleEdit = (task) => {
  modalType.value = 'edit'
  modalTitle.value = '编辑任务'
  currentRow.value = { ...task }
  modalVisible.value = true
}

const handleModalSubmit = (values) => {
  if (modalType.value === 'add') {
    tasks.value.push({
      ...values,
      id: Date.now(),
      taskNo: 'T' + String(tasks.value.length + 1).padStart(3, '0'),
      assignee: '张三',
      actualHours: 0
    })
    Message.success('创建成功')
  } else {
    const index = tasks.value.findIndex(t => t.id === currentRow.value.id)
    if (index > -1) tasks.value[index] = { ...tasks.value[index], ...values }
    Message.success('更新成功')
  }
  modalVisible.value = false
}
</script>

<style scoped lang="less">
.task-page {
  .project-select-card { margin-bottom: 16px; }
  .list-view {
    .overdue { color: #ff4d4f; }
  }
  .kanban-board {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    padding-bottom: 8px;
    .kanban-column {
      flex: 1;
      min-width: 280px;
      max-width: 320px;
      background: #f7f8fa;
      border-radius: 4px;
      .column-header {
        padding: 12px 16px;
        border-bottom: 1px solid #e5e6eb;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .status-name { font-weight: 500; }
      }
      .column-content {
        padding: 12px;
        min-height: 400px;
        .task-card {
          background: #fff;
          border-radius: 4px;
          padding: 12px;
          margin-bottom: 12px;
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          transition: all 0.3s;
          border-left: 3px solid transparent;
          &:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
          &.high-priority { border-left-color: #ff4d4f; }
          .task-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
            .task-no { font-size: 12px; color: #86909c; }
          }
          .task-title { font-weight: 500; margin-bottom: 12px; color: #1d2129; }
          .task-meta {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
            .task-assignee {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 13px;
              color: #4e5969;
            }
            .task-deadline {
              font-size: 12px;
              color: #86909c;
              display: flex;
              align-items: center;
              gap: 4px;
              &.overdue { color: #ff4d4f; }
            }
          }
          .task-hours {
            font-size: 12px;
            color: #86909c;
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
      }
    }
  }
}
</style>
