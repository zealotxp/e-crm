<template>
  <div class="quotation-page">
    <a-card class="search-card" :bordered="false">
      <a-form :model="searchForm" layout="inline">
        <a-form-item field="keyword" hide-label>
          <a-input-search v-model="searchForm.keyword" placeholder="搜索报价单号/客户" style="width: 280px" allow-clear @search="handleSearch" />
        </a-form-item>
        <a-form-item hide-label>
          <a-button type="primary" @click="handleSearch"><template #icon><icon-search /></template>查询</a-button>
          <a-button @click="handleReset" style="margin-left: 8px">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card class="table-card table-resizable" :bordered="false">
      <template #title>
        <a-button type="primary" @click="handleAdd"><template #icon><icon-plus /></template>新建报价</a-button>
      </template>

      <a-table :data="quotations" stripe row-key="id"  column-resizable>
        <template #columns>
          <a-table-column title="报价单号" data-index="quotationNo" />
          <a-table-column title="报价名称" data-index="name" />
          <a-table-column title="客户" data-index="customerName" />
          <a-table-column title="报价金额" data-index="amount" >
            <template #cell="{ record }"><span style="font-weight: 500; color: #f5319d">¥{{ formatAmount(record.amount) }}</span></template>
          </a-table-column>
          <a-table-column title="有效期至" data-index="validDate" />
          <a-table-column title="状态" data-index="status" >
            <template #cell="{ record }"><a-tag :color="getStatusColor(record.status)">{{ getStatusLabel(record.status) }}</a-tag></template>
          </a-table-column>
          <a-table-column title="操作" width="200" >
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="handleView(record)">查看</a-button>
                <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
                <a-button type="text" size="small" @click="handleExport(record)">导出</a-button>
                <a-button type="text" size="small" @click="handleConvert(record)">转合同</a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
      
      <a-modal v-model:visible="modalVisible" :title="modalTitle" :width="700" :footer="false" @cancel="modalVisible = false">
        <QuotationForm v-if="modalVisible" :type="modalType" :data="currentRow" @submit="handleModalSubmit" @cancel="modalVisible = false" />
      </a-modal>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconSearch, IconPlus } from '@arco-design/web-vue/es/icon'
import { QUOTATION_STATUS, getDictLabel, getDictColor } from '@/utils/dict'
import QuotationForm from './components/QuotationForm.vue'

const searchForm = reactive({ keyword: '' })
const modalVisible = ref(false)
const modalType = ref('add')
const modalTitle = ref('新建报价')
const currentRow = ref(null)

const quotations = ref([
  { id: 1, quotationNo: 'Q20240320001', name: '电商平台升级项目报价', customerName: '阿里巴巴', amount: 1200000, validDate: '2024-04-20', status: 'sent' },
  { id: 2, quotationNo: 'Q20240315001', name: '移动端APP开发报价', customerName: '腾讯科技', amount: 800000, validDate: '2024-04-15', status: 'won' }
])

const getStatusLabel = (status) => getDictLabel(QUOTATION_STATUS, status)
const getStatusColor = (status) => getDictColor(QUOTATION_STATUS, status)
const formatAmount = (amount) => amount.toLocaleString('zh-CN')

const handleSearch = () => {}
const handleReset = () => {}

const handleAdd = () => {
  modalType.value = 'add'
  modalTitle.value = '新建报价'
  currentRow.value = null
  modalVisible.value = true
}

const handleEdit = (record) => {
  modalType.value = 'edit'
  modalTitle.value = '编辑报价'
  currentRow.value = { ...record }
  modalVisible.value = true
}

const handleModalSubmit = (values) => {
  if (modalType.value === 'add') {
    quotations.value.push({ ...values, id: Date.now(), customerName: '阿里巴巴' })
    Message.success('创建成功')
  } else {
    const index = quotations.value.findIndex(q => q.id === currentRow.value.id)
    if (index > -1) quotations.value[index] = { ...quotations.value[index], ...values }
    Message.success('更新成功')
  }
  modalVisible.value = false
}

const handleView = (record) => {}
const handleExport = (record) => { Message.success('导出成功') }
const handleConvert = (record) => { Message.success('已生成合同') }
</script>

<style scoped lang="less">
.quotation-page { .search-card { margin-bottom: 16px; } }
</style>
