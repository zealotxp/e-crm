<template>
  <div class="invoice-page">
    <a-card class="search-card" :bordered="false">
      <a-form :model="searchForm" layout="inline">
        <a-form-item field="keyword" hide-label>
          <a-input-search v-model="searchForm.keyword" placeholder="搜索客户/合同" style="width: 280px" allow-clear @search="handleSearch" />
        </a-form-item>
        <a-form-item hide-label>
          <a-button type="primary" @click="handleSearch"><template #icon><icon-search /></template>查询</a-button>
          <a-button @click="handleReset" style="margin-left: 8px">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card class="table-card table-resizable" :bordered="false">
      <template #title>
        <a-button type="primary" @click="handleApply"><template #icon><icon-plus /></template>申请开票</a-button>
      </template>

      <a-table :data="invoices" stripe row-key="id"  column-resizable>
        <template #columns>
          <a-table-column title="发票号码" data-index="invoiceNo" />
          <a-table-column title="客户" data-index="customerName" />
          <a-table-column title="合同" data-index="contractName" />
          <a-table-column title="开票金额" data-index="amount" >
            <template #cell="{ record }"><span style="font-weight: 500; color: #f5319d">¥{{ formatAmount(record.amount) }}</span></template>
          </a-table-column>
          <a-table-column title="发票类型" data-index="type" >
            <template #cell="{ record }">{{ record.type === 'special' ? '增值税专用发票' : '增值税普通发票' }}</template>
          </a-table-column>
          <a-table-column title="状态" data-index="status" >
            <template #cell="{ record }"><a-tag :color="getStatusColor(record.status)">{{ getStatusLabel(record.status) }}</a-tag></template>
          </a-table-column>
          <a-table-column title="开票日期" data-index="invoiceDate" />
          <a-table-column title="操作" width="150" >
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="handleView(record)">查看</a-button>
                <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
                <a-button type="text" size="small" @click="handleExpress(record)">快递</a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
      
      <a-modal v-model:visible="modalVisible" :title="modalTitle" :width="700" :footer="false" @cancel="modalVisible = false">
        <InvoiceForm v-if="modalVisible" :type="modalType" :data="currentRow" @submit="handleModalSubmit" @cancel="modalVisible = false" />
      </a-modal>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconSearch, IconPlus } from '@arco-design/web-vue/es/icon'
import { INVOICE_STATUS, getDictLabel, getDictColor } from '@/utils/dict'
import InvoiceForm from './components/InvoiceForm.vue'

const searchForm = reactive({ keyword: '' })
const modalVisible = ref(false)
const modalType = ref('add')
const modalTitle = ref('申请开票')
const currentRow = ref(null)

const invoices = ref([
  { id: 1, invoiceNo: '1234567890', customerName: '阿里巴巴', contractName: '电商平台开发', amount: 400000, type: 'special', status: 'received', invoiceDate: '2024-03-15' },
  { id: 2, invoiceNo: '0987654321', customerName: '腾讯科技', contractName: '小程序开发', amount: 220000, type: 'normal', status: 'sent', invoiceDate: '2024-03-20' }
])

const getStatusLabel = (status) => getDictLabel(INVOICE_STATUS, status)
const getStatusColor = (status) => getDictColor(INVOICE_STATUS, status)
const formatAmount = (amount) => amount.toLocaleString('zh-CN')

const handleSearch = () => {}
const handleReset = () => {}

const handleApply = () => {
  modalType.value = 'add'
  modalTitle.value = '申请开票'
  currentRow.value = null
  modalVisible.value = true
}

const handleEdit = (record) => {
  modalType.value = 'edit'
  modalTitle.value = '编辑发票'
  currentRow.value = { ...record }
  modalVisible.value = true
}

const handleModalSubmit = (values) => {
  if (modalType.value === 'add') {
    invoices.value.push({ ...values, id: Date.now(), customerName: '阿里巴巴', contractName: '合同名称' })
    Message.success('申请成功')
  } else {
    const index = invoices.value.findIndex(i => i.id === currentRow.value.id)
    if (index > -1) invoices.value[index] = { ...invoices.value[index], ...values }
    Message.success('更新成功')
  }
  modalVisible.value = false
}

const handleView = (record) => {}
const handleExpress = (record) => {}
</script>

<style scoped lang="less">
.invoice-page { .search-card { margin-bottom: 16px; } }
</style>
