<template>
  <div class="payment-page">
    <!-- 统计卡片 -->
    <a-row :gutter="[16, 16]" class="stat-row">
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-title">本月应收</div>
          <div class="stat-value">¥{{ formatAmount(stats.monthReceivable) }}</div>
          <div class="stat-count">{{ stats.monthReceivableCount }}笔</div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-title">本月已收</div>
          <div class="stat-value" style="color: #52c41a">
            ¥{{ formatAmount(stats.monthReceived) }}
          </div>
          <div class="stat-count">{{ stats.monthReceivedCount }}笔</div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-title">逾期未收</div>
          <div class="stat-value" style="color: #ff4d4f">
            ¥{{ formatAmount(stats.overdue) }}
          </div>
          <div class="stat-count">{{ stats.overdueCount }}笔 ⚠️</div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-title">回款率</div>
          <div class="stat-value" style="color: #1890ff">
            {{ stats.collectionRate }}%
          </div>
          <div class="stat-count">本月累计</div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 搜索栏 -->
    <a-card class="search-card" :bordered="false">
      <a-form :model="searchForm" layout="inline">
        <a-form-item field="keyword" hide-label>
          <a-input-search
            v-model="searchForm.keyword"
            placeholder="搜索客户/合同"
            style="width: 280px"
            allow-clear
            @search="handleSearch"
          />
        </a-form-item>
        <a-form-item field="status" hide-label>
          <a-select
            v-model="searchForm.status"
            placeholder="回款状态"
            style="width: 140px"
            allow-clear
          >
            <a-option value="unpaid" label="未回款" />
            <a-option value="partial" label="部分回款" />
            <a-option value="paid" label="已回款" />
            <a-option value="overdue" label="已逾期" />
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

    <!-- 数据表格 -->
    <a-card class="table-card table-resizable" :bordered="false">
      <template #title>
        <a-space>
          <a-button type="primary" @click="handleRecord">
            <template #icon><icon-plus /></template>
            记录回款
          </a-button>
          <a-button @click="handleExport">
            <template #icon><icon-download /></template>
            导出
          </a-button>
        </a-space>
      </template>

      <a-tabs v-model="activeTab" @change="handleTabChange">
        <a-tab-pane key="all" title="全部" />
        <a-tab-pane key="receivable" title="本月应收" />
        <a-tab-pane key="received" title="已回款" />
        <a-tab-pane key="overdue" title="逾期未回 ⚠️" />
        <a-tab-pane key="future" title="未来回款" />
      </a-tabs>

      <a-table :data="payments" stripe  column-resizable>
        <template #columns>
          <a-table-column title="客户名称" data-index="customerName" />
          <a-table-column title="合同名称" data-index="contractName" />
          <a-table-column title="期次" data-index="period" >
            <template #cell="{ record }">
              第{{ record.currentPeriod }}/{{ record.totalPeriod }}期
            </template>
          </a-table-column>
          <a-table-column title="计划日期" data-index="planDate" />
          <a-table-column title="应收金额" data-index="planAmount" >
            <template #cell="{ record }">
              ¥{{ formatAmount(record.planAmount) }}
            </template>
          </a-table-column>
          <a-table-column title="实收金额" data-index="actualAmount" >
            <template #cell="{ record }">
              <span v-if="record.actualAmount" style="color: #52c41a">
                ¥{{ formatAmount(record.actualAmount) }}
              </span>
              <span v-else>-</span>
            </template>
          </a-table-column>
          <a-table-column title="状态" data-index="status" >
            <template #cell="{ record }">
              <a-tag :color="getStatusColor(record.status)">
                {{ getStatusLabel(record.status) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="操作" width="150" >
            <template #cell="{ record }">
              <a-space>
                <a-button
                  v-if="record.status !== 'paid'"
                  type="text"
                  size="small"
                  @click="handleRecordPayment(record)"
                >
                  记录
                </a-button>
                <a-button type="text" size="small" @click="handleView(record)">
                  详情
                </a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconSearch, IconPlus, IconDownload } from '@arco-design/web-vue/es/icon'

const searchForm = reactive({
  keyword: '',
  status: undefined
})

const activeTab = ref('all')

const stats = reactive({
  monthReceivable: 850000,
  monthReceivableCount: 5,
  monthReceived: 620000,
  monthReceivedCount: 4,
  overdue: 230000,
  overdueCount: 2,
  collectionRate: 73
})

const payments = ref([
  {
    id: 1,
    customerName: '阿里巴巴',
    contractName: '电商平台开发',
    currentPeriod: 2,
    totalPeriod: 3,
    planDate: '2024-03-15',
    planAmount: 400000,
    actualAmount: 400000,
    status: 'paid'
  },
  {
    id: 2,
    customerName: '腾讯科技',
    contractName: '小程序开发',
    currentPeriod: 2,
    totalPeriod: 2,
    planDate: '2024-03-20',
    planAmount: 220000,
    actualAmount: 220000,
    status: 'paid'
  },
  {
    id: 3,
    customerName: '招商银行',
    contractName: '管理系统开发',
    currentPeriod: 1,
    totalPeriod: 3,
    planDate: '2024-03-25',
    planAmount: 300000,
    actualAmount: 0,
    status: 'unpaid'
  },
  {
    id: 4,
    customerName: '平安保险',
    contractName: 'APP开发项目',
    currentPeriod: 2,
    totalPeriod: 3,
    planDate: '2024-03-10',
    planAmount: 150000,
    actualAmount: 0,
    status: 'overdue'
  },
  {
    id: 5,
    customerName: '美团点评',
    contractName: '后台管理系统',
    currentPeriod: 1,
    totalPeriod: 2,
    planDate: '2024-03-30',
    planAmount: 250000,
    actualAmount: 0,
    status: 'unpaid'
  }
])

const statusMap = {
  unpaid: { label: '未回款', color: 'gray' },
  partial: { label: '部分回款', color: 'orange' },
  paid: { label: '已回款', color: 'green' },
  overdue: { label: '已逾期', color: 'red' }
}

const getStatusLabel = (status) => statusMap[status]?.label || status
const getStatusColor = (status) => statusMap[status]?.color || 'gray'

const formatAmount = (amount) => {
  return amount.toLocaleString('zh-CN')
}

const handleSearch = () => {}
const handleReset = () => {}
const handleTabChange = () => {}
const handleRecord = () => {}
const handleRecordPayment = (record) => {}
const handleView = (record) => {}
const handleExport = () => {
  Message.success('导出成功')
}
</script>

<style scoped lang="less">
.payment-page {
  .stat-row {
    margin-bottom: 16px;
    
    .stat-card {
      text-align: center;
      
      .stat-title {
        font-size: 14px;
        color: #86909c;
        margin-bottom: 8px;
      }
      
      .stat-value {
        font-size: 24px;
        font-weight: 600;
        color: #1d2129;
        margin-bottom: 4px;
      }
      
      .stat-count {
        font-size: 13px;
        color: #86909c;
      }
    }
  }
  
  .search-card {
    margin-bottom: 16px;
  }
}
</style>
