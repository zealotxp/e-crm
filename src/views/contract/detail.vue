<template>
  <div class="contract-detail-page">
    <a-page-header
      title="合同详情"
      :subtitle="contract.contractNo"
      @back="goBack"
    >
      <template #extra>
        <a-space>
          <a-button @click="handleEdit">
            <template #icon><icon-pen /></template>
            编辑
          </a-button>
          <a-button type="primary" @click="handleDownload">
            <template #icon><icon-download /></template>
            下载合同
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- 合同概览卡片 -->
    <a-card class="overview-card" :bordered="false">
      <div class="contract-overview">
        <div class="overview-header">
          <h2>{{ contract.name }}</h2>
          <a-tag :color="getStatusColor(contract.status)" size="large">
            {{ getStatusLabel(contract.status) }}
          </a-tag>
        </div>
        <div class="overview-meta">
          <span>客户：{{ contract.customerName }}</span>
          <a-divider direction="vertical" />
          <span>签订日期：{{ contract.signDate }}</span>
          <a-divider direction="vertical" />
          <span>合同编号：{{ contract.contractNo }}</span>
        </div>
      </div>
    </a-card>

    <!-- 金额信息 -->
    <a-row :gutter="[16, 16]" class="stat-row">
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-label">合同金额</div>
          <div class="stat-value" style="color: #f5319d">
            ¥{{ formatAmount(contract.amount) }}
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-label">已回款</div>
          <div class="stat-value" style="color: #52c41a">
            ¥{{ formatAmount(contract.receivedAmount || 0) }}
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-label">未回款</div>
          <div class="stat-value" style="color: #ff4d4f">
            ¥{{ formatAmount((contract.amount || 0) - (contract.receivedAmount || 0)) }}
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-label">实际收入</div>
          <div class="stat-value" style="color: #1890ff">
            ¥{{ formatAmount((contract.amount || 0) - (contract.channelFee || 0)) }}
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 详细信息 -->
    <a-card class="detail-card" :bordered="false" title="合同信息">
      <a-descriptions :column="2" bordered>
        <a-descriptions-item label="合同编号">{{ contract.contractNo }}</a-descriptions-item>
        <a-descriptions-item label="合同名称">{{ contract.name }}</a-descriptions-item>
        <a-descriptions-item label="关联客户">{{ contract.customerName }}</a-descriptions-item>
        <a-descriptions-item label="签订日期">{{ contract.signDate }}</a-descriptions-item>
        <a-descriptions-item label="合同金额">¥{{ formatAmount(contract.amount) }}</a-descriptions-item>
        <a-descriptions-item label="渠道费">¥{{ formatAmount(contract.channelFee || 0) }}</a-descriptions-item>
        <a-descriptions-item label="已回款">¥{{ formatAmount(contract.receivedAmount || 0) }}</a-descriptions-item>
        <a-descriptions-item label="未回款">¥{{ formatAmount((contract.amount || 0) - (contract.receivedAmount || 0)) }}</a-descriptions-item>
        <a-descriptions-item label="实际收入">¥{{ formatAmount((contract.amount || 0) - (contract.channelFee || 0)) }}</a-descriptions-item>
        <a-descriptions-item label="合同状态">
          <a-tag :color="getStatusColor(contract.status)">
            {{ getStatusLabel(contract.status) }}
          </a-tag>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <!-- 编辑弹窗 -->
    <a-modal
      v-model:visible="editModalVisible"
      title="编辑合同"
      :width="700"
      :footer="false"
      @cancel="editModalVisible = false"
    >
      <ContractForm
        v-if="editModalVisible"
        type="edit"
        :data="contract"
        @submit="handleEditSubmit"
        @cancel="editModalVisible = false"
      />
    </a-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconPen, IconDownload } from '@arco-design/web-vue/es/icon'
import { CONTRACT_STATUS, getDictLabel, getDictColor } from '@/utils/dict'
import ContractForm from './components/ContractForm.vue'

const router = useRouter()
const route = useRoute()

const contract = ref({
  id: 1,
  contractNo: 'C20240301001',
  name: '电商平台升级项目合同',
  customerName: '阿里巴巴',
  amount: 1200000,
  receivedAmount: 400000,
  channelFee: 120000,
  status: 'executing',
  signDate: '2024-03-01'
})

const editModalVisible = ref(false)

const getStatusLabel = (status) => getDictLabel(CONTRACT_STATUS, status)
const getStatusColor = (status) => getDictColor(CONTRACT_STATUS, status)

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
  contract.value = { ...contract.value, ...values }
  Message.success('更新成功')
  editModalVisible.value = false
}

const handleDownload = () => {
  Message.success('开始下载合同...')
}
</script>

<style scoped lang="less">
.contract-detail-page {
  .overview-card {
    margin-bottom: 16px;

    .contract-overview {
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

  .detail-card {
    :deep(.arco-descriptions-item-label) {
      width: 120px;
      background-color: var(--color-fill-2);
    }
  }
}
</style>
