<template>
  <div class="contract-page">
    <a-card class="search-card" :bordered="false">
      <a-form :model="searchForm" layout="inline">
        <a-form-item field="keyword" hide-label>
          <a-input-search
            v-model="searchForm.keyword"
            placeholder="搜索合同编号/客户"
            style="width: 280px"
            allow-clear
            @search="handleSearch"
          />
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

    <a-card class="table-card table-resizable" :bordered="false">
      <template #title>
        <a-button type="primary" @click="handleAdd">
          <template #icon><icon-plus /></template>
          新建合同
        </a-button>
      </template>

      <a-table :data="contracts" stripe row-key="id" :scroll="{ x: 1400 }" column-resizable>
        <template #columns>
          <a-table-column title="合同编号" data-index="contractNo" :width="160" fixed="left" />
          <a-table-column title="合同名称" data-index="name" :width="220" ellipsis tooltip />
          <a-table-column title="客户" data-index="customerName" :width="140" ellipsis tooltip />
          <a-table-column title="合同金额" data-index="amount" :width="130" align="right">
            <template #cell="{ record }">
              <span style="font-weight: 500; color: #f5319d">
                ¥{{ formatAmount(record.amount) }}
              </span>
            </template>
          </a-table-column>
          <a-table-column title="已回款" data-index="receivedAmount" :width="130" align="right">
            <template #cell="{ record }">
              <span style="font-weight: 500; color: #52c41a">
                ¥{{ formatAmount(record.receivedAmount || 0) }}
              </span>
            </template>
          </a-table-column>
          <a-table-column title="未回款" data-index="unreceivedAmount" :width="130" align="right">
            <template #cell="{ record }">
              <span style="font-weight: 500; color: #ff4d4f">
                ¥{{ formatAmount((record.amount || 0) - (record.receivedAmount || 0)) }}
              </span>
            </template>
          </a-table-column>
          <a-table-column title="渠道费" data-index="channelFee" :width="110" align="right">
            <template #cell="{ record }">
              <span style="font-weight: 500; color: #fa8c16">
                ¥{{ formatAmount(record.channelFee || 0) }}
              </span>
            </template>
          </a-table-column>
          <a-table-column title="实际收入" data-index="actualIncome" :width="130" align="right">
            <template #cell="{ record }">
              <span style="font-weight: 500; color: #52c41a">
                ¥{{ formatAmount((record.amount || 0) - (record.channelFee || 0)) }}
              </span>
            </template>
          </a-table-column>
          <a-table-column title="状态" data-index="status" :width="100" align="center">
            <template #cell="{ record }">
              <a-tag :color="getStatusColor(record.status)" size="small">
                {{ getStatusLabel(record.status) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="签订日期" data-index="signDate" :width="110" align="center" />
          <a-table-column title="操作" :width="120" fixed="right" align="center">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="handleView(record)">查看</a-button>
                <a-button type="text" size="small" @click="handleDownload(record)">下载</a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    
    <!-- 新建/编辑合同弹窗 -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalTitle"
      :width="700"
      :footer="false"
      @cancel="modalVisible = false"
    >
      <ContractForm
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconSearch, IconPlus } from '@arco-design/web-vue/es/icon'
import { CONTRACT_STATUS, getDictLabel, getDictColor } from '@/utils/dict'
import ContractForm from './components/ContractForm.vue'

const router = useRouter()

const searchForm = reactive({
  keyword: ''
})

const modalVisible = ref(false)
const modalType = ref('add')
const modalTitle = ref('新建合同')
const currentRow = ref(null)

const contracts = ref([
  {
    id: 1,
    contractNo: 'C20240301001',
    name: '电商平台升级项目合同',
    customerName: '阿里巴巴',
    amount: 1200000,
    receivedAmount: 400000,
    channelFee: 120000,
    status: 'executing',
    signDate: '2024-03-01'
  },
  {
    id: 2,
    contractNo: 'C20240215001',
    name: '移动端APP开发合同',
    customerName: '腾讯科技',
    amount: 800000,
    receivedAmount: 800000,
    channelFee: 80000,
    status: 'completed',
    signDate: '2024-02-15'
  },
  {
    id: 3,
    contractNo: 'C20240110001',
    name: '数据中台建设合同',
    customerName: '招商银行',
    amount: 2000000,
    receivedAmount: 600000,
    channelFee: 200000,
    status: 'executing',
    signDate: '2024-01-10'
  }
])

const getStatusLabel = (status) => getDictLabel(CONTRACT_STATUS, status)
const getStatusColor = (status) => getDictColor(CONTRACT_STATUS, status)

const formatAmount = (amount) => {
  return amount.toLocaleString('zh-CN')
}

const handleSearch = () => {}
const handleReset = () => {}

const handleAdd = () => {
  modalType.value = 'add'
  modalTitle.value = '新建合同'
  currentRow.value = null
  modalVisible.value = true
}

const handleEdit = (record) => {
  modalType.value = 'edit'
  modalTitle.value = '编辑合同'
  currentRow.value = { ...record }
  modalVisible.value = true
}

const handleModalSubmit = (values) => {
  if (modalType.value === 'add') {
    contracts.value.push({
      ...values,
      id: Date.now(),
      customerName: '阿里巴巴'
    })
    Message.success('创建成功')
  } else {
    const index = contracts.value.findIndex(c => c.id === currentRow.value.id)
    if (index > -1) {
      contracts.value[index] = { ...contracts.value[index], ...values }
    }
    Message.success('更新成功')
  }
  modalVisible.value = false
}

const handleView = (record) => {
  router.push(`/contract/detail/${record.id}`)
}
const handleDownload = (record) => {
  Message.success('开始下载...')
}
</script>

<style scoped lang="less">
.contract-page {
  .search-card {
    margin-bottom: 16px;
  }

  :deep(.arco-table-th) {
    position: relative;

    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 25%;
      height: 50%;
      width: 1px;
      background-color: var(--color-neutral-3);
    }

    &:last-child::after {
      display: none;
    }
  }

  :deep(.arco-table-column-resize) {
    position: absolute;
    right: -3px;
    top: 0;
    bottom: 0;
    width: 6px;
    cursor: col-resize;
    z-index: 10;

    &:hover,
    &.arco-table-column-resizing {
      background-color: var(--color-primary-6);
      opacity: 0.5;
    }
  }
}
</style>
