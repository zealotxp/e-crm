<template>
  <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" @submit="handleSubmit">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item field="customerId" label="关联客户" required>
          <a-select
            v-model="form.customerId"
            placeholder="请选择客户"
            allow-search
            @change="handleCustomerChange"
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
      <a-col :span="12">
        <a-form-item field="projectCode" label="项目编号" required>
          <a-input v-model="form.projectCode" placeholder="如：1501-01" @change="generatePhaseCode">
            <template #prefix>{{ customerCodePrefix }}</template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="phaseCode" label="期号" required>
          <a-input v-model="form.phaseCode" placeholder="如：02" @change="generatePhaseCode">
            <template #prefix>{{ projectCodePrefix }}-</template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="fullCode" label="完整编号">
          <a-input v-model="form.fullCode" placeholder="自动生成" readonly />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item field="name" label="期号名称" required>
          <a-input v-model="form.name" placeholder="请输入期号名称，如：电商平台升级项目-第二期" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="type" label="项目类型" required>
          <a-select v-model="form.type" placeholder="请选择项目类型">
            <a-option value="custom" label="定制开发" />
            <a-option value="product" label="产品实施" />
            <a-option value="operation" label="运维服务" />
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="managerId" label="项目经理" required>
          <a-select v-model="form.managerId" placeholder="请选择项目经理">
            <a-option value="1" label="张三" />
            <a-option value="2" label="李四" />
            <a-option value="3" label="王五" />
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="startDate" label="开始日期" required>
          <a-date-picker v-model="form.startDate" style="width: 100%" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="endDate" label="结束日期" required>
          <a-date-picker v-model="form.endDate" style="width: 100%" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="amount" label="期号金额" required>
          <a-input-number v-model="form.amount" placeholder="请输入期号金额" :min="0" style="width: 100%">
            <template #prefix>¥</template>
          </a-input-number>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="status" label="期号状态" required>
          <a-select v-model="form.status" placeholder="请选择状态">
            <a-option v-for="item in PROJECT_STATUS" :key="item.value" :value="item.value" :label="item.label" />
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item field="remark" label="期号描述">
          <a-textarea v-model="form.remark" placeholder="请输入期号描述" :auto-size="{ minRows: 3, maxRows: 6 }" />
        </a-form-item>
      </a-col>
    </a-row>
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
import { PROJECT_STATUS } from '@/utils/dict'

const props = defineProps({
  type: { type: String, default: 'add' },
  data: { type: Object, default: null },
  customerCode: { type: String, default: '' }
})

const emit = defineEmits(['submit', 'cancel'])

const formRef = ref(null)
const submitting = ref(false)

const customerOptions = ref([
  { value: '1', label: '阿里巴巴', code: '1501' },
  { value: '2', label: '腾讯科技', code: '1502' },
  { value: '3', label: '招商银行', code: '1503' },
  { value: '4', label: '平安保险', code: '1504' }
])

const form = reactive({
  customerId: '',
  projectCode: '',
  phaseCode: '',
  fullCode: '',
  name: '',
  type: 'custom',
  managerId: undefined,
  startDate: undefined,
  endDate: undefined,
  amount: undefined,
  status: 'not_started',
  remark: ''
})

const customerCodePrefix = computed(() => {
  const customer = customerOptions.value.find(c => c.value === form.customerId)
  return customer ? customer.code : '1501'
})

const projectCodePrefix = computed(() => {
  return `${customerCodePrefix.value}-${form.projectCode || '01'}`
})

const rules = {
  customerId: [{ required: true, message: '请选择关联客户' }],
  projectCode: [{ required: true, message: '请输入项目编号' }],
  phaseCode: [{ required: true, message: '请输入期号' }],
  name: [{ required: true, message: '请输入期号名称' }],
  type: [{ required: true, message: '请选择项目类型' }],
  managerId: [{ required: true, message: '请选择项目经理' }],
  startDate: [{ required: true, message: '请选择开始日期' }],
  endDate: [{ required: true, message: '请选择结束日期' }],
  amount: [{ required: true, message: '请输入期号金额' }],
  status: [{ required: true, message: '请选择期号状态' }]
}

const handleCustomerChange = () => {
  generatePhaseCode()
}

const generatePhaseCode = () => {
  const customer = customerOptions.value.find(c => c.value === form.customerId)
  const customerCode = customer ? customer.code : '1501'
  const projectCode = form.projectCode || '01'
  const phaseCode = form.phaseCode || '01'
  form.fullCode = `${customerCode}-${projectCode}-${phaseCode}`
}

watch(() => props.data, (val) => {
  if (val) {
    Object.assign(form, val)
  }
}, { immediate: true })

const handleSubmit = async ({ errors }) => {
  if (errors) return

  submitting.value = true
  try {
    emit('submit', { ...form })
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped lang="less">
.form-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
