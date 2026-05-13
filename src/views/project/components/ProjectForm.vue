<template>
  <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" @submit="handleSubmit">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item field="customerId" label="关联客户" required>
          <a-select
            v-model="form.customerId"
            placeholder="请选择客户"
            allow-search
            @change="generateProjectNo"
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
        <a-form-item field="projectNo" label="项目编号">
          <a-input v-model="form.projectNo" placeholder="自动生成" readonly>
            <template #prefix>{{ customerCode }}</template>
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item field="name" label="项目名称" required>
          <a-input v-model="form.name" placeholder="请输入项目名称" />
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
        <a-form-item field="status" label="项目状态" required>
          <a-select v-model="form.status" placeholder="请选择状态">
            <a-option v-for="item in PROJECT_STATUS" :key="item.value" :value="item.value" :label="item.label" />
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item field="remark" label="项目描述">
          <a-textarea v-model="form.remark" placeholder="请输入项目描述" :auto-size="{ minRows: 3, maxRows: 6 }" />
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
  data: { type: Object, default: null }
})

const emit = defineEmits(['submit', 'cancel'])

const formRef = ref(null)
const submitting = ref(false)

const customerOptions = [
  { value: '1501', label: '阿里巴巴', code: '1501' },
  { value: '1502', label: '腾讯科技', code: '1502' },
  { value: '1503', label: '招商银行', code: '1503' },
  { value: '1504', label: '平安保险', code: '1504' }
]

const form = reactive({
  customerId: '',
  projectNo: '',
  name: '',
  type: 'custom',
  managerId: undefined,
  startDate: undefined,
  endDate: undefined,
  status: 'not_started',
  remark: ''
})

const customerCode = computed(() => {
  const customer = customerOptions.find(c => c.value === form.customerId)
  return customer ? customer.code : '1501'
})

const rules = {
  customerId: [{ required: true, message: '请选择关联客户' }],
  name: [{ required: true, message: '请输入项目名称' }],
  type: [{ required: true, message: '请选择项目类型' }],
  managerId: [{ required: true, message: '请选择项目经理' }],
  startDate: [{ required: true, message: '请选择开始日期' }],
  endDate: [{ required: true, message: '请选择结束日期' }],
  status: [{ required: true, message: '请选择项目状态' }]
}

const generateProjectNo = () => {
  // 项目编号格式：客户号-项目序号，如 1501-01
  // 实际项目中应该根据该客户已有项目数量自动生成序号
  form.projectNo = '-01'
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
