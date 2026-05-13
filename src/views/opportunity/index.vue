<template>
  <div class="opportunity-page">
    <!-- 搜索栏 -->
    <a-card class="search-card" :bordered="false">
      <a-form :model="searchForm" layout="inline">
        <a-form-item field="keyword" hide-label>
          <a-input-search v-model="searchForm.keyword" placeholder="搜索商机名称/客户名称" style="width: 280px" allow-clear @search="handleSearch" />
        </a-form-item>
        <a-form-item field="stage" hide-label>
          <a-select v-model="searchForm.stage" placeholder="商机阶段" style="width: 140px" allow-clear>
            <a-option v-for="item in OPPORTUNITY_STAGE" :key="item.value" :value="item.value" :label="item.label" />
          </a-select>
        </a-form-item>
        <a-form-item field="ownerId" hide-label>
          <a-select v-model="searchForm.ownerId" placeholder="归属销售" style="width: 140px" allow-clear>
            <a-option value="1" label="张三" />
            <a-option value="2" label="李四" />
            <a-option value="3" label="王五" />
          </a-select>
        </a-form-item>
        <a-form-item hide-label>
          <a-button type="primary" @click="handleSearch"><template #icon><icon-search /></template>查询</a-button>
          <a-button @click="handleReset" style="margin-left: 8px">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 操作栏和视图切换 -->
    <a-card class="content-card" :bordered="false">
      <template #title>
        <a-space>
          <a-button type="primary" @click="handleAdd"><template #icon><icon-plus /></template>新建商机</a-button>
          <a-radio-group v-model="viewMode" type="button">
            <a-radio value="kanban">看板视图</a-radio>
            <a-radio value="list">列表视图</a-radio>
          </a-radio-group>
        </a-space>
      </template>

      <!-- 看板视图 -->
      <div v-if="viewMode === 'kanban'" class="kanban-view">
        <div class="kanban-columns">
          <div v-for="stage in kanbanStages" :key="stage.value" class="kanban-column">
            <div class="column-header" :style="{ borderBottomColor: stage.color }">
              <div class="header-left">
                <span class="stage-name">{{ stage.label }}</span>
                <a-tag :color="stage.color" size="small">{{ stage.count }}</a-tag>
              </div>
              <span class="stage-amount">¥{{ formatAmount(stage.amount) }}</span>
            </div>
            <div class="column-content">
              <div v-for="item in stage.items" :key="item.id" class="kanban-card" @click="handleEdit(item)">
                <div class="card-title">{{ item.name }}</div>
                <div class="card-customer">{{ item.customerName }}</div>
                <div class="card-amount">¥{{ formatAmount(item.amount) }}</div>
                <div class="card-footer">
                  <a-avatar :size="24" :style="{ background: '#1890ff' }">{{ item.ownerName.charAt(0) }}</a-avatar>
                  <span class="expected-date">{{ item.expectedDate }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <a-table v-else :loading="loading" :data="tableData" :pagination="pagination" @page-change="handlePageChange" row-key="id" stripe  column-resizable>
        <template #columns>
          <a-table-column title="商机名称" data-index="name" :width="200" >
            <template #cell="{ record }"><a-link @click="handleEdit(record)">{{ record.name }}</a-link></template>
          </a-table-column>
          <a-table-column title="客户名称" data-index="customerName" :width="180" />
          <a-table-column title="预计金额" data-index="amount" :width="140" >
            <template #cell="{ record }"><span style="font-weight: 500; color: #f5319d">¥{{ formatAmount(record.amount) }}</span></template>
          </a-table-column>
          <a-table-column title="阶段" data-index="stage" :width="120" >
            <template #cell="{ record }"><a-tag :color="getStageColor(record.stage)">{{ getStageLabel(record.stage) }}</a-tag></template>
          </a-table-column>
          <a-table-column title="概率" data-index="probability" :width="120" >
            <template #cell="{ record }"><a-progress :percent="record.probability / 100" :color="getProgressColor(record.probability)" size="small" /></template>
          </a-table-column>
          <a-table-column title="预计成交" data-index="expectedDate" :width="120" />
          <a-table-column title="负责人" data-index="ownerName" :width="100" />
          <a-table-column title="操作" :width="150" fixed="right" >
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="handleEdit(record)">编辑</a-button>
                <a-button type="text" size="small" @click="handleAdvance(record)">推进</a-button>
                <a-button type="text" size="small" status="danger" @click="handleDelete(record)">删除</a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <!-- 新建/编辑弹窗 -->
    <a-modal v-model:visible="modalVisible" :title="modalTitle" :width="700" :footer="false" @cancel="modalVisible = false">
      <OpportunityForm v-if="modalVisible" :type="modalType" :data="currentRow" @submit="handleModalSubmit" @cancel="modalVisible = false" />
    </a-modal>

    <!-- 推进弹窗 -->
    <a-modal v-model:visible="advanceModalVisible" title="推进商机" :width="500" @ok="handleAdvanceSubmit" @cancel="advanceModalVisible = false">
      <a-form :model="advanceForm" layout="vertical">
        <a-form-item label="当前阶段"><a-input v-model="advanceForm.currentStage" disabled /></a-form-item>
        <a-form-item label="推进至" required>
          <a-select v-model="advanceForm.targetStage" placeholder="选择目标阶段">
            <a-option v-for="item in OPPORTUNITY_STAGE" :key="item.value" :value="item.value" :label="item.label" />
          </a-select>
        </a-form-item>
        <a-form-item label="备注"><a-textarea v-model="advanceForm.remark" placeholder="请输入推进备注" /></a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import { IconSearch, IconPlus } from '@arco-design/web-vue/es/icon'
import { OPPORTUNITY_STAGE, getDictLabel, getDictColor } from '@/utils/dict'
import OpportunityForm from './components/OpportunityForm.vue'

const searchForm = reactive({ keyword: '', stage: undefined, ownerId: undefined })
const viewMode = ref('kanban')
const loading = ref(false)
const modalVisible = ref(false)
const modalType = ref('add')
const modalTitle = ref('新建商机')
const currentRow = ref(null)
const advanceModalVisible = ref(false)
const advanceForm = reactive({ currentStage: '', targetStage: '', remark: '' })

const opportunities = ref([
  { id: 1, name: '电商平台升级项目', customerName: '阿里巴巴', amount: 1200000, stage: 'quotation', probability: 60, expectedDate: '2024-06-30', ownerName: '李四' },
  { id: 2, name: '移动端APP开发', customerName: '腾讯科技', amount: 800000, stage: 'solution', probability: 40, expectedDate: '2024-07-15', ownerName: '张三' },
  { id: 3, name: '数据中台建设', customerName: '招商银行', amount: 2000000, stage: 'requirement', probability: 30, expectedDate: '2024-08-30', ownerName: '王五' },
  { id: 4, name: '智能客服系统', customerName: '平安保险', amount: 500000, stage: 'negotiation', probability: 80, expectedDate: '2024-05-30', ownerName: '李四' },
  { id: 5, name: '供应链管理系统', customerName: '美团点评', amount: 1500000, stage: 'contact', probability: 20, expectedDate: '2024-09-15', ownerName: '张三' }
])

const kanbanStages = computed(() => {
  return OPPORTUNITY_STAGE.map(stage => {
    const items = opportunities.value.filter(item => item.stage === stage.value)
    const amount = items.reduce((sum, item) => sum + item.amount, 0)
    return { ...stage, count: items.length, amount, items }
  })
})

const tableData = computed(() => opportunities.value)
const pagination = reactive({ total: opportunities.value.length, current: 1, pageSize: 10, showTotal: true, showJumper: true, showPageSize: true })

const getStageLabel = (stage) => getDictLabel(OPPORTUNITY_STAGE, stage)
const getStageColor = (stage) => getDictColor(OPPORTUNITY_STAGE, stage)
const formatAmount = (amount) => amount >= 10000 ? (amount / 10000).toFixed(0) + '万' : amount.toLocaleString('zh-CN')
const getProgressColor = (probability) => {
  if (probability >= 70) return '#52c41a'
  if (probability >= 40) return '#faad14'
  return '#ff4d4f'
}

const handleSearch = () => {}
const handleReset = () => {}

const handleAdd = () => {
  modalType.value = 'add'
  modalTitle.value = '新建商机'
  currentRow.value = null
  modalVisible.value = true
}

const handleEdit = (record) => {
  modalType.value = 'edit'
  modalTitle.value = '编辑商机'
  currentRow.value = { ...record }
  modalVisible.value = true
}

const handleModalSubmit = (values) => {
  if (modalType.value === 'add') {
    opportunities.value.push({ ...values, id: Date.now(), customerName: '阿里巴巴', ownerName: '张三' })
    Message.success('创建成功')
  } else {
    const index = opportunities.value.findIndex(o => o.id === currentRow.value.id)
    if (index > -1) opportunities.value[index] = { ...opportunities.value[index], ...values }
    Message.success('更新成功')
  }
  modalVisible.value = false
}

const handleAdvance = (record) => {
  advanceForm.currentStage = getStageLabel(record.stage)
  advanceForm.targetStage = ''
  advanceForm.remark = ''
  advanceModalVisible.value = true
}

const handleAdvanceSubmit = () => {
  if (!advanceForm.targetStage) {
    Message.warning('请选择目标阶段')
    return
  }
  Message.success('商机已推进')
  advanceModalVisible.value = false
}

const handleDelete = (record) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除商�?"${record.name}" 吗？`,
    okText: '删除',
    cancelText: '取消',
    okButtonProps: { status: 'danger' },
    onOk: () => {
      opportunities.value = opportunities.value.filter(o => o.id !== record.id)
      Message.success('删除成功')
    }
  })
}

const handlePageChange = (page) => { pagination.current = page }
</script>

<style scoped lang="less">
.opportunity-page {
  .search-card { margin-bottom: 16px; }
  
  .content-card {
    .kanban-view {
      .kanban-columns {
        display: flex;
        gap: 16px;
        overflow-x: auto;
        padding-bottom: 8px;
        
        .kanban-column {
          flex: 1;
          min-width: 260px;
          max-width: 300px;
          background: #f7f8fa;
          border-radius: 4px;
          
          .column-header {
            padding: 12px 16px;
            border-bottom: 2px solid;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #fff;
            border-radius: 4px 4px 0 0;
            
            .header-left {
              display: flex;
              align-items: center;
              gap: 8px;
              
              .stage-name { font-weight: 500; font-size: 14px; color: #1d2129; }
            }
            
            .stage-amount { font-size: 13px; color: #86909c; }
          }
          
          .column-content {
            padding: 12px;
            min-height: 400px;
            
            .kanban-card {
              background: #fff;
              border-radius: 4px;
              padding: 12px;
              margin-bottom: 12px;
              cursor: pointer;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
              transition: all 0.3s;
              
              &:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
              
              .card-title { font-weight: 500; font-size: 14px; color: #1d2129; margin-bottom: 8px; }
              .card-customer { font-size: 13px; color: #86909c; margin-bottom: 8px; }
              .card-amount { font-weight: 500; color: #f5319d; font-size: 15px; margin-bottom: 12px; }
              
              .card-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                
                .expected-date { font-size: 12px; color: #86909c; }
              }
            }
          }
        }
      }
    }
  }
}
</style>
