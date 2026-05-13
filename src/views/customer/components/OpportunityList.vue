<template>
  <div class="opportunity-list table-resizable">
    <div class="list-header">
      <a-button type="primary" @click="handleAdd">
        <template #icon><icon-plus /></template>
        新建商机
      </a-button>
    </div>
    
    <a-table :data="opportunities" stripe column-resizable>
      <template #columns>
        <a-table-column title="商机名称" data-index="name">
          <template #cell="{ record }">
            <a-link @click="handleView(record)">{{ record.name }}</a-link>
          </template>
        </a-table-column>
        <a-table-column title="预计金额" data-index="amount">
          <template #cell="{ record }">
            ¥{{ formatAmount(record.amount) }}
          </template>
        </a-table-column>
        <a-table-column title="阶段" data-index="stage">
          <template #cell="{ record }">
            <a-tag :color="getStageColor(record.stage)">
              {{ getStageLabel(record.stage) }}
            </a-tag>
          </template>
        </a-table-column>
        <a-table-column title="概率" data-index="probability">
          <template #cell="{ record }">
            <a-progress
              :percent="record.probability / 100"
              :color="getProgressColor(record.probability)"
              size="small"
            />
          </template>
        </a-table-column>
        <a-table-column title="预计成交" data-index="expectedDate" />
        <a-table-column title="负责人" data-index="ownerName" />
        <a-table-column title="操作" width="150">
          <template #cell="{ record }">
            <a-space>
              <a-button type="text" size="small" @click="handleEdit(record)">
                编辑
              </a-button>
              <a-button type="text" size="small" status="danger" @click="handleDelete(record)">
                删除
              </a-button>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Message, Modal } from '@arco-design/web-vue'
import { IconPlus } from '@arco-design/web-vue/es/icon'
import { OPPORTUNITY_STAGE, getDictLabel, getDictColor } from '@/utils/dict'

const props = defineProps({
  customerId: {
    type: [String, Number],
    required: true
  }
})

const router = useRouter()

// 商机数据
const opportunities = ref([
  {
    id: 1,
    name: '电商平台升级项目',
    amount: 1200000,
    stage: 'quotation',
    probability: 60,
    expectedDate: '2024-06-30',
    ownerName: '李四'
  },
  {
    id: 2,
    name: '移动端APP开发',
    amount: 800000,
    stage: 'solution',
    probability: 50,
    expectedDate: '2024-07-15',
    ownerName: '张三'
  },
  {
    id: 3,
    name: '数据中台建设',
    amount: 2000000,
    stage: 'requirement',
    probability: 30,
    expectedDate: '2024-08-30',
    ownerName: '王五'
  }
])

// 获取阶段标签和颜色
const getStageLabel = (stage) => {
  const item = OPPORTUNITY_STAGE.find(s => s.value === stage)
  return item?.label || stage
}

const getStageColor = (stage) => {
  const item = OPPORTUNITY_STAGE.find(s => s.value === stage)
  return item?.color || 'gray'
}

// 获取进度条颜色
const getProgressColor = (probability) => {
  if (probability >= 80) return '#52c41a'
  if (probability >= 50) return '#1890ff'
  if (probability >= 30) return '#faad14'
  return '#ff4d4f'
}

// 格式化金额
const formatAmount = (amount) => {
  return amount.toLocaleString('zh-CN')
}

// 新建商机
const handleAdd = () => {
  router.push('/opportunity?customerId=' + props.customerId)
}

// 查看商机
const handleView = (record) => {
  router.push('/opportunity?id=' + record.id)
}

// 编辑商机
const handleEdit = (record) => {
  router.push('/opportunity?id=' + record.id + '&edit=true')
}

// 删除商机
const handleDelete = (record) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除商机 "${record.name}" 吗？`,
    onOk: () => {
      opportunities.value = opportunities.value.filter(o => o.id !== record.id)
      Message.success('删除成功')
    }
  })
}
</script>

<style scoped lang="less">
.opportunity-list {
  .list-header {
    margin-bottom: 16px;
  }
}
</style>
