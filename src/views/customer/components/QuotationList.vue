<template>
  <div class="quotation-list table-resizable">
    <div class="list-header">
      <a-button type="primary" @click="handleAdd">
        <template #icon><icon-plus /></template>
        新建报价
      </a-button>
    </div>
    
    <a-table :data="quotations" stripe column-resizable>
      <template #columns>
        <a-table-column title="报价单号" data-index="quotationNo">
          <template #cell="{ record }">
            <a-link @click="handleView(record)">{{ record.quotationNo }}</a-link>
          </template>
        </a-table-column>
        <a-table-column title="报价名称" data-index="name" />
        <a-table-column title="报价金额" data-index="amount">
          <template #cell="{ record }">
            <span style="font-weight: 500; color: #f5319d">
              ¥{{ formatAmount(record.amount) }}
            </span>
          </template>
        </a-table-column>
        <a-table-column title="有效期至" data-index="validDate" />
        <a-table-column title="状态" data-index="status">
          <template #cell="{ record }">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusLabel(record.status) }}
            </a-tag>
          </template>
        </a-table-column>
        <a-table-column title="报价日期" data-index="quotationDate" />
        <a-table-column title="操作" width="150">
          <template #cell="{ record }">
            <a-space>
              <a-button type="text" size="small" @click="handleView(record)">
                查看
              </a-button>
              <a-button type="text" size="small" @click="handleExport(record)">
                导出
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
import { Message } from '@arco-design/web-vue'
import { IconPlus } from '@arco-design/web-vue/es/icon'
import { QUOTATION_STATUS, getDictLabel, getDictColor } from '@/utils/dict'

const props = defineProps({
  customerId: {
    type: [String, Number],
    required: true
  }
})

const router = useRouter()

// 报价数据
const quotations = ref([
  {
    id: 1,
    quotationNo: 'Q20240320001',
    name: '电商平台升级项目报价',
    amount: 1200000,
    validDate: '2024-04-20',
    status: 'sent',
    quotationDate: '2024-03-20'
  },
  {
    id: 2,
    quotationNo: 'Q20240315001',
    name: '移动端APP开发报价',
    amount: 800000,
    validDate: '2024-04-15',
    status: 'won',
    quotationDate: '2024-03-15'
  }
])

// 获取状态标签和颜色
const getStatusLabel = (value) => getDictLabel(QUOTATION_STATUS, value)
const getStatusColor = (value) => getDictColor(QUOTATION_STATUS, value)

// 格式化金额
const formatAmount = (amount) => {
  return amount.toLocaleString('zh-CN')
}

// 新建报价
const handleAdd = () => {
  router.push('/quotation?customerId=' + props.customerId)
}

// 查看报价
const handleView = (record) => {
  router.push('/quotation?id=' + record.id)
}

// 导出报价
const handleExport = (record) => {
  Message.success('报价单导出成功')
}
</script>

<style scoped lang="less">
.quotation-list {
  .list-header {
    margin-bottom: 16px;
  }
}
</style>
