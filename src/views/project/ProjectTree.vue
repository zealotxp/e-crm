<template>
  <div class="project-tree-page">
    <a-card :bordered="false" class="tree-card">
      <a-row :gutter="16">
        <!-- 左侧树形菜单 -->
        <a-col :span="5">
          <div class="tree-header">
            <h4>项目结构</h4>
          </div>
          <a-tree
            :data="treeData"
            :default-expanded-keys="['1', '1-1']"
            :default-selected-keys="['1-1-1']"
            @select="handleTreeSelect"
            block-node
          >
            <template #title="{ title, nodeType }">
              <span :class="['tree-node', nodeType]">
                <icon-user v-if="nodeType === 'customer'" />
                <icon-apps v-if="nodeType === 'project'" />
                <icon-calendar v-if="nodeType === 'phase'" />
                {{ title }}
              </span>
            </template>
          </a-tree>
        </a-col>

        <!-- 右侧任务列表 -->
        <a-col :span="19">
          <div class="task-header">
            <a-space>
              <h3>{{ selectedNodeTitle }}</h3>
              <a-tag v-if="selectedNodeType === 'phase'" color="blue">期号</a-tag>
              <a-tag v-else-if="selectedNodeType === 'project'" color="green">项目</a-tag>
              <a-tag v-else-if="selectedNodeType === 'customer'" color="orange">客户</a-tag>
            </a-space>
            <a-button type="primary" @click="handleAddTask">
              <template #icon><icon-plus /></template>
              新建任务
            </a-button>
          </div>

          <a-table
            :loading="loading"
            :data="filteredTasks"
            stripe
            :pagination="pagination"
          >
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
                    <a-button type="text" size="small" @click="handleEditTask(record)">编辑</a-button>
                    <a-button type="text" size="small" status="danger">删除</a-button>
                  </a-space>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </a-col>
      </a-row>
    </a-card>

    <!-- 新建/编辑任务弹窗 -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalTitle"
      :width="700"
      :footer="false"
      @cancel="modalVisible = false"
    >
      <TaskForm
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
import { Message } from '@arco-design/web-vue'
import { IconUser, IconApps, IconCalendar, IconPlus } from '@arco-design/web-vue/es/icon'
import { TASK_PRIORITY, getDictLabel, getDictColor } from '@/utils/dict'
import TaskForm from '../task/components/TaskForm.vue'

const loading = ref(false)
const modalVisible = ref(false)
const modalType = ref('add')
const modalTitle = ref('新建任务')
const currentRow = ref(null)

// 当前选中的节点
const selectedNodeKey = ref('1-1-1')
const selectedNodeTitle = ref('第一期')
const selectedNodeType = ref('phase')

// 树形数据：客户 -> 项目 -> 期号
const treeData = ref([
  {
    key: '1',
    title: '阿里巴巴网络技术有限公司',
    nodeType: 'customer',
    children: [
      {
        key: '1-1',
        title: '电商平台升级项目',
        nodeType: 'project',
        children: [
          { key: '1-1-1', title: '第一期', nodeType: 'phase' },
          { key: '1-1-2', title: '第二期', nodeType: 'phase' },
          { key: '1-1-3', title: '第三期', nodeType: 'phase' }
        ]
      },
      {
        key: '1-2',
        title: '移动端APP开发',
        nodeType: 'project',
        children: [
          { key: '1-2-1', title: '第一期', nodeType: 'phase' },
          { key: '1-2-2', title: '第二期', nodeType: 'phase' }
        ]
      }
    ]
  },
  {
    key: '2',
    title: '腾讯科技（深圳）有限公司',
    nodeType: 'customer',
    children: [
      {
        key: '2-1',
        title: '企业微信定制开发',
        nodeType: 'project',
        children: [
          { key: '2-1-1', title: '第一期', nodeType: 'phase' }
        ]
      }
    ]
  },
  {
    key: '3',
    title: '招商银行股份有限公司',
    nodeType: 'customer',
    children: [
      {
        key: '3-1',
        title: '移动银行APP优化',
        nodeType: 'project',
        children: [
          { key: '3-1-1', title: '第一期', nodeType: 'phase' },
          { key: '3-1-2', title: '第二期', nodeType: 'phase' }
        ]
      }
    ]
  },
  {
    key: '4',
    title: '中国平安保险（集团）股份有限公司',
    nodeType: 'customer',
    children: [
      {
        key: '4-1',
        title: '保险理赔系统开发',
        nodeType: 'project',
        children: [
          { key: '4-1-1', title: '第一期', nodeType: 'phase' }
        ]
      }
    ]
  },
  {
    key: '5',
    title: '美团点评',
    nodeType: 'customer',
    children: [
      {
        key: '5-1',
        title: '外卖小程序开发',
        nodeType: 'project',
        children: [
          { key: '5-1-1', title: '第一期', nodeType: 'phase' },
          { key: '5-1-2', title: '第二期', nodeType: 'phase' }
        ]
      }
    ]
  }
])

// 所有任务数据
const allTasks = ref([
  { id: 1, taskNo: 'T001', title: '需求分析文档编写', status: 'completed', priority: 'high', assignee: '张三', deadline: '2024-03-10', estimatedHours: 16, actualHours: 14, phaseKey: '1-1-1' },
  { id: 2, taskNo: 'T002', title: '数据库设计', status: 'in_progress', priority: 'high', assignee: '李四', deadline: '2024-03-22', estimatedHours: 24, actualHours: 12, phaseKey: '1-1-1' },
  { id: 3, taskNo: 'T003', title: 'UI设计稿制作', status: 'in_progress', priority: 'medium', assignee: '王五', deadline: '2024-03-25', estimatedHours: 40, actualHours: 20, phaseKey: '1-1-1' },
  { id: 4, taskNo: 'T004', title: '前端框架搭建', status: 'todo', priority: 'high', assignee: '赵六', deadline: '2024-03-28', estimatedHours: 16, actualHours: 0, phaseKey: '1-1-1' },
  { id: 5, taskNo: 'T005', title: '后端接口开发', status: 'todo', priority: 'high', assignee: '钱七', deadline: '2024-04-10', estimatedHours: 80, actualHours: 0, phaseKey: '1-1-1' },
  { id: 6, taskNo: 'T006', title: '接口联调测试', status: 'todo', priority: 'medium', assignee: '孙八', deadline: '2024-04-20', estimatedHours: 40, actualHours: 0, phaseKey: '1-1-1' },
  { id: 7, taskNo: 'T007', title: '项目启动会', status: 'completed', priority: 'low', assignee: '张三', deadline: '2024-03-01', estimatedHours: 4, actualHours: 4, phaseKey: '1-1-1' },
  { id: 8, taskNo: 'T008', title: '技术选型评估', status: 'completed', priority: 'medium', assignee: '李四', deadline: '2024-03-05', estimatedHours: 8, actualHours: 8, phaseKey: '1-1-1' },
  { id: 9, taskNo: 'T009', title: '第二期需求调研', status: 'in_progress', priority: 'high', assignee: '张三', deadline: '2024-04-15', estimatedHours: 24, actualHours: 8, phaseKey: '1-1-2' },
  { id: 10, taskNo: 'T010', title: '移动端适配开发', status: 'todo', priority: 'medium', assignee: '王五', deadline: '2024-04-20', estimatedHours: 40, actualHours: 0, phaseKey: '1-2-1' },
  { id: 11, taskNo: 'T011', title: '企业微信API对接', status: 'in_progress', priority: 'high', assignee: '赵六', deadline: '2024-03-25', estimatedHours: 32, actualHours: 16, phaseKey: '2-1-1' },
  { id: 12, taskNo: 'T012', title: '银行安全认证模块', status: 'todo', priority: 'high', assignee: '钱七', deadline: '2024-04-05', estimatedHours: 48, actualHours: 0, phaseKey: '3-1-1' }
])

// 根据选中节点过滤任务
const filteredTasks = computed(() => {
  const key = selectedNodeKey.value
  if (!key) return []

  // 如果是期号节点，只显示该期号的任务
  if (key.includes('-') && key.split('-').length === 3) {
    return allTasks.value.filter(task => task.phaseKey === key)
  }

  // 如果是项目节点，显示该项目下所有期号的任务
  if (key.includes('-') && key.split('-').length === 2) {
    return allTasks.value.filter(task => task.phaseKey.startsWith(key))
  }

  // 如果是客户节点，显示该客户下所有任务
  return allTasks.value.filter(task => task.phaseKey.startsWith(key))
})

const pagination = reactive({
  total: computed(() => filteredTasks.value.length),
  current: 1,
  pageSize: 20
})

const handleTreeSelect = (keys, { node }) => {
  selectedNodeKey.value = keys[0]
  selectedNodeTitle.value = node.title
  selectedNodeType.value = node.nodeType
}

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
const isOverdue = (deadline) => new Date(deadline) < new Date()

const handleAddTask = () => {
  modalType.value = 'add'
  modalTitle.value = '新建任务'
  currentRow.value = null
  modalVisible.value = true
}

const handleEditTask = (record) => {
  modalType.value = 'edit'
  modalTitle.value = '编辑任务'
  currentRow.value = { ...record }
  modalVisible.value = true
}

const handleModalSubmit = (values) => {
  if (modalType.value === 'add') {
    const maxNo = Math.max(...allTasks.value.map(t => parseInt(t.taskNo.slice(1))), 0)
    allTasks.value.push({
      ...values,
      id: Date.now(),
      taskNo: 'T' + String(maxNo + 1).padStart(3, '0'),
      phaseKey: selectedNodeKey.value,
      actualHours: 0
    })
    Message.success('任务创建成功')
  } else {
    const index = allTasks.value.findIndex(t => t.id === currentRow.value.id)
    if (index > -1) {
      allTasks.value[index] = { ...allTasks.value[index], ...values }
    }
    Message.success('任务更新成功')
  }
  modalVisible.value = false
}
</script>

<style scoped lang="less">
.project-tree-page {
  .tree-card {
    min-height: calc(100vh - 180px);
  }

  .tree-header {
    padding: 12px 0;
    border-bottom: 1px solid #e5e6eb;
    margin-bottom: 12px;

    h4 {
      margin: 0;
      font-weight: 500;
    }
  }

  .tree-node {
    display: flex;
    align-items: center;
    gap: 6px;

    &.customer {
      color: #ff7d00;
      font-weight: 500;
    }

    &.project {
      color: #165dff;
    }

    &.phase {
      color: #00b42a;
    }
  }

  .task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e6eb;

    h3 {
      margin: 0;
    }
  }

  .overdue {
    color: #ff4d4f;
  }
}
</style>
