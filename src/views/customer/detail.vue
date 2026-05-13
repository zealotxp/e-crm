<template>
  <div class="customer-detail-page">
    <!-- 返回按钮 -->
    <a-page-header
      title="客户详情"
      :subtitle="customer.name"
      @back="goBack"
    >
      <template #extra>
        <a-space>
          <a-button @click="handleFollow">
            <template #icon><icon-phone /></template>
            跟进
          </a-button>
          <a-button type="primary" @click="handleEdit">
            <template #icon><icon-pen /></template>
            编辑
          </a-button>
          <a-dropdown>
            <a-button>
              更多<icon-down />
            </a-button>
            <template #content>
              <a-doption @click="handleCreateOpportunity">新建商机</a-doption>
              <a-doption @click="handleCreateQuotation">新建报价</a-doption>
              <a-doption @click="handleCreateContract">新建合同</a-doption>
              <a-divider style="margin: 4px 0" />
              <a-doption @click="handleTransfer">转移客户</a-doption>
              <a-doption @click="handleDelete" style="color: #ff4d4f">
                删除客户
              </a-doption>
            </template>
          </a-dropdown>
        </a-space>
      </template>
    </a-page-header>

    <!-- 客户概览卡片 -->
    <a-card class="overview-card" :bordered="false">
      <div class="customer-overview">
        <div class="overview-left">
          <a-avatar :size="64" :style="{ background: '#1890ff' }">
            <span style="font-size: 24px">{{ customer.name?.charAt(0) }}</span>
          </a-avatar>
          <div class="overview-info">
            <h2>{{ customer.name }}</h2>
            <a-space class="overview-tags">
              <a-tag :color="getLevelColor(customer.level)">
                {{ getLevelLabel(customer.level) }}级客户
              </a-tag>
              <a-tag :color="getStatusColor(customer.status)">
                {{ getStatusLabel(customer.status) }}
              </a-tag>
              <a-tag>{{ getIndustryLabel(customer.industry) }}</a-tag>
            </a-space>
            <div class="overview-meta">
              <span><icon-location /> {{ customer.address || '暂无地址' }}</span>
              <a-divider direction="vertical" />
              <span><icon-phone /> {{ customer.phone || '暂无电话' }}</span>
              <a-divider direction="vertical" />
              <span>归属：{{ customer.ownerName }}</span>
            </div>
          </div>
        </div>
        <div class="overview-right">
          <div class="stat-item">
            <div class="stat-label">关联商机</div>
            <div class="stat-value">{{ stats.opportunityCount }}</div>
          </div>
          <a-divider direction="vertical" />
          <div class="stat-item">
            <div class="stat-label">关联合同</div>
            <div class="stat-value">{{ stats.contractCount }}</div>
          </div>
          <a-divider direction="vertical" />
          <div class="stat-item">
            <div class="stat-label">合同金额</div>
            <div class="stat-value">¥{{ formatAmount(stats.contractAmount) }}</div>
          </div>
          <a-divider direction="vertical" />
          <div class="stat-item">
            <div class="stat-label">已回款</div>
            <div class="stat-value">¥{{ formatAmount(stats.paidAmount) }}</div>
          </div>
        </div>
      </div>
    </a-card>

    <!-- 标签页内容 -->
    <a-card class="detail-tabs-card" :bordered="false">
      <a-tabs v-model="activeTab">
        <a-tab-pane key="basic" title="基本信息">
          <BasicInfo :data="customer" />
        </a-tab-pane>
        <a-tab-pane key="contacts" title="联系人">
          <ContactList :customer-id="customer.id" />
        </a-tab-pane>
        <a-tab-pane key="follows" title="跟进记录">
          <FollowList :customer-id="customer.id" />
        </a-tab-pane>
        <a-tab-pane key="opportunities" title="商机">
          <OpportunityList :customer-id="customer.id" />
        </a-tab-pane>
        <a-tab-pane key="quotations" title="报价">
          <QuotationList :customer-id="customer.id" />
        </a-tab-pane>
        <a-tab-pane key="contracts" title="合同">
          <ContractList :customer-id="customer.id" />
        </a-tab-pane>
        <a-tab-pane key="projects" title="项目">
          <ProjectList :customer-id="customer.id" />
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- 编辑弹窗 -->
    <a-modal
      v-model:visible="editModalVisible"
      title="编辑客户"
      :width="700"
      :footer="false"
    >
      <CustomerForm
        v-if="editModalVisible"
        type="edit"
        :data="customer"
        @submit="handleEditSubmit"
        @cancel="editModalVisible = false"
      />
    </a-modal>

    <!-- 跟进弹窗 -->
    <a-modal
      v-model:visible="followModalVisible"
      title="客户跟进"
      :width="600"
      :footer="false"
    >
      <FollowRecord
        v-if="followModalVisible"
        :customer="customer"
        @submit="handleFollowSubmit"
        @cancel="followModalVisible = false"
      />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message, Modal } from '@arco-design/web-vue'
import {
  IconPhone,
  IconPen,
  IconDown,
  IconLocation
} from '@arco-design/web-vue/es/icon'
import {
  CUSTOMER_LEVEL,
  CUSTOMER_STATUS,
  INDUSTRY_LIST,
  getDictLabel,
  getDictColor
} from '@/utils/dict'
import CustomerForm from './components/CustomerForm.vue'
import FollowRecord from './components/FollowRecord.vue'
import BasicInfo from './components/BasicInfo.vue'
import ContactList from './components/ContactList.vue'
import FollowList from './components/FollowList.vue'
import OpportunityList from './components/OpportunityList.vue'
import QuotationList from './components/QuotationList.vue'
import ContractList from './components/ContractList.vue'
import ProjectList from './components/ProjectList.vue'

const route = useRoute()
const router = useRouter()

// 客户数据
const customer = reactive({
  id: null,
  name: '',
  shortName: '',
  industry: '',
  size: '',
  level: '',
  status: '',
  source: '',
  ownerName: '',
  address: '',
  phone: ''
})

// 统计数据
const stats = reactive({
  opportunityCount: 3,
  contractCount: 2,
  contractAmount: 2500000,
  paidAmount: 1500000
})

// 当前标签页
const activeTab = ref('basic')

// 弹窗控制
const editModalVisible = ref(false)
const followModalVisible = ref(false)

// 获取字典标签和颜色
const getLevelLabel = (value) => getDictLabel(CUSTOMER_LEVEL, value)
const getLevelColor = (value) => getDictColor(CUSTOMER_LEVEL, value)
const getStatusLabel = (value) => getDictLabel(CUSTOMER_STATUS, value)
const getStatusColor = (value) => getDictColor(CUSTOMER_STATUS, value)
const getIndustryLabel = (value) => getDictLabel(INDUSTRY_LIST, value)

// 格式化金额
const formatAmount = (amount) => {
  if (!amount) return '0'
  return amount.toLocaleString('zh-CN')
}

// 加载客户数据
const loadCustomer = async () => {
  const id = route.params.id
  // 模拟加载
  await new Promise(resolve => setTimeout(resolve, 300))
  
  Object.assign(customer, {
    id: parseInt(id),
    name: '阿里巴巴网络技术有限公司',
    shortName: '阿里巴巴',
    industry: 'ecommerce',
    size: 'large',
    level: 'A',
    status: 'signed',
    source: 'website',
    ownerName: '李四',
    address: '浙江省杭州市余杭区文一西路969号',
    phone: '0571-85022088',
    website: 'https://www.alibaba.com',
    remark: '双十一大促项目潜在客户，需求明确，预算充足。'
  })
}

// 返回
const goBack = () => {
  router.back()
}

// 编辑
const handleEdit = () => {
  editModalVisible.value = true
}

// 跟进
const handleFollow = () => {
  followModalVisible.value = true
}

// 编辑提交
const handleEditSubmit = async (values) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    Object.assign(customer, values)
    Message.success('更新成功')
    editModalVisible.value = false
  } catch (error) {
    Message.error('更新失败')
  }
}

// 跟进提交
const handleFollowSubmit = async (values) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    Message.success('跟进记录已保存')
    followModalVisible.value = false
  } catch (error) {
    Message.error('保存失败')
  }
}

// 新建商机
const handleCreateOpportunity = () => {
  router.push('/opportunity?customerId=' + customer.id)
}

// 新建报价
const handleCreateQuotation = () => {
  router.push('/quotation?customerId=' + customer.id)
}

// 新建合同
const handleCreateContract = () => {
  router.push('/contract?customerId=' + customer.id)
}

// 转移客户
const handleTransfer = () => {
  Message.info('转移客户功能开发中')
}

// 删除客户
const handleDelete = () => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除客户 "${customer.name}" 吗？删除后不可恢复。`,
    okText: '删除',
    cancelText: '取消',
    okButtonProps: { status: 'danger' },
    onOk: async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        Message.success('删除成功')
        router.push('/customer')
      } catch (error) {
        Message.error('删除失败')
      }
    }
  })
}

onMounted(() => {
  loadCustomer()
})
</script>

<style scoped lang="less">
.customer-detail-page {
  .overview-card {
    margin-bottom: 16px;
    
    .customer-overview {
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .overview-left {
        display: flex;
        align-items: center;
        gap: 16px;
        
        .overview-info {
          h2 {
            margin: 0 0 8px 0;
            font-size: 20px;
            font-weight: 600;
          }
          
          .overview-tags {
            margin-bottom: 8px;
          }
          
          .overview-meta {
            color: #86909c;
            font-size: 13px;
            
            span {
              display: inline-flex;
              align-items: center;
              gap: 4px;
            }
          }
        }
      }
      
      .overview-right {
        display: flex;
        align-items: center;
        gap: 24px;
        
        .stat-item {
          text-align: center;
          
          .stat-label {
            font-size: 13px;
            color: #86909c;
            margin-bottom: 4px;
          }
          
          .stat-value {
            font-size: 20px;
            font-weight: 600;
            color: #1d2129;
          }
        }
      }
    }
  }
  
  .detail-tabs-card {
    :deep(.arco-tabs-content) {
      padding-top: 16px;
    }
  }
}
</style>
