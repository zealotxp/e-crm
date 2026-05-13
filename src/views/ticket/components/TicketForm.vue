<template>
  <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" @submit="handleSubmit">
    <a-row :gutter="16">
      <a-col :span="24">
        <a-form-item field="title" label="工单标题" required>
          <a-input v-model="form.title" placeholder="请输入工单标题" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="customerId" label="客户" required>
          <a-select v-model="form.customerId" placeholder="请选择客户">
            <a-option value="1" label="阿里巴巴" />
            <a-option value="2" label="腾讯科技" />
            <a-option value="3" label="招商银行" />
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="type" label="工单类型" required>
          <a-select v-model="form.type" placeholder="请选择工单类型">
            <a-option v-for="item in TICKET_TYPE" :key="item.value" :value="item.value" :label="item.label" />
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="priority" label="优先级" required>
          <a-select v-model="form.priority" placeholder="请选择优先级">
            <a-option v-for="item in TICKET_PRIORITY" :key="item.value" :value="item.value" :label="item.label" />
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item field="assigneeId" label="负责人">
          <a-select v-model="form.assigneeId" placeholder="请选择负责人">
            <a-option value="1" label="张三" />
            <a-option value="2" label="李四" />
            <a-option value="3" label="王五" />
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item field="description" label="问题描述">
          <a-textarea v-model="form.description" placeholder="请详细描述问题" :auto-size="{ minRows: 4, maxRows: 8 }" />
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
import { ref, reactive, watch } from 'vue'
import { TICKET_TYPE, TICKET_PRIORITY } from '@/utils/dict'

const props = defineProps({ type: { type: String, default: 'add' }, data: { type: Object, default: null } })
const emit = defineEmits(['submit', 'cancel'])

const formRef = ref(null)
const submitting = ref(false)
const form = reactive({ title: '', customerId: undefined, type: 'bug', priority: 'medium', assigneeId: undefined, description: '' })
const rules = {
  title: [{ required: true, message: '请输入工单标题' }],
  customerId: [{ required: true, message: '请选择客户' }],
  type: [{ required: true, message: '请选择工单类型' }],
  priority: [{ required: true, message: '请选择优先级' }]
}

watch(() => props.data, (val) => { if (val) Object.assign(form, val) }, { immediate: true })

const handleSubmit = async ({ errors }) => {
  if (errors) return
  submitting.value = true
  try { emit('submit', { ...form }) } finally { submitting.value = false }
}
const handleCancel = () => emit('cancel')
</script>

<style scoped lang="less">
.form-footer { display: flex; justify-content: flex-end; }
</style>
