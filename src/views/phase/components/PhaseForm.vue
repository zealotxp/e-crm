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
        <a-form-item field="projectId" label="关联项目" required>
          <a-select
            v-model="form.projectId"
            placeholder="请选择项目"
            allow-search
            :disabled="!form.customerId"
            @change="generatePhaseNo"
          >
            <a-option
              v-for="item in filteredProjects"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="phaseNo" label="期号编号">
          <a-input v-model="form.phaseNo" placeholder="自动生成" readonly />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="name" label="期号名称" required>
          <a-input v-model="form.name" placeholder="请输入期号名称" />
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
        <a-form-item field="progress" label="当前进度">
          <a-slider v-model="form.progress" :min="0" :max="100" show-input />
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
  data: { type: Object, default: null }
})

const emit = defineEmits(['submit', 'cancel'])

const formRef = ref(null)
const submitting = ref(false)

const customerOptions = [
  { value: '1501', label: '阿里巴巴' },
  { value: '1502', label: '腾讯科技' },
  { value: '1503', label: '招商银行' },
  { value: '1504', label: '平安保险' }
]

const projectOptions = [
  { value: '1', label: '1501-01 电商平台升级项目', customerId: '1501' },
  { value: '2', label: '1501-02 移动端APP开发项目', customerId: '1501' },
  { value: '3', label: '1502-01 微信小程序开发', customerId: '1502' },
  { value: '4', label: '1503-01 数据中台建设', customerId: '1503' }
]

const form = reactive({
  customerId: '',
  projectId: '',
  phaseNo: '',
  name: '',
  type: 'custom',
  managerId: undefined,
  startDate: undefined,
  endDate: undefined,
  amount: undefined,
  progress: 0,
  status: 'not_started',
  remark: ''
})

const filteredProjects = computed(() => {
  if (!form.customerId) return []
  return projectOptions.filter(p => p.customerId === form.customerId)
})

const rules = {
  customerId: [{ required: true, message: '请选择关联客户' }],
  projectId: [{ required: true, message: '请选择关联项目' }],
  name: [{ required: true, message: '请输入期号名称' }],
  type: [{ required: true, message: '请选择项目类型' }],
  managerId: [{ required: true, message: '请选择项目经理' }],
  startDate: [{ required: true, message: '请选择开始日期' }],
  endDate: [{ required: true, message: '请选择结束日期' }],
  amount: [{ required: true, message: '请输入期号金额' }],
  status: [{ required: true, message: '请选择期号状态' }]
}

const handleCustomerChange = () => {
  form.projectId = ''
  form.phaseNo = ''
}

const generatePhaseNo = () => {
  const project = projectOptions.find(p => p.value === form.projectId)
  if (project) {
    const projectCode = project.label.split(' ')[0]
    // 实际项目中应该根据该项目已有期数自动生成序号
    form.phaseNo = `${projectCode}-01`
  }
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
