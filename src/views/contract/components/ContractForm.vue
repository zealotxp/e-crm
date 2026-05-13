<template>
  <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" @submit="handleSubmit">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item field="customerCode" label="客户号" required>
          <a-input v-model="form.customerCode" placeholder="请输入客户号，如：1515" @change="generateContractNo" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="projectCode" label="项目号" required>
          <a-input v-model="form.projectCode" placeholder="请输入项目号，如：01" @change="generateContractNo" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="phaseCode" label="期号" required>
          <a-input v-model="form.phaseCode" placeholder="请输入期号，如：01" @change="generateContractNo" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="signDate" label="签订日期" required>
          <a-date-picker v-model="form.signDate" style="width: 100%" @change="generateContractNo" />
        </a-form-item>
      </a-col>
    </a-row>
    
    <a-form-item field="contractNo" label="合同编号">
      <a-input v-model="form.contractNo" placeholder="自动生成合同编号" readonly>
        <template #prefix>H</template>
      </a-input>
    </a-form-item>
    
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item field="name" label="合同名称" required>
          <a-input v-model="form.name" placeholder="请输入合同名称" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="customerId" label="关联客户" required>
          <a-select
            v-model="form.customerId"
            placeholder="请输入客户名称搜索"
            allow-search
            allow-clear
            :filter-option="filterCustomerOption"
            @search="handleCustomerSearch"
          >
            <a-option
              v-for="item in customerOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    
    <a-divider orientation="left">金额信息</a-divider>
    
    <a-row :gutter="16">
      <a-col :span="8">
        <a-form-item field="amount" label="合同金额" required>
          <a-input-number v-model="form.amount" placeholder="请输入合同金额" :min="0" style="width: 100%" @change="calculateActualIncome">
            <template #prefix>¥</template>
          </a-input-number>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item field="channelFee" label="渠道费（回扣）">
          <a-input-number v-model="form.channelFee" placeholder="请输入渠道费" :min="0" :max="form.amount" style="width: 100%" @change="calculateActualIncome">
            <template #prefix>¥</template>
          </a-input-number>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="实际收入">
          <div class="actual-income">
            <span class="amount">¥{{ formatActualIncome }}</span>
          </div>
        </a-form-item>
      </a-col>
    </a-row>
    
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item field="status" label="合同状态" required>
          <a-select v-model="form.status" placeholder="请选择状态">
            <a-option v-for="item in CONTRACT_STATUS" :key="item.value" :value="item.value" :label="item.label" />
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    
    <a-col :span="24">
      <a-form-item field="remark" label="备注">
        <a-textarea v-model="form.remark" placeholder="请输入备注" :auto-size="{ minRows: 3, maxRows: 6 }" />
      </a-form-item>
    </a-col>
    
    <a-divider />
    
    <div class="form-footer">
      <a-space>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" html-type="submit" :loading="submitting">保存</a-button>
      </a-space>
    </div>
  </a-form>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { CONTRACT_STATUS } from '@/utils/dict'

const props = defineProps({ type: { type: String, default: 'add' }, data: { type: Object, default: null } })
const emit = defineEmits(['submit', 'cancel'])

const formRef = ref(null)
const submitting = ref(false)

// 客户选项（支持搜索）
const allCustomers = [
  { value: '1', label: '阿里巴巴网络技术有限公司' },
  { value: '2', label: '腾讯科技（深圳）有限公司' },
  { value: '3', label: '招商银行股份有限公司' },
  { value: '4', label: '中国平安保险（集团）股份有限公司' },
  { value: '5', label: '美团点评' },
  { value: '6', label: '京东集团' },
  { value: '7', label: '百度在线网络技术（北京）有限公司' },
  { value: '8', label: '字节跳动科技有限公司' }
]
const customerOptions = ref([...allCustomers])

const filterCustomerOption = (inputValue, option) => {
  return option.label.toLowerCase().includes(inputValue.toLowerCase())
}

const handleCustomerSearch = (value) => {
  if (!value) {
    customerOptions.value = [...allCustomers]
    return
  }
  customerOptions.value = allCustomers.filter(customer =>
    customer.label.toLowerCase().includes(value.toLowerCase())
  )
}

const form = reactive({
  customerCode: '',
  projectCode: '',
  phaseCode: '',
  contractNo: '',
  name: '',
  customerId: undefined,
  amount: undefined,
  channelFee: 0,
  actualIncome: 0,
  signDate: undefined,
  status: 'draft',
  remark: ''
})

const rules = {
  customerCode: [{ required: true, message: '请输入客户号' }],
  projectCode: [{ required: true, message: '请输入项目号' }],
  phaseCode: [{ required: true, message: '请输入期号' }],
  name: [{ required: true, message: '请输入合同名称' }],
  customerId: [{ required: true, message: '请选择关联客户' }],
  amount: [{ required: true, message: '请输入合同金额' }],
  signDate: [{ required: true, message: '请选择签订日期' }],
  status: [{ required: true, message: '请选择合同状态' }]
}

const formatActualIncome = computed(() => {
  const amount = Number(form.amount) || 0
  const fee = Number(form.channelFee) || 0
  return (amount - fee).toLocaleString('zh-CN')
})

const generateContractNo = () => {
  if (!form.signDate || !form.customerCode || !form.projectCode || !form.phaseCode) {
    form.contractNo = ''
    return
  }
  
  const date = new Date(form.signDate)
  const year = String(date.getFullYear()).slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const dateStr = `${year}${month}${day}`
  
  form.contractNo = `H${dateStr}-${form.customerCode}-${form.projectCode}-${form.phaseCode}`
}

const calculateActualIncome = () => {
  const amount = Number(form.amount) || 0
  const fee = Number(form.channelFee) || 0
  form.actualIncome = amount - fee
}

watch(() => props.data, (val) => {
  if (val) {
    Object.assign(form, val)
    calculateActualIncome()
  }
}, { immediate: true })

const handleSubmit = async ({ errors }) => {
  if (errors) return
  submitting.value = true
  try {
    calculateActualIncome()
    emit('submit', { ...form })
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => emit('cancel')
</script>

<style scoped lang="less">
.form-footer {
  display: flex;
  justify-content: flex-end;
}

.actual-income {
  height: 32px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 4px;
  
  .amount {
    font-size: 16px;
    font-weight: 600;
    color: #52c41a;
  }
}
</style>
