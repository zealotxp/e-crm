<template>
  <div class="contract-list table-resizable">
    <div class="list-header">
      <a-button type="primary" @click="handleAdd">
        <template #icon><icon-plus /></template>
        新建合同
      </a-button>
    </div>
    
    <a-table :data="contracts" stripe column-resizable>
      <template #columns>
        <a-table-column title="合同编号" data-index="contractNo">
          <template #cell="{ record }">
            <a-link @click="handleView(record)">{{ record.contractNo }}</a-link>
          </template>
        </a-table-column>
        <a-table-column title="合同名称" data-index="name" />
        <a-table-column title="合同金额" data-index="amount">
          <template #cell="{ record }">
            <span style="font-weight: 500; color: #f5319d">
              ¥{{ formatAmount(record.amount) }}
            </span>
          </template>
        </a-table-column>
        <a-table-column title="状态" data-index="status">
          <template #cell="{ record }">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusLabel(record.status) }}
            </a-tag>
          </template>
        </a-table-column>
        <a-table-column title="签订日期" data-index="signDate" />
        <a-table-column title="到期日期" data-index="expireDate" />
        <a-table-column title="操作" width="150">
          <template #cell="{ record }">
            <a-space>
              <a-button type="text" size="small" @click="handleView(record)">
                查看
              </a-button>
              <a-button type="text" size="small" @click="handleDownload(record)">
                下载
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
import { CONTRACT_STATUS, getDictLabel, getDictColor } from '@/utils/dict'

const props = defineProps({
  customerId: {
    type: [String, Number],
    required: true
  }
})

const router = useRouter()

// 合同数据
const contracts = ref([
  {
    id: 1,
    contractNo: 'C20240301001',
    name: '电商平台升级项目合同',
    amount: 1200000,
    status: 'executing',
    signDate: '2024-03-01',
    expireDate: '2024-12-31'
  },
  {
    id: 2,
    contractNo: 'C20240215001',
    name: '移动端APP开发合同',
    amount: 800000,
    status: 'completed',
    signDate: '2024-02-15',
    expireDate: '2024-06-30'
  }
])

// 获取状态标签和颜色
const getStatusLabel = (value) => getDictLabel(CONTRACT_STATUS, value)
const getStatusColor = (value) => getDictColor(CONTRACT_STATUS, value)

// 格式化金额
const formatAmount = (amount) => {
  return amount.toLocaleString('zh-CN')
}

// 新建合同
const handleAdd = () => {
  router.push('/contract?customerId=' + props.customerId)
}

// 查看合同
const handleView = (record) => {
  router.push('/contract?id=' + record.id)
}

// 下载合同
const handleDownload = (record) => {
  Message.success('合同文件下载中...')
}
</script>

<style scoped lang="less">
.contract-list {
  .list-header {
    margin-bottom: 16px;
  }
}
</style>
