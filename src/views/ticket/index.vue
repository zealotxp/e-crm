<template>
  <div class="ticket-page">
    <a-card class="search-card" :bordered="false">
      <a-form :model="searchForm" layout="inline">
        <a-form-item field="keyword" hide-label>
          <a-input-search v-model="searchForm.keyword" placeholder="搜索工单标题/客户" style="width: 280px" allow-clear @search="handleSearch" />
        </a-form-item>
        <a-form-item field="status" hide-label>
          <a-select v-model="searchForm.status" placeholder="工单状态" style="width: 140px" allow-clear>
            <a-option value="new" label="新建" />
            <a-option value="processing" label="处理中" />
            <a-option value="resolved" label="已解决" />
            <a-option value="closed" label="已关闭" />
          </a-select>
        </a-form-item>
        <a-form-item hide-label>
          <a-button type="primary" @click="handleSearch"><template #icon><icon-search /></template>查询</a-button>
          <a-button @click="handleReset" style="margin-left: 8px">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card class="table-card table-resizable" :bordered="false">
      <template #title>
        <a-button type="primary" @click="handleAdd"><template #icon><icon-plus /></template>新建工单</a-button>
      </template>

      <a-table :data="tickets" stripe row-key="id"  column-resizable>
        <template #columns>
          <a-table-column title="工单编号" data-index="ticketNo" />
          <a-table-column title="标题" data-index="title" />
          <a-table-column title="客户" data-index="customerName" />
          <a-table-column title="类型" data-index="type" >
            <template #cell="{ record }"><a-tag :color="getTypeColor(record.type)">{{ getTypeLabel(record.type) }}</a-tag></template>
          </a-table-column>
          <a-table-column title="优先级" data-index="priority" >
            <template #cell="{ record }"><a-tag :color="getPriorityColor(record.priority)">{{ getPriorityLabel(record.priority) }}</a-tag></template>
          </a-table-column>
          <a-table-column title="状态" data-index="status" >
            <template #cell="{ record }"><a-badge :status="getStatusType(record.status)" :text="getStatusLabel(record.status)" /></template>
          </a-table-column>
          <a-table-column title="负责人" data-index="assignee" />
          <a-table-column title="创建时间" data-index="createTime" />
          <a-table-column title="操作" width="150" >
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="handleView(record)">查看</a-button>
                <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
                <a-button type="text" size="small" @click="handleProcess(record)">处理</a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
      
      <a-modal v-model:visible="modalVisible" :title="modalTitle" :width="700" :footer="false" @cancel="modalVisible = false">
        <TicketForm v-if="modalVisible" :type="modalType" :data="currentRow" @submit="handleModalSubmit" @cancel="modalVisible = false" />
      </a-modal>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconSearch, IconPlus } from '@arco-design/web-vue/es/icon'
import { TICKET_TYPE, TICKET_PRIORITY, getDictLabel, getDictColor } from '@/utils/dict'
import TicketForm from './components/TicketForm.vue'

const searchForm = reactive({ keyword: '', status: undefined })
const modalVisible = ref(false)
const modalType = ref('add')
const modalTitle = ref('新建工单')
const currentRow = ref(null)

const tickets = ref([
  { id: 1, ticketNo: 'TK20240320001', title: '登录功能异常', customerName: '阿里巴巴', type: 'bug', priority: 'high', status: 'processing', assignee: '张三', createTime: '2024-03-20 10:30' },
  { id: 2, ticketNo: 'TK20240319001', title: '增加数据导出功能', customerName: '腾讯科技', type: 'feature', priority: 'medium', status: 'new', assignee: '李四', createTime: '2024-03-19 14:00' },
  { id: 3, ticketNo: 'TK20240318001', title: '系统使用咨询', customerName: '招商银行', type: 'inquiry', priority: 'low', status: 'resolved', assignee: '王五', createTime: '2024-03-18 09:00' }
])

const getTypeLabel = (type) => getDictLabel(TICKET_TYPE, type)
const getTypeColor = (type) => getDictColor(TICKET_TYPE, type)
const getPriorityLabel = (priority) => getDictLabel(TICKET_PRIORITY, priority)
const getPriorityColor = (priority) => getDictColor(TICKET_PRIORITY, priority)

const statusMap = {
  new: { label: '新建', type: 'default' },
  processing: { label: '处理中', type: 'processing' },
  resolved: { label: '已解决', type: 'success' },
  closed: { label: '已关闭', type: 'default' }
}
const getStatusLabel = (status) => statusMap[status]?.label || status
const getStatusType = (status) => statusMap[status]?.type || 'default'

const handleSearch = () => {}
const handleReset = () => {}

const handleAdd = () => {
  modalType.value = 'add'
  modalTitle.value = '新建工单'
  currentRow.value = null
  modalVisible.value = true
}

const handleEdit = (record) => {
  modalType.value = 'edit'
  modalTitle.value = '编辑工单'
  currentRow.value = { ...record }
  modalVisible.value = true
}

const handleModalSubmit = (values) => {
  if (modalType.value === 'add') {
    tickets.value.push({ ...values, id: Date.now(), ticketNo: 'TK' + Date.now(), customerName: '阿里巴巴', assignee: '张三', createTime: new Date().toLocaleString('zh-CN'), status: 'new' })
    Message.success('创建成功')
  } else {
    const index = tickets.value.findIndex(t => t.id === currentRow.value.id)
    if (index > -1) tickets.value[index] = { ...tickets.value[index], ...values }
    Message.success('更新成功')
  }
  modalVisible.value = false
}

const handleView = (record) => {}
const handleProcess = (record) => {}
</script>

<style scoped lang="less">
.ticket-page { .search-card { margin-bottom: 16px; } }
</style>
